import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AchievementService from '../../services/achievementService';
import Header from '../../component/Header/Header';
import './Success.css';

const Success = () => {
  const { currentUser, isAuthenticated, gainExperience } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [validatingAchievement, setValidatingAchievement] = useState(null);
  const [checkingAll, setCheckingAll] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadAchievements();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Synchronisation automatique avec l'admin (événement custom)
  useEffect(() => {
    const handleAchievementUpdate = () => {
      loadAchievements();
    };
    window.addEventListener('achievement-updated', handleAchievementUpdate);
    return () => {
      window.removeEventListener('achievement-updated', handleAchievementUpdate);
    };
  }, []);

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
      setCheckingAll(true);
      const response = await AchievementService.checkAllAchievements();
      if (response.success) {
        const total = response.data?.total || 0;
        const achievements = response.data?.achievements || [];
        const xpTotal = achievements.reduce((sum, a) => sum + (a.experienceGained || 0), 0);
        if (total > 0) {
          alert(`🎉 ${total} succès validé(s) automatiquement ! +${xpTotal} XP gagnée(s)`);
        } else {
          alert('Aucun succès supplémentaire à valider.');
        }
        // Rafraîchir la liste
        loadAchievements();
      } else {
        alert('Erreur lors de la vérification des succès.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des succès:', error);
      alert(error.message || 'Erreur lors de la vérification des succès');
    } finally {
      setCheckingAll(false);
    }
  };

  const validateAchievement = async (achievementId) => {
    try {
      setValidatingAchievement(achievementId);
      const response = await AchievementService.validateAchievement(achievementId);
      
      if (response.success) {
        // Ajouter l'XP gagné au contexte
        if (response.data.experienceGained > 0) {
          gainExperience(response.data.experienceGained);
        }
        
        // Afficher un message de succès
        alert(`🎉 Succès validé ! +${response.data.experienceGained} XP gagné !`);
        
        // Recharger les succès pour mettre à jour l'affichage
        loadAchievements();
      }
    } catch (error) {
      console.error('Erreur lors de la validation du succès:', error);
      alert(error.message || 'Erreur lors de la validation du succès');
    } finally {
      setValidatingAchievement(null);
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
          
          <div className="action-buttons">
            <button 
              className="check-all-button"
              onClick={checkAllAchievements}
              disabled={checkingAll}
            >
              {checkingAll ? 'Vérification...' : '🔍 Vérifier tous les succès'}
            </button>
          </div>
        </div>

        <div className="achievements-grid">
          <div className="red-dot-right"></div>
          {getFilteredAchievements().map((achievement) => (
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

              {/* Bouton de validation */}
              {!achievement.isUnlocked && achievement.percentage >= 100 && (
                <div className="achievement-actions">
                  <button
                    className="validate-button"
                    onClick={() => validateAchievement(achievement._id)}
                    disabled={validatingAchievement === achievement._id}
                  >
                    {validatingAchievement === achievement._id ? 'Validation...' : 'Valider le succès'}
                  </button>
                </div>
              )}

              {/* Message si déjà débloqué */}
              {achievement.isUnlocked && (
                <div className="achievement-actions">
                  <span className="already-unlocked">✅ Déjà débloqué</span>
                </div>
              )}

              {/* Message si conditions non remplies */}
              {!achievement.isUnlocked && achievement.percentage < 100 && (
                <div className="achievement-actions">
                  <span className="conditions-not-met">
                    Conditions non remplies ({achievement.percentage}%)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Success;