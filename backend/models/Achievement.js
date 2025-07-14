const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['taches_completees', 'niveau_atteint', 'jours_consecutifs', 'special'],
    required: true
  },
  achievementType: {
    type: String,
    enum: ['taches_completees', 'niveau_atteint', 'jours_consecutifs', 'special'],
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  experienceReward: {
    type: Number,
    default: 50
  },
  criteria: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
achievementSchema.index({ type: 1, isActive: 1 });
achievementSchema.index({ rarity: 1 });

// Méthode statique pour obtenir tous les achievements actifs
achievementSchema.statics.getActiveAchievements = function() {
  return this.find({ isActive: true }).sort({ type: 1, rarity: 1 });
};

// Méthode statique pour obtenir les achievements par type
achievementSchema.statics.getByType = function(type) {
  return this.find({ type, isActive: true }).sort({ rarity: 1 });
};

// Méthode pour vérifier si un utilisateur peut débloquer cet achievement
achievementSchema.methods.canUnlock = function(userStats) {
  switch (this.type) {
    case 'taches_completees':
      return userStats.completedTasks >= this.criteria.requiredTasks;
    
    case 'niveau_atteint':
      return userStats.level >= this.criteria.requiredLevel;
    
    case 'jours_consecutifs':
      return userStats.currentStreak >= this.criteria.requiredDays;
    
    case 'special':
      // Logique spéciale selon les critères
      return this.checkSpecialCriteria(userStats);
    
    default:
      return false;
  }
};

// Méthode pour obtenir le progrès actuel d'un utilisateur pour cet achievement
achievementSchema.methods.getUserProgress = function(userStats) {
  switch (this.type) {
    case 'taches_completees':
      return Math.min(userStats.completedTasks, this.criteria.requiredTasks);
    
    case 'niveau_atteint':
      return Math.min(userStats.level, this.criteria.requiredLevel);
    
    case 'jours_consecutifs':
      return Math.min(userStats.currentStreak, this.criteria.requiredDays);
    
    case 'special':
      return this.getSpecialProgress(userStats);
    
    default:
      return 0;
  }
};

// Méthode pour obtenir le progrès spécial
achievementSchema.methods.getSpecialProgress = function(userStats) {
  // Logique personnalisée selon les critères spéciaux
  return 0; // À implémenter selon les besoins
};

// Méthode pour vérifier les critères spéciaux
achievementSchema.methods.checkSpecialCriteria = function(userStats) {
  // Logique personnalisée selon les critères
  return true; // À implémenter selon les besoins
};

module.exports = mongoose.model('Achievement', achievementSchema); 