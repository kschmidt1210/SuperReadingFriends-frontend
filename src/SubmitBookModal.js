import React, { useState } from "react";
import "./SubmitBookModal.css";

function SubmitBookModal({ isOpen, onClose, onBookAdded }) {
    const [bookData, setBookData] = useState({
        player_name: "Josh", // Hardcoded for now
        title: "",
        pages: "",
        year_published: "",
        completed: false,
        genre: "",
        rating: "",
        points: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBookData({
            ...bookData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("https://superreadingfriends-backend.onrender.com/api/submit-book", {
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
                <h2>Submit a New Book 📚</h2>
                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input type="text" name="title" value={bookData.title} onChange={handleChange} required />

                    <label>Pages:</label>
                    <input type="number" name="pages" value={bookData.pages} onChange={handleChange} required />

                    <label>Year Published:</label>
                    <input type="number" name="year_published" value={bookData.year_published} onChange={handleChange} />

                    <label>Completed:</label>
                    <input type="checkbox" name="completed" checked={bookData.completed} onChange={handleChange} />

                    <label>Genre:</label>
                    <input type="text" name="genre" value={bookData.genre} onChange={handleChange} />

                    <label>Rating (out of 10):</label>
                    <input type="number" name="rating" value={bookData.rating} onChange={handleChange} min="1" max="10" />

                    <label>Points:</label>
                    <input type="number" name="points" value={bookData.points} onChange={handleChange} required />

                    <div className="modal-actions">
                        <button type="submit">Submit Book</button>
                        <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmitBookModal;