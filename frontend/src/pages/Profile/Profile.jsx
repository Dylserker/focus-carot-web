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
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!currentUser || !currentUser._id) {
                    throw new Error('Utilisateur non connecté');
                }

                const response = await apiService.getUserProfile(currentUser._id);

                if (response.success) {
                    const user = response.profile;
                    setProfileData({
                        username: currentUser.username || '',
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        birthDate: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
                        email: currentUser.email || '',
                        password: '',
                        title: '',
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
        // Effacer les messages d'erreur/succès quand l'utilisateur modifie quelque chose
        setError(null);
        setSuccess(null);
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Le fichier est trop volumineux. Taille maximum : 5MB');
                return;
            }

            // Vérifier le type de fichier
            if (!file.type.startsWith('image/')) {
                setError('Veuillez sélectionner un fichier image valide');
                return;
            }

            setIsUploading(true);
            setError(null);
            
            try {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result;

                    const response = await apiService.uploadAvatar(currentUser._id, base64Image);

                    if (response.success) {
                        setProfileData(prev => ({
                            ...prev,
                            profilePicture: base64Image
                        }));
                        setSuccess('Photo de profil mise à jour avec succès !');
                        
                        // Mettre à jour le contexte utilisateur
                        updateUser({
                            ...currentUser,
                            avatarUrl: base64Image
                        });
                    } else {
                        throw new Error(response.message || 'Erreur lors de l\'upload de l\'image');
                    }
                };
                reader.readAsDataURL(file);
            } catch (err) {
                setError(err.message);
                console.error('Erreur:', err);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            if (!currentUser || !currentUser._id) {
                throw new Error('Utilisateur non connecté');
            }

            const updatedProfile = {
                username: profileData.username,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
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
                    ...currentUser,
                    username: profileData.username,
                    email: profileData.email,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    profile: {
                        dateOfBirth: profileData.birthDate ? new Date(profileData.birthDate) : null
                    }
                });

                setIsEditing(false);
                setSuccess('Profil mis à jour avec succès !');
                
                // Vider le champ mot de passe
                setProfileData(prev => ({
                    ...prev,
                    password: ''
                }));
            } else {
                throw new Error(response.message || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            setError(err.message);
            console.error('Erreur:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError(null);
        setSuccess(null);
        // Recharger les données originales
        if (currentUser) {
            setProfileData(prev => ({
                ...prev,
                username: currentUser.username || '',
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                birthDate: currentUser.profile?.dateOfBirth ? new Date(currentUser.profile.dateOfBirth).toISOString().split('T')[0] : '',
                email: currentUser.email || '',
                password: '',
                title: ''
            }));
        }
    };

    return (
        <div className="profile">
            <Header />

            <div className="profile-container">
                <h1>Mon Profil</h1>

                {/* Messages d'erreur et de succès */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <div className="profile-picture-section">
                    <div className="profile-picture">
                        {profileData.profilePicture ? (
                            <img
                                src={profileData.profilePicture}
                                alt="Photo de profil"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/default-avatar.png';
                                }}
                            />
                        ) : (
                            <div className="placeholder-image">
                                <img 
                                    src="/assets/images/default-avatar.png" 
                                    alt="Photo par défaut"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{ display: 'none' }}>Photo</div>
                            </div>
                        )}
                        {isUploading && (
                            <div className="upload-overlay">
                                <div className="upload-spinner">Chargement...</div>
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="upload-button">
                            <label htmlFor="profile-picture-upload" className="btn">
                                {isUploading ? 'Chargement...' : 'Modifier la photo'}
                            </label>
                            <input
                                type="file"
                                id="profile-picture-upload"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                                disabled={isUploading}
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
                            placeholder="Votre pseudo"
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
                            placeholder="Votre prénom"
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
                            placeholder="Votre nom"
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
                            placeholder="votre.email@exemple.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Nouveau mot de passe (optionnel)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={profileData.password}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Laissez vide pour ne pas changer"
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
                            disabled={true}
                            className="disabled-field"
                        />
                    </div>
                </div>

                <div className="action-buttons">
                    {isEditing ? (
                        <>
                            <button 
                                className="save-btn" 
                                onClick={handleSaveChanges}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                            <button 
                                className="cancel-btn" 
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                            >
                                Annuler
                            </button>
                        </>
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