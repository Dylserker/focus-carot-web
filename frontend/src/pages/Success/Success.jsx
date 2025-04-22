import React from 'react';
import Header from '../../component/Header/Header';
import './Success.css';

const achievements = [
    { id: 1, title: "Premier Pas", description: "Compléter le tutoriel d'introduction", level: "Débutant" },
    { id: 2, title: "Explorateur", description: "Visiter toutes les sections de l'application", level: "Intermédiaire" },
    { id: 3, title: "Expert", description: "Utiliser toutes les fonctionnalités disponibles", level: "Avancé" },
    { id: 4, title: "Champion", description: "Atteindre 1000 points", level: "Expert" },
    { id: 5, title: "Maître", description: "Compléter tous les défis hebdomadaires", level: "Légende" }
];

const Success = () => {
    return (
        <div className="success-container">
            <Header />

            <div className="success-content">
                <h1>Mes Succès</h1>

                <div className="achievements-table-container">
                    <table className="achievements-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Niveau</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {achievements.map((achievement) => (
                            <tr key={achievement.id}>
                                <td>
                                    <div className="achievement-image-placeholder"></div>
                                </td>
                                <td>{achievement.title}</td>
                                <td>{achievement.description}</td>
                                <td>{achievement.level}</td>
                                <td>
                                    <button className="view-details-button">
                                        Voir détail
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Success;