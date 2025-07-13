const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const AchievementService = require('../services/achievementService');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function testCompleteAchievementSystem() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un utilisateur de test
    const testUser = new User({
      email: 'test-complete@example.com',
      password: 'password123',
      username: 'testcomplete',
      firstName: 'Test',
      lastName: 'Complete',
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

    // Créer quelques tâches complétées pour l'utilisateur
    const tasks = [
      {
        title: 'Tâche 1',
        description: 'Première tâche',
        userId: testUser._id,
        status: 'terminée',
        experienceReward: 10,
        completedAt: new Date()
      },
      {
        title: 'Tâche 2',
        description: 'Deuxième tâche',
        userId: testUser._id,
        status: 'terminée',
        experienceReward: 15,
        completedAt: new Date()
      },
      {
        title: 'Tâche 3',
        description: 'Troisième tâche',
        userId: testUser._id,
        status: 'terminée',
        experienceReward: 20,
        completedAt: new Date()
      }
    ];

    await Task.insertMany(tasks);
    console.log(`✅ ${tasks.length} tâches créées`);

    // Donner de l'XP à l'utilisateur pour atteindre le niveau 5
    await testUser.addExperience(250);
    console.log('✅ XP ajoutée à l\'utilisateur');

    // Mettre à jour le streak
    await testUser.updateStreak();
    console.log('✅ Streak mis à jour');

    // Afficher les statistiques initiales
    console.log('\n📊 Statistiques initiales:');
    const initialStats = await AchievementService.calculateUserStats(testUser._id);
    console.log('- Tâches complétées:', initialStats.completedTasks);
    console.log('- Niveau:', initialStats.level);
    console.log('- Streak:', initialStats.currentStreak);
    console.log('- XP totale:', initialStats.totalExperience);

    // Tester la récupération des succès avec progrès
    console.log('\n🎯 Récupération des succès avec progrès:');
    const achievementsWithProgress = await AchievementService.getUserAchievementsWithProgress(testUser._id);
    
    achievementsWithProgress.forEach(achievement => {
      console.log(`- ${achievement.icon} ${achievement.name}: ${achievement.progress}/${achievement.maxProgress} (${achievement.percentage}%)`);
    });

    // Tester la validation automatique de tous les succès
    console.log('\n🔍 Test de validation automatique:');
    const validationResult = await AchievementService.checkAllAchievements(testUser._id);
    console.log(`✅ ${validationResult.total} succès débloqués automatiquement`);

    if (validationResult.achievements.length > 0) {
      validationResult.achievements.forEach(item => {
        console.log(`  - ${item.achievement.name}: +${item.experienceGained} XP`);
      });
    }

    // Tester la validation manuelle d'un succès spécifique
    console.log('\n🎯 Test de validation manuelle:');
    const firstAchievement = achievementsWithProgress.find(a => !a.isUnlocked && a.percentage >= 100);
    
    if (firstAchievement) {
      try {
        const result = await UserAchievement.validateAchievement(testUser._id, firstAchievement._id);
        console.log(`✅ Succès validé manuellement: ${firstAchievement.name} (+${result.experienceGained} XP)`);
      } catch (error) {
        console.log(`❌ Erreur validation manuelle: ${error.message}`);
      }
    } else {
      console.log('ℹ️ Aucun succès disponible pour validation manuelle');
    }

    // Afficher les statistiques finales
    console.log('\n📊 Statistiques finales:');
    const finalStats = await AchievementService.calculateUserStats(testUser._id);
    console.log('- Tâches complétées:', finalStats.completedTasks);
    console.log('- Niveau:', finalStats.level);
    console.log('- Streak:', finalStats.currentStreak);
    console.log('- XP totale:', finalStats.totalExperience);

    const userAchievements = await UserAchievement.find({ userId: testUser._id, isUnlocked: true });
    console.log('- Succès débloqués:', userAchievements.length);

    // Afficher les statistiques des succès
    const achievementStats = await AchievementService.getUserAchievementStats(testUser._id);
    console.log('\n🏆 Statistiques des succès:');
    console.log('- Total des succès:', achievementStats.totalAchievements);
    console.log('- Succès débloqués:', achievementStats.unlocked);
    console.log('- Taux de complétion:', achievementStats.completionRate + '%');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le test
testCompleteAchievementSystem(); 