import React from 'react';

const ProgressBar = ({
                         progress = 0,
                         height = '20px',
                         backgroundColor = '#e0e0e0',
                         progressColor = '#4CAF50',
                         showPercentage = true
                     }) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="progress-bar-container" style={{
            width: '400px',
            backgroundColor: backgroundColor,
            borderRadius: '4px',
            height: height,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="progress-bar-fill" style={{
                height: '100%',
                width: `${clampedProgress}%`,
                backgroundColor: progressColor,
                transition: 'width 0.3s ease-in-out'
            }} />
            {showPercentage && (
                <span className="progress-bar-text" style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    fontSize: '0.8rem',
                    zIndex: 1
                }}>
                    {`${Math.round(clampedProgress)}%`}
                </span>
            )}
        </div>
    );
};

export default ProgressBar;