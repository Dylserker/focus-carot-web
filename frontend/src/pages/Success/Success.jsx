import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import Modal from '../../component/Modal';
import { getAllAchievements } from '../../services/achievementService';
import './Success.css';

const Success = () => {
    const [achievements, setAchievements] = useState([]);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await getAllAchievements();
            if (response.success) {
                setAchievements(response.achievements);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des succès:', error);
        }
    };

    const openModal = (achievement) => {
        setSelectedAchievement(achievement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAchievement(null);
    };

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
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>XP</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {achievements.map((achievement) => (
                            <tr key={achievement.id}>
                                <td>
                                    {achievement.icon_url ? (
                                        <img
                                            src={achievement.icon_url}
                                            alt={achievement.name}
                                            className="achievement-icon"
                                        />
                                    ) : (
                                        <div className="achievement-image-placeholder"></div>
                                    )}
                                </td>
                                <td>{achievement.name}</td>
                                <td>{achievement.description}</td>
                                <td>{achievement.achievement_type}</td>
                                <td>{achievement.experience_reward} XP</td>
                                <td>
                                    <button
                                        className="view-details-button"
                                        onClick={() => openModal(achievement)}
                                    >
                                        Voir détail
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedAchievement && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={selectedAchievement.name}
                >
                    <div className="achievement-modal-content">
                        {selectedAchievement.icon_url && (
                            <img
                                src={selectedAchievement.icon_url}
                                alt={selectedAchievement.name}
                                className="achievement-modal-icon"
                            />
                        )}
                        <p className="achievement-description">
                            {selectedAchievement.description}
                        </p>
                        <div className="achievement-details">
                            <p><strong>Type:</strong> {selectedAchievement.achievement_type}</p>
                            <p><strong>Récompense:</strong> {selectedAchievement.experience_reward} XP</p>
                            <p><strong>Objectif requis:</strong> {selectedAchievement.required_value}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Success;