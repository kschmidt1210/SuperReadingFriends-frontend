import React, { useEffect, useState } from 'react';

function RankingsTable() {
    const [players, setPlayers] = useState([]);

    // Fetch player data from the backend API
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/players')
            .then(response => response.json())
            .then(data => setPlayers(data.players))
            .catch(error => console.error('Error fetching player data:', error));
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Player Rankings</h2>
            <table style={{ width: '60%', margin: 'auto', borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={styles.cell}>Player ID</th>
                        <th style={styles.cell}>Player Name</th>
                        <th style={styles.cell}>Player Email</th>
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ? (
                        players.map((player, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid black' }}>
                                <td style={styles.cell}>{player.playerID}</td>
                                <td style={styles.cell}>{player.playerName}</td>
                                <td style={styles.cell}>{player.playerEmail}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={styles.cell}>Loading...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    cell: {
        border: '1px solid black',
        padding: '10px',
        textAlign: 'center'
    }
};

export default RankingsTable;