const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Task = require('../models/Task');
const UserAchievement = require('../models/UserAchievement');
const { auth, requireRole, requireOwnership } = require('../middleware/auth');
const { handleValidationErrors, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(auth);

// Validation pour la mise à jour du profil
const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères')
    .trim(),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .trim(),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La bio ne peut pas dépasser 500 caractères'),
  body('profile.gender')
    .optional()
    .isIn(['homme', 'femme', 'autre', 'non_specifie'])
    .withMessage('Genre invalide'),
  handleValidationErrors
];

// Obtenir tous les utilisateurs (admin seulement)
router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

// Créer un nouvel utilisateur (admin seulement)
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { email, username, firstName, lastName, password, role } = req.body;

    // Validation des champs requis
    if (!email || !username || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Ce nom d\'utilisateur est déjà utilisé'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      email,
      username,
      firstName,
      lastName,
      password,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur'
    });
  }
});

// Obtenir un utilisateur par ID
router.get('/:id', validateObjectId('id'), requireOwnership('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur'
    });
  }
});

// Obtenir le profil d'un utilisateur
router.get('/:id/profile', validateObjectId('id'), requireOwnership('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName profile avatarUrl progression settings')
      .populate('progression');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile,
        avatarUrl: user.avatarUrl,
        progression: user.progression,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// Mettre à jour le profil d'un utilisateur
router.put('/:id/profile', validateObjectId('id'), requireOwnership('id'), updateProfileValidation, async (req, res) => {
  try {
    const { firstName, lastName, profile, settings } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profile) updateData.profile = profile;
    if (settings) updateData.settings = settings;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// Obtenir la progression d'un utilisateur
router.get('/:id/progression', validateObjectId('id'), requireOwnership('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('progression');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      progression: user.progression
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la progression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la progression'
    });
  }
});

// Mettre à jour la progression d'un utilisateur
router.put('/:id/progression', validateObjectId('id'), requireOwnership('id'), async (req, res) => {
  try {
    const { experiencePoints, currentStreak } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (experiencePoints) {
      await user.addExperience(experiencePoints);
    }

    if (currentStreak !== undefined) {
      user.progression.currentStreak = currentStreak;
      if (currentStreak > user.progression.longestStreak) {
        user.progression.longestStreak = currentStreak;
      }
      await user.save();
    }

    res.json({
      success: true,
      message: 'Progression mise à jour avec succès',
      progression: user.progression
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la progression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la progression'
    });
  }
});

// Ajouter de l'expérience à un utilisateur
router.post('/:id/experience', validateObjectId('id'), requireOwnership('id'), async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Montant d\'expérience invalide'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    await user.addExperience(amount);

    res.json({
      success: true,
      message: 'Expérience ajoutée avec succès',
      progression: user.progression
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'expérience:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout d\'expérience'
    });
  }
});

// Obtenir les statistiques d'un utilisateur
router.get('/:id/stats', validateObjectId('id'), requireOwnership('id'), async (req, res) => {
  try {
    const [user, taskStats] = await Promise.all([
      User.findById(req.params.id).select('progression'),
      Task.getUserTaskStats(req.params.id)
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      stats: {
        progression: user.progression,
        tasks: taskStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Mettre à jour un utilisateur (admin seulement)
router.put('/:id', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const { email, username, firstName, lastName, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }
    }

    // Vérifier si le nom d'utilisateur existe déjà (sauf pour cet utilisateur)
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: req.params.id } });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'Ce nom d\'utilisateur est déjà utilisé'
        });
      }
    }

    // Mettre à jour l'utilisateur
    if (email) user.email = email;
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur'
    });
  }
});

// Supprimer un utilisateur (admin seulement)
router.delete('/:id', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher la suppression de son propre compte
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
});

// Obtenir les achievements d'un utilisateur
router.get('/:id/achievements', validateObjectId('id'), requireRole(['admin']), async (req, res) => {
  try {
    const userAchievements = await UserAchievement.getUserAchievements(req.params.id);
    
    res.json({
      success: true,
      userAchievements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des achievements'
    });
  }
});

module.exports = router; 