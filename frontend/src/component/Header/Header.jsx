import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../assets/logo/Logo_sans_titre.png';

const Header = () => {
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
                        <li><Link to="/task">Tâche</Link></li>
                        <li><Link to="/success">Succès</Link></li>
                        <li><Link to="/setting">Paramètre</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/admin">Admin</Link></li>
                        <li><Link to="/logout">Déconnexion</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;