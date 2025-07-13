const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
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

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

// Middleware pour vérifier les rôles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur peut accéder à ses propres données
const requireOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[paramName];
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    // Les admins peuvent accéder à tout
    if (req.user.role === 'admin') {
      return next();
    }

    // Les utilisateurs normaux ne peuvent accéder qu'à leurs propres données
    if (req.user._id.toString() !== resourceId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Vous ne pouvez accéder qu\'à vos propres données'
      });
    }

    next();
  };
};

module.exports = {
  auth,
  requireRole,
  requireOwnership
}; 