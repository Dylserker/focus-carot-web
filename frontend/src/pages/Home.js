import React from 'react';
import Header from '../components/Header';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <Header />
            <main className="main-content">
                <section className="hero">
                    <h2>Bienvenue sur Mon Site</h2>
                    <p>Découvrez nos produits et services exceptionnels</p>
                    <button className="cta-button">En savoir plus</button>
                </section>

                <section className="features">
                    <div className="feature">
                        <h3>Fonctionnalité 1</h3>
                        <p>Description de la première fonctionnalité</p>
                    </div>
                    <div className="feature">
                        <h3>Fonctionnalité 2</h3>
                        <p>Description de la deuxième fonctionnalité</p>
                    </div>
                    <div className="feature">
                        <h3>Fonctionnalité 3</h3>
                        <p>Description de la troisième fonctionnalité</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;