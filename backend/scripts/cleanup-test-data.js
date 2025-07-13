const mongoose = require('mongoose');
const User = require('../models/User');
const UserAchievement = require('../models/UserAchievement');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function cleanupTestData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer l'utilisateur de test
    const deletedUser = await User.findOneAndDelete({ 
      email: 'test-achievement@example.com' 
    });

    if (deletedUser) {
      console.log('✅ Utilisateur de test supprimé:', deletedUser.username);
      
      // Supprimer les UserAchievements associés
      const deletedAchievements = await UserAchievement.deleteMany({ 
        userId: deletedUser._id 
      });
      console.log(`✅ ${deletedAchievements.deletedCount} UserAchievements supprimés`);
    } else {
      console.log('ℹ️ Aucun utilisateur de test trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le nettoyage
cleanupTestData(); 