const express = require('express');
const { body } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const AchievementService = require('../services/achievementService');
const { auth, requireOwnership } = require('../middleware/auth');
const { handleValidationErrors, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(auth);

// Validation pour la création/mise à jour de tâches
const taskValidation = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Le titre doit contenir entre 1 et 255 caractères')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères')
    .trim(),
  body('status')
    .optional()
    .isIn(['à_faire', 'en_cours', 'terminée'])
    .withMessage('Statut invalide'),
  body('priority')
    .optional()
    .isIn(['basse', 'moyenne', 'haute'])
    .withMessage('Priorité invalide'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Date d\'échéance invalide'),
  handleValidationErrors
];

// Créer une nouvelle tâche
router.post('/', taskValidation, async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;
    
    const task = new Task({
      userId: req.user._id,
      title,
      description,
      status: status || 'à_faire',
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'moyenne'
    });

    await task.save();

    // Vérifier les achievements après création
    await AchievementService.checkTaskCompletionAchievements(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      task
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la tâche'
    });
  }
});

// Obtenir toutes les tâches de l'utilisateur connecté
router.get('/my-tasks', async (req, res) => {
  try {
    const { status, priority, dueDate } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDate) filters.dueDate = new Date(dueDate);

    const tasks = await Task.getTasksByUserId(req.user._id, filters);
    
    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tâches'
    });
  }
});

// Obtenir les tâches d'un utilisateur spécifique (pour les admins ou les parents)
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

    const { status, priority, dueDate } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDate) filters.dueDate = new Date(dueDate);

    const tasks = await Task.getTasksByUserId(req.params.userId, filters);
    
    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tâches'
    });
  }
});

// Obtenir une tâche spécifique
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('userId', 'username firstName lastName');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (task.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la tâche'
    });
  }
});

// Mettre à jour une tâche
router.put('/:id', validateObjectId('id'), taskValidation, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    const { title, description, status, dueDate, priority } = req.body;
    const oldStatus = task.status;
    
    // Mettre à jour la tâche
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority) task.priority = priority;

    // Si la tâche est marquée comme terminée, mettre à jour completedAt
    if (status === 'terminée' && oldStatus !== 'terminée') {
      task.completedAt = new Date();
    }

    await task.save();

    // Si la tâche vient d'être terminée, ajouter de l'expérience
    if (status === 'terminée' && oldStatus !== 'terminée') {
      const user = await User.findById(task.userId);
      if (user) {
        await user.addExperience(task.experienceReward);
        await user.updateStreak();
        
        // Vérifier les achievements
        await AchievementService.checkTaskCompletionAchievements(task.userId);
      }
    }

    res.json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      task
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la tâche'
    });
  }
});

// Supprimer une tâche
router.delete('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la tâche'
    });
  }
});

// Marquer une tâche comme terminée
router.patch('/:id/complete', validateObjectId('id'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }
    }

    if (task.status === 'terminée') {
      return res.status(400).json({
        success: false,
        message: 'La tâche est déjà terminée'
      });
    }

    await task.complete();

    // Ajouter de l'expérience à l'utilisateur
    const user = await User.findById(task.userId);
    if (user) {
      await user.addExperience(task.experienceReward);
      await user.updateStreak();
      
      // Vérifier les achievements
      await AchievementService.checkTaskCompletionAchievements(task.userId);
    }

    res.json({
      success: true,
      message: 'Tâche marquée comme terminée',
      task
    });
  } catch (error) {
    console.error('Erreur lors de la finalisation de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la finalisation de la tâche'
    });
  }
});

// Obtenir les statistiques des tâches
router.get('/stats/my-tasks', async (req, res) => {
  try {
    const stats = await Task.getUserTaskStats(req.user._id);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});



module.exports = router; 