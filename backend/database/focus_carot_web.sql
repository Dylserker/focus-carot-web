-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 06 mai 2025 à 08:47
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `focus_carot_web`
--

-- --------------------------------------------------------

--
-- Structure de la table `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `experience_reward` int(11) NOT NULL DEFAULT 0,
  `required_value` int(11) NOT NULL DEFAULT 1,
  `achievement_type` enum('taches_completees','niveau_atteint','jours_consecutifs','special') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parents_children`
--

CREATE TABLE `parents_children` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notifications_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `theme` varchar(50) DEFAULT 'default',
  `language` varchar(10) DEFAULT 'fr',
  `daily_goal` int(11) DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('à_faire','en_cours','terminée') NOT NULL DEFAULT 'à_faire',
  `due_date` date DEFAULT NULL,
  `priority` enum('basse','moyenne','haute') NOT NULL DEFAULT 'moyenne',
  `experience_reward` int(11) NOT NULL DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `titles`
--

CREATE TABLE `titles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `unlock_condition` text NOT NULL,
  `rarity` enum('commun','rare','épique','légendaire') NOT NULL DEFAULT 'commun'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','parent','enfant','user') NOT NULL DEFAULT 'user',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `first_name`, `last_name`, `role`, `avatar_url`, `created_at`, `updated_at`) VALUES
(1, 'edith25@example.com', '$2y$10$d0SWVDkxhZkPIc7qEmPtae07IpYpZddUw5n66qK/DimR5I9tnnLA2', 'llaine', 'Edith', 'Moineau', 'admin', 'https://via.placeholder.com/150x150.png/00aa66?text=people+et', '2025-04-29 06:09:04', '2025-05-06 06:31:18'),
(2, 'cgrenier@example.org', '$2y$10$Yi6CVk6RN8Jq20I3V52FuOmEAMu1fGWEB97wTk8PjZ1gx8Pp5RFB2', 'francois91', 'Célim', 'Fournirer', 'enfant', 'https://via.placeholder.com/150x150.png/003377?text=people+commodi', '2025-04-29 06:09:04', '2025-05-06 06:31:41'),
(3, 'nicolas.guillot@example.com', '$2y$10$ELh33F3CzlmJ/lwKXwxLruHbh4AkNx61sCl3.W/Sj24yWI5SeV6EG', 'dubois.jeanne', 'Jeanne', 'Dubois', 'enfant', 'https://via.placeholder.com/150x150.png/006622?text=people+omnis', '2025-04-29 06:09:05', '2025-05-06 06:31:54'),
(4, 'joseph.isabelle@example.net', '$2y$10$2TVQJBF2jcFYh0FmalzylOzHjzwJFV170z6RkK5xanNq3nRZrD8TS', 'emilie56', 'Emilie', 'Benda', 'user', 'https://via.placeholder.com/150x150.png/00cc88?text=people+voluptatem', '2025-04-29 06:09:05', '2025-05-06 06:32:06'),
(5, 'clemence30@example.org', '$2y$10$pIFpGZx346hVn3Xtrr.1l.9NIE4ydZn87aHRiwipckzvmLAU1BJHe', 'adrienne.pichon', 'Adrienne', 'Pichon', 'user', 'https://via.placeholder.com/150x150.png/00ccaa?text=people+nesciunt', '2025-04-29 06:09:05', '2025-05-06 06:32:33'),
(6, 'admin@focuscarot.com', '$2y$10$5T.QZiX9PQVVLJFj6/dq8etZEtqQgA2NH7vG.MKzVFfqS5nTPm3fu', 'Admin', 'Admin', 'Admin', 'admin', 'avatars/admin.png', '2025-04-29 08:14:30', '2025-05-06 06:32:46'),
(7, 'parent1@example.com', '$2y$10$2Sf3j4HXH3l7RZbZJsT3CecDfqJnm1LZMvDRzlQ95Py.c8qz0XEFa', 'Parent1', 'Grégore', 'tchétchen', 'parent', 'avatars/parent1.png', '2025-04-29 08:14:30', '2025-05-06 06:33:23'),
(8, 'parent2@example.com', '$2y$10$dP6h7BpGJv3cSXJKm9x.G.sDSgV4iqb7FHUw.NpyNcGfK9LQO4rce', 'Parent2', 'Samy', 'Boomboom', 'parent', 'avatars/parent2.png', '2025-04-29 08:14:30', '2025-05-06 06:33:41'),
(9, 'enfant1@example.com', '$2y$10$fZbCLm4eHQZyEKZxcWj3deIfRkmR.xLh1dOPOBU1UJH./.GbY2S2G', 'Enfant1', 'Yasmina', 'Labiradmi', 'enfant', 'avatars/enfant1.png', '2025-04-29 08:14:30', '2025-05-06 06:34:13'),
(10, 'user1@example.com', '$2y$10$78JZcgzRdZIvD1jA/Y3ADeRfRxhPxv1VLcJ9D68lw9STiJQfN1Xza', 'Utilisateur1', 'Jean', 'Ramdom', 'user', 'avatars/user1.png', '2025-04-29 08:14:30', '2025-05-06 06:34:33'),
(16, 'admin@gmail.com', '$2y$10$5T.QZiX9PQVVLJFj6/dq8etZEtqQgA2NH7vG.MKzVFfqS5nTPm3fu', 'Admin', 'Victor', 'Michi', 'admin', 'avatars/admin.png', '2025-04-29 08:16:12', '2025-05-06 06:34:49'),
(17, 'parent1@gmail.com', '$2y$10$2Sf3j4HXH3l7RZbZJsT3CecDfqJnm1LZMvDRzlQ95Py.c8qz0XEFa', 'Parent1', 'Nathan', 'Monténégro', 'parent', 'avatars/parent1.png', '2025-04-29 08:16:12', '2025-05-06 06:35:18'),
(18, 'parent2@gmail.com', '$2y$10$dP6h7BpGJv3cSXJKm9x.G.sDSgV4iqb7FHUw.NpyNcGfK9LQO4rce', 'Parent2', 'Maxime', 'Matuvu', 'parent', 'avatars/parent2.png', '2025-04-29 08:16:12', '2025-05-06 06:35:35'),
(19, 'enfant1@gmail.com', '$2y$10$fZbCLm4eHQZyEKZxcWj3deIfRkmR.xLh1dOPOBU1UJH./.GbY2S2G', 'Enfant1', 'Kayle', 'Rails', 'enfant', 'avatars/enfant1.png', '2025-04-29 08:16:12', '2025-05-06 06:30:58'),
(20, 'user1@gmail.com', '$2y$10$78JZcgzRdZIvD1jA/Y3ADeRfRxhPxv1VLcJ9D68lw9STiJQfN1Xza', 'Utilisateur1', 'Charles', 'Adrien', 'user', 'avatars/user1.png', '2025-04-29 08:16:12', '2025-05-06 06:30:39'),
(1207, 'levant.dylan@gmail.com', '$2y$10$oEBS0jX5kv9fUVbyMBYh2O3nmF4NJwH7lfM8mmf4yZYcJX1StUI42', 'Dylserker', 'Dylan', 'Levant', 'admin', NULL, '2025-04-29 14:26:18', '2025-05-06 06:30:25');

-- --------------------------------------------------------

--
-- Structure de la table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('homme','femme','autre','non_specifie') DEFAULT 'non_specifie',
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_progression`
--

