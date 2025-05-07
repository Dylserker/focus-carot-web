import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import Modal from '../../component/Modal';
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
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'todo',
        date: new Date().toISOString().split('T')[0],
        priority: 'medium',
    });

    useEffect(() => {
        const fetchTasks = async () => {
            const todayTasks = [
                {
                    id: 1,
                    title: 'Réunion d\'équipe',
                    status: 'todo',
                    priority: 'high',
                    description: 'Réunion importante avec l\'équipe',
                    date: '2024-03-20'
                },
                {
                    id: 2,
                    title: 'Finaliser le rapport',
                    status: 'done',
                    priority: 'medium',
                    description: 'Finaliser le rapport mensuel',
                    date: '2024-03-20'
                },
                {
                    id: 3,
                    title: 'Appeler le client',
                    status: 'in_progress',
                    priority: 'low',
                    description: 'Appeler le client pour le suivi',
                    date: '2024-03-20'
                }
            ];

            const taskStats = {
                totalCompleted: 42,
                totalCreated: 67,
                completionRate: Math.round((42 / 67) * 100)
            };

            setTasks(todayTasks);
            setStats(taskStats);
        };

        fetchTasks();
    }, []);

    const handleCreateTask = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Nouvelle tâche:', newTask);
        setIsModalOpen(false);
        setNewTask({
            title: '',
            description: '',
            status: 'todo',
            date: new Date().toISOString().split('T')[0],
            priority: 'medium',
        });
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskDetailModalOpen(true);
    };

    const handleStatusChange = (taskId) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const nextStatus = {
                    'todo': 'in_progress',
                    'in_progress': 'done',
                    'done': 'todo'
                };
                return { ...task, status: nextStatus[task.status] };
            }
            return task;
        }));
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
                                tasks.map(task => (
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
                                                Voir
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
                onClose={() => setIsTaskDetailModalOpen(false)}
                title={selectedTask?.title}
            >
                {selectedTask && (
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
                            <p>{selectedTask.date}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Task;