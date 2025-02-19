import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import for navigation
import supabase from "./supabase"; // Ensure supabase client is properly imported
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./styles/SubmitBookModal.css";


function SubmitBookModal({ onClose, currentUser }) {
    const navigate = useNavigate(); // ✅ Initialize navigation hook
    const location = useLocation();

    // ✅ Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    };

    const [bookData, setBookData] = useState({
        title: "",
        pages: "",
        year_published: "",
        completed: true,
        fiction_nonfiction: "fiction",
        female_author: false,
        genre: "",
        country_published: "",
        date_finished: getCurrentDate(),
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
    
        // **Fetch the player's name based on currentUser's uuid**
        const { data: playerData, error: playerError } = await supabase
            .from("players")
            .select("player_name")
            .eq("player_id", currentUser.id)
            .single(); // Expecting a single result
    
        if (playerError || !playerData) {
            console.error("❌ Error fetching player name:", playerError?.message);
            alert("Failed to retrieve player information.");
            return;
        }
    
        const playerName = playerData.player_name; // Store the player's name
    
        const newBookEntry = {
            player_id: currentUser.id, // Store user ID (foreign key)
            player_name: playerName,  // ✅ Now including the player's name
            title: bookData.title,
            pages: parseInt(bookData.pages) || 0,
            year_published: parseInt(bookData.year_published) || 0,
            completed: bookData.completed,
            fiction_nonfiction: bookData.fiction_nonfiction,
            female_author: bookData.female_author,
            genre: bookData.genre,
            country_published: bookData.country_published,
            date_finished: bookData.date_finished,
            rating: parseFloat(bookData.rating) || 0,
            longest_series: bookData.longest_series,
            deductions: parseFloat(bookData.deductions) || 0,
            points: parseFloat(bookData.points) || 0, // Use static for now
        };
    
        console.log("Submitting book:", newBookEntry);
        
        // **Insert data into Supabase**
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

             // ✅ Refresh My Books page if the user is already on /my-books
             if (location.pathname === "/my-books") {
                window.location.reload(); // ✅ Force a page reload
            } else {
                navigate("/my-books"); // ✅ Navigate to My Books if not there
            }
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
                            className={bookData.fiction_nonfiction ? "active" : ""} 
                            onClick={() => handleToggle("fiction_nonfiction")}
                        >Fiction</button>
                        <button 
                            type="button" 
                            className={!bookData.fiction_nonfiction ? "active" : ""} 
                            onClick={() => handleToggle("fiction_nonfiction")}
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
                        name="country_published" 
                        placeholder="Country" 
                        value={bookData.country_published} 
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