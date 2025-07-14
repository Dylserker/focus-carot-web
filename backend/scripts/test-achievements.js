const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
require('dotenv').config();

async function testAchievements() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('✅ Connexion à MongoDB établie');

    // Vérifier les achievements existants
    const achievements = await Achievement.find().sort({ type: 1, rarity: 1 });
    console.log(`\n📋 Nombre d'achievements trouvés: ${achievements.length}`);
    
    if (achievements.length === 0) {
      console.log('❌ Aucun achievement trouvé. Exécutez d\'abord le script d\'initialisation.');
      return;
    }

    console.log('\n📋 Liste des achievements:');
    achievements.forEach((achievement, index) => {
      console.log(`${index + 1}. ${achievement.icon} ${achievement.name}`);
      console.log(`   Type: ${achievement.type}`);
      console.log(`   XP: ${achievement.experienceReward}`);
      console.log(`   Actif: ${achievement.isActive}`);
      console.log(`   Critères:`, achievement.criteria);
      console.log('');
    });

    // Vérifier les utilisateurs
    const users = await User.find().select('username email progression');
    console.log(`\n👥 Nombre d'utilisateurs: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Utilisateurs:');
      users.forEach(user => {
        console.log(`- ${user.username} (${user.email})`);
        console.log(`  Niveau: ${user.progression.level}`);
        console.log(`  XP: ${user.progression.experiencePoints}`);
        console.log(`  Streak: ${user.progression.currentStreak}`);
        console.log('');
      });
    }

    // Tester la route GET /achievements
    console.log('\n🔍 Test de la route GET /achievements...');
    const activeAchievements = await Achievement.getActiveAchievements();
    console.log(`✅ ${activeAchievements.length} achievements actifs trouvés`);

    // Tester par type
    const types = ['taches_completees', 'niveau_atteint', 'jours_consecutifs', 'special'];
    for (const type of types) {
      const typeAchievements = await Achievement.getByType(type);
      console.log(`✅ ${typeAchievements.length} achievements de type "${type}"`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

testAchievements(); 