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
                </div>
            </main>
        </div>
    );
}

export default Profile;