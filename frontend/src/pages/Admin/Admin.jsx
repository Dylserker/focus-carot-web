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

    const token = localStorage.getItem('token');
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erreur réseau');

            const data = await response.json();
            const usersArray = data.users || [];
            const formattedUsers = usersArray.map(user => ({
                id: user.id,
                email: user.email,
                pseudo: user.username,
                prenom: user.first_name,
                nom: user.last_name,
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

    const fetchUserProgress = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${userId}/experience`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUserProgress(data.progression);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la progression:', error);
        }
    };

    const fetchUserAchievements = async (userId) => {
        try {
            const [achievementsResponse, userAchievementsResponse] = await Promise.all([
                fetch('http://localhost:8000/api/achievements', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`http://localhost:8000/api/users/${userId}/achievements`, {
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
            const response = await fetch(`http://localhost:8000/api/users/${id}`, {
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
                nom: formData.nom,
                prenom: formData.prenom,
                pseudo: formData.pseudo,
                role: formData.role
            };

            if (formData.password) {
                userData.password = formData.password;
            }

            let response;

            if (isCreate) {
                // Logique existante pour la création
                response = await fetch('http://localhost:8000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });
            } else {
                // Nouvelle logique pour la mise à jour
                response = await fetch(`http://localhost:8000/api/users/${formData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'opération');
            }

            const result = await response.json();
            if (result.success) {
                await fetchUsers(); // Rafraîchir la liste des utilisateurs
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
                                    <div className="progress-details">
                                        <p>Niveau : {userProgress.level}</p>
                                        <p>Progression : {userProgress.progress.toFixed(2)}%</p>
                                    </div>
                                </div>
                            )}

                            {isEditModalOpen && allAchievements.length > 0 && (
                                <div className="detail-group">
                                    <label>Succès</label>
                                    <div className="achievements-list">
                                        {allAchievements.map(achievement => (
                                            <div key={achievement.id} className="achievement-item">
                                                <span>{achievement.name}</span>
                                                {userAchievements.includes(achievement.id) ? (
                                                    <span className="achievement-status unlocked">Débloqué</span>
                                                ) : (
                                                    <span className="achievement-status locked">Bloqué</span>
                                                )}
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