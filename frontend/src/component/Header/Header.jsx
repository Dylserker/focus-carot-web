import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ title = 'Mon Application' }) => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <h1>{title}</h1>
                    </Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/apropos">À propos</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;