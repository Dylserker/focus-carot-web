import React from 'react';
import Header from '../components/Header';
import './Home.css';

function Home() {
    const tachesDuJour = [
        { id: 1, nom: "Réviser le cours de React", difficulte: "Moyenne" },
        { id: 2, nom: "Faire les exercices de programmation", difficulte: "Difficile" },
        { id: 3, nom: "Préparer la présentation", difficulte: "Facile" },
        { id: 4, nom: "Réunion d'équipe", difficulte: "Moyenne" },
    ];

    return (
        <div className="home-container">
            <Header />
            <main className="main-content">
                <div className="layout-container">
                    <div className="chiby-container">
                        <div className="chiby-placeholder">
                            Chiby
                        </div>
                    </div>

                    <div className="tasks-container">
                        <h3>Tâches du jour</h3>
                        <ul className="tasks-list">
                            {tachesDuJour.map(tache => (
                                <li key={tache.id} className="task-item">
                                    <span className="task-name">{tache.nom}</span>
                                    <span className={`task-difficulty ${tache.difficulte.toLowerCase()}`}>
                                        {tache.difficulte}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;