# Frontend Focus Carot - React.js

Ce frontend a été mis à jour pour être compatible avec le nouveau backend Express.js + MongoDB.

## 🚀 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Backend Express.js démarré sur le port 5000

### Installation des dépendances
```bash
cd frontend
npm install
```

### Configuration
1. Créez un fichier `.env` dans le dossier `frontend` :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

2. Assurez-vous que le backend Express.js est démarré sur le port 5000

### Démarrage
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🔄 Changements principaux

### 1. Service API centralisé
- Nouveau service API unifié dans `src/services/api.js`
- Gestion centralisée des requêtes HTTP
- Gestion automatique des tokens d'authentification
- Gestion des erreurs standardisée

### 2. Authentification mise à jour
- Compatible avec le nouveau backend Express.js
- Vérification automatique du token au démarrage
- Gestion des sessions améliorée

### 3. Services mis à jour
- `taskService.js` : Utilise le nouveau service API
- `ExperienceService.js` : Compatible avec la nouvelle structure
- `achievementService.js` : Nouveau service pour les achievements

### 4. Pages mises à jour
- **Login** : Compatible avec le nouveau backend
- **Register** : Champs mis à jour (`firstName`, `lastName`, `username`)
- **Task** : Format des données mis à jour

## 📁 Structure des services

### `src/services/api.js`
Service centralisé pour toutes les communications avec l'API :
- Authentification (login, register, verify)
- Gestion des utilisateurs
- Gestion des tâches
- Gestion des achievements

### `src/services/taskService.js`
Service spécialisé pour les tâches :
- Création, lecture, mise à jour, suppression
- Récupération des tâches avec filtres
- Statistiques des tâches

### `src/services/ExperienceService.js`
Service pour la gestion de l'expérience :
- Ajout d'expérience
- Récupération de la progression
- Statistiques utilisateur

### `src/services/achievementService.js`
Service pour les achievements :
- Récupération des achievements
- Gestion des achievements utilisateur
- Déblocage d'achievements

## 🔧 Configuration

### Variables d'environnement
- `REACT_APP_API_URL` : URL de l'API backend (défaut: http://localhost:5000/api)

### Configuration API
Le fichier `src/config/api.js` contient :
- URLs des endpoints
- Codes de statut HTTP
- Messages d'erreur par défaut
- Configuration des headers

## 🔐 Authentification

### Flux d'authentification
1. L'utilisateur se connecte via `/login`
2. Le token JWT est stocké dans `localStorage`
3. Toutes les requêtes suivantes incluent automatiquement le token
4. Vérification automatique de la validité du token au démarrage

### Gestion des sessions
- Token automatiquement inclus dans les headers
- Déconnexion automatique si le token expire
- Nettoyage du localStorage lors de la déconnexion

## 📊 Format des données

### Utilisateurs
```javascript
{
  _id: "string",
  email: "string",
  username: "string",
  firstName: "string",
  lastName: "string",
  role: "admin|parent|enfant|user",
  progression: {
    level: number,
    experiencePoints: number,
    currentStreak: number,
    longestStreak: number
  }
}
```

### Tâches
```javascript
{
  _id: "string",
  title: "string",
  description: "string",
  status: "à_faire|en_cours|terminée",
  priority: "basse|moyenne|haute",
  dueDate: "date",
  experienceReward: number
}
```

### Achievements
```javascript
{
  _id: "string",
  name: "string",
  description: "string",
  achievementType: "taches_completees|niveau_atteint|jours_consecutifs|special",
  experienceReward: number,
  requiredValue: number
}
```

## 🐛 Dépannage

### Erreur de connexion à l'API
- Vérifiez que le backend est démarré sur le port 5000
- Vérifiez la variable `REACT_APP_API_URL` dans `.env`
- Vérifiez les logs du backend

### Erreur d'authentification
- Vérifiez que le token est valide
- Essayez de vous reconnecter
- Vérifiez les logs du backend

### Erreur CORS
- Vérifiez que le backend autorise les requêtes depuis `http://localhost:3000`
- Vérifiez la configuration CORS dans le backend

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement de production
```env
REACT_APP_API_URL=https://votre-api.com/api
```

## 📝 Notes de migration

### Changements depuis l'ancien backend PHP
1. **URLs** : `http://localhost:8000` → `http://localhost:5000`
2. **Format des données** : `user_id` → `userId`, `due_date` → `dueDate`
3. **Champs utilisateur** : `nom/prenom` → `lastName/firstName`
4. **Authentification** : Même système JWT, mais endpoints différents
5. **Gestion des erreurs** : Format standardisé avec `success` et `message`

### Compatibilité
Le frontend est maintenant entièrement compatible avec le nouveau backend Express.js + MongoDB. Tous les endpoints ont été mis à jour pour correspondre à la nouvelle API. 

## 🔔 PWA (Progressive Web App)

Ce projet inclut un service worker simple pour supporter le mode hors-ligne et l'installation en tant que PWA.

- **Fichiers importants** : `public/manifest.json`, `public/service-worker.js`, `public/logo192.png`, `public/logo512.png`.
- **Enregistrement** : le service worker est enregistré automatiquement par `src/index.js`.

Pour tester localement :
```bash
cd frontend
npm install
npm run build
npx serve -s build
# puis ouvrez http://localhost:3000
```

Ouvrez les DevTools → Application pour vérifier le `Service Worker` et l'installation en tant qu'application.

Si vous mettez à jour le service worker, rechargez la page et vérifiez la console pour les messages d'update.