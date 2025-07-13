const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot';

async function testAdminFeatures() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Créer un utilisateur admin de test
    console.log('\n🔧 Création d\'un utilisateur admin...');
    const adminUser = new User({
      email: 'admin@test.com',
      username: 'admin_test',
      firstName: 'Admin',
      lastName: 'Test',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Utilisateur admin créé:', adminUser._id);

    // 2. Créer quelques utilisateurs de test
    console.log('\n👥 Création d\'utilisateurs de test...');
    const testUsers = [];
    for (let i = 1; i <= 3; i++) {
      const user = new User({
        email: `user${i}@test.com`,
        username: `user${i}_test`,
        firstName: `Prénom${i}`,
        lastName: `Nom${i}`,
        password: 'password123',
        role: 'user'
      });
      await user.save();
      testUsers.push(user);
      console.log(`✅ Utilisateur ${i} créé:`, user._id);
    }

    // 3. Créer quelques tâches de test
    console.log('\n📝 Création de tâches de test...');
    const testTasks = [];
    for (let i = 0; i < testUsers.length; i++) {
      for (let j = 1; j <= 2; j++) {
        const task = new Task({
          userId: testUsers[i]._id,
          title: `Tâche ${j} de ${testUsers[i].username}`,
          description: `Description de la tâche ${j}`,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
        await task.save();
        testTasks.push(task);
      }
    }
    console.log(`✅ ${testTasks.length} tâches créées`);

    // 4. Créer quelques achievements de test
    console.log('\n🏆 Création d\'achievements de test...');
    const testAchievements = [];
    const achievementData = [
      {
        name: 'Première tâche',
        description: 'Compléter votre première tâche',
        icon: '🎯',
        type: 'taches_completees',
        requirement: 1,
        experienceReward: 10
      },
      {
        name: 'Niveau 5',
        description: 'Atteindre le niveau 5',
        icon: '⭐',
        type: 'niveau_atteint',
        requirement: 5,
        experienceReward: 50
      },
      {
        name: '7 jours consécutifs',
        description: 'Se connecter 7 jours de suite',
        icon: '🔥',
        type: 'jours_consecutifs',
        requirement: 7,
        experienceReward: 100
      }
    ];

    for (const data of achievementData) {
      const achievement = new Achievement(data);
      await achievement.save();
      testAchievements.push(achievement);
      console.log(`✅ Achievement créé: ${achievement.name}`);
    }

    // 5. Débloquer quelques achievements pour les utilisateurs
    console.log('\n🔓 Déblocage d\'achievements...');
    for (let i = 0; i < testUsers.length; i++) {
      const userAchievement = new UserAchievement({
        userId: testUsers[i]._id,
        achievementId: testAchievements[0]._id,
        isUnlocked: true,
        unlockedAt: new Date(),
        progress: 100
      });
      await userAchievement.save();
      console.log(`✅ Achievement débloqué pour ${testUsers[i].username}`);
    }

    // 6. Afficher les statistiques
    console.log('\n📊 Statistiques:');
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalAchievements = await Achievement.countDocuments();
    const totalUserAchievements = await UserAchievement.countDocuments();

    console.log(`- Utilisateurs: ${totalUsers}`);
    console.log(`- Tâches: ${totalTasks}`);
    console.log(`- Achievements: ${totalAchievements}`);
    console.log(`- User Achievements: ${totalUserAchievements}`);

    // 7. Test des fonctionnalités admin
    console.log('\n🔧 Test des fonctionnalités admin...');
    
    // Récupérer tous les utilisateurs
    const allUsers = await User.find().select('-password');
    console.log(`✅ Récupération de ${allUsers.length} utilisateurs`);

    // Récupérer les achievements d'un utilisateur
    const userAchievements = await UserAchievement.getUserAchievements(testUsers[0]._id);
    console.log(`✅ Récupération de ${userAchievements.length} achievements pour ${testUsers[0].username}`);

    // Récupérer la progression d'un utilisateur
    const userProgression = testUsers[0].progression;
    console.log(`✅ Progression de ${testUsers[0].username}: Niveau ${userProgression.level}, XP: ${userProgression.experiencePoints}`);

    console.log('\n🎉 Tests admin terminés avec succès !');
    console.log('\n📋 Données de test créées:');
    console.log(`- Admin: admin@test.com / password123`);
    console.log(`- Utilisateurs: user1@test.com, user2@test.com, user3@test.com / password123`);
    console.log(`- Token admin: ${adminUser.generateAuthToken()}`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter les tests
testAdminFeatures(); 