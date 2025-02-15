import React, { useEffect, useState } from "react";
import supabase from "./supabase"; // Import Supabase client
import "./styles/TableStyles.css";

function MyBooksTable() {
    const [books, setBooks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchBooks = async () => {
            if (playerId) {
                try {
                    const response = await fetch(`https://superreadingfriends-backend.onrender.com/api/my-books?player_id=${playerId}`);
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
        fetchBooks();
    }, [playerId]);

    return (
        <div className="table-container">
            <h2>My Books</h2>
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
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="loading">Loading...</td>
                            </tr>
                        ) : books.length > 0 ? (
                            books.map((book, index) => (
                                <tr key={index}>
                                    <td>{book.book_title}</td>
                                    <td>{book.book_pages}</td>
                                    <td>{book.year_published}</td>
                                    <td>{book.book_completed ? "✅" : "❌"}</td>
                                    <td>{book.book_genre}</td>
                                    <td>{book.country_published}</td>
                                    <td>{book.book_rating}/10</td>
                                    <td>{book.book_points}</td>
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
        </div>
    );
}

export default MyBooksTable;