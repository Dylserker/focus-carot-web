import React from 'react';
import Header from '../components/Header';
import './Admin.css';

function Admin() {
    return (
        <div className="admin-page">
            <Header />
            <main className="admin-container">
                <h1>Panneau d'administration</h1>
                <div className="admin-content">
                </div>
            </main>
        </div>
    );
}

export default Admin;