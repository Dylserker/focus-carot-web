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
                    <section className="admin-section">
                        <h2>Gestion des utilisateurs</h2>
                        <div className="admin-card">
                            <p>Gérer les comptes utilisateurs, les permissions et les rôles.</p>
                            <button className="admin-button">Gérer les utilisateurs</button>
                        </div>
                    </section>

                    <section className="admin-section">
                        <h2>Gestion des tâches</h2>
                        <div className="admin-card">
                            <p>Créer, modifier ou supprimer des tâches dans le système.</p>
                            <button className="admin-button">Gérer les tâches</button>
                        </div>
                    </section>

                    <section className="admin-section">
                        <h2>Statistiques</h2>
                        <div className="admin-card">
                            <p>Consulter les statistiques d'utilisation et d'engagement.</p>
                            <button className="admin-button">Voir les statistiques</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Admin;