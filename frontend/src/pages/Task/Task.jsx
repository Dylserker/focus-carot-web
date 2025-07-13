import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import Modal from '../../component/Modal';
import { createTask, getTasks, updateTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';
import './Task.css';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        totalCompleted: 0,
        totalCreated: 0,
        completionRate: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'todo',
        date: new Date().toISOString().split('T')[0],
        priority: 'medium',
    });
    const { currentUser, gainExperience } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');

    // Récupérer les tâches
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                if (response.success) {
                    const formattedTasks = response.tasks.map(task => ({
                        ...task,
                        id: task._id,
                        status: task.status === 'à_faire' ? 'todo' : 
                               task.status === 'en_cours' ? 'in_progress' : 
                               task.status === 'terminée' ? 'done' : task.status,
                        priority: task.priority === 'basse' ? 'low' : 
                                 task.priority === 'moyenne' ? 'medium' : 
                                 task.priority === 'haute' ? 'high' : task.priority
                    }));
                    setTasks(formattedTasks);
                    updateStats(formattedTasks);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des tâches:', error);
            }
        };
        fetchTasks();
    }, []);

    const updateStats = (currentTasks) => {
        const completed = currentTasks.filter(task => task.status === 'done').length;
        const total = currentTasks.length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        setStats({
            totalCompleted: completed,
            totalCreated: total,
            completionRate: rate
        });
    };

    // CRUD
    const handleCreateTask = () => setIsModalOpen(true);
    
    const fetchAndUpdateTasks = async () => {
        try {
            const response = await getTasks();
            if (response.success) {
                const formattedTasks = response.tasks.map(task => ({
                    ...task,
                    id: task._id,
                    status: task.status === 'à_faire' ? 'todo' : 
                           task.status === 'en_cours' ? 'in_progress' : 
                           task.status === 'terminée' ? 'done' : task.status,
                    priority: task.priority === 'basse' ? 'low' : 
                             task.priority === 'moyenne' ? 'medium' : 
                             task.priority === 'haute' ? 'high' : task.priority
                }));
                setTasks(formattedTasks);
                updateStats(formattedTasks);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des tâches:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const taskData = {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status === 'todo' ? 'à_faire' : 
                       newTask.status === 'in_progress' ? 'en_cours' : 
                       newTask.status === 'done' ? 'terminée' : newTask.status,
                dueDate: newTask.date,
                priority: newTask.priority === 'low' ? 'basse' : 
                         newTask.priority === 'medium' ? 'moyenne' : 
                         newTask.priority === 'high' ? 'haute' : newTask.priority
            };
            const response = await createTask(taskData);
            if (response.success && response.task) {
                await fetchAndUpdateTasks();
                setIsModalOpen(false);
                setNewTask({
                    title: '',
                    description: '',
                    status: 'todo',
                    date: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                });
            } else {
                throw new Error(response.message || 'Erreur lors de la création de la tâche');
            }
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskDetailModalOpen(true);
    };

    const handleStatusChange = async (taskId) => {
        try {
            const currentTask = tasks.find(task => task.id === taskId);
            if (!currentTask) return;
            
            const nextStatus = {
                'todo': 'in_progress',
                'in_progress': 'done',
                'done': 'todo'
            };
            
            const newStatus = nextStatus[currentTask.status];
            const updateData = {
                title: currentTask.title,
                description: currentTask.description,
                status: newStatus === 'todo' ? 'à_faire' : 
                       newStatus === 'in_progress' ? 'en_cours' : 
                       newStatus === 'done' ? 'terminée' : newStatus,
                dueDate: currentTask.dueDate || currentTask.date,
                priority: currentTask.priority === 'low' ? 'basse' : 
                         currentTask.priority === 'medium' ? 'moyenne' : 
                         currentTask.priority === 'high' ? 'haute' : currentTask.priority
            };
            
            const response = await updateTask(taskId, updateData);
            if (response.success) {
                // Si la tâche est terminée, ajouter l'XP côté contexte
                if (newStatus === 'done') {
                    const xpGain = response.task?.experienceReward || 10;
                    await gainExperience(xpGain);
                    setSuccessMessage(`Félicitations ! Vous avez gagné ${xpGain} XP.`);
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
                await fetchAndUpdateTasks();
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedTask({ ...selectedTask });
    };

    const handleDeleteClick = async () => {
        try {
            const response = await deleteTask(selectedTask.id);
            if (response.success) {
                await fetchAndUpdateTasks();
                setIsTaskDetailModalOpen(false);
                setSelectedTask(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateTask(selectedTask.id, {
                title: editedTask.title,
                description: editedTask.description,
                status: editedTask.status === 'todo' ? 'à_faire' : 
                       editedTask.status === 'in_progress' ? 'en_cours' : 
                       editedTask.status === 'done' ? 'terminée' : editedTask.status,
                dueDate: editedTask.date,
                priority: editedTask.priority === 'low' ? 'basse' : 
                         editedTask.priority === 'medium' ? 'moyenne' : 
                         editedTask.priority === 'high' ? 'haute' : editedTask.priority
            });
            if (response.success) {
                await fetchAndUpdateTasks();
                setIsEditing(false);
                setIsTaskDetailModalOpen(false);
                setSelectedTask(null);
            }
        } catch (error) {
            console.error('Erreur lors de la modification de la tâche:', error);
        }
    };

    // Affichage des stats
    const getStatusLabel = (status) => {
        switch (status) {
            case 'todo': return 'À faire';
            case 'in_progress': return 'En cours';
            case 'done': return 'Terminée';
            default: return status;
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'low': return 'Basse';
            case 'medium': return 'Moyenne';
            case 'high': return 'Haute';
            default: return priority;
        }
    };

    // Affichage des tâches non terminées uniquement
    const tasksToShow = tasks.filter(task => task.status !== 'done');

    // Stat XP totale
    const totalXP = currentUser?.progression?.experiencePoints || 0;

    return (
        <div className="task-page-wrapper">
            <Header />
            <div className="task-page">
                <div className="task-page-header">
                    <h1>Gestion des Tâches</h1>
                    <button className="create-task-button" onClick={handleCreateTask}>
                        Créer une tâche
                    </button>
                </div>

                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="task-containers">
                    {/* Conteneur des tâches */}
                    <div className="task-container">
                        <h2>Mes Tâches</h2>
                        <div className="tasks-list">
                            {tasksToShow.map(task => (
                                <div key={task.id} className="task-item">
                                    <div className="task-info">
                                        <h3>{task.title}</h3>
                                        <div className="task-details">
                                            <span className={`status-badge ${task.status}`}>
                                                {getStatusLabel(task.status)}
                                            </span>
                                            <span className={`priority-badge ${task.priority}`}>
                                                {getPriorityLabel(task.priority)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        <button 
                                            className="change-status-button"
                                            onClick={() => handleStatusChange(task.id)}
                                        >
                                            Changer d'état
                                        </button>
                                        <button 
                                            className="view-task-button"
                                            onClick={() => handleTaskClick(task)}
                                        >
                                            Voir
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tasksToShow.length === 0 && (
                                <p>Aucune tâche pour le moment. Créez votre première tâche !</p>
                            )}
                        </div>
                    </div>

                    {/* Conteneur des statistiques */}
                    <div className="task-container">
                        <h2>Statistiques</h2>
                        <div className="stats-content">
                            <div className="stat-item">
                                <div className="stat-label">Tâches créées</div>
                                <div className="stat-value">{stats.totalCreated}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">Tâches terminées</div>
                                <div className="stat-value">{stats.totalCompleted}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">Taux de complétion</div>
                                <div className="stat-value">{stats.completionRate}%</div>
                                <div className="completion-bar">
                                    <div 
                                        className="completion-progress" 
                                        style={{ width: `${stats.completionRate}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">XP totale</div>
                                <div className="stat-value">{totalXP} XP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de création */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer une tâche">
                <form className="task-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Titre</label>
                        <input 
                            type="text" 
                            value={newTask.title} 
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            value={newTask.description} 
                            onChange={e => setNewTask({ ...newTask, description: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Échéance</label>
                        <input 
                            type="date" 
                            value={newTask.date} 
                            onChange={e => setNewTask({ ...newTask, date: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Priorité</label>
                        <select 
                            value={newTask.priority} 
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <option value="low">Basse</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="create-button">Créer</button>
                    </div>
                </form>
            </Modal>

            {/* Modal de détail/édition */}
            <Modal isOpen={isTaskDetailModalOpen} onClose={() => setIsTaskDetailModalOpen(false)} title="Détail de la tâche">
                {selectedTask && !isEditing && (
                    <div className="task-details-modal">
                        <div className="detail-group">
                            <label>Titre</label>
                            <p>{selectedTask.title}</p>
                        </div>
                        <div className="detail-group">
                            <label>Description</label>
                            <p>{selectedTask.description}</p>
                        </div>
                        <div className="detail-group">
                            <label>Échéance</label>
                            <p>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Aucune'}</p>
                        </div>
                        <div className="detail-group">
                            <label>Priorité</label>
                            <p>{getPriorityLabel(selectedTask.priority)}</p>
                        </div>
                        <div className="detail-group">
                            <label>Statut</label>
                            <p>{getStatusLabel(selectedTask.status)}</p>
                        </div>
                        <div className="modal-actions">
                            <button className="edit-button" onClick={handleEditClick}>Modifier</button>
                            <button className="delete-button" onClick={handleDeleteClick}>Supprimer</button>
                        </div>
                    </div>
                )}
                {selectedTask && isEditing && (
                    <form className="task-form" onSubmit={handleEditSubmit}>
                        <div className="form-group">
                            <label>Titre</label>
                            <input 
                                type="text" 
                                value={editedTask.title} 
                                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={editedTask.description} 
                                onChange={e => setEditedTask({ ...editedTask, description: e.target.value })} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Échéance</label>
                            <input 
                                type="date" 
                                value={editedTask.date || ''} 
                                onChange={e => setEditedTask({ ...editedTask, date: e.target.value })} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Priorité</label>
                            <select 
                                value={editedTask.priority} 
                                onChange={e => setEditedTask({ ...editedTask, priority: e.target.value })}
                            >
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="save-button">Enregistrer</button>
                            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Task;