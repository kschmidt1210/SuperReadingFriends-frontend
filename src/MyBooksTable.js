import React, { useEffect, useState } from "react";
import supabase from "./supabase"; // Import Supabase client
import "./styles/TableStyles.css";
import SubmitBookModal from "./SubmitBookModal";
import EditBookModal from "./EditBookModal.js";

function MyBooksTable() {
    const [books, setBooks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Fetch current user from Supabase
    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("❌ Error fetching user:", error);
            } else {
                setCurrentUser(user);
            }
        };
        getUser();
    }, []);

    // Fetch player_id using the user's email
    useEffect(() => {
        const fetchPlayerId = async () => {
            if (currentUser) {
                const { data, error } = await supabase
                    .from("players")
                    .select("player_id")
                    .eq("player_email", currentUser.email)
                    .single();

                if (error) {
                    console.error("❌ Error fetching player_id:", error);
                } else {
                    setPlayerId(data?.player_id);
                }
            }
        };
        fetchPlayerId();
    }, [currentUser]);

    const fetchBooks = async () => {
        if (playerId) {
            try {
                const response = await fetch(`https://superreadingfriends-backend.onrender.com/api/my-books?player_id=${playerId}&order=created_at.desc`);
                const data = await response.json();

                if (data.books) {
                    setBooks(data.books);
                } else {
                    console.error("❌ No books found for this user.");
                }
            } catch (error) {
                console.error("❌ Error fetching book data:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [playerId]);

    const handleEditBook = (book) => {
        setSelectedBook(book); // Store book data
        setShowEditModal(true); // Open modal
    };

    return (
        <div className="table-container">
            <h2>My Books</h2>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
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
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="loading">Loading...</td>
                            </tr>
                        ) : books.length > 0 ? (
                            books.map((book, index) => (
                                <tr key={index}>
                                    <td><button className="edit-button" onClick={() => handleEditBook(book)}>
                                        ✏️ Edit
                                    </button></td>
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
                                <td colSpan="8" className="loading">No books found for this user.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* 🆕 Add EditBookModal here before the closing div */}
            {showEditModal && (
                <EditBookModal
                    book={selectedBook}
                    onClose={(refresh) => {
                        setShowEditModal(false);
                        if (refresh) fetchBooks(); // Refresh the books list after edit
                    }}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}

export default MyBooksTable;