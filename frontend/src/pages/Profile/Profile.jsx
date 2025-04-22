import React, { useState } from 'react';
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({
                    ...profileData,
                    profilePicture: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        console.log('Données du profil sauvegardées:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="profile">
            <Header />

            <div className="profile-container">
                <h1>Mon Profil</h1>

                <div className="profile-picture-section">
                    <div className="profile-picture">
                        {profileData.profilePicture ? (
                            <img src={profileData.profilePicture} alt="Photo de profil" />
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