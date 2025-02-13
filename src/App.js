import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlayersTable from './PlayersTable';
import BooksTable from './BooksTable';
import MyBooksTable from './MyBooksTable';
import Navbar from './Navbar';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/players" />} />
                    <Route path="/players" element={<PlayersTable />} />
                    <Route path="/books" element={<BooksTable />} />
                    <Route path="/my-books" element={<MyBooksTable />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;