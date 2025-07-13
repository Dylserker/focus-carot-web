const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
require('dotenv').config();

// Configuration MySQL (à adapter selon votre ancienne configuration)
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'focus_carot_web',
  port: process.env.MYSQL_PORT || 3306
};

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/focus_carot_web', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateData() {
  let mysqlConnection;
  
  try {
    console.log('🚀 Début de la migration MySQL → MongoDB...');
    
    // Connexion MySQL
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connexion MySQL établie');
    
    // Migration des utilisateurs
    console.log('👥 Migration des utilisateurs...');
    const [users] = await mysqlConnection.execute('SELECT * FROM users');
    
    for (const user of users) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          console.log(`⏭️  Utilisateur déjà existant: ${user.email}`);
          continue;
        }
        
        // Créer le nouvel utilisateur
        const newUser = new User({
          email: user.email,
          password: user.password, // Le hash bcrypt devrait être compatible
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatarUrl: user.avatar_url,
          profile: {
            dateOfBirth: user.date_of_birth || null,
            gender: user.gender || 'non_specifie',
            bio: user.bio || null
          },
          settings: {
            notificationsEnabled: user.notifications_enabled !== 0,
            theme: user.theme || 'default',
            language: user.language || 'fr',
            dailyGoal: user.daily_goal || 3
          }
        });
        
        await newUser.save();
        console.log(`✅ Utilisateur migré: ${user.email}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de l'utilisateur ${user.email}:`, error.message);
      }
    }
    
    // Migration des tâches
    console.log('📝 Migration des tâches...');
    const [tasks] = await mysqlConnection.execute('SELECT * FROM tasks');
    
    for (const task of tasks) {
      try {
        // Trouver l'utilisateur correspondant
        const user = await User.findOne({ email: task.user_email || 'unknown@example.com' });
        if (!user) {
          console.log(`⚠️  Utilisateur non trouvé pour la tâche ${task.id}, ignorée`);
          continue;
        }
        
        // Créer la nouvelle tâche
        const newTask = new Task({
          userId: user._id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.due_date ? new Date(task.due_date) : null,
          priority: task.priority,
          experienceReward: task.experience_reward || 10,
          completedAt: task.completed_at ? new Date(task.completed_at) : null
        });
        
        await newTask.save();
        console.log(`✅ Tâche migrée: ${task.title}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de la tâche ${task.id}:`, error.message);
      }
    }
    
    // Migration des achievements
    console.log('🏆 Migration des achievements...');
    const [achievements] = await mysqlConnection.execute('SELECT * FROM achievements');
    
    for (const achievement of achievements) {
      try {
        // Vérifier si l'achievement existe déjà
        const existingAchievement = await Achievement.findOne({ 
          name: achievement.name,
          achievementType: achievement.achievement_type 
        });
        
        if (existingAchievement) {
          console.log(`⏭️  Achievement déjà existant: ${achievement.name}`);
          continue;
        }
        
        // Créer le nouvel achievement
        const newAchievement = new Achievement({
          name: achievement.name,
          description: achievement.description,
          iconUrl: achievement.icon_url,
          experienceReward: achievement.experience_reward,
          requiredValue: achievement.required_value,
          achievementType: achievement.achievement_type,
          isActive: true
        });
        
        await newAchievement.save();
        console.log(`✅ Achievement migré: ${achievement.name}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de l'achievement ${achievement.id}:`, error.message);
      }
    }
    
    // Migration des user_achievements
    console.log('🎯 Migration des achievements utilisateurs...');
    const [userAchievements] = await mysqlConnection.execute('SELECT * FROM user_achievements');
    
    for (const userAchievement of userAchievements) {
      try {
        // Trouver l'utilisateur et l'achievement correspondants
        const user = await User.findOne({ email: userAchievement.user_email || 'unknown@example.com' });
        const achievement = await Achievement.findOne({ 
          name: userAchievement.achievement_name || 'Unknown',
          achievementType: userAchievement.achievement_type || 'special'
        });
        
        if (!user || !achievement) {
          console.log(`⚠️  Utilisateur ou achievement non trouvé pour user_achievement ${userAchievement.id}, ignoré`);
          continue;
        }
        
        // Créer le nouveau userAchievement
        const newUserAchievement = new UserAchievement({
          userId: user._id,
          achievementId: achievement._id,
          progress: userAchievement.progress || 0,
          completed: userAchievement.completed === 1,
          completedAt: userAchievement.completed_at ? new Date(userAchievement.completed_at) : null
        });
        
        await newUserAchievement.save();
        console.log(`✅ UserAchievement migré pour ${user.email} - ${achievement.name}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la migration du user_achievement ${userAchievement.id}:`, error.message);
      }
    }
    
    // Migration de la progression utilisateur
    console.log('📈 Migration de la progression utilisateur...');
    const [userProgression] = await mysqlConnection.execute('SELECT * FROM user_progression');
    
    for (const progression of userProgression) {
      try {
        // Trouver l'utilisateur correspondant
        const user = await User.findOne({ email: progression.user_email || 'unknown@example.com' });
        if (!user) {
          console.log(`⚠️  Utilisateur non trouvé pour la progression ${progression.id}, ignorée`);
          continue;
        }
        
        // Mettre à jour la progression de l'utilisateur
        user.progression = {
          level: progression.level || 1,
          experiencePoints: progression.experience_points || 0,
          totalExperienceEarned: progression.total_experience_earned || 0,
          currentStreak: progression.current_streak || 0,
          longestStreak: progression.longest_streak || 0,
          lastActivityDate: progression.last_activity_date ? new Date(progression.last_activity_date) : null
        };
        
        await user.save();
        console.log(`✅ Progression migrée pour ${user.email}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de la progression ${progression.id}:`, error.message);
      }
    }
    
    console.log('✅ Migration terminée avec succès !');
    
    // Afficher les statistiques finales
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const achievementCount = await Achievement.countDocuments();
    const userAchievementCount = await UserAchievement.countDocuments();
    
    console.log('📊 Statistiques finales:');
    console.log(`   - Utilisateurs: ${userCount}`);
    console.log(`   - Tâches: ${taskCount}`);
    console.log(`   - Achievements: ${achievementCount}`);
    console.log(`   - UserAchievements: ${userAchievementCount}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('🔌 Connexion MySQL fermée');
    }
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter la migration
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData }; 