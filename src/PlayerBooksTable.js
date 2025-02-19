import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/TableStyles.css";

function PlayerBooksTable() {
    const { playerName } = useParams(); // ✅ Get player name from URL
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://superreadingfriends-backend.onrender.com/api/player-books?player_name=${encodeURIComponent(playerName)}&order=created_at.desc`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.books) {
                    setBooks(data.books);
                } else {
                    throw new Error("Invalid data format from backend");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Error fetching books:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [playerName]);

    if (loading) return <div className="loading">Loading books...</div>;
    if (error) return <div className="error">Error loading books: {error}</div>;

    return (
        <div className="table-container">
            <h2>{playerName}'s Reading List 📚</h2>
            <div className="table-wrapper">
                <table className="table">
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
                                    <td>{book.title}</td>
                                    <td>{book.pages}</td>
                                    <td>{book.year_published}</td>
                                    <td>{book.completed ? "✅" : "❌"}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.country_published}</td>
                                    <td>{book.rating}/10</td>
                                    <td>{book.points}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="loading">No books found for this player.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlayerBooksTable;