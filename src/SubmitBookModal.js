import React, { useState } from "react";
import supabase from "./supabase"; // Ensure supabase client is properly imported
import "./styles/SubmitBookModal.css";

function SubmitBookModal({ onClose, currentUser }) {
    const [bookData, setBookData] = useState({
        title: "",
        pages: "",
        year_published: "",
        completed: false,
        fiction: true,
        female_author: false,
        genre: "",
        country: "",
        date_finished: "",
        rating: 0,
        longest_series: false,
        deductions: 0,
        points: 0,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Yes/No Toggles
    const handleToggle = (field) => {
        setBookData((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Handle Star Rating
    const handleStarClick = (rating) => {
        setBookData((prev) => ({
            ...prev,
            rating,
        }));
    };

    // **2️⃣ Handle Form Submission**
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure user is logged in before submitting
        if (!currentUser) {
            alert("You must be logged in to submit a book.");
            return;
        }

        const newBookEntry = {
            player_id: currentUser.id, // Store user ID (foreign key)
            title: bookData.title,
            pages: parseInt(bookData.pages) || 0,
            year_published: bookData.year_published,
            completed: bookData.completed,
            fiction: bookData.fiction,
            female_author: bookData.female_author,
            genre: bookData.genre,
            country: bookData.country,
            date_finished: bookData.date_finished,
            rating: bookData.rating,
            longest_series: bookData.longest_series,
            deductions: parseFloat(bookData.deductions) || 0,
            points: parseFloat(bookData.points) || 0, // Use static for now
        };

        // **3️⃣ Insert data into Supabase**
        const { data, error } = await supabase
            .from("logged_books")
            .insert([newBookEntry]);

        if (error) {
            console.error("❌ Error submitting book:", error.message);
            alert("Failed to submit book. Please try again.");
        } else {
            console.log("✅ Book successfully submitted:", data);
            alert("Book submitted successfully!");
            onClose(); // Close the modal
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Submit New Book</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Book Title" 
                        value={bookData.title} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="number" 
                        name="pages" 
                        placeholder="Pages" 
                        value={bookData.pages} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="number" 
                        name="year_published" 
                        placeholder="Year Published" 
                        value={bookData.year_published} 
                        onChange={handleChange} 
                    />
                    
                    {/* Yes/No Toggles */}
                    <div className="toggle-group">
                        <label>Completed:</label>
                        <button 
                            type="button" 
                            className={bookData.completed ? "active" : ""} 
                            onClick={() => handleToggle("completed")}
                        >Yes</button>
                        <button 
                            type="button" 
                            className={!bookData.completed ? "active" : ""} 
                            onClick={() => handleToggle("completed")}
                        >No</button>
                    </div>

                    <div className="toggle-group">
                        <label>Fiction:</label>
                        <button 
                            type="button" 
                            className={bookData.fiction ? "active" : ""} 
                            onClick={() => handleToggle("fiction")}
                        >Fiction</button>
                        <button 
                            type="button" 
                            className={!bookData.fiction ? "active" : ""} 
                            onClick={() => handleToggle("fiction")}
                        >Nonfiction</button>
                    </div>

                    <input 
                        type="text" 
                        name="genre" 
                        placeholder="Genre" 
                        value={bookData.genre} 
                        onChange={handleChange} 
                    />

                    <input 
                        type="text" 
                        name="country" 
                        placeholder="Country" 
                        value={bookData.country} 
                        onChange={handleChange} 
                    />

                    <input 
                        type="date" 
                        name="date_finished" 
                        value={bookData.date_finished} 
                        onChange={handleChange} 
                    />

                    {/* Star Rating */}
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star} 
                                className={`star ${bookData.rating >= star ? "selected" : ""}`} 
                                onClick={() => handleStarClick(star)}
                            >★</span>
                        ))}
                    </div>

                    <div className="button-container">
                        <button type="submit" className="primary-button">
                            Submit Book
                        </button>
                        <button type="button" className="secondary-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmitBookModal;