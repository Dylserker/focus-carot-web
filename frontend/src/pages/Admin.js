import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './Admin.css';
import Modal from '../components/Modal';

function Admin() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const usersPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const mockUsers = [
            { id: 1, pseudo: 'user1', nom: 'Dupont', prenom: 'Jean', role: 'Administrateur' },
            { id: 2, pseudo: 'user2', nom: 'Martin', prenom: 'Sophie', role: 'Utilisateur' },
            { id: 3, pseudo: 'user3', nom: 'Bernard', prenom: 'Michel', role: 'Modérateur' },
            { id: 4, pseudo: 'user4', nom: 'Petit', prenom: 'Marie', role: 'Utilisateur' },
            { id: 5, pseudo: 'user5', nom: 'Dubois', prenom: 'Pierre', role: 'Utilisateur' },
            { id: 6, pseudo: 'user6', nom: 'Roux', prenom: 'Claire', role: 'Modérateur' },
            { id: 7, pseudo: 'user7', nom: 'Moreau', prenom: 'Thomas', role: 'Utilisateur' },
            { id: 8, pseudo: 'user8', nom: 'Simon', prenom: 'Julie', role: 'Utilisateur' },
            { id: 9, pseudo: 'user9', nom: 'Leroy', prenom: 'David', role: 'Utilisateur' },
            { id: 10, pseudo: 'user10', nom: 'Lefebvre', prenom: 'Émilie', role: 'Utilisateur' },
            { id: 11, pseudo: 'user11', nom: 'Garcia', prenom: 'Antoine', role: 'Utilisateur' },
            { id: 12, pseudo: 'user12', nom: 'Rousseau', prenom: 'Nathalie', role: 'Utilisateur' },
            { id: 13, pseudo: 'user13', nom: 'Mercier', prenom: 'Lucas', role: 'Modérateur' },
            { id: 14, pseudo: 'user14', nom: 'Blanc', prenom: 'Camille', role: 'Utilisateur' },
            { id: 15, pseudo: 'user15', nom: 'Guerin', prenom: 'Éric', role: 'Utilisateur' },
            { id: 16, pseudo: 'user16', nom: 'Fournier', prenom: 'Isabelle', role: 'Administrateur' },
            { id: 17, pseudo: 'user17', nom: 'Vincent', prenom: 'Alexandre', role: 'Utilisateur' },
            { id: 18, pseudo: 'user18', nom: 'Morel', prenom: 'Aurélie', role: 'Utilisateur' },
            { id: 19, pseudo: 'user19', nom: 'Boyer', prenom: 'Maxime', role: 'Modérateur' },
            { id: 20, pseudo: 'user20', nom: 'Lemaire', prenom: 'Charlotte', role: 'Utilisateur' },
            { id: 21, pseudo: 'user21', nom: 'Fontaine', prenom: 'Julien', role: 'Utilisateur' },
            { id: 22, pseudo: 'user22', nom: 'Roussel', prenom: 'Virginie', role: 'Utilisateur' },
            { id: 23, pseudo: 'user23', nom: 'Duval', prenom: 'Nicolas', role: 'Modérateur' },
            { id: 24, pseudo: 'user24', nom: 'Faure', prenom: 'Céline', role: 'Utilisateur' },
            { id: 25, pseudo: 'user25', nom: 'Henry', prenom: 'Stéphane', role: 'Utilisateur' }
        ];

        setUsers(mockUsers);
        setTotalPages(Math.ceil(mockUsers.length / usersPerPage));
    }, []);

    const getCurrentUsers = () => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return users.slice(indexOfFirstUser, indexOfLastUser);
    };

    const handleEdit = (userId) => {
        const user = users.find(user => user.id === userId);
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = (userId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            console.log(`Supprimer l'utilisateur avec l'ID: ${userId}`);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <div className="admin-page">
            <Header />
            <main className="admin-container">
                <h1>Panneau d'administration</h1>
                <div className="admin-content">
                    <section className="users-section">
                        <h2>Liste des utilisateurs</h2>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pseudo</th>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Rôle</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getCurrentUsers().map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.pseudo}</td>
                                        <td>{user.nom}</td>
                                        <td>{user.prenom}</td>
                                        <td>{user.role}</td>
                                        <td className="action-buttons">
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                Modifier
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="pagination-section">
                        <div className="pagination-controls">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                Précédent
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => goToPage(index + 1)}
                                    className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                Suivant
                            </button>
                        </div>
                    </section>
                </div>
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    {selectedUser && (
                        <div className="edit-user-form">
                            <h2>Modifier l'utilisateur</h2>
                            <form>
                                <div className="form-group">
                                    <label>Pseudo:</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.pseudo}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nom:</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.nom}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prénom:</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.prenom}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rôle:</label>
                                    <select defaultValue={selectedUser.role}>
                                        <option value="Utilisateur">Utilisateur</option>
                                        <option value="Modérateur">Modérateur</option>
                                        <option value="Administrateur">Administrateur</option>
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={handleCloseModal}>Annuler</button>
                                    <button type="submit">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    )}
                </Modal>
            </main>
        </div>
    );
}

export default Admin;