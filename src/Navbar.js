import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <h1>Super Reading Friends 📚</h1>
            <ul>
                <li><Link to="/players">Players</Link></li>
                <li><Link to="/books">Books</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;