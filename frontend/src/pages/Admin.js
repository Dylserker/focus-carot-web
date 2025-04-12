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
            { id: 1, pseudo: 'user1', nom: 'Dupont', prenom: 'Jean', role: 'Administrateur', xp: 1500, badge: 'Expert', chiby: 'avatar1.png', photo: 'profile1.jpg' },
            { id: 2, pseudo: 'user2', nom: 'Martin', prenom: 'Sophie', role: 'Utilisateur', xp: 800, badge: 'Débutant', chiby: 'avatar2.png', photo: 'profile2.jpg' },
            { id: 3, pseudo: 'user3', nom: 'Bernard', prenom: 'Michel', role: 'Modérateur', xp: 1200, badge: 'Intermédiaire', chiby: 'avatar3.png', photo: 'profile3.jpg' },
            { id: 4, pseudo: 'user4', nom: 'Petit', prenom: 'Marie', role: 'Utilisateur', xp: 500, badge: 'Débutant', chiby: 'avatar4.png', photo: 'profile4.jpg' },
            { id: 5, pseudo: 'user5', nom: 'Dubois', prenom: 'Pierre', role: 'Utilisateur', xp: 750, badge: 'Débutant', chiby: 'avatar5.png', photo: 'profile5.jpg' },
            { id: 6, pseudo: 'user6', nom: 'Roux', prenom: 'Claire', role: 'Modérateur', xp: 1100, badge: 'Intermédiaire', chiby: 'avatar6.png', photo: 'profile6.jpg' },
            { id: 7, pseudo: 'user7', nom: 'Moreau', prenom: 'Thomas', role: 'Utilisateur', xp: 600, badge: 'Débutant', chiby: 'avatar7.png', photo: 'profile7.jpg' },
            { id: 8, pseudo: 'user8', nom: 'Simon', prenom: 'Julie', role: 'Utilisateur', xp: 900, badge: 'Intermédiaire', chiby: 'avatar8.png', photo: 'profile8.jpg' },
            { id: 9, pseudo: 'user9', nom: 'Leroy', prenom: 'David', role: 'Utilisateur', xp: 850, badge: 'Débutant', chiby: 'avatar9.png', photo: 'profile9.jpg' },
            { id: 10, pseudo: 'user10', nom: 'Lefebvre', prenom: 'Émilie', role: 'Utilisateur', xp: 950, badge: 'Intermédiaire', chiby: 'avatar10.png', photo: 'profile10.jpg' },
            { id: 11, pseudo: 'user11', nom: 'Garcia', prenom: 'Antoine', role: 'Utilisateur', xp: 700, badge: 'Débutant', chiby: 'avatar11.png', photo: 'profile11.jpg' },
            { id: 12, pseudo: 'user12', nom: 'Rousseau', prenom: 'Nathalie', role: 'Utilisateur', xp: 650, badge: 'Débutant', chiby: 'avatar12.png', photo: 'profile12.jpg' },
            { id: 13, pseudo: 'user13', nom: 'Mercier', prenom: 'Lucas', role: 'Modérateur', xp: 1300, badge: 'Expert', chiby: 'avatar13.png', photo: 'profile13.jpg' },
            { id: 14, pseudo: 'user14', nom: 'Blanc', prenom: 'Camille', role: 'Utilisateur', xp: 550, badge: 'Débutant', chiby: 'avatar14.png', photo: 'profile14.jpg' },
            { id: 15, pseudo: 'user15', nom: 'Guerin', prenom: 'Éric', role: 'Utilisateur', xp: 1000, badge: 'Intermédiaire', chiby: 'avatar15.png', photo: 'profile15.jpg' },
            { id: 16, pseudo: 'user16', nom: 'Fournier', prenom: 'Isabelle', role: 'Administrateur', xp: 1600, badge: 'Expert', chiby: 'avatar16.png', photo: 'profile16.jpg' },
            { id: 17, pseudo: 'user17', nom: 'Vincent', prenom: 'Alexandre', role: 'Utilisateur', xp: 620, badge: 'Débutant', chiby: 'avatar17.png', photo: 'profile17.jpg' },
            { id: 18, pseudo: 'user18', nom: 'Morel', prenom: 'Aurélie', role: 'Utilisateur', xp: 720, badge: 'Débutant', chiby: 'avatar18.png', photo: 'profile18.jpg' },
            { id: 19, pseudo: 'user19', nom: 'Boyer', prenom: 'Maxime', role: 'Modérateur', xp: 1250, badge: 'Expert', chiby: 'avatar19.png', photo: 'profile19.jpg' },
            { id: 20, pseudo: 'user20', nom: 'Lemaire', prenom: 'Charlotte', role: 'Utilisateur', xp: 680, badge: 'Débutant', chiby: 'avatar20.png', photo: 'profile20.jpg' },
            { id: 21, pseudo: 'user21', nom: 'Fontaine', prenom: 'Julien', role: 'Utilisateur', xp: 930, badge: 'Intermédiaire', chiby: 'avatar21.png', photo: 'profile21.jpg' },
            { id: 22, pseudo: 'user22', nom: 'Roussel', prenom: 'Virginie', role: 'Utilisateur', xp: 870, badge: 'Intermédiaire', chiby: 'avatar22.png', photo: 'profile22.jpg' },
            { id: 23, pseudo: 'user23', nom: 'Duval', prenom: 'Nicolas', role: 'Modérateur', xp: 1150, badge: 'Expert', chiby: 'avatar23.png', photo: 'profile23.jpg' },
            { id: 24, pseudo: 'user24', nom: 'Faure', prenom: 'Céline', role: 'Utilisateur', xp: 520, badge: 'Débutant', chiby: 'avatar24.png', photo: 'profile24.jpg' },
            { id: 25, pseudo: 'user25', nom: 'Henry', prenom: 'Stéphane', role: 'Utilisateur', xp: 780, badge: 'Intermédiaire', chiby: 'avatar25.png', photo: 'profile25.jpg' }
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

    const handleSaveUser = (updatedUser) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        handleCloseModal();
    };

    const handleSubmitWithFileUpload = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const photoFile = e.target.photo.files[0];

        if (photoFile) {
            const photoFileName = photoFile.name;

            const updatedUser = {
                ...selectedUser,
                pseudo: formData.get('pseudo'),
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                role: formData.get('role'),
                xp: parseInt(formData.get('xp')),
                badge: formData.get('badge'),
                chiby: formData.get('chiby'),
                photo: photoFileName
            };

            handleSaveUser(updatedUser);
        } else {
            handleSaveUser({
                ...selectedUser,
                pseudo: formData.get('pseudo'),
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                role: formData.get('role'),
                xp: parseInt(formData.get('xp')),
                badge: formData.get('badge'),
                chiby: formData.get('chiby')
            });
        }
    };

    return (
        <div className="admin-page">
            <Header />
            <main className="admin-container">
                <h1>Panneau d'administration</h1>
                <div className="admin-table-container">
                    <table className="admin-table">
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
                                <td className="actions">
                                    <button onClick={() => handleEdit(user.id)} className="edit-button">Modifier</button>
                                    <button onClick={() => handleDelete(user.id)} className="delete-button">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Précédent
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                            {i + 1}
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

                {isModalOpen && selectedUser && (
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                        <div className="edit-user-form">
                            <h2>Modifier l'utilisateur</h2>
                            <form onSubmit={handleSubmitWithFileUpload}>
                                <div className="form-group">
                                    <label htmlFor="pseudo">Pseudo:</label>
                                    <input type="text" id="pseudo" name="pseudo" defaultValue={selectedUser.pseudo} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nom">Nom:</label>
                                    <input type="text" id="nom" name="nom" defaultValue={selectedUser.nom} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="prenom">Prénom:</label>
                                    <input type="text" id="prenom" name="prenom" defaultValue={selectedUser.prenom} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Rôle:</label>
                                    <select id="role" name="role" defaultValue={selectedUser.role}>
                                        <option value="Utilisateur">Utilisateur</option>
                                        <option value="Modérateur">Modérateur</option>
                                        <option value="Administrateur">Administrateur</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="xp">XP:</label>
                                    <input type="number" id="xp" name="xp" defaultValue={selectedUser.xp || 0} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="badge">Badge:</label>
                                    <input type="text" id="badge" name="badge" defaultValue={selectedUser.badge || ''} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="chiby">Chiby:</label>
                                    <input type="text" id="chiby" name="chiby" defaultValue={selectedUser.chiby || ''} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="photo">Photo:</label>
                                    <input type="file" id="photo" name="photo" accept="image/*" />
                                    {selectedUser.photo && (
                                        <div className="current-photo">
                                            <p>Photo actuelle: {selectedUser.photo}</p>
                                            <img
                                                src={`/images/${selectedUser.photo}`}
                                                alt="Photo de profil"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="save-button">Enregistrer</button>
                                    <button type="button" className="cancel-button" onClick={handleCloseModal}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
}

export default Admin;