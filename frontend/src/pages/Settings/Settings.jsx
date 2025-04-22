import React, { useState } from 'react';
import Header from '../../component/Header/Header';
import './Settings.css';

const Settings = () => {
    const [generalSettings, setGeneralSettings] = useState({
        language: 'fr',
        theme: 'light',
        notifications: true,
        newsletter: false
    });

    const [privacySettings, setPrivacySettings] = useState({
        dataSharing: false,
        cookieConsent: true,
        analytics: true
    });

    const [accountSettings, setAccountSettings] = useState({
        emailNotifications: true,
        twoFactorAuth: false,
        autoLogout: 30
    });

    const [displaySettings, setDisplaySettings] = useState({
        fontSize: 'medium',
        contrastMode: false,
        reducedMotion: false
    });

    const handleGeneralChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGeneralSettings({
            ...generalSettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePrivacyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPrivacySettings({
            ...privacySettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAccountChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAccountSettings({
            ...accountSettings,
            [name]: type === 'checkbox' ? checked : value === '' ? 30 : parseInt(value)
        });
    };

    const handleDisplayChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDisplaySettings({
            ...displaySettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Paramètres enregistrés:', {
            generalSettings,
            privacySettings,
            accountSettings,
            displaySettings
        });
        alert('Paramètres sauvegardés avec succès!');
    };

    return (
        <div className="settings-page">
            <Header />
            <div className="settings-container">
                <h1>Paramètres</h1>

                <form onSubmit={handleSubmit}>
                    <section className="settings-section">
                        <h2>Paramètres généraux</h2>

                        <div className="settings-group">
                            <label htmlFor="language">Langue</label>
                            <select
                                name="language"
                                id="language"
                                value={generalSettings.language}
                                onChange={handleGeneralChange}
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>

                        <div className="settings-group">
                            <label htmlFor="theme">Thème</label>
                            <select
                                name="theme"
                                id="theme"
                                value={generalSettings.theme}
                                onChange={handleGeneralChange}
                            >
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                                <option value="system">Système</option>
                            </select>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="notifications"
                                id="notifications"
                                checked={generalSettings.notifications}
                                onChange={handleGeneralChange}
                            />
                            <label htmlFor="notifications">Activer les notifications</label>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="newsletter"
                                id="newsletter"
                                checked={generalSettings.newsletter}
                                onChange={handleGeneralChange}
                            />
                            <label htmlFor="newsletter">S'abonner à la newsletter</label>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h2>Confidentialité</h2>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="dataSharing"
                                id="dataSharing"
                                checked={privacySettings.dataSharing}
                                onChange={handlePrivacyChange}
                            />
                            <label htmlFor="dataSharing">Partage des données avec des partenaires</label>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="cookieConsent"
                                id="cookieConsent"
                                checked={privacySettings.cookieConsent}
                                onChange={handlePrivacyChange}
                            />
                            <label htmlFor="cookieConsent">Accepter les cookies</label>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="analytics"
                                id="analytics"
                                checked={privacySettings.analytics}
                                onChange={handlePrivacyChange}
                            />
                            <label htmlFor="analytics">Autoriser les analyses d'utilisation</label>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h2>Compte et sécurité</h2>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                id="emailNotifications"
                                checked={accountSettings.emailNotifications}
                                onChange={handleAccountChange}
                            />
                            <label htmlFor="emailNotifications">Notifications par email</label>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="twoFactorAuth"
                                id="twoFactorAuth"
                                checked={accountSettings.twoFactorAuth}
                                onChange={handleAccountChange}
                            />
                            <label htmlFor="twoFactorAuth">Authentification à deux facteurs</label>
                        </div>

                        <div className="settings-group">
                            <label htmlFor="autoLogout">Déconnexion automatique après (minutes)</label>
                            <input
                                type="number"
                                name="autoLogout"
                                id="autoLogout"
                                value={accountSettings.autoLogout}
                                onChange={handleAccountChange}
                                min="5"
                                max="120"
                            />
                        </div>
                    </section>

                    <section className="settings-section">
                        <h2>Affichage</h2>

                        <div className="settings-group">
                            <label htmlFor="fontSize">Taille de police</label>
                            <select
                                name="fontSize"
                                id="fontSize"
                                value={displaySettings.fontSize}
                                onChange={handleDisplayChange}
                            >
                                <option value="small">Petite</option>
                                <option value="medium">Moyenne</option>
                                <option value="large">Grande</option>
                                <option value="xlarge">Très grande</option>
                            </select>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="contrastMode"
                                id="contrastMode"
                                checked={displaySettings.contrastMode}
                                onChange={handleDisplayChange}
                            />
                            <label htmlFor="contrastMode">Mode contraste élevé</label>
                        </div>

                        <div className="settings-group checkbox">
                            <input
                                type="checkbox"
                                name="reducedMotion"
                                id="reducedMotion"
                                checked={displaySettings.reducedMotion}
                                onChange={handleDisplayChange}
                            />
                            <label htmlFor="reducedMotion">Réduire les animations</label>
                        </div>
                    </section>

                    <div className="settings-actions">
                        <button type="submit" className="save-button">Sauvegarder les paramètres</button>
                        <button type="button" className="reset-button">Réinitialiser</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;