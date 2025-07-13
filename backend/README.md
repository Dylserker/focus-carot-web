# Backend Focus Carot - Express.js + MongoDB

Ce backend a été migré de PHP vers Express.js avec MongoDB pour une meilleure performance et flexibilité.

## 🚀 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- MongoDB (version 4.4 ou supérieure)
- npm ou yarn

### Installation des dépendances
```bash
cd backend
npm install
```

### Configuration
1. Copiez le fichier d'exemple des variables d'environnement :
```bash
cp env.example .env
```

2. Modifiez le fichier `.env` avec vos configurations :
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/focus_carot_web

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_securise_ici
JWT_EXPIRES_IN=24h

# Configuration du frontend
FRONTEND_URL=http://localhost:3000

# Configuration de sécurité
BCRYPT_ROUNDS=12
```

### Initialisation de la base de données
```bash
# Initialiser avec les achievements par défaut
npm run init-db

# Réinitialiser complètement la base de données
npm run init-db -- --reset

# Créer aussi les utilisateurs par défaut
npm run init-db -- --create-users
```

## 🏃‍♂️ Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (admin)
- `GET /api/users/:id` - Détails d'un utilisateur
- `GET /api/users/:id/profile` - Profil d'un utilisateur
- `PUT /api/users/:id/profile` - Mettre à jour le profil
- `GET /api/users/:id/progression` - Progression d'un utilisateur
- `PUT /api/users/:id/progression` - Mettre à jour la progression
- `POST /api/users/:id/experience` - Ajouter de l'expérience
- `GET /api/users/:id/stats` - Statistiques d'un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)

### Tâches
- `POST /api/tasks` - Créer une tâche
- `GET /api/tasks/my-tasks` - Mes tâches
- `GET /api/tasks/user/:userId` - Tâches d'un utilisateur
- `GET /api/tasks/:id` - Détails d'une tâche
- `PUT /api/tasks/:id` - Mettre à jour une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche
- `PATCH /api/tasks/:id/complete` - Marquer comme terminée
- `GET /api/tasks/stats/my-tasks` - Statistiques de mes tâches

### Achievements
- `GET /api/achievements` - Liste des achievements
- `GET /api/achievements/type/:type` - Achievements par type
- `GET /api/achievements/:id` - Détails d'un achievement
- `GET /api/achievements/user/:userId` - Achievements d'un utilisateur
- `GET /api/achievements/user/:userId/completed` - Achievements complétés
- `POST /api/achievements/user/:userId/unlock/:achievementId` - Débloquer un achievement
- `PUT /api/achievements/user/:userId/progress/:achievementId` - Mettre à jour le progrès
- `GET /api/achievements/user/:userId/stats` - Statistiques des achievements
- `POST /api/achievements` - Créer un achievement (admin)
- `PUT /api/achievements/:id` - Mettre à jour un achievement (admin)
- `DELETE /api/achievements/:id` - Supprimer un achievement (admin)

## 🔐 Authentification

Toutes les routes (sauf `/api/auth/*`) nécessitent un token JWT dans le header :
```
Authorization: Bearer <votre_token_jwt>
```

## 📊 Structure de la base de données

### Collections MongoDB

#### Users
- Informations de base (email, password, username, etc.)
- Profil utilisateur (bio, genre, etc.)
- Progression (niveau, expérience, streaks)
- Paramètres (notifications, thème, etc.)

#### Tasks
- Tâches des utilisateurs
- Statut, priorité, date d'échéance
- Récompense d'expérience

#### Achievements
- Défis et récompenses
- Types : taches_completees, niveau_atteint, jours_consecutifs, special
- Récompenses d'expérience

#### UserAchievements
- Progression des utilisateurs vers les achievements
- Suivi du progrès et des achievements débloqués

## 🛠️ Scripts disponibles

```bash
# Démarrage en mode développement
npm run dev

# Démarrage en mode production
npm start

# Tests
npm test

# Initialisation de la base de données
npm run init-db

# Linting (si configuré)
npm run lint
```

## 🔧 Configuration MongoDB

### Installation locale
1. Téléchargez MongoDB depuis [mongodb.com](https://www.mongodb.com/try/download/community)
2. Installez et démarrez le service MongoDB
3. Créez la base de données : `focus_carot_web`

### MongoDB Atlas (cloud)
1. Créez un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Obtenez l'URI de connexion
4. Remplacez `MONGODB_URI` dans votre `.env`

## 🚨 Sécurité

- Mots de passe hashés avec bcrypt
- JWT pour l'authentification
- Validation des données avec express-validator
- Rate limiting pour prévenir les abus
- Helmet pour les en-têtes de sécurité
- CORS configuré

## 📝 Migration depuis l'ancien backend PHP

### Changements principaux
1. **Base de données** : MySQL → MongoDB
2. **Langage** : PHP → Node.js/Express.js
3. **Authentification** : JWT (même système)
4. **Structure** : Architecture modulaire avec routes séparées

### Compatibilité API
Les endpoints principaux restent les mêmes, seuls les formats de réponse ont été légèrement ajustés pour une meilleure cohérence.

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI de connexion dans `.env`
- Vérifiez les permissions de la base de données

### Erreur JWT
- Vérifiez que `JWT_SECRET` est défini dans `.env`
- Vérifiez que le token est valide et non expiré

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correctement configuré
- Vérifiez que le frontend fait les requêtes depuis la bonne URL

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement. 