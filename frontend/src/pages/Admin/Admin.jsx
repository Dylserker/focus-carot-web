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
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        pseudo: '',
        prenom: '',
        nom: '',
        titre: '',
        email: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/users');
                if (!response.ok) throw new Error('Erreur réseau');

                const data = await response.json();
                console.log('Données reçues:', data);

                // On accède au tableau users dans l'objet data
                const usersArray = data.users || [];
                const formattedUsers = usersArray.map(user => ({
                    id: user.id,
                    email: user.email,
                    pseudo: user.pseudo,
                    prenom: user.prenom,
                    nom: user.nom,
                    titre: user.titre || ''
                }));

                setUsers(formattedUsers);
            } catch (err) {
                console.error('Erreur:', err);
                setError('Erreur lors du chargement des utilisateurs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            id: user.id,
            pseudo: user.pseudo,
            prenom: user.prenom,
            nom: user.nom,
            titre: user.titre || '',
            email: user.email
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }
        try {
            setUsers(users.filter(user => user.id !== id));
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
        }
    };

    return (
        <div className="admin-page">
            <Header />
            <div className="admin-container">
                <h1>Administration des Utilisateurs</h1>

                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
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
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.pseudo}</td>
                                    <td>{user.nom}</td>
                                    <td>{user.prenom}</td>
                                    <td>{user.titre}</td>
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
                )}

                {isEditModalOpen && (
                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        title="Modifier l'utilisateur"
                        maxWidth="600px"
                    >
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setIsEditModalOpen(false);
                        }}>
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
                            <div className="modal-actions">
                                <Button type="submit" variant="primary">Enregistrer</Button>
                                <Button onClick={() => setIsEditModalOpen(false)} variant="secondary">Annuler</Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default Admin;