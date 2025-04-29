import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../component/Header/Header';
import Button from '../../component/Button';
import Modal from '../../component/Modal';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error] = useState(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        pseudo: '',
        prenom: '',
        nom: '',
        photo: '',
        titre: ''
    });

    useEffect(() => {
        setTimeout(() => {
            const mockUsers = [
                { id: 1, pseudo: 'user1', nom: 'Dupont', prenom: 'Jean', photo: '', titre: 'Développeur' },
                { id: 2, pseudo: 'user2', nom: 'Martin', prenom: 'Sophie', photo: '', titre: 'Designer' },
                { id: 3, pseudo: 'user3', nom: 'Leroy', prenom: 'Marc', photo: '', titre: 'Marketeur' },
                { id: 4, pseudo: 'user4', nom: 'Petit', prenom: 'Claire', photo: '', titre: 'Chef de projet' },
                { id: 5, pseudo: 'user5', nom: 'Dubois', prenom: 'Thomas', photo: '', titre: 'Administrateur' },
            ];
            setUsers(mockUsers);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            pseudo: user.pseudo,
            prenom: user.prenom,
            nom: user.nom,
            photo: user.photo || '',
            titre: user.titre || ''
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedUsers = users.map(user =>
            user.id === currentUser.id
                ? { ...user, ...formData }
                : user
        );

        setUsers(updatedUsers);
        setIsEditModalOpen(false);
    };

    return (
        <div className="admin-page">
            <Header />
            <div className="admin-container">
                <h1>Administration des Utilisateurs</h1>

                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : error ? (
                    <p className="error-message">Erreur: {error}</p>
                ) : (
                    <>
                        <div className="admin-actions">
                            <Button
                                variant="primary"
                                onClick={() => console.log('Ajouter un utilisateur')}
                            >
                                Ajouter un utilisateur
                            </Button>
                        </div>

                        <div className="user-list">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
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

                        <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            title="Modifier l'utilisateur"
                            maxWidth="600px"
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="pseudo">Pseudo</label>
                                    <input
                                        type="text"
                                        id="pseudo"
                                        name="pseudo"
                                        value={formData.pseudo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="prenom">Prénom</label>
                                    <input
                                        type="text"
                                        id="prenom"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="nom">Nom</label>
                                    <input
                                        type="text"
                                        id="nom"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="photo">Photo (URL)</label>
                                    <input
                                        type="text"
                                        id="photo"
                                        name="photo"
                                        value={formData.photo}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="titre">Titre</label>
                                    <input
                                        type="text"
                                        id="titre"
                                        name="titre"
                                        value={formData.titre}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-actions">
                                    <div className="form-actions-left">
                                        <Button type="submit" variant="primary">
                                            Enregistrer
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setIsEditModalOpen(false)}
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                    <div className="form-actions-right">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => {
                                                if (currentUser) {
                                                    handleDelete(currentUser.id);
                                                    setIsEditModalOpen(false);
                                                }
                                            }}
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Modal>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;