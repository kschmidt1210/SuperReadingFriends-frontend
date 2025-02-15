import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SubmitBookModal from "./SubmitBookModal";
import "./Navbar.css";
import Login from "./Login";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined"; // Thin Trophy icon
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined"; // Thin My Books icon

function Navbar() {
    const [modalOpen, setModalOpen] = useState(false);
    const location = useLocation(); // Get current page path

    return (
        <>
            <nav className="navbar">
                <h1>Super Reading Friends 📚</h1>
                <Login />
            </nav>

            {/* Floating Bottom Navigation */}
            <div className="floating-nav">
                <Link to="/rankings" className={`nav-icon ${location.pathname === "/rankings" ? "active" : ""}`}>
                    <EmojiEventsOutlinedIcon fontSize="large" />
                    <span>Rankings</span>
                </Link>

                {/* Floating Action Button (FAB) for Submit Book */}
                <button className="fab" onClick={() => setModalOpen(true)}>+</button>

                <Link to="/my-books" className={`nav-icon ${location.pathname === "/my-books" ? "active" : ""}`}>
                    <MenuBookOutlinedIcon fontSize="large" />
                    <span>My Books</span>
                </Link>
            </div>

            {/* Submit Book Modal */}
            <SubmitBookModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onBookAdded={() => window.location.reload()} />
        </>
    );
}

export default Navbar;