const mongoose = require('mongoose');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const AchievementService = require('../services/achievementService');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function testStatsRoute() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un utilisateur de test
    const testUser = new User({
      email: 'test-stats@example.com',
      password: 'password123',
      username: 'teststats',
      firstName: 'Test',
      lastName: 'Stats',
      role: 'user',
      progression: {
        level: 1,
        experiencePoints: 0,
        totalExperienceEarned: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date()
      }
    });

    await testUser.save();
    console.log('✅ Utilisateur de test créé:', testUser.username);

    // Tester la méthode getUserAchievementStats
    console.log('\n🔍 Test de getUserAchievementStats:');
    try {
      const stats = await AchievementService.getUserAchievementStats(testUser._id);
      console.log('✅ Statistiques récupérées avec succès:');
      console.log('- Total des succès:', stats.totalAchievements);
      console.log('- Succès débloqués:', stats.unlocked);
      console.log('- Taux de complétion:', stats.completionRate + '%');
      console.log('- Stats utilisateur:', {
        completedTasks: stats.userStats.completedTasks,
        level: stats.userStats.level,
        currentStreak: stats.userStats.currentStreak
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error.message);
    }

    // Tester la méthode getUserAchievementsWithProgress
    console.log('\n🔍 Test de getUserAchievementsWithProgress:');
    try {
      const achievements = await AchievementService.getUserAchievementsWithProgress(testUser._id);
      console.log(`✅ ${achievements.length} succès récupérés avec progrès`);
      
      achievements.slice(0, 3).forEach(achievement => {
        console.log(`- ${achievement.icon} ${achievement.name}: ${achievement.progress}/${achievement.maxProgress} (${achievement.percentage}%)`);
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des succès:', error.message);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le test
testStatsRoute(); 