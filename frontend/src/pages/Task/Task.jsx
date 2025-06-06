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
    const { currentUser } = useAuth();

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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                if (response.success) {
                    const formattedTasks = response.tasks.map(task => ({
                        ...task,
                        status: formatStatus(task.status),
                        priority: formatPriority(task.priority)
                    }));
                    setTasks(formattedTasks);

                    updateStats(formattedTasks);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches:", error);
            }
        };

        const formatStatus = (status) => {
            const statusMap = {
                'à_faire': 'todo',
                'en_cours': 'in_progress',
                'terminée': 'done'
            };
            return statusMap[status] || status;
        };

        const formatPriority = (priority) => {
            const priorityMap = {
                'basse': 'low',
                'moyenne': 'medium',
                'haute': 'high'
            };
            return priorityMap[priority] || priority;
        };

        fetchTasks();
    }, []);

    const handleCreateTask = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const taskData = {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                due_date: newTask.date,
                priority: newTask.priority,
                user_id: currentUser.id,
                experience_reward: 10
            };

            const response = await createTask(taskData);

            if (response.success && response.task) {
                const newTaskWithId = {
                    ...newTask,
                    id: response.task.id
                };

                const updatedTasks = [...tasks, newTaskWithId];
                setTasks(updatedTasks);

                updateStats(updatedTasks);

                setIsModalOpen(false);
                setNewTask({
                    title: '',
                    description: '',
                    status: 'todo',
                    date: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                });
            } else {
                throw new Error(response.error || 'Erreur lors de la création de la tâche');
            }
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskDetailModalOpen(true);
    };

    const { gainExperience } = useAuth();

    const handleStatusChange = async (taskId) => {
        try {
            const currentTask = tasks.find(task => task.id === taskId);
            if (!currentTask) {
                console.error("Tâche non trouvée:", taskId);
                return;
            }

            const nextStatus = {
                'todo': 'in_progress',
                'in_progress': 'done',
                'done': 'todo'
            };

            const statusMapForBackend = {
                'todo': 'à_faire',
                'in_progress': 'en_cours',
                'done': 'terminée'
            };

            const priorityMapForBackend = {
                'low': 'basse',
                'medium': 'moyenne',
                'high': 'haute'
            };

            const newStatus = nextStatus[currentTask.status];

            const updateData = {
                title: currentTask.title,
                description: currentTask.description,
                status: statusMapForBackend[newStatus],
                due_date: currentTask.due_date || currentTask.date,
                priority: priorityMapForBackend[currentTask.priority] || currentTask.priority,
                user_id: currentUser.id
            };

            const response = await updateTask(taskId, updateData);

            if (response.success) {
                const updatedTasks = tasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            status: newStatus
                        };
                    }
                    return task;
                });

                setTasks(updatedTasks);

                updateStats(updatedTasks);

                if (newStatus === 'done') {
                    const xpRewards = {
                        'low': 10,
                        'medium': 25,
                        'high': 50
                    };

                    const xpGain = xpRewards[currentTask.priority] || 10;

                    await gainExperience(xpGain);

                    alert(`Félicitations ! Vous avez gagné ${xpGain} points d'expérience.`);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
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
                const updatedTasks = tasks.filter(task => task.id !== selectedTask.id);
                setTasks(updatedTasks);

                updateStats(updatedTasks);

                setIsTaskDetailModalOpen(false);
                setSelectedTask(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche:", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const statusMap = {
                'todo': 'à_faire',
                'in_progress': 'en_cours',
                'done': 'terminée'
            };

            const priorityMap = {
                'low': 'basse',
                'medium': 'moyenne',
                'high': 'haute'
            };

            const response = await updateTask(selectedTask.id, {
                title: editedTask.title,
                description: editedTask.description,
                status: statusMap[editedTask.status],
                due_date: editedTask.date,
                priority: priorityMap[editedTask.priority],
                user_id: currentUser.id
            });

            if (response.success) {
                const updatedTasks = tasks.map(task =>
                    task.id === selectedTask.id ? {
                        ...task,
                        title: editedTask.title,
                        description: editedTask.description,
                        status: editedTask.status,
                        due_date: editedTask.date,
                        priority: editedTask.priority
                    } : task
                );
                setTasks(updatedTasks);

                updateStats(updatedTasks);

                setIsTaskDetailModalOpen(false);
                setIsEditing(false);
                setSelectedTask(null);
                setEditedTask(null);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la tâche:", error);
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'todo': 'À faire',
            'in_progress': 'En cours',
            'done': 'Terminé'
        };
        return labels[status];
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            'low': 'Basse',
            'medium': 'Moyenne',
            'high': 'Haute'
        };
        return labels[priority];
    };

    return (
        <div className="task-page-wrapper">
            <Header />
            <div className="task-page">
                <header className="task-page-header">
                    <h1>Gestion des Tâches</h1>
                    <button className="create-task-button" onClick={handleCreateTask}>
                        Créer une nouvelle tâche
                    </button>
                </header>

                <div className="task-containers">
                    <div className="task-container today-tasks">
                        <h2>Tâches du jour</h2>
                        <div className="tasks-list">
                            {tasks.length > 0 ? (
                                tasks
                                    .filter(task => task.status !== 'done')
                                    .map(task => (
                                        <div key={task.id} className={`task-item status-${task.status}`}>
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
                                                    className="view-task-button"
                                                    onClick={() => handleTaskClick(task)}
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    className="change-status-button"
                                                    onClick={() => handleStatusChange(task.id)}
                                                >
                                                    Changer status
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="no-tasks">Aucune tâche pour aujourd'hui</p>
                            )}
                        </div>
                    </div>

                    <div className="task-container task-stats">
                        <h2>Statistiques générales</h2>
                        <div className="stats-content">
                            <div className="stat-item">
                                <span className="stat-label">Tâches créées :</span>
                                <span className="stat-value">{stats.totalCreated}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Tâches complétées :</span>
                                <span className="stat-value">{stats.totalCompleted}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Taux de complétion :</span>
                                <span className="stat-value">{stats.completionRate}%</span>
                            </div>
                            <div className="completion-bar">
                                <div
                                    className="completion-progress"
                                    style={{ width: `${stats.completionRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer une nouvelle tâche">
                <form className="task-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Titre</label>
                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Statut</label>
                        <select
                            value={newTask.status}
                            onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                        >
                            <option value="todo">À faire</option>
                            <option value="in_progress">En cours</option>
                            <option value="done">Terminé</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={newTask.date}
                            onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Priorité</label>
                        <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        >
                            <option value="low">Basse (10 XP)</option>
                            <option value="medium">Moyenne (25 XP)</option>
                            <option value="high">Haute (50 XP)</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="create-button">Créer</button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isTaskDetailModalOpen}
                onClose={() => {
                    setIsTaskDetailModalOpen(false);
                    setIsEditing(false);
                }}
                title={selectedTask?.title}
            >
                {selectedTask && (
                    isEditing ? (
                        <form className="task-form" onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Titre</label>
                                <input
                                    type="text"
                                    value={editedTask.title}
                                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editedTask.description}
                                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Statut</label>
                                <select
                                    value={editedTask.status}
                                    onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
                                >
                                    <option value="todo">À faire</option>
                                    <option value="in_progress">En cours</option>
                                    <option value="done">Terminé</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={editedTask.date}
                                    onChange={(e) => setEditedTask({...editedTask, date: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Priorité</label>
                                <select
                                    value={editedTask.priority}
                                    onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                                >
                                    <option value="low">Basse (10 XP)</option>
                                    <option value="medium">Moyenne (25 XP)</option>
                                    <option value="high">Haute (50 XP)</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="save-button">Sauvegarder</button>
                                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="task-details-modal">
                            <div className="detail-group">
                                <label>Description</label>
                                <p>{selectedTask.description}</p>
                            </div>
                            <div className="detail-group">
                                <label>Status</label>
                                <p>{getStatusLabel(selectedTask.status)}</p>
                            </div>
                            <div className="detail-group">
                                <label>Priorité</label>
                                <p>{getPriorityLabel(selectedTask.priority)}</p>
                            </div>
                            <div className="detail-group">
                                <label>Date</label>
                                <p>{selectedTask.due_date}</p>
                            </div>
                            <div className="modal-actions">
                                <button className="edit-button" onClick={handleEditClick}>Modifier</button>
                                <button className="delete-button" onClick={handleDeleteClick}>Supprimer</button>
                            </div>
                        </div>
                    )
                )}
            </Modal>
            <svg style={{position: 'absolute', width: 0, height: 0}}>
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 30 -15"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default Task;