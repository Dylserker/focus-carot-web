import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import Modal from '../../component/Modal';
import { getAchievements, getUserAchievements } from '../../services/achievementService';
import { useAuth } from '../../contexts/AuthContext';
import './Success.css';

const Success = () => {
    const [achievements, setAchievements] = useState([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [achievementsResponse, unlockedResponse] = await Promise.all([
                    getAchievements(),
                    getUserAchievements(currentUser._id)
                ]);

                if (achievementsResponse.success) {
                    setAchievements(achievementsResponse.achievements);
                }

                if (unlockedResponse.success) {
                    setUnlockedAchievements(unlockedResponse.userAchievements);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des succès:", error);
            }
        };

        fetchData();
    }, [currentUser._id]);

    const handleAchievementClick = (achievement) => {
        setSelectedAchievement(achievement);
        setIsModalOpen(true);
    };

    const isAchievementUnlocked = (achievementId) => {
        return unlockedAchievements.some(ua => ua.achievementId._id === achievementId);
    };

    const formatAchievementType = (type) => {
        const typeMap = {
            'taches_completees': 'Tâches complétées',
            'niveau_atteint': 'Niveau atteint',
            'jours_consecutifs': 'Jours consécutifs',
            'special': 'Spécial'
        };
        return typeMap[type] || type;
    };

    function getAchievementTypeLabel(type) {
        const types = {
            'taches_completees': 'Tâches complétées',
            'niveau_atteint': 'Niveau atteint',
            'jours_consecutifs': 'Jours consécutifs',
            'special': 'Spécial'
        };
        return types[type] || type;
    }

    return (
        <div className="success-container">
            <Header />
            <div className="success-content">
                <h1>Succès</h1>
                <div className="achievements-table-container">
                    <table className="achievements-table">
                        <thead>
                        <tr>
                            <th>Icône</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>XP</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {achievements.map((achievement) => (
                            <tr key={achievement._id}
                                className={isAchievementUnlocked(achievement._id) ? 'achievement-unlocked' : ''}>
                                <td>
                                    {achievement.iconUrl ? (
                                        <img src={achievement.iconUrl} alt="" className="achievement-icon" />
                                    ) : (
                                        <div className="achievement-image-placeholder" />
                                    )}
                                </td>
                                <td>{achievement.name}</td>
                                <td>{achievement.description}</td>
                                <td>{getAchievementTypeLabel(achievement.achievementType)}</td>
                                <td>{achievement.experienceReward} XP</td>
                                <td>
                                    <button
                                        className="view-details-button"
                                        onClick={() => handleAchievementClick(achievement)}
                                    >
                                        Voir détails
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedAchievement(null);
                }}
                title="Détails du succès"
            >
                {selectedAchievement && (
                    <div className="achievement-modal">
                        <div className="achievement-modal-content">
                            {selectedAchievement.iconUrl ? (
                                <img
                                    src={selectedAchievement.iconUrl}
                                    alt={selectedAchievement.name}
                                    className="achievement-modal-icon"
                                />
                            ) : (
                                <div className="achievement-image-placeholder" />
                            )}
                            <h2>{selectedAchievement.name}</h2>
                            <p className="achievement-description">{selectedAchievement.description}</p>
                            <div className="achievement-details">
                                                            <p>Type: {formatAchievementType(selectedAchievement.achievementType)}</p>
                            <p>Récompense: {selectedAchievement.experienceReward} XP</p>
                            <p>Valeur requise: {selectedAchievement.requiredValue}</p>
                            <p>Statut: {isAchievementUnlocked(selectedAchievement._id) ? 'Débloqué' : 'Non débloqué'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Success;