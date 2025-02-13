import React, { useState } from "react";
import "./SubmitBookModal.css";

function SubmitBookModal({ isOpen, onClose, onBookAdded }) {
    const [bookData, setBookData] = useState({
        player_name: "Josh", // Hardcoded for now
        title: "",
        author: "",
        description: "",
        pages: "",
        genre: "",
        rating: "",
        points: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({
            ...bookData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("https://superreadingfriends-backend.onrender.com/api/log-book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData),
        });

        if (response.ok) {
            alert("Book submitted successfully!");
            onBookAdded(); // Refresh book list
            onClose(); // Close modal
        } else {
            alert("Error submitting book. Please try again.");
        }
    };

    if (!isOpen) return null; // Don't render if modal is closed

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

                    <div className="radio-buttons">
                        <label>
                            <input type="checkbox" name="reading_status" value="completed" onChange={handleChange} />
                            Completed
                        </label>

                        <label>
                            <input type="radio" name="fiction" value="fiction" onChange={handleChange} />
                            Fiction
                            <input type="radio" name="nonfiction" value="nonfiction" onChange={handleChange} />
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
                    <textarea name="Notes" value={bookData.notes} onChange={handleChange} />

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