const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot_web', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Données des achievements par défaut
const defaultAchievements = [
  {
    name: 'Premier pas',
    description: 'Félicitation tu as créer ta première tâche !!',
    iconUrl: null,
    experienceReward: 250,
    requiredValue: 1,
    achievementType: 'taches_completees',
    isActive: true
  },
  {
    name: 'Motivation',
    description: 'Incroyable tu as compléter 100% des tâches journalière que tu t\'étais fixé chapeau !!!',
    iconUrl: null,
    experienceReward: 5000,
    requiredValue: 1,
    achievementType: 'taches_completees',
    isActive: true
  },
  {
    name: 'JE PEUX LE FAIRE !!!',
    description: 'Une tâches de niveau Haute à été effectuer',
    iconUrl: null,
    experienceReward: 10000,
    requiredValue: 1,
    achievementType: 'taches_completees',
    isActive: true
  },
  {
    name: 'Je contrôle ma vie !!',
    description: '10 tâches de niveau haute à été effectuer',
    iconUrl: null,
    experienceReward: 25000,
    requiredValue: 1,
    achievementType: 'taches_completees',
    isActive: true
  },
  {
    name: 'Niveau 10 atteint',
    description: 'tu as atteint le niveau 10',
    iconUrl: null,
    experienceReward: 1000,
    requiredValue: 1,
    achievementType: 'niveau_atteint',
    isActive: true
  },
  {
    name: 'It\'s over nine thousand !',
    description: 'Wouah !!!! le niveau 9000 à été atteint mais tu es extraordinaire',
    iconUrl: null,
    experienceReward: 90000,
    requiredValue: 1,
    achievementType: 'niveau_atteint',
    isActive: true
  },
  {
    name: 'une semaine de changement',
    description: '7 jours consécutif de tâches compléter à 100%',
    iconUrl: null,
    experienceReward: 7000,
    requiredValue: 1,
    achievementType: 'jours_consecutifs',
    isActive: true
  },
  {
    name: 'Défis en vu !!',
    description: 'Une tâches spécial a été effectuer :)',
    iconUrl: null,
    experienceReward: 15000,
    requiredValue: 1,
    achievementType: 'special',
    isActive: true
  }
];

// Données des utilisateurs par défaut (optionnel)
const defaultUsers = [
  {
    email: 'admin@focuscarot.com',
    password: 'admin123',
    username: 'Admin',
    firstName: 'Admin',
    lastName: 'Admin',
    role: 'admin',
    avatarUrl: 'avatars/admin.png'
  },
  {
    email: 'parent1@example.com',
    password: 'parent123',
    username: 'Parent1',
    firstName: 'Grégore',
    lastName: 'tchétchen',
    role: 'parent',
    avatarUrl: 'avatars/parent1.png'
  },
  {
    email: 'enfant1@example.com',
    password: 'enfant123',
    username: 'Enfant1',
    firstName: 'Yasmina',
    lastName: 'Labiradmi',
    role: 'enfant',
    avatarUrl: 'avatars/enfant1.png'
  }
];

async function initializeDatabase() {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Supprimer les collections existantes (optionnel)
    if (process.argv.includes('--reset')) {
      console.log('🗑️  Suppression des collections existantes...');
      await mongoose.connection.dropDatabase();
    }

    // Créer les achievements par défaut
    console.log('🏆 Création des achievements par défaut...');
    for (const achievementData of defaultAchievements) {
      const existingAchievement = await Achievement.findOne({ 
        name: achievementData.name,
        achievementType: achievementData.achievementType 
      });
      
      if (!existingAchievement) {
        const achievement = new Achievement(achievementData);
        await achievement.save();
        console.log(`✅ Achievement créé: ${achievement.name}`);
      } else {
        console.log(`⏭️  Achievement déjà existant: ${achievementData.name}`);
      }
    }

    // Créer les utilisateurs par défaut (optionnel)
    if (process.argv.includes('--create-users')) {
      console.log('👥 Création des utilisateurs par défaut...');
      for (const userData of defaultUsers) {
        const existingUser = await User.findOne({ email: userData.email });
        
        if (!existingUser) {
          const user = new User(userData);
          await user.save();
          console.log(`✅ Utilisateur créé: ${user.username} (${user.email})`);
        } else {
          console.log(`⏭️  Utilisateur déjà existant: ${userData.email}`);
        }
      }
    }

    console.log('✅ Initialisation terminée avec succès !');
    
    // Afficher les statistiques
    const achievementCount = await Achievement.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`📊 Statistiques:`);
    console.log(`   - Achievements: ${achievementCount}`);
    console.log(`   - Utilisateurs: ${userCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion à la base de données fermée');
  }
}

// Exécuter le script
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 