const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        // Validation d'email plus permissive qui accepte les points avant le @
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Format d\'email invalide'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'parent', 'enfant', 'user'],
    default: 'user'
  },
  avatarUrl: {
    type: String,
    default: null
  },
  profile: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['homme', 'femme', 'autre', 'non_specifie'],
      default: 'non_specifie'
    },
    bio: String
  },
  progression: {
    level: {
      type: Number,
      default: 1
    },
    experiencePoints: {
      type: Number,
      default: 0
    },
    totalExperienceEarned: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date,
      default: null
    }
  },
  settings: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'default'
    },
    language: {
      type: String,
      default: 'fr'
    },
    dailyGoal: {
      type: Number,
      default: 3
    }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances (suppression des indexes dupliqués)
userSchema.index({ role: 1 });

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les informations publiques de l'utilisateur
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Méthode pour ajouter de l'expérience
userSchema.methods.addExperience = function(amount) {
  this.progression.experiencePoints += amount;
  this.progression.totalExperienceEarned += amount;
  
  // Calcul du niveau (formule: niveau = 1 + sqrt(exp / 100))
  this.progression.level = Math.floor(1 + Math.sqrt(this.progression.experiencePoints / 100));
  
  return this.save();
};

// Méthode pour mettre à jour le streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = this.progression.lastActivityDate;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!lastActivity || lastActivity < yesterday) {
    // Nouveau streak
    this.progression.currentStreak = 1;
  } else if (lastActivity.getTime() === yesterday.getTime()) {
    // Streak continu
    this.progression.currentStreak += 1;
  }
  
  if (this.progression.currentStreak > this.progression.longestStreak) {
    this.progression.longestStreak = this.progression.currentStreak;
  }
  
  this.progression.lastActivityDate = today;
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 