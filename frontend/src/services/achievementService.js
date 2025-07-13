import apiService from './api';

class AchievementService {
  // Obtenir tous les succès avec le progrès de l'utilisateur
  static async getUserAchievementsWithProgress() {
    try {
      const response = await apiService.getUserAchievementsWithProgress();
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des succès:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des succès de l'utilisateur
  static async getUserAchievementStats() {
    try {
      const response = await apiService.getAchievementStats();
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Vérifier et débloquer tous les succès pour l'utilisateur
  static async checkAllAchievements() {
    try {
      const response = await apiService.checkAllAchievements();
      return response;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès:', error);
      throw error;
    }
  }

  // Vérifier spécifiquement les succès de tâches
  static async checkTaskAchievements() {
    try {
      const response = await apiService.checkTaskAchievements();
      return response;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès de tâches:', error);
      throw error;
    }
  }

  // Vérifier spécifiquement les succès de niveau
  static async checkLevelAchievements() {
    try {
      const response = await apiService.checkLevelAchievements();
      return response;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès de niveau:', error);
      throw error;
    }
  }

  // Vérifier spécifiquement les succès de streak
  static async checkStreakAchievements() {
    try {
      const response = await apiService.checkStreakAchievements();
      return response;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès de streak:', error);
      throw error;
    }
  }

  // Obtenir les icônes par type de succès
  static getAchievementIcon(type, rarity = 'common') {
    const icons = {
      taches_completees: {
        common: '📝',
        rare: '📋',
        epic: '📚',
        legendary: '🏆'
      },
      niveau_atteint: {
        common: '⭐',
        rare: '🌟',
        epic: '💫',
        legendary: '👑'
      },
      jours_consecutifs: {
        common: '🔥',
        rare: '⚡',
        epic: '💎',
        legendary: '💫'
      },
      special: {
        common: '🎯',
        rare: '🎪',
        epic: '🎭',
        legendary: '🏅'
      }
    };

    return icons[type]?.[rarity] || '🏆';
  }

  // Obtenir la couleur par rareté
  static getAchievementColor(rarity) {
    const colors = {
      common: '#6c757d',
      rare: '#007bff',
      epic: '#6f42c1',
      legendary: '#fd7e14'
    };

    return colors[rarity] || colors.common;
  }

  // Obtenir le nom du type en français
  static getTypeName(type) {
    const types = {
      taches_completees: 'Tâches complétées',
      niveau_atteint: 'Niveau atteint',
      jours_consecutifs: 'Jours consécutifs',
      special: 'Spécial'
    };

    return types[type] || type;
  }

  // Formater la description avec les valeurs
  static formatDescription(achievement) {
    let description = achievement.description;
    
    switch (achievement.type) {
      case 'taches_completees':
        description = description.replace('{requiredTasks}', achievement.criteria.requiredTasks);
        break;
      case 'niveau_atteint':
        description = description.replace('{requiredLevel}', achievement.criteria.requiredLevel);
        break;
      case 'jours_consecutifs':
        description = description.replace('{requiredDays}', achievement.criteria.requiredDays);
        break;
      default:
        // Pas de modification pour les autres types
        break;
    }

    return description;
  }

  // Valider un succès spécifique
  static async validateAchievement(achievementId) {
    try {
      const response = await apiService.validateAchievement(achievementId);
      return response;
    } catch (error) {
      console.error('Erreur lors de la validation du succès:', error);
      throw error;
    }
  }
}

export default AchievementService;