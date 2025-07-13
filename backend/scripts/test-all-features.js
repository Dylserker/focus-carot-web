const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
require('dotenv').config();

async function testAllFeatures() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('✅ Connexion à MongoDB établie');

    console.log('\n🧪 Test de toutes les fonctionnalités...\n');

    // 1. Test des utilisateurs
    console.log('1️⃣ Test des utilisateurs...');
    const users = await User.find().limit(5);
    console.log(`   - ${users.length} utilisateurs trouvés`);
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`   - Utilisateur test: ${testUser.username} (Niveau ${testUser.progression.level})`);
    }

    // 2. Test des tâches
    console.log('\n2️⃣ Test des tâches...');
    const tasks = await Task.find().limit(5);
    console.log(`   - ${tasks.length} tâches trouvées`);
    
    if (tasks.length > 0) {
      const taskStats = await Task.getUserTaskStats(users[0]._id);
      console.log(`   - Statistiques utilisateur: ${taskStats.completed}/${taskStats.total} tâches complétées`);
    }

    // 3. Test des achievements
    console.log('\n3️⃣ Test des achievements...');
    const achievements = await Achievement.find().limit(5);
    console.log(`   - ${achievements.length} achievements disponibles`);
    
    if (achievements.length > 0 && users.length > 0) {
      const userAchievements = await UserAchievement.getUserAchievements(users[0]._id);
      console.log(`   - ${userAchievements.length} achievements pour l'utilisateur test`);
    }

    // 4. Test de la progression
    console.log('\n4️⃣ Test de la progression...');
    if (users.length > 0) {
      const user = users[0];
      console.log(`   - Niveau actuel: ${user.progression.level}`);
      console.log(`   - Expérience: ${user.progression.experiencePoints} XP`);
      console.log(`   - Streak actuel: ${user.progression.currentStreak} jours`);
      console.log(`   - Streak le plus long: ${user.progression.longestStreak} jours`);
    }

    // 5. Test de création d'une tâche
    console.log('\n5️⃣ Test de création d\'une tâche...');
    if (users.length > 0) {
      const newTask = new Task({
        userId: users[0]._id,
        title: 'Tâche de test',
        description: 'Description de test',
        status: 'à_faire',
        priority: 'moyenne'
      });
      
      await newTask.save();
      console.log('   - ✅ Tâche de test créée avec succès');
      
      // Supprimer la tâche de test
      await Task.findByIdAndDelete(newTask._id);
      console.log('   - ✅ Tâche de test supprimée');
    }

    // 6. Test d'ajout d'expérience
    console.log('\n6️⃣ Test d\'ajout d\'expérience...');
    if (users.length > 0) {
      const user = users[0];
      const oldExp = user.progression.experiencePoints;
      const oldLevel = user.progression.level;
      
      await user.addExperience(50);
      console.log(`   - Expérience avant: ${oldExp} XP (Niveau ${oldLevel})`);
      console.log(`   - Expérience après: ${user.progression.experiencePoints} XP (Niveau ${user.progression.level})`);
    }

    console.log('\n✅ Tous les tests sont passés avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - Utilisateurs: ${await User.countDocuments()}`);
    console.log(`   - Tâches: ${await Task.countDocuments()}`);
    console.log(`   - Achievements: ${await Achievement.countDocuments()}`);
    console.log(`   - UserAchievements: ${await UserAchievement.countDocuments()}`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnexion de MongoDB');
  }
}

testAllFeatures(); 