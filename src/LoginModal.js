import React, { useState } from "react";
import supabase from "./supabase"; // Ensure correct import path
import "./styles/LoginModal.css";

function LoginModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    // Handle login
    const handleLogin = async () => {
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            console.log("✅ Logged in:", data);
            onClose(); // Close modal on success
        }
        window.location.reload(); // ✅ Force a page reload
    };

    // Handle signup
    const handleSignUp = async () => {
        setError(null);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            console.log("✅ Signup successful! Please check your email to verify.");
            alert("Check your email for a confirmation link.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Sign In</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                {/* Login and Cancel buttons in one row */}
                <div className="modal-buttons">
                    <button className="primary-btn" onClick={handleLogin}>
                        Login
                    </button>
                    <button className="secondary-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>

                {/* "Create Account" button now separate below */}
                <button className="signup-btn" onClick={handleSignUp}>
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default LoginModal;