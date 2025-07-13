const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const UserAchievement = require('../models/UserAchievement');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function cleanupCompleteTestData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les utilisateurs de test
    const testEmails = [
      'test-achievement@example.com',
      'test-complete@example.com'
    ];

    for (const email of testEmails) {
      const deletedUser = await User.findOneAndDelete({ email });
      
      if (deletedUser) {
        console.log(`✅ Utilisateur supprimé: ${deletedUser.username}`);
        
        // Supprimer les tâches associées
        const deletedTasks = await Task.deleteMany({ userId: deletedUser._id });
        console.log(`  - ${deletedTasks.deletedCount} tâches supprimées`);
        
        // Supprimer les UserAchievements associés
        const deletedAchievements = await UserAchievement.deleteMany({ userId: deletedUser._id });
        console.log(`  - ${deletedAchievements.deletedCount} UserAchievements supprimés`);
      } else {
        console.log(`ℹ️ Aucun utilisateur trouvé avec l'email: ${email}`);
      }
    }

    console.log('✅ Nettoyage terminé');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le nettoyage
cleanupCompleteTestData(); 