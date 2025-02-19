import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import useSortableTable from "./hooks/useSortableTable";
import "./styles/TableStyles.css";

function RankingsTable() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // ✅ Hook for navigation

    // Fetch rankings from backend
    useEffect(() => {
        console.log("📢 Fetching rankings...");
        fetch("https://superreadingfriends-backend.onrender.com/api/rankings")
            .then((response) => {
                console.log("🔍 Response Status:", response.status);
                return response.json();
            })
            .then((data) => {
                console.log("✅ Raw Rankings Data:", data);
                if (data.rankings) {
                    // Assign rank before setting state
                    const rankedData = data.rankings
                        .sort((a, b) => b.total_points - a.total_points) // Ensure sorted initially by points
                        .map((player, index) => ({
                            ...player,
                            rank: index + 1, // Attach rank to each player
                        }));
    
                    setRankings(rankedData);
                } else {
                    console.error("❌ Invalid data format from backend:", data);
                    setRankings([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("❌ Error fetching rankings:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const { data: sortedRankings, sortData, sortConfig } = useSortableTable(rankings);
    console.log("🔍 Sorted Rankings Data Before Render:", sortedRankings);
    
    if (loading) return <div className="loading">Loading rankings...</div>;
    if (error) return <div className="error">Error loading rankings: {error}</div>;

    const getRankEmoji = (rank) => {
        if (rank === 1) return " 👑"; // Gold Crown for 1st place
        if (rank === 2) return " 🥈"; // Silver Medal for 2nd place
        if (rank === 3) return " 🥉"; // Bronze Medal for 3rd place
        return "";
    };

    // ✅ Function to handle row click
    const handleRowClick = (playerName) => {
        navigate(`/player-books/${encodeURIComponent(playerName)}`);
    };

    return (
        <div className="table-container">
            <h2>Player Rankings 🏆</h2>
            <div className="table-wrapper">
                <table className="table">
                <thead>
                    <tr>
                        <th 
                            className={`sortable ${sortConfig.key === "rank" ? `sorted-${sortConfig.direction}` : ""}`}
                            onClick={() => sortData("rank")}
                        >
                            <span>Rank</span> {sortConfig.key === "rank" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                        </th>
                        <th 
                            className={`sortable ${sortConfig.key === "player_name" ? `sorted-${sortConfig.direction}` : ""}`}
                            onClick={() => sortData("player_name")}
                        >
                            <span>Player</span> {sortConfig.key === "player_name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                        </th>
                        <th 
                            className={`sortable ${sortConfig.key === "total_points" ? `sorted-${sortConfig.direction}` : ""}`}
                            onClick={() => sortData("total_points")}
                        >
                            <span>Total Points</span> {sortConfig.key === "total_points" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
                        </th>
                    </tr>
                </thead>
                    <tbody>
                        {sortedRankings.length > 0 ? (
                            sortedRankings.map((player, index) => (
                                <tr key={index} 
                                    className="clickable-row" 
                                    onClick={() => handleRowClick(player.player_name)}
                                >
                                    <td>
                                        <span className="rank-badge">{player.rank}</span> {/* Use assigned rank */}
                                    </td>
                                    <td>
                                        {player.player_name}
                                        <span className="rank-emoji">{getRankEmoji(player.rank)}</span>
                                    </td>
                                    <td>{player.total_points.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="loading">No rankings available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RankingsTable;