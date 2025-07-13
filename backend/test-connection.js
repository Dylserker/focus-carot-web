const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔌 Test de connexion à MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('✅ Connexion à MongoDB réussie');
    
    // Test de récupération des succès
    const Achievement = require('./models/Achievement');
    const achievements = await Achievement.find({ isActive: true });
    console.log(`📋 ${achievements.length} succès trouvés dans la base de données`);
    
    // Test de récupération d'un utilisateur
    const User = require('./models/User');
    const users = await User.find().limit(1);
    if (users.length > 0) {
      console.log(`👤 Utilisateur de test trouvé: ${users[0].username} (ID: ${users[0]._id})`);
    } else {
      console.log('⚠️ Aucun utilisateur trouvé dans la base de données');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testConnection(); 