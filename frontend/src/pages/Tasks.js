import React, { useState, useEffect } from 'react';
import './Tasks.css';
import Header from '../components/Header';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const mockTasks = [
                    { id: 1, title: 'Tâche 1', description: 'Description de la tâche 1', status: 'À faire', dueDate: '2023-12-01' },
                    { id: 2, title: 'Tâche 2', description: 'Description de la tâche 2', status: 'En cours', dueDate: '2023-12-10' },
                ];

                setTasks(mockTasks);
            } catch (error) {
                console.error('Erreur lors de la récupération des tâches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="tasks-page">
            <Header />
            <main className="tasks-main">
                <div className="tasks-container">
                    <h1 className="tasks-title">Gestion des Tâches</h1>

                    <div className="tasks-card">
                        <div className="tasks-header">
                            <h2>Liste des Tâches</h2>
                            <button className="tasks-button">Ajouter une tâche</button>
                        </div>

                        {loading ? (
                            <p className="loading-message">Chargement des tâches...</p>
                        ) : (
                            <>
                                <div className="table-wrapper">
                                    <table className="tasks-table">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Titre</th>
                                            <th>Description</th>
                                            <th>Statut</th>
                                            <th>Date d'échéance</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentTasks.map((task) => (
                                            <tr key={task.id}>
                                                <td>{task.id}</td>
                                                <td>{task.title}</td>
                                                <td>{task.description}</td>
                                                <td>{task.status}</td>
                                                <td>{task.dueDate}</td>
                                                <td className="action-buttons">
                                                    <button className="edit-button">Modifier</button>
                                                    <button className="delete-button">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pagination-section">
                                    <div className="pagination-controls">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Précédent
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => paginate(i + 1)}
                                                className={currentPage === i + 1 ? 'active' : ''}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Tasks;