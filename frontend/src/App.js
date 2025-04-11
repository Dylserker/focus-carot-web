import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import Home from "./pages/Home";
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/register" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;