import React, { useEffect, useState } from "react";
import supabase from "./supabase";

function Login() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });
        if (error) {
            console.error("Google Sign-in Error:", error.message);
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
                <button onClick={handleLogin} className="login-button">
                    Sign in with Google
                </button>
            )}
        </div>
    );
}

export default Login;