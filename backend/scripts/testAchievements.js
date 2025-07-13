const mongoose = require('mongoose');
const AchievementService = require('../services/achievementService');
const User = require('../models/User');
const Task = require('../models/Task');
require('dotenv').config();

async function testAchievements() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('✅ Connexion à MongoDB établie');

    // Trouver un utilisateur de test
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Utilisateur de test non trouvé. Création d\'un utilisateur de test...');
      return;
    }

    console.log(`👤 Utilisateur de test: ${testUser.username} (ID: ${testUser._id})`);
    console.log(`📊 Stats actuelles:`);
    console.log(`   - Niveau: ${testUser.level}`);
    console.log(`   - XP: ${testUser.experience}`);
    console.log(`   - Tâches complétées: ${testUser.completedTasks}`);
    console.log(`   - Streak actuel: ${testUser.currentStreak}`);

    // Test 1: Vérifier les succès existants
    console.log('\n🔍 Test 1: Vérification des succès existants...');
    const achievements = await AchievementService.getUserAchievementsWithProgress(testUser._id);
    console.log(`📋 ${achievements.length} succès trouvés`);

    // Afficher les succès par type
    const byType = achievements.reduce((acc, achievement) => {
      if (!acc[achievement.type]) acc[achievement.type] = [];
      acc[achievement.type].push(achievement);
      return acc;
    }, {});

    Object.entries(byType).forEach(([type, typeAchievements]) => {
      console.log(`   ${type}: ${typeAchievements.length} succès`);
      typeAchievements.forEach(achievement => {
        const status = achievement.isUnlocked ? '✅' : '⏳';
        console.log(`     ${status} ${achievement.name} (${achievement.progress}/${achievement.maxProgress})`);
      });
    });

    // Test 2: Vérifier les statistiques
    console.log('\n📊 Test 2: Statistiques des succès...');
    const stats = await AchievementService.getUserAchievementStats(testUser._id);
    console.log(`   - Total: ${stats.totalAchievements}`);
    console.log(`   - Débloqués: ${stats.unlocked}`);
    console.log(`   - Taux de complétion: ${stats.completionRate}%`);

    // Test 3: Vérifier tous les succès
    console.log('\n🔍 Test 3: Vérification automatique de tous les succès...');
    const checkResult = await AchievementService.checkAllAchievements(testUser._id);
    console.log(`   - Succès de tâches débloqués: ${checkResult.taskAchievements.length}`);
    console.log(`   - Succès de niveau débloqués: ${checkResult.levelAchievements.length}`);
    console.log(`   - Succès de streak débloqués: ${checkResult.streakAchievements.length}`);
    console.log(`   - Total nouveau: ${checkResult.total}`);

    // Test 4: Simuler une tâche complétée
    console.log('\n📝 Test 4: Simulation d\'une tâche complétée...');
    
    // Créer une tâche de test
    const testTask = new Task({
      userId: testUser._id,
      title: 'Tâche de test pour succès',
      description: 'Tâche créée pour tester le système de succès',
      status: 'terminée',
      priority: 'moyenne',
      completedAt: new Date(),
      experienceReward: 25
    });
    await testTask.save();
    console.log('   ✅ Tâche de test créée');

    // Mettre à jour les stats de l'utilisateur
    testUser.completedTasks += 1;
    testUser.experience += testTask.experienceReward;
    await testUser.save();
    console.log('   ✅ Stats utilisateur mises à jour');

    // Vérifier les succès de tâches
    console.log('   🔍 Vérification des succès de tâches...');
    const taskAchievements = await AchievementService.checkTaskCompletionAchievements(testUser._id);
    console.log(`   ✅ ${taskAchievements.length} nouveau(x) succès de tâches débloqué(s)`);

    // Test 5: Vérifier les succès de niveau
    console.log('\n⭐ Test 5: Vérification des succès de niveau...');
    const levelAchievements = await AchievementService.checkLevelAchievements(testUser._id);
    console.log(`   ✅ ${levelAchievements.length} succès de niveau débloqué(s)`);

    // Test 6: Vérifier les succès de streak
    console.log('\n🔥 Test 6: Vérification des succès de streak...');
    const streakAchievements = await AchievementService.checkStreakAchievements(testUser._id);
    console.log(`   ✅ ${streakAchievements.length} succès de streak débloqué(s)`);

    // Test 7: Récupérer les succès mis à jour
    console.log('\n📋 Test 7: Récupération des succès mis à jour...');
    const updatedAchievements = await AchievementService.getUserAchievementsWithProgress(testUser._id);
    const unlockedCount = updatedAchievements.filter(a => a.isUnlocked).length;
    console.log(`   ✅ ${unlockedCount}/${updatedAchievements.length} succès débloqués`);

    // Nettoyer la tâche de test
    await Task.findByIdAndDelete(testTask._id);
    console.log('   🧹 Tâche de test supprimée');

    console.log('\n🎉 Tests terminés avec succès !');
    console.log('\n📋 Résumé:');
    console.log(`   - Utilisateur: ${testUser.username}`);
    console.log(`   - Succès total: ${updatedAchievements.length}`);
    console.log(`   - Succès débloqués: ${unlockedCount}`);
    console.log(`   - Taux de complétion: ${Math.round((unlockedCount / updatedAchievements.length) * 100)}%`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion à MongoDB fermée');
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testAchievements();
}

module.exports = testAchievements; 