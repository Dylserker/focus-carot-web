const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  maxProgress: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isUnlocked: 1 });

// Méthode statique pour obtenir les achievements d'un utilisateur
userAchievementSchema.statics.getUserAchievements = function(userId) {
  return this.find({ userId })
    .populate('achievementId')
    .sort({ unlockedAt: -1, createdAt: -1 });
};

// Méthode statique pour obtenir les achievements complétés d'un utilisateur
userAchievementSchema.statics.getCompletedAchievements = function(userId) {
  return this.find({ userId, isUnlocked: true })
    .populate('achievementId')
    .sort({ unlockedAt: -1 });
};

// Méthode statique pour débloquer un achievement
userAchievementSchema.statics.unlockAchievement = async function(userId, achievementId) {
  // Vérifier si l'achievement existe déjà pour cet utilisateur
  let userAchievement = await this.findOne({ userId, achievementId });
  
  if (!userAchievement) {
    // Créer un nouveau UserAchievement
    userAchievement = new this({
      userId,
      achievementId,
      isUnlocked: true,
      unlockedAt: new Date(),
      progress: 1,
      maxProgress: 1
    });
  } else if (userAchievement.isUnlocked) {
    throw new Error('Achievement déjà débloqué');
  } else {
    // Marquer comme débloqué
    userAchievement.isUnlocked = true;
    userAchievement.unlockedAt = new Date();
    userAchievement.progress = userAchievement.maxProgress;
  }
  
  await userAchievement.save();
  return userAchievement.populate('achievementId');
};

// Méthode statique pour mettre à jour le progrès d'un achievement
userAchievementSchema.statics.updateProgress = async function(userId, achievementId, progress) {
  let userAchievement = await this.findOne({ userId, achievementId });
  
  if (!userAchievement) {
    // Créer un nouveau UserAchievement
    userAchievement = new this({
      userId,
      achievementId,
      progress,
      maxProgress: 1 // À ajuster selon l'achievement
    });
  } else {
    userAchievement.progress = progress;
    
    // Vérifier si l'achievement peut être débloqué
    if (progress >= userAchievement.maxProgress && !userAchievement.isUnlocked) {
      userAchievement.isUnlocked = true;
      userAchievement.unlockedAt = new Date();
    }
  }
  
  await userAchievement.save();
  return userAchievement.populate('achievementId');
};

// Méthode statique pour obtenir les statistiques des achievements d'un utilisateur
userAchievementSchema.statics.getUserAchievementStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unlocked: {
          $sum: { $cond: [{ $eq: ['$isUnlocked', true] }, 1, 0] }
        },
        totalProgress: { $sum: '$progress' },
        totalMaxProgress: { $sum: '$maxProgress' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    unlocked: 0,
    totalProgress: 0,
    totalMaxProgress: 0
  };
};

module.exports = mongoose.model('UserAchievement', userAchievementSchema); 