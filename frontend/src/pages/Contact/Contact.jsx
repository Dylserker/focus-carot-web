import React, { useState } from 'react';
import Header from '../../component/Header/Header';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        email: '',
        objet: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Données du formulaire soumises:', formData);
        setFormData({
            email: '',
            objet: '',
            message: ''
        });
        alert('Votre message a été envoyé!');
    };

    return (
        <div className="contact-page">
            <Header />

            <div className="contact-container">
                <h1>Contactez-nous</h1>
                <p>Vous avez des questions ou des suggestions? N'hésitez pas à nous contacter!</p>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Votre adresse email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="objet">Objet</label>
                        <input
                            type="text"
                            id="objet"
                            name="objet"
                            value={formData.objet}
                            onChange={handleChange}
                            placeholder="Sujet de votre message"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Votre message"
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">Envoyer</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;