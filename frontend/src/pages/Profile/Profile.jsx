import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './Profile.css';

const Profile = () => {
    const { currentUser, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        password: '',
        title: '',
        profilePicture: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!currentUser || !currentUser._id) {
                    throw new Error('Utilisateur non connecté');
                }

                const response = await apiService.getUserProfile(currentUser._id);

                if (response.success) {
                    const user = response.user;
                    setProfileData({
                        username: user.username || '',
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        birthDate: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
                        email: user.email || '',
                        password: '',
                        title: `Niveau ${user.progression?.level || 1}`,
                        profilePicture: user.avatarUrl || null
                    });
                }
            } catch (err) {
                setError(err.message);
                console.error('Erreur:', err);
            }
        };

        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result;
                    const userData = JSON.parse(localStorage.getItem('user'));

                    const response = await fetch(`http://localhost:8000/api/users/${userData.id}/profile-picture`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ image: base64Image })
                    });

                    if (!response.ok) {
                        throw new Error('Erreur lors de l\'upload de l\'image');
                    }

                    const result = await response.json();
                    if (result.success) {
                        setProfileData(prev => ({
                            ...prev,
                            profilePicture: base64Image
                        }));
                    }
                };
                reader.readAsDataURL(file);
            } catch (err) {
                setError(err.message);
                console.error('Erreur:', err);
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            if (!currentUser || !currentUser._id) {
                throw new Error('Utilisateur non connecté');
            }

            const updatedProfile = {
                email: profileData.email,
                username: profileData.username,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                profile: {
                    dateOfBirth: profileData.birthDate ? new Date(profileData.birthDate) : null
                }
            };

            if (profileData.password) {
                updatedProfile.password = profileData.password;
            }

            const response = await apiService.updateUserProfile(currentUser._id, updatedProfile);

            if (response.success) {
                // Mettre à jour le contexte utilisateur
                updateUser({
                    email: profileData.email,
                    username: profileData.username,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    profile: {
                        dateOfBirth: profileData.birthDate ? new Date(profileData.birthDate) : null
                    }
                });

                setIsEditing(false);
                setError(null);
            } else {
                throw new Error(response.message || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            setError(err.message);
            console.error('Erreur:', err);
        }
    };

    return (
        <div className="profile">
            <Header />

            <div className="profile-container">
                <h1>Mon Profil</h1>

                <div className="profile-picture-section">
                    <div className="profile-picture">
                        {profileData.profilePicture ? (
                            <img
                                src={`http://localhost:8000/api/users/${JSON.parse(localStorage.getItem('user')).id}/avatar`}
                                alt="Profil"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'chemin/vers/image/par/defaut.png';
                                }}
                            />
                        ) : (
                            <div className="placeholder-image">Photo</div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="upload-button">
                            <label htmlFor="profile-picture-upload" className="btn">
                                Modifier la photo
                            </label>
                            <input
                                type="file"
                                id="profile-picture-upload"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label htmlFor="username">Pseudo</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthDate">Date de naissance</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={profileData.birthDate}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={profileData.password}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Titre</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={profileData.title}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="action-buttons">
                    {isEditing ? (
                        <button className="save-btn" onClick={handleSaveChanges}>
                            Enregistrer les modifications
                        </button>
                    ) : (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            Modifier les informations
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;