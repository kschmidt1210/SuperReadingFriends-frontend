import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlayersTable from './PlayersTable';
import BooksTable from './BooksTable';
import MyBooksTable from './MyBooksTable';
import RankingsTable from './RankingsTable';
import Navbar from './Navbar';
import PlayerBooksTable from "./PlayerBooksTable";
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/rankings" />} />
                    <Route path="/rankings" element={<RankingsTable />} />
                    <Route path="/players" element={<PlayersTable />} />
                    <Route path="/books" element={<BooksTable />} />
                    <Route path="/my-books" element={<MyBooksTable />} />
                    <Route path="/player-books/:playerName" element={<PlayerBooksTable />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;