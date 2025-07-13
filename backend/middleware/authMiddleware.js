const { auth } = require('./auth');

// Middleware d'authentification pour les routes des succès
const authMiddleware = auth;

module.exports = authMiddleware; 