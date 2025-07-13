const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');

class AchievementService {
  // Vérifier et débloquer les succès basés sur les tâches complétées
  static async checkTaskCompletionAchievements(userId) {
    try {
      // Valider l'ID utilisateur
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('ID utilisateur invalide');
      }
      
      const user = await User.findById(userId);
      if (!user) return [];

      const achievements = await Achievement.find({ 
        type: 'taches_completees', 
        isActive: true 
      });

      const unlockedAchievements = [];

      for (const achievement of achievements) {
        const requiredTasks = achievement.criteria.requiredTasks;
        
        if (user.completedTasks >= requiredTasks) {
          try {
            const userAchievement = await UserAchievement.unlockAchievement(userId, achievement._id);
            unlockedAchievements.push(userAchievement);
            
            // Ajouter l'XP de récompense
            await User.findByIdAndUpdate(userId, {
              $inc: { experience: achievement.experienceReward }
            });
            
            console.log(`Succès débloqué: ${achievement.name} pour l'utilisateur ${userId}`);
          } catch (error) {
            if (error.message !== 'Achievement déjà débloqué') {
              console.error(`Erreur lors du déblocage du succès ${achievement.name}:`, error);
            }
          }
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès de tâches:', error);
      return [];
    }
  }

  // Vérifier et débloquer les succès basés sur le niveau
  static async checkLevelAchievements(userId) {
    try {
      // Valider l'ID utilisateur
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('ID utilisateur invalide');
      }
      
      const user = await User.findById(userId);
      if (!user) return [];

      const achievements = await Achievement.find({ 
        type: 'niveau_atteint', 
        isActive: true 
      });

      const unlockedAchievements = [];

      for (const achievement of achievements) {
        const requiredLevel = achievement.criteria.requiredLevel;
        
        if (user.level >= requiredLevel) {
          try {
            const userAchievement = await UserAchievement.unlockAchievement(userId, achievement._id);
            unlockedAchievements.push(userAchievement);
            
            // Ajouter l'XP de récompense
            await User.findByIdAndUpdate(userId, {
              $inc: { experience: achievement.experienceReward }
            });
            
            console.log(`Succès de niveau débloqué: ${achievement.name} pour l'utilisateur ${userId}`);
          } catch (error) {
            if (error.message !== 'Achievement déjà débloqué') {
              console.error(`Erreur lors du déblocage du succès ${achievement.name}:`, error);
            }
          }
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès de niveau:', error);
      return [];
    }
  }

  // Vérifier et débloquer les succès basés sur les jours consécutifs
  static async checkStreakAchievements(userId) {
    try {
      // Valider l'ID utilisateur
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('ID utilisateur invalide');
      }
      
      const user = await User.findById(userId);
      if (!user) return [];

      const achievements = await Achievement.find({ 
        type: 'jours_consecutifs', 
        isActive: true 
      });

      const unlockedAchievements = [];

      for (const achievement of achievements) {
        const requiredDays = achievement.criteria.requiredDays;
        
        if (user.currentStreak >= requiredDays) {
          try {
            const userAchievement = await UserAchievement.unlockAchievement(userId, achievement._id);
            unlockedAchievements.push(userAchievement);
            
            // Ajouter l'XP de récompense
            await User.findByIdAndUpdate(userId, {
              $inc: { experience: achievement.experienceReward }
            });
            
            console.log(`Succès de streak débloqué: ${achievement.name} pour l'utilisateur ${userId}`);
          } catch (error) {
            if (error.message !== 'Achievement déjà débloqué') {
              console.error(`Erreur lors du déblocage du succès ${achievement.name}:`, error);
            }
          }
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Erreur lors de la vérification des succès de streak:', error);
      return [];
    }
  }

  // Vérifier tous les types de succès pour un utilisateur
  static async checkAllAchievements(userId) {
    try {
      const taskAchievements = await this.checkTaskCompletionAchievements(userId);
      const levelAchievements = await this.checkLevelAchievements(userId);
      const streakAchievements = await this.checkStreakAchievements(userId);

      return {
        taskAchievements,
        levelAchievements,
        streakAchievements,
        total: taskAchievements.length + levelAchievements.length + streakAchievements.length
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de tous les succès:', error);
      return { taskAchievements: [], levelAchievements: [], streakAchievements: [], total: 0 };
    }
  }

  // Obtenir tous les succès avec le progrès de l'utilisateur
  static async getUserAchievementsWithProgress(userId) {
    try {
      // Valider l'ID utilisateur
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('ID utilisateur invalide');
      }
      
      const user = await User.findById(userId);
      if (!user) return [];

      const achievements = await Achievement.getActiveAchievements();
      const userAchievements = await UserAchievement.find({ userId });

      return achievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => 
          ua.achievementId.toString() === achievement._id.toString()
        );

        let progress = 0;
        let maxProgress = 1;
        let isUnlocked = false;

        if (userAchievement) {
          progress = userAchievement.progress;
          maxProgress = userAchievement.maxProgress;
          isUnlocked = userAchievement.isUnlocked;
        } else {
          // Calculer le progrès actuel
          switch (achievement.type) {
            case 'taches_completees':
              progress = Math.min(user.completedTasks, achievement.criteria.requiredTasks);
              maxProgress = achievement.criteria.requiredTasks;
              break;
            case 'niveau_atteint':
              progress = Math.min(user.level, achievement.criteria.requiredLevel);
              maxProgress = achievement.criteria.requiredLevel;
              break;
            case 'jours_consecutifs':
              progress = Math.min(user.currentStreak, achievement.criteria.requiredDays);
              maxProgress = achievement.criteria.requiredDays;
              break;
            default:
              progress = 0;
              maxProgress = 1;
          }
        }

        return {
          ...achievement.toObject(),
          progress,
          maxProgress,
          isUnlocked,
          percentage: Math.round((progress / maxProgress) * 100)
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des succès utilisateur:', error);
      return [];
    }
  }

  // Obtenir les statistiques des succès d'un utilisateur
  static async getUserAchievementStats(userId) {
    try {
      // Valider l'ID utilisateur
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('ID utilisateur invalide');
      }
      
      const stats = await UserAchievement.getUserAchievementStats(userId);
      const totalAchievements = await Achievement.countDocuments({ isActive: true });
      
      return {
        ...stats,
        totalAchievements,
        completionRate: totalAchievements > 0 ? Math.round((stats.unlocked / totalAchievements) * 100) : 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total: 0,
        unlocked: 0,
        totalProgress: 0,
        totalMaxProgress: 0,
        totalAchievements: 0,
        completionRate: 0
      };
    }
  }
}

module.exports = AchievementService; 