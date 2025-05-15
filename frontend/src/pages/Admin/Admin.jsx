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
    const [formData, setFormData] = useState({
        id: '',
        pseudo: '',
        prenom: '',
        nom: '',
        titre: '',
        email: '',
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
            pseudo: user.pseudo,
            prenom: user.prenom,
            nom: user.nom,
            titre: user.titre || '',
            email: user.email,
            role: user.role
        });
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
            role: 'user'
        });
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setUsers(users.filter(user => user.id !== id));
            }
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
        }
    };

    const handleSubmit = async (e, isCreate = false) => {
        e.preventDefault();
        try {
            const url = isCreate
                ? 'http://localhost:8000/users'
                : `http://localhost:8000/users/${formData.id}`;

            const response = await fetch(url, {
                method: isCreate ? 'POST' : 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchUsers();
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
            }
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
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
                                >
                                    <option value="user">Utilisateur</option>
                                    <option value="admin">Administrateur</option>
                                    <option value="parent">Parent</option>
                                    <option value="enfant">Enfant</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <Button type="submit" variant="primary">
                                    {isCreateModalOpen ? "Créer" : "Enregistrer"}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setIsCreateModalOpen(false);
                                    }}
                                    variant="secondary"
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