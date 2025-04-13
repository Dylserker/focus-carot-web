import React from 'react';
import './Card.css';

const Card = ({ title, subtitle, children, imageUrl, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {imageUrl && (
                <div className="card-image">
                    <img src={imageUrl} alt={title} />
                </div>
            )}
            <div className="card-content">
                {title && <h2 className="card-title">{title}</h2>}
                {subtitle && <h3 className="card-subtitle">{subtitle}</h3>}
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;