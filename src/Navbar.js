import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogBookModal from "./SubmitBookModal"; // Import modal
import "./Navbar.css";

function Navbar() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <nav className="navbar">
            <h1>Super Reading Friends 📚</h1>
            <ul>
                <li><Link to="/players">Players</Link></li>
                <li><Link to="/books">All Books</Link></li>
                <li><Link to="/my-books">My Books</Link></li>
                <li><Link to="/rankings">Rankings</Link></li>
            </ul>
            <button className="submit-book-btn" onClick={() => setModalOpen(true)}>Submit a Book</button>

            {/* Modal */}
            <SubmitBookModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onBookAdded={() => window.location.reload()} />
        </nav>
    );
}

export default Navbar;