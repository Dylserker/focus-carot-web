import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <img src="/logo192.png" alt="Logo" />
                </div>
                <div className="nav-section">
                    <nav className="nav-top">
                        <ul>
                            <li><Link to="/tasks">Tâches</Link></li>
                            <li><Link to="/success">Succès</Link></li>
                            <li><Link to="/admin">Admin</Link></li>
                        </ul>
                    </nav>
                    <nav className="nav-bottom">
                        <ul>
                            <li><Link to="/settings">Paramètre</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/logout">Déconnexion</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="profile-avatar">
                    <Link to="/profile">
                        <img src="/profile-placeholder.png" alt="Photo de profil" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;