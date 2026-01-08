-- Focus Carot - Schéma relationnel (MySQL 8.0 / InnoDB / utf8mb4)
-- Généré à partir des modèles Mongoose du backend Node.js
-- Objectif: fournir une base SQL équivalente, robuste et indexée

-- Recommandations d'exécution:
-- 1) Adapter le nom de la base si besoin
-- 2) Exécuter ce script avec un utilisateur ayant les droits adéquats

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Base de données (adapter si nécessaire)
CREATE DATABASE IF NOT EXISTS focus_carot
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE focus_carot;

-- Nettoyage optionnel (ATTENTION en prod!)
-- DROP TABLE IF EXISTS user_achievements;
-- DROP TABLE IF EXISTS achievements;
-- DROP TABLE IF EXISTS tasks;
-- DROP TABLE IF EXISTS users;

-- TABLE: users
-- Dérivé de backend/models/User.js
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('admin','parent','enfant','user') NOT NULL DEFAULT 'user',
  avatar_url TEXT NULL,
  -- Sous-documents Mongoose transformés en colonnes à plat
  profile_date_of_birth DATE NULL,
  profile_gender ENUM('homme','femme','autre','non_specifie') NOT NULL DEFAULT 'non_specifie',
  profile_bio VARCHAR(500) NULL,
  progression_level INT NOT NULL DEFAULT 1,
  progression_experience_points INT NOT NULL DEFAULT 0,
  progression_total_experience_earned INT NOT NULL DEFAULT 0,
  progression_current_streak INT NOT NULL DEFAULT 0,
  progression_longest_streak INT NOT NULL DEFAULT 0,
  progression_last_activity_date DATETIME NULL,
  settings_notifications_enabled TINYINT(1) NOT NULL DEFAULT 1,
  settings_theme VARCHAR(50) NOT NULL DEFAULT 'default',
  settings_language VARCHAR(10) NOT NULL DEFAULT 'fr',
  settings_daily_goal INT NOT NULL DEFAULT 3,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username),
  KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: tasks
-- Dérivé de backend/models/Task.js
CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('à_faire','en_cours','terminée') NOT NULL DEFAULT 'à_faire',
  due_date DATETIME NULL,
  priority ENUM('basse','moyenne','haute') NOT NULL DEFAULT 'moyenne',
  experience_reward INT NOT NULL DEFAULT 10,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_user_status (user_id, status),
  KEY idx_tasks_user_due (user_id, due_date),
  KEY idx_tasks_status_priority (status, priority),
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: achievements
-- Dérivé de backend/models/Achievement.js
-- Remarques:
-- - Mongoose a les champs `type` et `achievementType` (doublon), on conserve les deux
-- - `criteria` est stocké en JSON (MySQL 8.0)
CREATE TABLE IF NOT EXISTS achievements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  type ENUM('taches_completees','niveau_atteint','jours_consecutifs','special') NOT NULL,
  achievement_type ENUM('taches_completees','niveau_atteint','jours_consecutifs','special') NOT NULL,
  icon VARCHAR(64) NULL DEFAULT '🏆',
  icon_url VARCHAR(1024) NULL,
  experience_reward INT NOT NULL DEFAULT 50,
  criteria LONGTEXT NOT NULL,
  CHECK (JSON_VALID(criteria)),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  rarity ENUM('common','rare','epic','legendary') NOT NULL DEFAULT 'common',
  blocked TINYINT(1) NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_achievements_name (name),
  KEY idx_achievements_type_active (type, is_active),
  KEY idx_achievements_rarity (rarity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE: user_achievements
-- Dérivé de backend/models/UserAchievement.js
CREATE TABLE IF NOT EXISTS user_achievements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  achievement_id BIGINT UNSIGNED NOT NULL,
  is_unlocked TINYINT(1) NOT NULL DEFAULT 0,
  unlocked_at DATETIME NULL,
  progress INT NOT NULL DEFAULT 0,
  max_progress INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_achievement (user_id, achievement_id),
  KEY idx_user_achievements_user_unlocked (user_id, is_unlocked),
  CONSTRAINT fk_user_achievements_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_achievements_achievement FOREIGN KEY (achievement_id)
    REFERENCES achievements(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- SEEDS MINIMAUX (facultatifs): Quelques achievements de base
INSERT INTO achievements (name, description, type, achievement_type, icon, icon_url, experience_reward, criteria, is_active, rarity, blocked, level)
VALUES
  ('Première tâche', 'Compléter votre première tâche', 'taches_completees', 'taches_completees', '✅', NULL, 25, '{"requiredTasks": 1}', 1, 'common', 0, 1),
  ('5 tâches', 'Compléter 5 tâches', 'taches_completees', 'taches_completees', '🖐️', NULL, 100, '{"requiredTasks": 5}', 1, 'common', 0, 1),
  ('Niveau 5', 'Atteindre le niveau 5', 'niveau_atteint', 'niveau_atteint', '🎚️', NULL, 150, '{"requiredLevel": 5}', 1, 'rare', 0, 1),
  ('Streak 3 jours', 'Se connecter 3 jours d''affilée', 'jours_consecutifs', 'jours_consecutifs', '🔥', NULL, 75, '{"requiredDays": 3}', 1, 'common', 0, 1),
  ('Bienvenue', 'Créer un compte', 'special', 'special', '🎉', NULL, 10, '{"action": "account_creation"}', 1, 'common', 0, 1)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- VUES UTILES (optionnelles)
-- Vue de synthèse des stats d'achievements par utilisateur
DROP VIEW IF EXISTS vw_user_achievement_stats;
CREATE VIEW vw_user_achievement_stats AS
SELECT 
  u.id AS user_id,
  u.username,
  COUNT(ua.id) AS total_achievements_tracked,
  SUM(CASE WHEN ua.is_unlocked = 1 THEN 1 ELSE 0 END) AS unlocked_count,
  COALESCE(ROUND(SUM(CASE WHEN ua.is_unlocked = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(ua.id),0) * 100, 0), 0) AS completion_rate_percent
FROM users u
LEFT JOIN user_achievements ua ON ua.user_id = u.id
GROUP BY u.id, u.username;

-- REQUÊTES D'ACCÈS COURANTES (documentation)
-- 1) Tâches d'un utilisateur triées par due_date
--    SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC;
-- 2) Stats tâches d'un utilisateur (terminées, en_cours, à_faire)
--    SELECT 
--      COUNT(*) AS total,
--      SUM(status='terminée') AS completed,
--      SUM(status='en_cours') AS in_progress,
--      SUM(status='à_faire') AS pending
--    FROM tasks WHERE user_id = ?;
-- 3) Achievements actifs par type
--    SELECT * FROM achievements WHERE is_active = 1 AND type = 'taches_completees' ORDER BY rarity;
