import React, { useEffect, useState } from 'react';

function FriendsTable() {
    const [friends, setFriends] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        fetch('https://superreadingfriends-backend.onrender.com/api/friends')
            .then(response => response.json())
            .then(data => setFriends(data.friends))
            .catch(error => console.error('Error fetching friends data:', error));
    }, []);

    return (
        <div className="friends-container">
            <h2>Friends Leaderboard</h2>
            <div className="table-wrapper">
                <table className="friends-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Pages</th>
                            <th>Books Counted</th>
                            <th>Books Completed</th>
                            <th>Total Points</th>
                            <th>Avg. Book Length</th>
                            <th>Highest-Point Book</th>
                            <th>Highest-Rated Book</th>
                        </tr>
                    </thead>
                    <tbody>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <tr key={index}>
                                    <td>{friend.name}</td>
                                    <td>{friend.pages}</td>
                                    <td>{friend.booksCounted}</td>
                                    <td>{friend.booksCompleted}</td>
                                    <td>{friend.totalPoints}</td>
                                    <td>{friend.avgBookLength}</td>
                                    <td>{friend.highestPointBook} ({friend.highestPointBookValue} pts)</td>
                                    <td>{friend.highestRatedBook} ({friend.highestRatedBookRating}★)</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="loading">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FriendsTable;