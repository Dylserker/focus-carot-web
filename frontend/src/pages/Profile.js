import React, { useState } from 'react';
import Header from '../components/Header';
import './Profile.css';

function Profile() {
    const [editMode, setEditMode] = useState(false);

    const [userData, setUserData] = useState({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: '••••••••',
        title: 'Développeur Web'
    });

    const handleEdit = () => {
        setEditMode(!editMode);
    };

    return (
        <div>
            <Header />
        <div className="profile-container">

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

                            <div className="profile-info-container">
                                <div className="personal-info">
                                    <div className="info-row">
                                        <label>Prénom:</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={userData.firstName}
                                                onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                                            />
                                        ) : (
                                            <span>{userData.firstName}</span>
                                        )}
                                    </div>
                                    <div className="info-row">
                                        <label>Nom:</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={userData.lastName}
                                                onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                                            />
                                        ) : (
                                            <span>{userData.lastName}</span>
                                        )}
                                    </div>
                                    <div className="info-row">
                                        <label>Email:</label>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                value={userData.email}
                                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                            />
                                        ) : (
                                            <span>{userData.email}</span>
                                        )}
                                    </div>
                                    <div className="info-row">
                                        <label>Mot de passe:</label>
                                        {editMode ? (
                                            <input
                                                type="password"
                                                value={userData.password}
                                                onChange={(e) => setUserData({...userData, password: e.target.value})}
                                            />
                                        ) : (
                                            <span>{userData.password}</span>
                                        )}
                                    </div>
                                    <div className="info-row">
                                        <label>Titre:</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={userData.title}
                                                onChange={(e) => setUserData({...userData, title: e.target.value})}
                                            />
                                        ) : (
                                            <span>{userData.title}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="edit-button"
                                    onClick={handleEdit}
                                >
                                    {editMode ? 'Enregistrer' : 'Modifier'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
}

export default Profile;