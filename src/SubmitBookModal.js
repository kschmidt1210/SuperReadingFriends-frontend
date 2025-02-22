import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import for navigation
import supabase from "./supabase"; // Ensure supabase client is properly imported
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./styles/SubmitBookModal.css";


function SubmitBookModal({ onClose, currentUser }) {
    const navigate = useNavigate(); // ✅ Initialize navigation hook
    const location = useLocation();
    const [pointValues, setPointValues] = useState({});

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
        deductions: "",
        hometown_bonus: "",  // 🆕 New field
        bonus_1: "",  // 🆕 New field
        bonus_2: "",  // 🆕 New field
        bonus_3: "",  // 🆕 New field
    });

    const [calculatedPoints, setCalculatedPoints] = useState(0);

    useEffect(() => {
        async function fetchPointValues() {
            const { data, error } = await supabase.from("point_values").select("attribute, value");
            if (!error) {
                const valuesMap = data.reduce((acc, { attribute, value }) => {
                    acc[attribute] = value;
                    return acc;
                }, {});
                setPointValues(valuesMap);
            } else {
                console.error("Error fetching point values:", error);
            }
        }
        fetchPointValues();
    }, []);

    const updateCalculatedPoints = (updatedData) => {
        const points = calculatePoints(updatedData, pointValues);
        setCalculatedPoints(points); // ✅ Update the state with new points
    };

    function calculatePoints(bookData, pointValues) {
        let { pages, completed, fiction_nonfiction, hometown_bonus, bonus_1, bonus_2, bonus_3, deductions } = bookData;
    
        // Get point multipliers from the provided `pointValues` lookup
        let pageRate1 = pointValues["Page Rate (1-100) per 50"] || 0;
        let pageRate2 = pointValues["Page Rate (100+) per 50"] || 0;
    
        // **Step 1: Base Points Calculation** (Round pages up to the nearest 50)
        let roundedPages = Math.ceil(pages / 50) * 50;
        let basePoints = 
            (Math.min(100, roundedPages) * pageRate1 / 50) + 
            (Math.max(0, roundedPages - 100) * pageRate2 / 50);
    
        // **Step 2: Fiction/Nonfiction Bonus (Only applies if completed)**
        // Ensure first letter is uppercase to match point_values table
        let fictionNonfictionKey = String(fiction_nonfiction).charAt(0).toUpperCase() + String(fiction_nonfiction).slice(1);
        let extraPoints = completed ? (pointValues[fictionNonfictionKey] || 0) : 0;
    
        // **Step 3: Multipliers Calculation**
        let multipliers = 
            (pointValues[hometown_bonus] || 0) +
            (pointValues[bonus_1] || 0) +
            (pointValues[bonus_2] || 0) +
            (pointValues[bonus_3] || 0);
    
        // **Step 4: Deduction Multiplier**
        let deductionMultiplier = pointValues[deductions] || 1;
    
        // **Final Calculation**
        let finalPoints = (basePoints + extraPoints) * (1 + multipliers) * deductionMultiplier;
    
        return finalPoints.toFixed(2); // Round to 2 decimal places
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        let newValue = type === "checkbox" ? checked : value;
    
        setBookData((prevData) => {
            const updatedData = { ...prevData, [name]: newValue };
            updateCalculatedPoints(updatedData); // 🔥 Update points dynamically
            return updatedData;
        });
    };

    // Handle Yes/No Toggles
    const handleToggle = (field) => {
        const updatedBookData = { ...bookData, [field]: !bookData[field] };
        setBookData(updatedBookData);
        updateCalculatedPoints(updatedBookData);
    };

    // Handle Star Rating
    const handleStarClick = (rating) => {
        const updatedBookData = { ...bookData, rating };
        setBookData(updatedBookData);
        updateCalculatedPoints(updatedBookData);
    };

    // **2️⃣ Handle Form Submission**
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure user is logged in before submitting
        if (!currentUser) {
            alert("You must be logged in to submit a book.");
            return;
        }
    
        // Fetch the player's name based on currentUser's uuid
        const { data: playerData, error: playerError } = await supabase
            .from("players")
            .select("player_name")
            .eq("player_id", currentUser.id)
            .single();
    
        if (playerError || !playerData) {
            console.error("❌ Error fetching player name:", playerError?.message);
            alert("Failed to retrieve player information.");
            return;
        }
    
        const playerName = playerData.player_name; // Store the player's name
    
        // Construct book entry, ensuring correct data types
        const newBookEntry = {
            player_id: currentUser.id, 
            player_name: playerName,
            title: bookData.title.trim(),
            pages: parseInt(bookData.pages) || 0,
            year_published: bookData.year_published ? parseInt(bookData.year_published) : null,
            completed: bookData.completed,
            fiction_nonfiction: bookData.fiction_nonfiction,
            female_author: bookData.female_author,
            genre: bookData.genre.trim() || null,
            country_published: bookData.country_published.trim() || null,
            date_finished: bookData.date_finished,
            rating: parseFloat(bookData.rating) || 0,
            longest_series: bookData.longest_series,
            deductions: bookData.deductions.trim() || null,
            hometown_bonus: bookData.hometown_bonus.trim() || null,
            bonus_1: bookData.bonus_1.trim() || null,
            bonus_2: bookData.bonus_2.trim() || null,
            bonus_3: bookData.bonus_3.trim() || null,
            points: parseFloat(calculatedPoints) || 0
        };
    
        // Insert data into Supabase
        const { data, error } = await supabase
            .from("logged_books")
            .insert([newBookEntry]);
    
        if (error) {
            console.error("❌ Error submitting book:", error);
            alert(`Failed to submit book: ${error.message}`);
            return; // Stop execution if there's an error
        }
    
        console.log("✅ Book successfully submitted:", data); // 🔍 Log the response from Supabase
    
        onClose(); // Close the modal
    
        // Refresh My Books page if the user is already on /my-books
        if (location.pathname === "/my-books") {
            window.location.reload(); // Force a page reload
        } else {
            navigate("/my-books"); // Navigate to My Books if not there
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

                    {/* Hometown Bonus */}
                    <input 
                        type="text" 
                        name="hometown_bonus" 
                        placeholder="Hometown Bonus" 
                        value={bookData.hometown_bonus} 
                        onChange={handleChange} 
                    />

                    {/* Bonus 1 */}
                    <input 
                        type="text" 
                        name="bonus_1" 
                        placeholder="Bonus 1" 
                        value={bookData.bonus_1} 
                        onChange={handleChange} 
                    />

                    {/* Bonus 2 */}
                    <input 
                        type="text" 
                        name="bonus_2" 
                        placeholder="Bonus 2" 
                        value={bookData.bonus_2} 
                        onChange={handleChange} 
                    />

                    {/* Bonus 3 */}
                    <input 
                        type="text" 
                        name="bonus_3" 
                        placeholder="Bonus 3" 
                        value={bookData.bonus_3} 
                        onChange={handleChange} 
                    />

                    {/* Deductions (Number Input) */}
                    <input 
                        type="text" 
                        name="deductions" 
                        placeholder="Deductions" 
                        value={bookData.deductions} 
                        onChange={handleChange} 
                    />

                    <div className="button-container">
                        <div className="points-display">
                            <strong>Points:</strong> {calculatedPoints !== undefined ? calculatedPoints : "0.00"}
                        </div>
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