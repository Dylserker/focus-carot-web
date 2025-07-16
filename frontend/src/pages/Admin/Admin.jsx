import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import Button from '../../component/Button';
import Modal from '../../component/Modal';
import './Admin.css';

const Admin = () => {
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
        pseudo: '',
        prenom: '',
        nom: '',
        titre: '',
        email: '',
        password: '',
        role: 'user'
    });
    // Ajout d'un état local pour les niveaux en édition
    const [editedLevels, setEditedLevels] = useState({});
    // Ajout d'un état pour l'avertissement de cohérence niveau/XP
    const [levelWarning, setLevelWarning] = useState("");

    const token = localStorage.getItem('token');
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erreur réseau');

            const data = await response.json();
            const usersArray = data.users || [];
            const formattedUsers = usersArray.map(user => ({
                id: user._id,
                email: user.email,
                pseudo: user.username,
                prenom: user.firstName,
                nom: user.lastName,
                titre: user.titre || '',
                role: user.role
            }));

            setUsers(formattedUsers);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction utilitaire pour calculer le pourcentage d'XP dans le niveau courant
    const computeProgressPercent = (xp, level) => {
        const xpMin = 100 * Math.pow(level - 1, 2);
        const xpMax = 100 * Math.pow(level, 2);
        return ((xp - xpMin) / (xpMax - xpMin)) * 100;
    };

    const fetchUserProgress = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/progression`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                const progression = data.progression;
                const progress = computeProgressPercent(progression.experiencePoints, progression.level);
                setUserProgress({ ...progression, progress: isNaN(progress) ? 0 : progress });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la progression:', error);
        }
    };

    const fetchUserAchievements = async (userId) => {
        try {
            const [achievementsResponse, userAchievementsResponse] = await Promise.all([
                fetch('http://localhost:5000/api/achievements', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`http://localhost:5000/api/users/${userId}/achievements`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const achievementsData = await achievementsResponse.json();
            const userAchievementsData = await userAchievementsResponse.json();

            if (achievementsData.success) {
                setAllAchievements(achievementsData.achievements);
            }
            if (userAchievementsData.success) {
                setUserAchievements(userAchievementsData.achievements);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des succès:', error);
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
            id: user.id || '',
            pseudo: user.pseudo || '',
            prenom: user.prenom || '',
            nom: user.nom || '',
            titre: user.titre || '',
            email: user.email || '',
            password: '',
            role: user.role || 'user'
        });
        fetchUserProgress(user.id);
        fetchUserAchievements(user.id);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setFormData({
            id: '',
            pseudo: '',
            prenom: '',
            nom: '',
            titre: '',
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
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la suppression');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));

            const remainingUsers = users.length - 1;
            const newTotalPages = Math.ceil(remainingUsers / usersPerPage);
            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
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
                username: formData.pseudo,
                firstName: formData.prenom,
                lastName: formData.nom,
                role: formData.role,
                achievements: userAchievements
            };

            if (formData.password) {
                userData.password = formData.password;
            }

            let response;

            if (isCreate) {
                response = await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });
            } else {
                response = await fetch(`http://localhost:5000/api/users/${formData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });

                if (userProgress) {
                    if (
                        userProgress.level &&
                        userProgress.progress !== undefined &&
                        !isNaN(userProgress.level) &&
                        !isNaN(userProgress.progress)
                    ) {
                        // Calcul de l'XP cible à partir du niveau et du pourcentage
                        const xpMin = 100 * Math.pow(userProgress.level - 1, 2);
                        const xpMax = 100 * Math.pow(userProgress.level, 2);
                        let experiencePoints = xpMin + (xpMax - xpMin) * (userProgress.progress / 100);
                        // On force l'XP à être strictement inférieure à xpMax
                        if (experiencePoints >= xpMax) {
                            experiencePoints = xpMax - 1;
                        }
                        experiencePoints = Math.floor(experiencePoints);
                        const resp = await fetch(`http://localhost:5000/api/users/${formData.id}/progression`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                level: userProgress.level,
                                experiencePoints
                            })
                        });
                        if (!resp.ok) {
                            const errorData = await resp.json();
                            throw new Error(errorData.message || 'Erreur lors de la sauvegarde de la progression');
                        }
                        await fetchUserProgress(formData.id);
                    }
                }
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'opération');
            }

            const result = await response.json();
            if (result.success) {
                await fetchUsers();
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
                setFormData({
                    id: '',
                    pseudo: '',
                    prenom: '',
                    nom: '',
                    titre: '',
                    email: '',
                    password: '',
                    role: 'user'
                });
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        }
    };

    const toggleAchievement = async (achievementId, isUnlocked) => {
        try {
            const endpoint = isUnlocked ? 'unlock' : 'lock';
            const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}/achievements/${achievementId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erreur lors de la modification du succès');

            const updatedAchievements = isUnlocked
                ? [...userAchievements, achievementId]
                : userAchievements.filter(id => id !== achievementId);

            setUserAchievements(updatedAchievements);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Nouvelle fonction pour bloquer/débloquer un succès
    const toggleBlockAchievement = async (achievementId, blocked) => {
        try {
            const response = await fetch(`http://localhost:5000/api/achievements/${achievementId}/block`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ blocked: !blocked })
            });
            if (!response.ok) throw new Error('Erreur lors du blocage/déblocage du succès');
            setAllAchievements(prev => prev.map(a => a._id === achievementId ? { ...a, blocked: !blocked } : a));
            // Déclenche un événement custom pour synchroniser la page succès
            window.dispatchEvent(new Event('achievement-updated'));
        } catch (error) {
            console.error('Erreur lors du blocage/déblocage du succès:', error);
        }
    };

    // Fonction pour sauvegarder le niveau d'un succès
    const saveAchievementLevel = async (achievementId, newLevel) => {
        try {
            const response = await fetch(`http://localhost:5000/api/achievements/${achievementId}/level`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ level: newLevel })
            });
            if (!response.ok) throw new Error('Erreur lors de la modification du niveau');
            // Met à jour l'état local pour refléter le changement
            setAllAchievements(prev => prev.map(a => a._id === achievementId ? { ...a, level: newLevel } : a));
            // Remet l'XP à zéro (ou au début du niveau) si tu veux gérer ça côté frontend ici
            // (Sinon, à faire côté backend si l'XP dépend du niveau)
            setEditedLevels(prev => ({ ...prev, [achievementId]: undefined }));
        } catch (error) {
            console.error('Erreur lors de la modification du niveau:', error);
        }
    };

    const calculateExperiencePoints = (level, progressPercent) => {
        const xpForNextLevel = 10 * Math.pow(2, level - 1);
        return Math.floor((progressPercent / 100) * xpForNextLevel);
    };

    // Vérifie la cohérence niveau/XP à chaque changement de niveau ou pourcentage
    useEffect(() => {
        if (userProgress && userProgress.level && userProgress.progress !== undefined) {
            const xpMin = 100 * Math.pow(userProgress.level - 1, 2);
            const xpMax = 100 * Math.pow(userProgress.level, 2);
            const experiencePoints = Math.round(xpMin + (xpMax - xpMin) * (userProgress.progress / 100));
            // Calcul du niveau réel à partir de l'XP cible
            const realLevel = Math.floor(1 + Math.sqrt(experiencePoints / 100));
            if (realLevel !== userProgress.level) {
                setLevelWarning(`Attention : avec ce pourcentage, le niveau réel sera ${realLevel} après sauvegarde.`);
            } else {
                setLevelWarning("");
            }
        } else {
            setLevelWarning("");
        }
    }, [userProgress && userProgress.level, userProgress && userProgress.progress]);

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

                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        <div className="user-list">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Pseudo</th>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Titre</th>
                                    <th>Rôle</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.pseudo}</td>
                                        <td>{user.nom}</td>
                                        <td>{user.prenom}</td>
                                        <td>{user.titre}</td>
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
                                    value={formData.pseudo}
                                    onChange={(e) => setFormData({...formData, pseudo: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Prénom</label>
                                <input
                                    type="text"
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
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
                                                onChange={e => setUserProgress({
                                                    ...userProgress,
                                                    level: parseInt(e.target.value),
                                                })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Progression (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={userProgress.progress !== undefined && userProgress.progress !== null ? Number(userProgress.progress).toFixed(2) : ''}
                                                onChange={e => setUserProgress({
                                                    ...userProgress,
                                                    progress: parseFloat(e.target.value)
                                                })}
                                            />
                                        </div>
                                    </div>
                                    {levelWarning && (
                                        <div style={{ color: 'orange', marginTop: 8, fontWeight: 'bold' }}>{levelWarning}</div>
                                    )}
                                </div>
                            )}
                            {isEditModalOpen && allAchievements.length > 0 && (
                                <div className="form-group">
                                    <label>Succès</label>
                                    <div className="achievements-list">
                                        {allAchievements.map((achievement, idx) => (
                                            <div key={achievement._id || idx} className="achievement-item">
                                                <span>{achievement.name}</span>
                                                <Button
                                                    variant={achievement.blocked ? 'danger' : 'secondary'}
                                                    size="small"
                                                    style={{ marginLeft: 8, padding: '2px 8px', fontSize: '0.75rem', minWidth: 0 }}
                                                    onClick={() => toggleBlockAchievement(achievement._id, achievement.blocked)}
                                                >
                                                    {achievement.blocked ? 'Débloquer' : 'Bloquer'}
                                                </Button>
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