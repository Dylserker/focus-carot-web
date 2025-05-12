import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoImage from '../../assets/logo/Logo_sans_titre.png';
import ProgressBar from '../ProgressBar';
import { useAuth } from '../../contexts/AuthContext';
import ExperienceService from '../../services/ExperienceService';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, logout, gainExperience } = useAuth();
    const [userProgression, setUserProgression] = useState({
        level: currentUser?.level || 1,
        progress: currentUser?.progress || 0
    });
    const updateUserProgress = (progression) => {
        setUserProgression({
            level: progression.level,
            progress: progression.progress
        });
    };

    useEffect(() => {
        const fetchUserProgression = async () => {
            if (currentUser?.id) {
                try {
                    const response = await fetch(`http://localhost:8000/api/users/${currentUser.id}/experience`);
                    const data = await response.json();
                    if (data.success) {
                        updateUserProgress(data.progression);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération de la progression:', error);
                }
            }
        };

        fetchUserProgression();
    }, [currentUser?.id, gainExperience]);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userInfo = {
        pseudo: currentUser?.username || "Invité",
        level: currentUser?.level || 1,
        title: currentUser?.title || "Débutant",
        progress: currentUser?.progress || 0
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <img src={logoImage} alt="Logo" className="header-logo" />
                    </Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li>
                            <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                            <Link to="/tasks">Tâche</Link>
                        </li>
                        <li>
                            <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                            <Link to="/success">Succès</Link>
                        </li>
                        <li>
                            <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                            <Link to="/settings">Paramètre</Link>
                        </li>
                        <li>
                            <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                            <Link to="/admin">Admin</Link>
                        </li>
                        <li>
                            <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                            <Link onClick={handleLogout} to="#">Fermer</Link>
                        </li>
                    </ul>
                </nav>
                <div className="user-profile">
                    <div className="profile-info">
                        <div className="profile-pseudo">{userInfo.pseudo}</div>
                        <div className="profile-level">Niveau {userInfo.level}</div>
                        <div className="profile-title">{userInfo.title}</div>
                        <ProgressBar progress={userInfo.progress} />
                    </div>
                    <div className="profile-photo-container">
                        <div className="profile-photo" onClick={handleProfileClick}></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;