import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../assets/logo/Logo_sans_titre.png';

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={Logo} alt="Logo du site" />
            </div>
            <nav className="navigation">
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/about">À propos</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;