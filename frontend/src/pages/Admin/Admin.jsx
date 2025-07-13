import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import Button from '../../component/Button';
import Modal from '../../component/Modal';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './Admin.css';

const Admin = () => {
    const { currentUser: authUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userProgress, setUserProgress] = useState(null);
    const [userAchievements, setUserAchievements] = useState([]);
    const [allAchievements, setAllAchievements] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
    });

    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
        fetchAchievements();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiService.getUsers();
            if (response.success) {
                const formattedUsers = response.users.map(user => ({
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    level: user.progression?.level || 1,
                    role: user.role
                }));

                setUsers(formattedUsers);
            }
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAchievements = async () => {
        try {
            const response = await apiService.getAchievements();
            if (response.success) {
                setAllAchievements(response.achievements);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des succès:', error);
        }
    };

    const fetchUserProgress = async (userId) => {
        try {
            const response = await apiService.getUserProgression(userId);
            if (response.success) {
                setUserProgress(response.progression);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la progression:', error);
        }
    };

    const fetchUserAchievements = async (userId) => {
        try {
            const response = await apiService.getUserAchievements(userId);
            if (response.success) {
                setUserAchievements(response.userAchievements);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des succès utilisateur:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: '',
            role: user.role
        });
        fetchUserProgress(user.id);
        fetchUserAchievements(user.id);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setFormData({
            id: '',
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'user'
        });
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        try {
            const response = await apiService.deleteUser(id);

            if (response.success) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));

                const remainingUsers = users.length - 1;
                const newTotalPages = Math.ceil(remainingUsers / usersPerPage);
                if (currentPage > newTotalPages) {
                    setCurrentPage(newTotalPages);
                }
            } else {
                throw new Error(response.message || 'Erreur lors de la suppression');
            }

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError('Erreur lors de la suppression de l\'utilisateur');
        }
    };

    const handleSubmit = async (e, isCreate = false) => {
        e.preventDefault();
        try {
            const userData = {
                email: formData.email,
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role
            };

            if (formData.password) {
                userData.password = formData.password;
            }

            let response;

            if (isCreate) {
                // Créer un nouvel utilisateur
                response = await apiService.createUser(userData);
            } else {
                // Mettre à jour un utilisateur existant
                response = await apiService.updateUser(formData.id, userData);

                // Mettre à jour la progression si nécessaire
                if (userProgress) {
                    await apiService.updateUserProgression(formData.id, {
                        experiencePoints: userProgress.experiencePoints || 0
                    });
                }
            }

            if (response.success) {
                await fetchUsers();
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
                setFormData({
                    id: '',
                    username: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'user'
                });
                setError(null);
            } else {
                throw new Error(response.message || 'Erreur lors de l\'opération');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        }
    };

    const toggleAchievement = async (achievementId, isUnlocked) => {
        try {
            if (!currentUser) return;

            if (isUnlocked) {
                // Débloquer l'achievement
                await apiService.unlockAchievement(currentUser.id, achievementId);
            } else {
                // Bloquer l'achievement (non implémenté dans l'API actuelle)
                console.log('Bloquage d\'achievement non implémenté');
                return;
            }

            // Rafraîchir les achievements de l'utilisateur
            await fetchUserAchievements(currentUser.id);
        } catch (error) {
            console.error('Erreur lors de la modification du succès:', error);
        }
    };

    const isAchievementUnlocked = (achievementId) => {
        return userAchievements.some(ua => 
            ua.achievementId && 
            (ua.achievementId._id === achievementId || ua.achievementId === achievementId) && 
            ua.isUnlocked
        );
    };

    return (
        <div className="admin-page">
            <Header />
            <div className="admin-container">
                <h1>Administration des Utilisateurs</h1>

                <div className="admin-tools">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleCreate}
                    >
                        Créer un utilisateur
                    </Button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <>
                        <div className="user-list">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Pseudo</th>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Niveau</th>
                                    <th>Rôle</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.level}</td>
                                        <td>{user.role}</td>
                                        <td className="actions-cell">
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="small"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                variant="secondary"
                                size="small"
                            >
                                Précédent
                            </Button>
                            <span>Page {currentPage} sur {totalPages}</span>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                variant="secondary"
                                size="small"
                            >
                                Suivant
                            </Button>
                        </div>
                    </>
                )}

                {(isEditModalOpen || isCreateModalOpen) && (
                    <Modal
                        isOpen={isEditModalOpen || isCreateModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setIsCreateModalOpen(false);
                        }}
                        title={isCreateModalOpen ? "Créer un utilisateur" : "Modifier l'utilisateur"}
                        maxWidth="600px"
                    >
                        <form onSubmit={(e) => handleSubmit(e, isCreateModalOpen)}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                            {isCreateModalOpen && (
                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required={isCreateModalOpen}
                                        minLength="6"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Pseudo</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Prénom</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Rôle</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    required
                                >
                                    <option value="user">Utilisateur</option>
                                    <option value="admin">Administrateur</option>
                                    <option value="parent">Parent</option>
                                    <option value="enfant">Enfant</option>
                                </select>
                            </div>
                            {isEditModalOpen && userProgress && (
                                <div className="detail-group">
                                    <label>Progression</label>
                                    <div className="progress-fields">
                                        <div className="form-group">
                                            <label>Niveau</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={userProgress.level}
                                                onChange={(e) => setUserProgress({
                                                    ...userProgress,
                                                    level: parseInt(e.target.value)
                                                })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Expérience</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={userProgress.experiencePoints || 0}
                                                onChange={(e) => setUserProgress({
                                                    ...userProgress,
                                                    experiencePoints: parseInt(e.target.value)
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isEditModalOpen && allAchievements.length > 0 && (
                                <div className="detail-group">
                                    <label>Succès</label>
                                    <div className="achievements-list">
                                        {allAchievements.map(achievement => (
                                            <div key={achievement._id} className="achievement-item">
                                                <span>{achievement.icon} {achievement.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleAchievement(
                                                            achievement._id,
                                                            !isAchievementUnlocked(achievement._id)
                                                        );
                                                    }}
                                                    className={`achievement-toggle ${
                                                        isAchievementUnlocked(achievement._id) ? 'unlocked' : 'locked'
                                                    }`}
                                                >
                                                    {isAchievementUnlocked(achievement._id) ? 'Débloqué' : 'Bloqué'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="form-actions">
                                <Button type="submit" variant="primary">
                                    {isCreateModalOpen ? "Créer" : "Modifier"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setIsCreateModalOpen(false);
                                    }}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default Admin;