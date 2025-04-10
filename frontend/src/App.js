import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <main>
                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default App;