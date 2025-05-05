import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoImage from '../../assets/logo/Logo_sans_titre.png';
import ProgressBar from '../ProgressBar';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const user = {
        pseudo: "Utilisateur",
        level: 5,
        title: "Débutant",
        progress: 65
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
                        <div className="profile-pseudo">{user.pseudo}</div>
                        <div className="profile-level">Niveau {user.level}</div>
                        <div className="profile-title">{user.title}</div>
                        <ProgressBar progress={user.progress} />
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