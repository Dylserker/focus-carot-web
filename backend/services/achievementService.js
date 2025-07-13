const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const Task = require('../models/Task');

class AchievementService {
  // Calculer les statistiques complètes d'un utilisateur
  static async calculateUserStats(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Compter les tâches complétées
    const completedTasksCount = await Task.countDocuments({
      userId: userId,
      status: 'terminée'
    });

    // Calculer les statistiques
    const stats = {
      completedTasks: completedTasksCount,
      level: user.progression.level,
      currentStreak: user.progression.currentStreak,
      longestStreak: user.progression.longestStreak,
      totalExperience: user.progression.experiencePoints,
      totalExperienceEarned: user.progression.totalExperienceEarned,
      accountCreatedAt: user.createdAt,
      lastActivityDate: user.progression.lastActivityDate
    };

    return stats;
  }

  // Obtenir tous les succès avec le progrès de l'utilisateur
  static async getUserAchievementsWithProgress(userId) {
    const userStats = await this.calculateUserStats(userId);
    const achievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ userId });

    // Créer un map des UserAchievements existants
    const userAchievementMap = new Map();
    userAchievements.forEach(ua => {
      userAchievementMap.set(ua.achievementId.toString(), ua);
    });

    // Calculer le progrès pour chaque achievement
    const achievementsWithProgress = achievements.map(achievement => {
      const userAchievement = userAchievementMap.get(achievement._id.toString());
      const progress = this.calculateAchievementProgress(achievement, userStats);
      const maxProgress = this.getMaxProgress(achievement);
      const percentage = maxProgress > 0 ? Math.min(100, (progress / maxProgress) * 100) : 0;

      return {
        ...achievement.toObject(),
        progress,
        maxProgress,
        percentage: Math.round(percentage),
        isUnlocked: userAchievement ? userAchievement.isUnlocked : false,
        unlockedAt: userAchievement ? userAchievement.unlockedAt : null
      };
    });

    return achievementsWithProgress;
  }

  // Calculer le progrès pour un achievement spécifique
  static calculateAchievementProgress(achievement, userStats) {
    switch (achievement.type) {
      case 'taches_completees':
        return Math.min(userStats.completedTasks, achievement.criteria.requiredTasks);
      
      case 'niveau_atteint':
        return Math.min(userStats.level, achievement.criteria.requiredLevel);
      
      case 'jours_consecutifs':
        return Math.min(userStats.currentStreak, achievement.criteria.requiredDays);
      
      case 'special':
        return this.calculateSpecialProgress(achievement, userStats);
      
      default:
        return 0;
    }
  }

  // Calculer le progrès maximum pour un achievement
  static getMaxProgress(achievement) {
    switch (achievement.type) {
      case 'taches_completees':
        return achievement.criteria.requiredTasks;
      
      case 'niveau_atteint':
        return achievement.criteria.requiredLevel;
      
      case 'jours_consecutifs':
        return achievement.criteria.requiredDays;
      
      case 'special':
        return 1; // Les succès spéciaux sont binaires
      
      default:
        return 1;
    }
  }

  // Calculer le progrès pour les succès spéciaux
  static calculateSpecialProgress(achievement, userStats) {
    switch (achievement.criteria.action) {
      case 'account_creation':
        // Toujours débloqué si l'utilisateur existe
        return 1;
      
      case 'explore_all_pages':
        // Pour l'instant, on considère que c'est toujours 0
        // À implémenter avec un système de tracking des pages visitées
        return 0;
      
      default:
        return 0;
    }
  }

  // Vérifier si un utilisateur peut débloquer un achievement
  static canUnlockAchievement(achievement, userStats) {
    const progress = this.calculateAchievementProgress(achievement, userStats);
    const maxProgress = this.getMaxProgress(achievement);
    return progress >= maxProgress;
  }

  // Vérifier et débloquer tous les succès pour un utilisateur
  static async checkAllAchievements(userId) {
    const userStats = await this.calculateUserStats(userId);
    const achievements = await Achievement.find({ isActive: true });
    const unlockedAchievements = [];

    for (const achievement of achievements) {
      // Vérifier si l'achievement est déjà débloqué
      const existingUserAchievement = await UserAchievement.findOne({
        userId,
        achievementId: achievement._id
      });

      if (existingUserAchievement && existingUserAchievement.isUnlocked) {
        continue; // Déjà débloqué
      }

      // Vérifier si l'utilisateur peut débloquer cet achievement
      if (this.canUnlockAchievement(achievement, userStats)) {
        try {
          const result = await UserAchievement.validateAchievement(userId, achievement._id);
          unlockedAchievements.push({
            achievement: achievement,
            experienceGained: result.experienceGained
          });
        } catch (error) {
          console.error(`Erreur lors du déblocage de ${achievement.name}:`, error.message);
        }
      }
    }

    return {
      total: unlockedAchievements.length,
      achievements: unlockedAchievements
    };
  }

  // Vérifier spécifiquement les succès de tâches
  static async checkTaskCompletionAchievements(userId) {
    const userStats = await this.calculateUserStats(userId);
    const taskAchievements = await Achievement.find({
      type: 'taches_completees',
      isActive: true
    });

    const unlockedAchievements = [];

    for (const achievement of taskAchievements) {
      const existingUserAchievement = await UserAchievement.findOne({
        userId,
        achievementId: achievement._id
      });

      if (existingUserAchievement && existingUserAchievement.isUnlocked) {
        continue;
      }

      if (this.canUnlockAchievement(achievement, userStats)) {
        try {
          const result = await UserAchievement.validateAchievement(userId, achievement._id);
          unlockedAchievements.push({
            achievement: achievement,
            experienceGained: result.experienceGained
          });
        } catch (error) {
          console.error(`Erreur lors du déblocage de ${achievement.name}:`, error.message);
        }
      }
    }

    return unlockedAchievements;
  }

  // Vérifier spécifiquement les succès de niveau
  static async checkLevelAchievements(userId) {
    const userStats = await this.calculateUserStats(userId);
    const levelAchievements = await Achievement.find({
      type: 'niveau_atteint',
      isActive: true
    });

    const unlockedAchievements = [];

    for (const achievement of levelAchievements) {
      const existingUserAchievement = await UserAchievement.findOne({
        userId,
        achievementId: achievement._id
      });

      if (existingUserAchievement && existingUserAchievement.isUnlocked) {
        continue;
      }

      if (this.canUnlockAchievement(achievement, userStats)) {
        try {
          const result = await UserAchievement.validateAchievement(userId, achievement._id);
          unlockedAchievements.push({
            achievement: achievement,
            experienceGained: result.experienceGained
          });
        } catch (error) {
          console.error(`Erreur lors du déblocage de ${achievement.name}:`, error.message);
        }
      }
    }

    return unlockedAchievements;
  }

  // Vérifier spécifiquement les succès de streak
  static async checkStreakAchievements(userId) {
    const userStats = await this.calculateUserStats(userId);
    const streakAchievements = await Achievement.find({
      type: 'jours_consecutifs',
      isActive: true
    });

    const unlockedAchievements = [];

    for (const achievement of streakAchievements) {
      const existingUserAchievement = await UserAchievement.findOne({
        userId,
        achievementId: achievement._id
      });

      if (existingUserAchievement && existingUserAchievement.isUnlocked) {
        continue;
      }

      if (this.canUnlockAchievement(achievement, userStats)) {
        try {
          const result = await UserAchievement.validateAchievement(userId, achievement._id);
          unlockedAchievements.push({
            achievement: achievement,
            experienceGained: result.experienceGained
          });
        } catch (error) {
          console.error(`Erreur lors du déblocage de ${achievement.name}:`, error.message);
        }
      }
    }

    return unlockedAchievements;
  }

  // Obtenir les statistiques des succès d'un utilisateur
  static async getUserAchievementStats(userId) {
    const userStats = await this.calculateUserStats(userId);
    const achievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ userId, isUnlocked: true });

    const totalAchievements = achievements.length;
    const unlockedAchievements = userAchievements.length;
    const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

    return {
      totalAchievements,
      unlocked: unlockedAchievements,
      completionRate: Math.round(completionRate),
      userStats
    };
  }
}

module.exports = AchievementService; 