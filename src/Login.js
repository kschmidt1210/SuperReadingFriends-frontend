import React, { useEffect, useState } from "react";
import supabase from "./supabase";
import "./styles/Login.css";

function Login() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: sessionData, error } = await supabase.auth.getSession();
            if (error) {
                console.error("❌ Error fetching session:", error);
            } else if (sessionData.session) {
                console.log("✅ Active session:", sessionData.session.user);
                setUser(sessionData.session.user);
            }
        };

        getSession();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                console.log("🔄 Auth state changed, user logged in:", session.user);
                setUser(session.user);
            } else {
                console.warn("⚠️ User logged out or session missing.");
                setUser(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSignUp = async () => {
        setError(null);
    
        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
    
        if (error) {
            setError(error.message);
            return;
        }
    
        // Get the new user ID from Supabase Auth
        const userId = data.user?.id;
        if (userId) {
            // Insert into players table using the same UUID
            const { error: insertError } = await supabase
                .from("players")
                .insert([{ player_id: userId, player_email: email }]);
    
            if (insertError) {
                console.error("❌ Error inserting into players table:", insertError);
            } else {
                console.log("✅ Player linked to users table!");
            }
        }
    };

    const handleSignIn = async () => {
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
            console.error("Sign-in Error:", error.message);
        } else {
            console.log("✅ Sign-in success:", data);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <div className="login-container">
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button onClick={handleSignUp} className="signup-button">
                        Sign Up
                    </button>
                    <button onClick={handleSignIn} className="signin-button">
                        Sign In
                    </button>
                </div>
            )}
        </div>
    );
}

export default Login;