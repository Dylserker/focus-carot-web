const express = require('express');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');
const AchievementService = require('../services/achievementService');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(auth);

// Obtenir tous les succès avec le progrès de l'utilisateur
router.get('/user-progress', async (req, res) => {
  try {
    console.log('User object:', req.user);
    console.log('User ID:', req.user?._id);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }
    
    const achievements = await AchievementService.getUserAchievementsWithProgress(req.user._id);
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des succès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des succès'
    });
  }
});

// Obtenir les statistiques des succès de l'utilisateur
router.get('/stats', async (req, res) => {
  try {
    console.log('User object (stats):', req.user);
    console.log('User ID (stats):', req.user?._id);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }
    
    const stats = await AchievementService.getUserAchievementStats(req.user._id);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Vérifier et débloquer tous les succès pour l'utilisateur
router.post('/check-all', async (req, res) => {
  try {
    const result = await AchievementService.checkAllAchievements(req.user._id);
    res.json({
      success: true,
      data: result,
      message: `${result.total} nouveau(x) succès débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès'
    });
  }
});

// Vérifier spécifiquement les succès de tâches
router.post('/check-tasks', async (req, res) => {
  try {
    const achievements = await AchievementService.checkTaskCompletionAchievements(req.user._id);
    res.json({
      success: true,
      data: achievements,
      message: `${achievements.length} succès de tâches débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès de tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès de tâches'
    });
  }
});

// Vérifier spécifiquement les succès de niveau
router.post('/check-levels', async (req, res) => {
  try {
    const achievements = await AchievementService.checkLevelAchievements(req.user._id);
    res.json({
      success: true,
      data: achievements,
      message: `${achievements.length} succès de niveau débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès de niveau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès de niveau'
    });
  }
});

// Vérifier spécifiquement les succès de streak
router.post('/check-streaks', async (req, res) => {
  try {
    const achievements = await AchievementService.checkStreakAchievements(req.user._id);
    res.json({
      success: true,
      data: achievements,
      message: `${achievements.length} succès de streak débloqué(s) !`
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des succès de streak:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des succès de streak'
    });
  }
});

// Obtenir tous les achievements disponibles
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.getActiveAchievements();
    
    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des achievements'
    });
  }
});

// Obtenir les achievements par type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['taches_completees', 'niveau_atteint', 'jours_consecutifs', 'special'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type d\'achievement invalide'
      });
    }

    const achievements = await Achievement.getByType(type);
    
    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des achievements par type:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des achievements'
    });
  }
});

// Obtenir un achievement spécifique
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }

    res.json({
      success: true,
      achievement
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'achievement'
    });
  }
});

// Obtenir les achievements d'un utilisateur
router.get('/user/:userId', validateObjectId('userId'), async (req, res) => {
  try {
    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    const userAchievements = await UserAchievement.getUserAchievements(req.params.userId);
    
    res.json({
      success: true,
      userAchievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des achievements de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des achievements'
    });
  }
});

// Obtenir les achievements complétés d'un utilisateur
router.get('/user/:userId/completed', validateObjectId('userId'), async (req, res) => {
  try {
    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    const completedAchievements = await UserAchievement.getCompletedAchievements(req.params.userId);
    
    res.json({
      success: true,
      completedAchievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des achievements complétés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des achievements complétés'
    });
  }
});

// Débloquer un achievement pour un utilisateur
router.post('/user/:userId/unlock/:achievementId', validateObjectId('userId'), validateObjectId('achievementId'), async (req, res) => {
  try {
    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    const { userId, achievementId } = req.params;

    // Vérifier que l'achievement existe
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Débloquer l'achievement
    const userAchievement = await UserAchievement.unlockAchievement(userId, achievementId);

    // Ajouter l'expérience de récompense à l'utilisateur
    if (achievement.experienceReward > 0) {
      await user.addExperience(achievement.experienceReward);
    }

    res.json({
      success: true,
      message: 'Achievement débloqué avec succès',
      userAchievement,
      experienceReward: achievement.experienceReward
    });
  } catch (error) {
    console.error('Erreur lors du déblocage de l\'achievement:', error);
    
    if (error.message === 'Achievement non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }
    
    if (error.message === 'Achievement déjà débloqué') {
      return res.status(400).json({
        success: false,
        message: 'Achievement déjà débloqué'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors du déblocage de l\'achievement'
    });
  }
});

// Valider un succès spécifique (vérifier les conditions et donner l'XP)
router.post('/validate/:achievementId', validateObjectId('achievementId'), async (req, res) => {
  try {
    const { achievementId } = req.params;
    const userId = req.user._id;

    console.log(`Tentative de validation du succès ${achievementId} pour l'utilisateur ${userId}`);

    // Valider l'achievement et donner l'XP
    const result = await UserAchievement.validateAchievement(userId, achievementId);

    res.json({
      success: true,
      message: 'Succès validé avec succès !',
      data: {
        achievement: result.userAchievement,
        experienceGained: result.experienceGained,
        newLevel: result.newLevel,
        totalExperience: result.totalExperience
      }
    });
  } catch (error) {
    console.error('Erreur lors de la validation du succès:', error);
    
    if (error.message === 'Achievement non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Succès non trouvé'
      });
    }
    
    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    if (error.message === 'Achievement déjà débloqué') {
      return res.status(400).json({
        success: false,
        message: 'Ce succès est déjà débloqué'
      });
    }
    
    if (error.message === 'Conditions non remplies pour débloquer cet achievement') {
      return res.status(400).json({
        success: false,
        message: 'Vous ne remplissez pas encore les conditions pour débloquer ce succès'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation du succès'
    });
  }
});

// Mettre à jour le progrès d'un achievement
router.put('/user/:userId/progress/:achievementId', validateObjectId('userId'), validateObjectId('achievementId'), async (req, res) => {
  try {
    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    const { userId, achievementId } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0) {
      return res.status(400).json({
        success: false,
        message: 'Progrès invalide'
      });
    }

    // Mettre à jour le progrès
    const userAchievement = await UserAchievement.updateProgress(userId, achievementId, progress);

    res.json({
      success: true,
      message: 'Progrès mis à jour avec succès',
      userAchievement
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du progrès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du progrès'
    });
  }
});

// Obtenir les statistiques des achievements d'un utilisateur
router.get('/user/:userId/stats', validateObjectId('userId'), async (req, res) => {
  try {
    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    const [allAchievements, userAchievements, completedAchievements] = await Promise.all([
      Achievement.getActiveAchievements(),
      UserAchievement.getUserAchievements(req.params.userId),
      UserAchievement.getCompletedAchievements(req.params.userId)
    ]);

    const stats = {
      total: allAchievements.length,
      unlocked: completedAchievements.length,
      inProgress: userAchievements.filter(ua => !ua.completed).length,
      completionRate: allAchievements.length > 0 ? (completedAchievements.length / allAchievements.length) * 100 : 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Créer un nouvel achievement (admin seulement)
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, iconUrl, experienceReward, requiredValue, type } = req.body;

    if (!name || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Nom, description et type d\'achievement requis'
      });
    }

    const achievement = new Achievement({
      name,
      description,
      iconUrl,
      experienceReward: experienceReward || 0,
      requiredValue: requiredValue || 1,
      type,
      achievementType: type
    });

    await achievement.save();

    res.status(201).json({
      success: true,
      message: 'Achievement créé avec succès',
      achievement
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'achievement'
    });
  }
});

