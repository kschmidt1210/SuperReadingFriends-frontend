import React, { useEffect, useState } from 'react';
import './BooksTable.css'; // Use the same styles as BooksTable

function RankingsTable() {
    const [rankings, setRankings] = useState([]);

    // Fetch rankings from backend
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/rankings')
            .then(response => response.json())
            .then(data => setRankings(data.rankings))
            .catch(error => console.error('Error fetching rankings:', error));
    }, []);

    return (
        <div className="books-container"> {/* Using the same container class */}
            <h2>Player Rankings 🏆</h2>
            <div className="table-wrapper">
                <table className="books-table"> {/* Using the same table class */}
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
                                    <td>{player.player_name}</td>
                                    <td>{player.total_points}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="loading">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RankingsTable;