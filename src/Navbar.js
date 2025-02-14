import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SubmitBookModal from "./SubmitBookModal";
import "./Navbar.css";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Trophy icon
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; // My Books icon

function Navbar() {
    const [modalOpen, setModalOpen] = useState(false);
    const location = useLocation(); // Get current page path

    return (
        <>
            <nav className="navbar">
                <h1>Super Reading Friends 📚</h1>
            </nav>

            {/* Floating Bottom Navigation */}
            <div className="floating-nav">
                <Link to="/rankings" className={`nav-icon ${location.pathname === "/rankings" ? "active" : ""}`}>
                    <EmojiEventsIcon fontSize="large" />
                    <span>Rankings</span>
                </Link>

                {/* Floating Action Button (FAB) for Submit Book */}
                <button className="fab" onClick={() => setModalOpen(true)}>+</button>

                <Link to="/my-books" className={`nav-icon ${location.pathname === "/my-books" ? "active" : ""}`}>
                    <LibraryBooksIcon fontSize="large" />
                    <span>My Books</span>
                </Link>
            </div>

            {/* Submit Book Modal */}
            <SubmitBookModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onBookAdded={() => window.location.reload()} />
        </>
    );
}

export default Navbar;