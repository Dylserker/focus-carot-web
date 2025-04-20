import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import './Task.css';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        totalCompleted: 0,
        totalCreated: 0,
        completionRate: 0
    });

    useEffect(() => {
        const fetchTasks = async () => {
            const todayTasks = [
                { id: 1, title: 'Réunion d\'équipe', completed: false },
                { id: 2, title: 'Finaliser le rapport', completed: true },
                { id: 3, title: 'Appeler le client', completed: false }
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
        console.log('Création d\'une nouvelle tâche');
    };

    return (
        <div className="task-page-wrapper">
            <Header />

            <div className="task-page">
                <header className="task-page-header">
                    <h1>Gestion des Tâches</h1>
                    <button
                        className="create-task-button"
                        onClick={handleCreateTask}
                    >
                        Créer une nouvelle tâche
                    </button>
                </header>

                <div className="task-containers">
                    <div className="task-container today-tasks">
                        <h2>Tâches du jour</h2>
                        <div className="tasks-list">
                            {tasks.length > 0 ? (
                                tasks.map(task => (
                                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => {}}
                                        />
                                        <span>{task.title}</span>
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
        </div>
    );
};

export default Task;