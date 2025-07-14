import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoImage from '../../assets/logo/Logo_sans_titre.png';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    // Utiliser la progression du contexte
    const progression = currentUser?.progression || { level: 1, experiencePoints: 0 };
    // Calcul du pourcentage d'XP du niveau courant
    const level = progression.level || 1;
    const exp = progression.experiencePoints || 0;
    const expForCurrentLevel = 100 * Math.pow(level - 1, 2);
    const expForNextLevel = 100 * Math.pow(level, 2);
    const progressPercent = expForNextLevel > expForCurrentLevel
        ? ((exp - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel)) * 100
        : 0;
    const userInfo = {
        pseudo: currentUser?.username || "Invité",
        level: level,
        title: currentUser?.title || "Débutant",
        progress: Math.max(0, Math.min(100, progressPercent))
    };

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserData(user);
        }
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                            <Link to="/contact">Contact</Link>
                        </li>
                        {currentUser?.role === 'admin' && (
                            <li>
                                <img src={require('../../assets/img/Carot.png')} alt="background" className="nav-bg" />
                                <Link to="/admin">Admin</Link>
                            </li>
                        )}
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
                        {userData && userData.id ? (
                            <img
                                className="profile-photo"
                                src={`http://localhost:5000/api/users/${userData.id}/avatar`}
                                alt="Avatar"
                                onClick={handleProfileClick}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/default-avatar.png';
                                }}
                            />
                        ) : (
                            <img
                                className="profile-photo"
                                src={'/assets/images/default-avatar.png'}
                                alt="Avatar"
                                onClick={handleProfileClick}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;