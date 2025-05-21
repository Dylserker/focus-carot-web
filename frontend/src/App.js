import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Task from './pages/Task/Task';
import Contact from './pages/Contact/Contact';
import Success from './pages/Success/Success';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import ItemsPage from './pages/ItemsPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './component/Utils/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        <Route path="/tasks" element={
                            <PrivateRoute>
                                <Task />
                            </PrivateRoute>
                        } />
                        <Route path="/contact" element={
                            <PrivateRoute>
                                <Contact />
                            </PrivateRoute>
                        } />
                        <Route path="/success" element={
                            <PrivateRoute>
                                <Success />
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/admin" element={
                            <PrivateRoute>
                                <Admin />
                            </PrivateRoute>
                        } />
                        <Route path="/items" element={
                            <PrivateRoute>
                                <ItemsPage />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;