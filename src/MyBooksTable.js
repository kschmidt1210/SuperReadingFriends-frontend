import React, { useEffect, useState } from 'react';
import './BooksTable.css';

function MyBooksTable() {
    const [books, setBooks] = useState([]);

    // Fetch only books for Josh
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/my-books')
            .then(response => response.json())
            .then(data => setBooks(data.books))
            .catch(error => console.error('Error fetching book data:', error));
    }, []);

    return (
        <div className="books-container">
            <h2>My Books</h2>
            <div className="table-wrapper">
                <table className="books-table">
                    <thead>
                        <tr>
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
                                    <td>{book.book_title}</td>
                                    <td>{book.book_pages}</td>
                                    <td>{book.year_published}</td>
                                    <td>{book.book_completed ? '✅' : '❌'}</td>
                                    <td>{book.book_genre}</td>
                                    <td>{book.country_published}</td>
                                    <td>{book.book_rating}/10</td>
                                    <td>{book.book_points}</td>
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

export default MyBooksTable;