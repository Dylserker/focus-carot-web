const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['à_faire', 'en_cours', 'terminée'],
    default: 'à_faire'
  },
  dueDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  experienceReward: {
    type: Number,
    default: 10
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ status: 1, priority: 1 });

// Méthode statique pour obtenir les tâches d'un utilisateur
taskSchema.statics.getTasksByUserId = function(userId, filters = {}) {
  const query = { userId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.priority) {
    query.priority = filters.priority;
  }
  
  if (filters.dueDate) {
    query.dueDate = filters.dueDate;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'username firstName lastName');
};

// Méthode pour marquer une tâche comme terminée
taskSchema.methods.complete = function() {
  this.status = 'terminée';
  this.completedAt = new Date();
  return this.save();
};

// Méthode pour calculer la récompense d'expérience basée sur la priorité
taskSchema.methods.calculateExperienceReward = function() {
  const rewards = {
    'basse': 10,
    'moyenne': 25,
    'haute': 50
  };
  
  return rewards[this.priority] || 10;
};

// Middleware pour mettre à jour la récompense d'expérience avant sauvegarde
taskSchema.pre('save', function(next) {
  if (this.isModified('priority')) {
    this.experienceReward = this.calculateExperienceReward();
  }
  next();
});

// Méthode pour obtenir les statistiques des tâches d'un utilisateur
taskSchema.statics.getUserTaskStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'terminée'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'en_cours'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'à_faire'] }, 1, 0] }
        },
        totalExperience: { $sum: '$experienceReward' },
        earnedExperience: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'terminée'] },
              '$experienceReward',
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    totalExperience: 0,
    earnedExperience: 0
  };
};

module.exports = mongoose.model('Task', taskSchema); 