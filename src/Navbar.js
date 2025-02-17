import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import SubmitBookModal from "./SubmitBookModal";
import LoginModal from "./LoginModal";
import supabase from "./supabase"; // Import Supabase client
import "./styles/Navbar.css";

// MUI Icons
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined"; // Trophy icon
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined"; // My Books icon

function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null); // Track logged-in user
    const location = useLocation();

    // Fetch user session on component mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user); // Set user state
        };
        getUser();

        // Listen for authentication state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Logout function
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); // Clear user state on logout
    };

    // Open/close handlers for modals
    const openBookModal = useCallback(() => setModalOpen(true), []);
    const closeBookModal = useCallback(() => setModalOpen(false), []);
    const openLoginModal = useCallback(() => setShowLogin(true), []);
    const closeLoginModal = useCallback(() => setShowLogin(false), []);

    return (
        <>
            {/* Top Navigation */}
            <nav className="navbar">
                <h1>Super Reading Friends 📚</h1>

                {user ? (
                    <button className="login-button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button className="login-button" onClick={openLoginModal}>
                        Login
                    </button>
                )}
            </nav>

            {/* Floating Bottom Navigation */}
            <div className="floating-nav">
                <Link
                    to="/rankings"
                    className={`nav-icon ${location.pathname === "/rankings" ? "active" : ""}`}
                >
                    <EmojiEventsOutlinedIcon fontSize="large" />
                    <span>Rankings</span>
                </Link>

                {/* Floating Action Button (FAB) for Submit Book */}
                <button className="fab" onClick={openBookModal}>+</button>

                <Link
                    to="/my-books"
                    className={`nav-icon ${location.pathname === "/my-books" ? "active" : ""}`}
                >
                    <MenuBookOutlinedIcon fontSize="large" />
                    <span>My Books</span>
                </Link>
            </div>

            {/* Modals */}
            {showLogin && <LoginModal onClose={closeLoginModal} />}
            {modalOpen && <SubmitBookModal isOpen={modalOpen} onClose={closeBookModal} onBookAdded={closeBookModal} currentUser={user} />}
        </>
    );
}

export default Navbar;