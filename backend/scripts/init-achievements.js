const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
require('dotenv').config();

async function initAchievements() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot');
    console.log('✅ Connexion à MongoDB établie');

    // Supprimer tous les achievements existants
    await Achievement.deleteMany({});
    console.log('🗑️ Anciens achievements supprimés');

    // Créer les achievements par défaut
    const defaultAchievements = [
      // Achievements pour tâches complétées
      {
        name: 'Premier Pas',
        description: 'Complétez votre première tâche',
        type: 'taches_completees',
        achievementType: 'taches_completees',
        icon: '🎯',
        experienceReward: 25,
        criteria: { requiredTasks: 1 },
        rarity: 'common'
      },
      {
        name: 'Tâcheur Assidu',
        description: 'Complétez 10 tâches',
        type: 'taches_completees',
        achievementType: 'taches_completees',
        icon: '📝',
        experienceReward: 100,
        criteria: { requiredTasks: 10 },
        rarity: 'common'
      },
      {
        name: 'Maître des Tâches',
        description: 'Complétez 50 tâches',
        type: 'taches_completees',
        achievementType: 'taches_completees',
        icon: '📋',
        experienceReward: 250,
        criteria: { requiredTasks: 50 },
        rarity: 'rare'
      },
      {
        name: 'Expert Productif',
        description: 'Complétez 100 tâches',
        type: 'taches_completees',
        achievementType: 'taches_completees',
        icon: '🏆',
        experienceReward: 500,
        criteria: { requiredTasks: 100 },
        rarity: 'epic'
      },

      // Achievements pour niveaux
      {
        name: 'Débutant',
        description: 'Atteignez le niveau 5',
        type: 'niveau_atteint',
        achievementType: 'niveau_atteint',
        icon: '⭐',
        experienceReward: 50,
        criteria: { requiredLevel: 5 },
        rarity: 'common'
      },
      {
        name: 'Intermédiaire',
        description: 'Atteignez le niveau 10',
        type: 'niveau_atteint',
        achievementType: 'niveau_atteint',
        icon: '⭐⭐',
        experienceReward: 150,
        criteria: { requiredLevel: 10 },
        rarity: 'common'
      },
      {
        name: 'Avancé',
        description: 'Atteignez le niveau 20',
        type: 'niveau_atteint',
        achievementType: 'niveau_atteint',
        icon: '⭐⭐⭐',
        experienceReward: 300,
        criteria: { requiredLevel: 20 },
        rarity: 'rare'
      },
      {
        name: 'Expert',
        description: 'Atteignez le niveau 50',
        type: 'niveau_atteint',
        achievementType: 'niveau_atteint',
        icon: '👑',
        experienceReward: 1000,
        criteria: { requiredLevel: 50 },
        rarity: 'legendary'
      },

      // Achievements pour jours consécutifs
      {
        name: 'Première Semaine',
        description: 'Connectez-vous 7 jours de suite',
        type: 'jours_consecutifs',
        achievementType: 'jours_consecutifs',
        icon: '📅',
        experienceReward: 75,
        criteria: { requiredDays: 7 },
        rarity: 'common'
      },
      {
        name: 'Mois Consacré',
        description: 'Connectez-vous 30 jours de suite',
        type: 'jours_consecutifs',
        achievementType: 'jours_consecutifs',
        icon: '🗓️',
        experienceReward: 200,
        criteria: { requiredDays: 30 },
        rarity: 'rare'
      },
      {
        name: 'Détermination',
        description: 'Connectez-vous 100 jours de suite',
        type: 'jours_consecutifs',
        achievementType: 'jours_consecutifs',
        icon: '🔥',
        experienceReward: 750,
        criteria: { requiredDays: 100 },
        rarity: 'epic'
      },

      // Achievements spéciaux
      {
        name: 'Bienvenue',
        description: 'Créez votre compte',
        type: 'special',
        achievementType: 'special',
        icon: '🎉',
        experienceReward: 25,
        criteria: { action: 'account_creation' },
        rarity: 'common'
      },
      {
        name: 'Explorateur',
        description: 'Visitez toutes les pages de l\'application',
        type: 'special',
        achievementType: 'special',
        icon: '🗺️',
        experienceReward: 100,
        criteria: { action: 'explore_all_pages' },
        rarity: 'rare'
      }
    ];

    // Insérer les achievements
    await Achievement.insertMany(defaultAchievements);
    console.log(`✅ ${defaultAchievements.length} achievements créés avec succès`);

    // Afficher les achievements créés
    const achievements = await Achievement.find().sort({ type: 1, rarity: 1 });
    console.log('\n📋 Liste des achievements créés :');
    achievements.forEach(achievement => {
      console.log(`- ${achievement.icon} ${achievement.name} (${achievement.type}) - ${achievement.experienceReward} XP`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des achievements:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

initAchievements(); 