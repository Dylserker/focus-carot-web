import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                {/* Logo à gauche */}
                <div className="logo">
                    <img src="/logo192.png" alt="Logo" />
                </div>
                <div className="nav-section">
                    <nav className="nav-top">
                        <ul>
                            <li><Link to="/tasks">Tasks</Link></li>
                            <li><Link to="/success">Success</Link></li>
                            <li><Link to="/admin">Admin</Link></li>
                        </ul>
                    </nav>
                    <nav className="nav-bottom">
                        <ul>
                            <li><Link to="/settings">Settings</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/logout">Logout</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;