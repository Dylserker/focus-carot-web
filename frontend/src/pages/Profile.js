import React from 'react';
import Header from '../components/Header';
import './Profile.css';

function Profile() {
    return (
        <div className="profile-container">
            <Header />
            <main className="profile-content">
                <div className="profile-details">
                    <div className="profile-header">
                        <div className="profile-avatar-large">
                            <img src="/profile-placeholder.png" alt="Photo de profil" />
                        </div>
                        <div className="profile-header-info">
                            <h1>Pseudo123</h1>
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="stat-value">Niveau 10</span>
                                    <span className="stat-label">Aventurier</span>
                                </div>
                                <div className="xp-bar">
                                    <div className="xp-progress" style={{ width: '70%' }}></div>
                                    <span className="xp-text">70/100 XP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-sections">
                        <section className="profile-section">
                            <h2>Statistiques</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Tâches complétées</h3>
                                    <p className="stat-number">125</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Succès débloqués</h3>
                                    <p className="stat-number">18</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Jours consécutifs</h3>
                                    <p className="stat-number">7</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Temps total</h3>
                                    <p className="stat-number">42h</p>
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h2>Derniers succès</h2>
                            <ul className="achievements-list">
                                <li className="achievement-item">
                                    <div className="achievement-icon">🏆</div>
                                    <div className="achievement-info">
                                        <h3>Premier pas</h3>
                                        <p>Compléter votre première tâche</p>
                                    </div>
                                </li>
                                <li className="achievement-item">
                                    <div className="achievement-icon">⭐</div>
                                    <div className="achievement-info">
                                        <h3>Constance</h3>
                                        <p>Se connecter 7 jours d'affilée</p>
                                    </div>
                                </li>
                                <li className="achievement-item">
                                    <div className="achievement-icon">🔥</div>
                                    <div className="achievement-info">
                                        <h3>Productivité</h3>
                                        <p>Compléter 10 tâches en une journée</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;