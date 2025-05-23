import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({
                         progress = 0,
                         height = '20px',
                         backgroundColor = '#432',
                         progressColor = '#8b4513',
                         showPercentage = true
                     }) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="header-progress-bar-container">
            <div className="header-progress-bar-background">
                <div
                    className="header-progress-bar-fill"
                    style={{ width: `${clampedProgress}%` }}
                >
                    {showPercentage && (
                        <span className="header-progress-text">
                            {`${Math.round(clampedProgress)}%`}
                        </span>
                    )}
                </div>
            </div>
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

export default ProgressBar;