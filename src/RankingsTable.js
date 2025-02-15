import React, { useEffect, useState } from 'react';
import "./styles/TableStyles.css";

function RankingsTable() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch rankings from backend
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/rankings')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.rankings) {
                    setRankings(data.rankings);
                } else {
                    throw new Error('Invalid data format from backend');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Error fetching rankings:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">Loading rankings...</div>;
    }

    if (error) {
        return <div className="error">Error loading rankings: {error}</div>;
    }

    // Function to add emoji based on rank
    const getRankEmoji = (rank) => {
        if (rank === 1) return " 👑"; // Gold Crown for 1st place
        if (rank === 2) return " 🥈"; // Silver Medal for 2nd place
        if (rank === 3) return " 🥉"; // Bronze Medal for 3rd place
        return ""; // No emoji for other ranks
    };

    return (
        <div className="table-container">
            <h2>Player Rankings 🏆</h2>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.length > 0 ? (
                            rankings.map((player, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className="rank-badge">{index + 1}</span>
                                    </td>
                                    <td>
                                        {player.player_name}
                                        <span className="rank-emoji">{getRankEmoji(index + 1)}</span>
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