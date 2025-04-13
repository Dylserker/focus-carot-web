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
            width: '100%',
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
                transition: 'width 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {showPercentage && (
                    <span className="progress-bar-text" style={{
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontSize: '0.8rem'
                    }}>
            {`${Math.round(clampedProgress)}%`}
          </span>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;