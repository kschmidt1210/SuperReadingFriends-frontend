import React, { useEffect, useState } from 'react';
import "./TableStyles.css";

function PlayersTable() {
    const [players, setPlayers] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/players')
            .then(response => response.json())
            .then(data => setPlayers(data.players)) // Fixed setPlayers
            .catch(error => console.error('Error fetching player data:', error));
    }, []);

    return (
        <div className="table-container">
            <h2>Players List</h2>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.length > 0 ? (
                            players.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.player_name}</td>
                                    <td>{player.player_email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="loading">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlayersTable;