import React from 'react';
import Header from '../../component/Header/Header';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <Header />
            <main className="home-content">
                <h1>Bienvenue sur notre site</h1>
                <p>Contenu de la page d'accueil</p>
            </main>
        </div>
    );
}

export default Home;