// Mettre à jour un achievement (admin seulement)
router.put('/:id', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, iconUrl, experienceReward, requiredValue, type, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (experienceReward !== undefined) updateData.experienceReward = experienceReward;
    if (requiredValue !== undefined) updateData.requiredValue = requiredValue;
    if (type) {
      updateData.type = type;
      updateData.achievementType = type;
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Achievement mis à jour avec succès',
      achievement
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'achievement'
    });
  }
});

// Supprimer un achievement (admin seulement)
router.delete('/:id', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }

    // Supprimer toutes les références à cet achievement
    await UserAchievement.deleteMany({ achievementId: req.params.id });

    res.json({
      success: true,
      message: 'Achievement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'achievement'
    });
  }
});

// Bloquer ou débloquer un succès (admin seulement)
router.patch('/:id/block', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const { blocked } = req.body;
    if (typeof blocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Le champ "blocked" doit être un booléen.'
      });
    }
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { blocked },
      { new: true, runValidators: true }
    );
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }
    res.json({
      success: true,
      message: `Succès ${blocked ? 'bloqué' : 'débloqué'} avec succès`,
      achievement
    });
  } catch (error) {
    console.error('Erreur lors du blocage/déblocage du succès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du blocage/déblocage du succès'
    });
  }
});

// Modifier le niveau d'un succès (admin seulement)
router.patch('/:id/level', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const { level } = req.body;
    if (typeof level !== 'number' || level < 1) {
      return res.status(400).json({
        success: false,
        message: 'Le champ "level" doit être un nombre positif.'
      });
    }
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { level },
      { new: true, runValidators: true }
    );
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement non trouvé'
      });
    }
    res.json({
      success: true,
      message: 'Niveau du succès modifié avec succès',
      achievement
    });
  } catch (error) {
    console.error('Erreur lors de la modification du niveau du succès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du niveau du succès'
    });
  }
});

module.exports = router; 