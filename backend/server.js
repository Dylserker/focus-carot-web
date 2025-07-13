const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const achievementRoutes = require('./routes/achievementRoutes');

const app = express();
const PORT = 5000;

// Configuration de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Serveur backend opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/achievements', achievementRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Focus Carot Backend', 
    version: '1.0.0',
    status: 'running'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot')
.then(() => {
  console.log('✅ Connexion à MongoDB établie');
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 API disponible sur http://localhost:${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Le port ${PORT} est déjà utilisé. Essayez un autre port.`);
      console.log('💡 Vous pouvez modifier la variable PORT dans le fichier .env ou dans server.js');
    } else {
      console.error('❌ Erreur lors du démarrage du serveur:', err);
    }
    process.exit(1);
  });
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB:', err);
  process.exit(1);
});

module.exports = app; 