import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import './Profile.css';

const Profile = () => {
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
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.id) {
                    throw new Error('Utilisateur non connecté');
                }

                const response = await fetch(`http://localhost:8000/api/users/${userData.id}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }

                const data = await response.json();
                const profile = data.profile;

                setProfileData({
                    username: profile.username || '',
                    firstName: profile.first_name || '',
                    lastName: profile.last_name || '',
                    birthDate: profile.date_of_birth || '',
                    email: profile.email || '',
                    password: '',
                    title: userData.title || 'Novice',
                    profilePicture: profile.avatar_url || null
                });
            } catch (err) {
                setError(err.message);
                console.error('Erreur:', err);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    profilePicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));

            const updatedProfile = {
                email: profileData.email,
                pseudo: profileData.username,
                prenom: profileData.firstName,
                nom: profileData.lastName,
                date_of_birth: profileData.birthDate || null,
                role: userData.role
            };

            if (profileData.password) {
                updatedProfile.password = profileData.password;
            }

            const response = await fetch(`http://localhost:8000/api/users/${userData.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedProfile)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du profil');
            }

            const result = await response.json();

            if (result.success) {
                const updatedUserData = {
                    ...userData,
                    email: profileData.email,
                    username: profileData.username,
                    first_name: profileData.firstName,
                    last_name: profileData.lastName
                };
                localStorage.setItem('user', JSON.stringify(updatedUserData));

                setIsEditing(false);
                setError(null);
            } else {
                throw new Error(result.error || 'Erreur lors de la mise à jour');
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
                            <img src={profileData.profilePicture} alt="Profil" />
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

                    <button className="customize-btn">
                        Personnalisation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;