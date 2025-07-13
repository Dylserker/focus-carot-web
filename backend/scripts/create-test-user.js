const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('✅ Connexion à MongoDB établie');

    // Vérifier si l'utilisateur de test existe déjà
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('⚠️ L\'utilisateur de test existe déjà');
      console.log('Email: test@example.com');
      console.log('Mot de passe: password123');
      return;
    }

    // Créer l'utilisateur de test
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    });

    await testUser.save();
    console.log('✅ Utilisateur de test créé avec succès');
    console.log('Email: test@example.com');
    console.log('Mot de passe: password123');
    console.log('Nom d\'utilisateur: testuser');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur de test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

createTestUser(); 