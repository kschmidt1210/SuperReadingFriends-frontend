import React, { useState, useEffect } from "react";
import supabase from "./supabase";  // Import Supabase client
import "./SubmitBookModal.css";

function SubmitBookModal({ isOpen, onClose, onBookAdded }) {
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        pages: "",
        genre: "",
        fiction_status: "",
        reading_status: false,
        notes: "",
        user_id: "" // This will be updated dynamically
    });

    const [currentUser, setCurrentUser] = useState(null);

    // Fetch the logged-in user from Supabase
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("❌ Error fetching user:", error);
            } else {
                console.log("✅ Logged-in user:", user); // Debugging statement
                setCurrentUser(user);
                setBookData((prevData) => ({
                    ...prevData,
                    user_id: user?.id,  // Store user_id from Supabase
                }));
            }
        };
    
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBookData({
            ...bookData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bookData.user_id) {
            alert("User not found. Please log in.");
            return;
        }

        try {
            const response = await fetch("https://superreadingfriends-backend.onrender.com/api/log-book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert("Book submitted successfully!");
            onBookAdded();
            onClose();
        } catch (error) {
            console.error("❌ Error submitting book:", error);
            alert("Error submitting book. Check the console for details.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Submit New Book</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" name="title" placeholder="Book Title" value={bookData.title} onChange={handleChange} required />
                        <input type="text" name="author" placeholder="Author" value={bookData.author} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Page Count</label>
                        <input type="number" name="pages" value={bookData.pages} onChange={handleChange} required />
                    </div>

                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" name="reading_status" checked={bookData.reading_status} onChange={handleChange} />
                            Completed
                        </label>
                    </div>

                    <div className="radio-buttons">
                        <label>
                            <input type="radio" name="fiction_status" value="fiction" checked={bookData.fiction_status === "fiction"} onChange={handleChange} />
                            Fiction
                        </label>
                        <label>
                            <input type="radio" name="fiction_status" value="nonfiction" checked={bookData.fiction_status === "nonfiction"} onChange={handleChange} />
                            Nonfiction
                        </label>
                    </div>

                    <div className="dropdown">
                        <label>📚 Select Genre</label>
                        <select name="genre" value={bookData.genre} onChange={handleChange}>
                            <option value="">Select Genre</option>
                            <option value="fiction">Fiction</option>
                            <option value="non-fiction">Non-Fiction</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="mystery">Mystery</option>
                        </select>
                    </div>

                    <label>Notes</label>
                    <textarea name="notes" value={bookData.notes} onChange={handleChange} />

                    <div className="button-group">
                        <button type="submit" className="primary-button">Submit Book</button>
                        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmitBookModal;