import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import Home from "./pages/Home";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/register" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;