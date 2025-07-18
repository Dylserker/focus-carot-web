import React, { useState } from 'react';
import Header from '../../component/Header/Header';
import rabbitGif from '../../assets/img/rabbit-home.gif';
import './Home.css';

function Home() {
    const [announcements] = useState([
        {
            id: 1,
            title: "Nouvelle fonctionnalité : Système de succès",
            content: "Découvrez notre nouveau système de succès pour gamifier votre expérience !",
            date: "2024-01-15",
            type: "feature"
        },
        {
            id: 2,
            title: "Mise à jour de l'interface",
            content: "L'interface utilisateur a été améliorée pour une meilleure expérience.",
            date: "2024-01-10",
            type: "update"
        },
        {
            id: 3,
            title: "Correction de bugs",
            content: "Plusieurs bugs ont été corrigés pour améliorer la stabilité de l'application.",
            date: "2024-01-05",
            type: "fix"
        }
    ]);

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'feature':
                return '✨';
            case 'update':
                return '🔄';
            case 'fix':
                return '🐛';
            default:
                return '📢';
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'feature':
                return 'announcement-feature';
            case 'update':
                return 'announcement-update';
            case 'fix':
                return 'announcement-fix';
            default:
                return 'announcement-default';
        }
    };

    return (
        <div className="home-container">
            <Header />
            <div className="home-layout">
                <main className="home-content">
                    <h1>Bienvenue sur notre site</h1>
                    <p>Contenu de la page d'accueil</p>
                    
                    <div className="gif-container">
                        <img src={rabbitGif} alt="Scorbunny dansant" className="rabbit-gif" />
                    </div>
                </main>
                
                {/* Panneau d'annonces discret */}
                <aside className="announcements-sidebar">
                    <div className="announcements-header">
                        <h3>📢 Mises à jour</h3>
                    </div>
                    
                    <div className="announcements-list">
                        {announcements.map((announcement) => (
                            <div 
                                key={announcement.id} 
                                className={`announcement-item ${getTypeClass(announcement.type)}`}
                                onClick={() => setSelectedAnnouncement(announcement)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="announcement-icon">
                                    {getTypeIcon(announcement.type)}
                                </div>
                                <div className="announcement-content">
                                    <h4 className="announcement-title">{announcement.title}</h4>
                                    <p className="announcement-text">{announcement.content}</p>
                                    <span className="announcement-date">
                                        {new Date(announcement.date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* Modal d'annonce */}
            {selectedAnnouncement && (
                <div className="modal-announcement-overlay" onClick={() => setSelectedAnnouncement(null)}>
                    <div className="modal-announcement" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedAnnouncement(null)}>&times;</button>
                        <div className="modal-announcement-header">
                            <span className="modal-announcement-icon">{getTypeIcon(selectedAnnouncement.type)}</span>
                            <h2>{selectedAnnouncement.title}</h2>
                        </div>
                        <div className="modal-announcement-date">
                            {new Date(selectedAnnouncement.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="modal-announcement-content">
                            <p>{selectedAnnouncement.content}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;