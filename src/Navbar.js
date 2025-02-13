import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <h1>Super Reading Friends 📚</h1>
            <ul>
                <li><Link to="/players">Players</Link></li>
                <li><Link to="/books">All Books</Link></li>
                <li><Link to="/my-books">My Books</Link></li>
                <li><Link to="/rankings">Rankings</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;