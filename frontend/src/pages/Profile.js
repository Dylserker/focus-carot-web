import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './Profile.css';

function Profile() {
    const [editMode, setEditMode] = useState(false);
    const fileInputRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [userData, setUserData] = useState({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: '••••••••',
        title: 'Développeur Web',
        pseudo: 'Pseudo123',
        avatar: '/profile-placeholder.png',
    });

    const [selectedAvatar, setSelectedAvatar] = useState(userData.avatar);
    const [selectedBadge, setSelectedBadge] = useState('Aventurier');
    const [selectedProgressColor, setSelectedProgressColor] = useState('#4CAF50');

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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                    <button className="custom-button" onClick={openModal}>
                        Personnalisation
                    </button>
                </div>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="customization-modal">
                        <h2>Personnalisation</h2>

                        <div className="customization-section">
                            <h3>Chibi</h3>
                            <div className="button-group">
                                <button
                                    className="customization-button"
                                    onClick={() => setSelectedAvatar('/avatar1.png')}
                                >
                                    Chibi 1
                                </button>
                                <button
                                    className="customization-button"
                                    onClick={() => setSelectedAvatar('/avatar2.png')}
                                >
                                    Chibi 2
                                </button>
                                <button
                                    className="customization-button"
                                    onClick={() => setSelectedAvatar('/avatar3.png')}
                                >
                                    Chibi 3
                                </button>
                            </div>
                        </div>

                        <div className="customization-section">
                            <h3>Badge</h3>
                            <div className="button-group">
                                <button
                                    className="customization-button"
                                    onClick={() => setSelectedBadge('Aventurier')}
                                >
                                    Aventurier
                                </button>
                                <button
                                    className="customization-button"
                                    onClick={() => setSelectedBadge('Expert')}
                                >
                                    Expert
                                </button>
                                <button
                                    className="customization-button"
                                    onClick={() => setSelectedBadge('Maître')}
                                >
                                    Maître
                                </button>
                            </div>
                        </div>

                        <div className="customization-section">
                            <h3>Couleur de progression</h3>
                            <div className="button-group">
                                <button
                                    className="customization-button color-button"
                                    style={{ backgroundColor: '#4CAF50' }}
                                    onClick={() => setSelectedProgressColor('#4CAF50')}
                                >
                                    Vert
                                </button>
                                <button
                                    className="customization-button color-button"
                                    style={{ backgroundColor: '#2196F3' }}
                                    onClick={() => setSelectedProgressColor('#2196F3')}
                                >
                                    Bleu
                                </button>
                                <button
                                    className="customization-button color-button"
                                    style={{ backgroundColor: '#F44336' }}
                                    onClick={() => setSelectedProgressColor('#F44336')}
                                >
                                    Rouge
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="save-button"
                                onClick={() => {
                                    setUserData({
                                        ...userData,
                                        avatar: selectedAvatar
                                    });
                                    closeModal();
                                }}
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </Modal>

            </div>
        </div>
    );
}

export default Profile;