CREATE TABLE `user_progression` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `experience_points` int(11) NOT NULL DEFAULT 0,
  `total_experience_earned` int(11) NOT NULL DEFAULT 0,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `longest_streak` int(11) NOT NULL DEFAULT 0,
  `last_activity_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_titles`
--

CREATE TABLE `user_titles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `unlocked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `parents_children`
--
ALTER TABLE `parents_children`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_relation` (`parent_id`,`child_id`),
  ADD KEY `child_id` (`child_id`);

--
-- Index pour la table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `titles`
--
ALTER TABLE `titles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`);

--
-- Index pour la table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_progression`
--
ALTER TABLE `user_progression`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_titles`
--
ALTER TABLE `user_titles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_title` (`user_id`,`title_id`),
  ADD KEY `title_id` (`title_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `parents_children`
--
ALTER TABLE `parents_children`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `titles`
--
ALTER TABLE `titles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1233;

--
-- AUTO_INCREMENT pour la table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `user_progression`
--
ALTER TABLE `user_progression`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `user_titles`
--
ALTER TABLE `user_titles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `parents_children`
--
ALTER TABLE `parents_children`
  ADD CONSTRAINT `parents_children_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parents_children_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_progression`
--
ALTER TABLE `user_progression`
  ADD CONSTRAINT `user_progression_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_titles`
--
ALTER TABLE `user_titles`
  ADD CONSTRAINT `user_titles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_titles_ibfk_2` FOREIGN KEY (`title_id`) REFERENCES `titles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
