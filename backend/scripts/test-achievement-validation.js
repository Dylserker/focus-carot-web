const mongoose = require('mongoose');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function testAchievementValidation() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un utilisateur de test avec de l'XP
    const testUser = new User({
      email: 'test-achievement@example.com',
      password: 'password123',
      username: 'testachievement',
      firstName: 'Test',
      lastName: 'Achievement',
      role: 'user',
      progression: {
        level: 5,
        experiencePoints: 2500,
        totalExperienceEarned: 2500,
        currentStreak: 7,
        longestStreak: 10,
        lastActivityDate: new Date()
      }
    });

    await testUser.save();
    console.log('✅ Utilisateur de test créé:', testUser.username);

    // Récupérer tous les succès
    const achievements = await Achievement.find({ isActive: true });
    console.log(`✅ ${achievements.length} succès trouvés`);

    // Tester la validation de chaque succès
    for (const achievement of achievements) {
      console.log(`\n🔍 Test du succès: ${achievement.name}`);
      
      try {
        const result = await UserAchievement.validateAchievement(testUser._id, achievement._id);
        console.log(`✅ Succès validé ! XP gagné: ${result.experienceGained}`);
      } catch (error) {
        console.log(`❌ Erreur: ${error.message}`);
      }
    }

    // Afficher les statistiques finales
    const finalUser = await User.findById(testUser._id);
    console.log(`\n📊 Statistiques finales:`);
    console.log(`- Niveau: ${finalUser.progression.level}`);
    console.log(`- XP totale: ${finalUser.progression.experiencePoints}`);
    console.log(`- XP gagnée: ${finalUser.progression.totalExperienceEarned}`);

    const userAchievements = await UserAchievement.find({ userId: testUser._id, isUnlocked: true });
    console.log(`- Succès débloqués: ${userAchievements.length}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le test
testAchievementValidation(); 