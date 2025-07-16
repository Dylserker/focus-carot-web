const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .toLowerCase()
    .trim(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  body('firstName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères')
    .trim(),
  body('lastName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .trim(),
  handleValidationErrors
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .toLowerCase()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis'),
  handleValidationErrors
];

// Route d'inscription
router.post('/register', registerValidation, async (req, res) => {
  try {
    console.log('Données reçues pour inscription:', req.body);
    const { email, password, username, firstName, lastName } = req.body;

    // Vérifier si tous les champs requis sont présents
    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis',
        missing: {
          email: !email,
          password: !password,
          username: !username,
          firstName: !firstName,
          lastName: !lastName
        }
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
      password,
      username,
      firstName,
      lastName,
      role: 'user' // Rôle par défaut
    });

    await user.save();

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: user.toPublicJSON(),
      token
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route de connexion
router.post('/login', loginValidation, async (req, res) => {
  try {
    console.log('Tentative de connexion pour:', req.body.email);
    const { email, password } = req.body;

    // Vérifier si les champs sont présents
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé pour email:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Mot de passe incorrect pour email:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('Connexion réussie pour:', email);

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      user: user.toPublicJSON(),
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour vérifier le token (optionnelle)
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: user.toPublicJSON()
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

// Route de déconnexion
router.post('/logout', async (req, res) => {
  try {
    // Pour une déconnexion côté serveur, on peut simplement répondre avec succès
    // Le client devra supprimer le token localement
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion'
    });
  }
});

module.exports = router; 