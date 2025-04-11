import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import './Profile.css';

function Profile() {
    const [editMode, setEditMode] = useState(false);
    const fileInputRef = useRef(null);

    const [userData, setUserData] = useState({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: '••••••••',
        title: 'Développeur Web',
        pseudo: 'Pseudo123',
        avatar: '/profile-placeholder.png',
    });

    const handleEdit = () => {
        setEditMode(!editMode);
    };

    const handleAvatarClick = () => {
        if (editMode && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setUserData({...userData, avatar: imageUrl});
        }
    };


    return (
        <div>
            <Header />
            <div className="profile-container">
                <main className="profile-content">
                    <div className="profile-details">
                        <div className="profile-header">
                            <div className="profile-avatar-large">
                                <img src={userData.avatar} alt="Photo de profil" />
                                {editMode && (
                                    <div className="avatar-edit-overlay" onClick={handleAvatarClick}>
                                        <span>Modifier</span>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="profile-header-info">
                                {editMode ? (
                                    <input
                                        type="text"
                                        className="pseudo-input"
                                        value={userData.pseudo}
                                        onChange={(e) => setUserData({...userData, pseudo: e.target.value})}
                                    />
                                ) : (
                                    <h1>{userData.pseudo}</h1>
                                )}
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
                <div className="custom-button-container">
                    <button
                        className="custom-button"
                        onClick={() => console.log('Bouton personnalisé cliqué')}
                    >
                        Personnalisation
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;