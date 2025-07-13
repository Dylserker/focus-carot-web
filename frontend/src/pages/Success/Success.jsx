import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AchievementService from '../../services/achievementService';
import Header from '../../component/Header/Header';
import './Success.css';

const Success = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      loadAchievements();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const [achievementsResponse, statsResponse] = await Promise.all([
        AchievementService.getUserAchievementsWithProgress(),
        AchievementService.getUserAchievementStats()
      ]);
      if (achievementsResponse.success) setAchievements(achievementsResponse.data || []);
      if (statsResponse.success) setStats(statsResponse.data || {});
    } catch (error) {
      setError('Erreur lors du chargement des succès');
    } finally {
      setLoading(false);
    }
  };

  const checkAllAchievements = async () => {
    try {
      const response = await AchievementService.checkAllAchievements();
      if (response.success && response.data.total > 0) {
        alert(`🎉 ${response.message}`);
        loadAchievements(); // Recharger les succès
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des succès:', error);
    }
  };

  const getFilteredAchievements = () => {
    if (filter === 'all') return achievements;
    return achievements.filter(achievement => achievement.type === filter);
  };

  const getAchievementCardClass = (achievement) => {
    let baseClass = 'achievement-card';
    if (achievement.isUnlocked) {
      baseClass += ' unlocked';
    }
    if (achievement.rarity) {
      baseClass += ` rarity-${achievement.rarity}`;
    }
    return baseClass;
  };

  const getProgressBarColor = (achievement) => {
    if (achievement.isUnlocked) return '#28a745';
    if (achievement.percentage >= 75) return '#ffc107';
    if (achievement.percentage >= 50) return '#17a2b8';
    return '#6c757d';
  };

  if (loading) {
    return (
      <div className="success-page-wrapper">
        <Header />
        <div className="success-page">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="success-page-wrapper">
        <Header />
        <div className="success-page">
          <div className="info">Connecte-toi pour voir tes succès !</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page-wrapper">
        <Header />
        <div className="success-page">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page-wrapper">
      <Header />
      <div className="success-page">
        <div className="success-header">
          <h1>🏆 Succès</h1>
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-number">{stats.unlocked || 0}</span>
              <span className="stat-label">Débloqués</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalAchievements || 0}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completionRate || 0}%</span>
              <span className="stat-label">Complétion</span>
            </div>
          </div>
        </div>

        <div className="success-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
            <button 
              className={filter === 'taches_completees' ? 'active' : ''} 
              onClick={() => setFilter('taches_completees')}
            >
              📝 Tâches
            </button>
            <button 
              className={filter === 'niveau_atteint' ? 'active' : ''} 
              onClick={() => setFilter('niveau_atteint')}
            >
              ⭐ Niveaux
            </button>
            <button 
              className={filter === 'jours_consecutifs' ? 'active' : ''} 
              onClick={() => setFilter('jours_consecutifs')}
            >
              🔥 Streaks
            </button>
            <button 
              className={filter === 'special' ? 'active' : ''} 
              onClick={() => setFilter('special')}
            >
              🎯 Spéciaux
            </button>
          </div>
        </div>

        <div className="achievements-grid">
          {achievements.filter(a => filter === 'all' || a.type === filter).map((achievement) => (
            <div key={achievement._id} className={`achievement-card${achievement.isUnlocked ? ' unlocked' : ''} rarity-${achievement.rarity}`}>
              <div className="achievement-header">
                <div className="achievement-icon">
                  {AchievementService.getAchievementIcon(achievement.type, achievement.rarity)}
                </div>
                <div className="achievement-info">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-type">
                    {AchievementService.getTypeName(achievement.type)}
                  </p>
                  <span className={`rarity-badge rarity-${achievement.rarity}`}>
                    {achievement.rarity}
                  </span>
                </div>
                {achievement.isUnlocked && (
                  <div className="unlocked-badge">✅</div>
                )}
              </div>

              <p className="achievement-description">
                {AchievementService.formatDescription(achievement)}
              </p>

              <div className="achievement-progress">
                <div className="progress-info">
                  <span className="progress-text">
                    {achievement.progress} / {achievement.maxProgress}
                  </span>
                  <span className="progress-percentage">
                    {achievement.percentage}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${achievement.percentage}%`,
                      backgroundColor: achievement.isUnlocked ? '#28a745' : '#6c757d'
                    }}
                  ></div>
                </div>
              </div>

              <div className="achievement-reward">
                <span className="reward-label">Récompense:</span>
                <span className="reward-value">+{achievement.experienceReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Success;