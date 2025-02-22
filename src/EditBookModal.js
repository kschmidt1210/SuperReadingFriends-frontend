import React, { useState, useEffect } from "react";
import supabase from "./supabase";
import "./styles/SubmitBookModal.css";

function EditBookModal({ book, onClose, currentUser }) {
    const [bookData, setBookData] = useState({ ...book });
    const [calculatedPoints, setCalculatedPoints] = useState(0);

    useEffect(() => {
        if (book) {
            setBookData({ ...book }); // Preload book data into state
            updateCalculatedPoints(book); // Calculate points based on existing values
        }
    }, [book]);

    // Function to calculate points based on book data
    const updateCalculatedPoints = (updatedData) => {
        const points = calculatePoints(updatedData);
        setCalculatedPoints(points);
    };

    function calculatePoints(bookData) {
        let { pages, completed, fiction_nonfiction, hometown_bonus, bonus_1, bonus_2, bonus_3, deductions } = bookData;

        // Get point multipliers from the provided `pointValues` lookup
        let pageRate1 = 0.5; // Example values
        let pageRate2 = 0.2; // Example values

        // **Step 1: Base Points Calculation** (Round pages up to the nearest 50)
        let roundedPages = Math.ceil(pages / 50) * 50;
        let basePoints = 
            (Math.min(100, roundedPages) * pageRate1 / 50) + 
            (Math.max(0, roundedPages - 100) * pageRate2 / 50);

        // **Step 2: Fiction/Nonfiction Bonus (Only applies if completed)**
        let extraPoints = completed ? (fiction_nonfiction === "fiction" ? 0.5 : 0.3) : 0;

        // **Step 3: Multipliers Calculation**
        let multipliers = (hometown_bonus ? 0.1 : 0) + (bonus_1 ? 0.05 : 0) + (bonus_2 ? 0.05 : 0) + (bonus_3 ? 0.05 : 0);

        // **Step 4: Deduction Multiplier**
        let deductionMultiplier = deductions ? 0.9 : 1;

        // **Final Calculation**
        let finalPoints = (basePoints + extraPoints) * (1 + multipliers) * deductionMultiplier;

        return finalPoints.toFixed(2); // Round to 2 decimal places
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        let newValue = type === "checkbox" ? checked : value;

        setBookData((prevData) => {
            const updatedData = { ...prevData, [name]: newValue };
            updateCalculatedPoints(updatedData);
            return updatedData;
        });
    };

    const handleSave = async () => {
        if (!currentUser) {
            alert("You must be logged in to edit a book.");
            return;
        }
    
        // Ensure all fields have default values before updating Supabase
        const updatedBookData = {
            title: bookData.title ? bookData.title.trim() : "",
            pages: bookData.pages ? parseInt(bookData.pages) : 0,
            year_published: bookData.year_published ? parseInt(bookData.year_published) : null,
            completed: bookData.completed,
            fiction_nonfiction: bookData.fiction_nonfiction || "",
            female_author: bookData.female_author,
            genre: bookData.genre ? bookData.genre.trim() : "",
            country_published: bookData.country_published ? bookData.country_published.trim() : "",
            date_finished: bookData.date_finished || null,
            rating: bookData.rating ? parseFloat(bookData.rating) : 0,
            longest_series: bookData.longest_series,
            deductions: bookData.deductions ? bookData.deductions.trim() : "",
            hometown_bonus: bookData.hometown_bonus ? bookData.hometown_bonus.trim() : "",
            bonus_1: bookData.bonus_1 ? bookData.bonus_1.trim() : "",
            bonus_2: bookData.bonus_2 ? bookData.bonus_2.trim() : "",
            bonus_3: bookData.bonus_3 ? bookData.bonus_3.trim() : "",
            points: parseFloat(calculatedPoints) || 0
        };
    
        const { error } = await supabase
            .from("logged_books")
            .update(updatedBookData)
            .eq("id", bookData.id); // Match the book by its unique ID
    
        if (error) {
            console.error("❌ Error updating book:", error);
            alert(`Failed to update book: ${error.message}`);
        } else {
            alert("✅ Book successfully updated!");
            onClose(true); // Refresh parent component after saving
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Book</h2>
                <form onSubmit={(e) => e.preventDefault()}>
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
                            onClick={() => handleChange({ target: { name: "completed", type: "checkbox", checked: !bookData.completed } })}
                        >Yes</button>
                        <button 
                            type="button" 
                            className={!bookData.completed ? "active" : ""} 
                            onClick={() => handleChange({ target: { name: "completed", type: "checkbox", checked: !bookData.completed } })}
                        >No</button>
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
                                onClick={() => handleChange({ target: { name: "rating", value: star } })}
                            >★</span>
                        ))}
                    </div>

                    {/* Hometown Bonus */}
                    <input 
                        type="text" 
                        name="hometown_bonus" 
                        placeholder="Hometown Bonus" 
                        value={bookData.hometown_bonus} 
                        onChange={handleChange} 
                    />

                    {/* Bonuses */}
                    <input type="text" name="bonus_1" placeholder="Bonus 1" value={bookData.bonus_1} onChange={handleChange} />
                    <input type="text" name="bonus_2" placeholder="Bonus 2" value={bookData.bonus_2} onChange={handleChange} />
                    <input type="text" name="bonus_3" placeholder="Bonus 3" value={bookData.bonus_3} onChange={handleChange} />
                    <input type="text" name="deductions" placeholder="Deductions" value={bookData.deductions} onChange={handleChange} />

                    <div className="button-container">
                        <div className="points-display">
                            <strong>Points:</strong> {calculatedPoints}
                        </div>
                        <button type="button" className="primary-button" onClick={handleSave}>
                            Save Changes
                        </button>
                        <button type="button" className="secondary-button" onClick={() => onClose(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBookModal;