import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../component/Header/Header';
import Button from '../../component/Button';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            const mockUsers = [
                { id: 1, pseudo: 'user1', nom: 'Dupont', prenom: 'Jean' },
                { id: 2, pseudo: 'user2', nom: 'Martin', prenom: 'Sophie' },
                { id: 3, pseudo: 'user3', nom: 'Leroy', prenom: 'Marc' },
                { id: 4, pseudo: 'user4', nom: 'Petit', prenom: 'Claire' },
                { id: 5, pseudo: 'user5', nom: 'Dubois', prenom: 'Thomas' },
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
                                        <td className="actions-cell">
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => console.log('Modifier', user.id)}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;