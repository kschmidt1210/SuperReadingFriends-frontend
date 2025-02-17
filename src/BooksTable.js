import React, { useEffect, useState } from 'react';
import "./styles/TableStyles.css";

function BooksTable() {
    const [books, setBooks] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/books')
            .then(response => response.json())
            .then(data => setBooks(data.books))
            .catch(error => console.error('Error fetching book data:', error));
    }, []);

    return (
        <div className="table-container">
            <h2>All Logged Books</h2>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Title</th>
                            <th>Pages</th>
                            <th>Year</th>
                            <th>Completed</th>
                            <th>Genre</th>
                            <th>Country</th>
                            <th>Rating</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? (
                            books.map((book, index) => (
                                <tr key={index}>
                                    <td>{book.player_name}</td>
                                    <td>{book.title}</td>
                                    <td>{book.pages}</td>
                                    <td>{book.year_published}</td>
                                    <td>{book.completed ? '✅' : '❌'}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.country_published}</td>
                                    <td>{book.rating}/10</td>
                                    <td>{book.points}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="loading">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BooksTable;