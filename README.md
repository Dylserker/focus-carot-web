# 🎯 Focus Carot Web

**Focus Carot** est une application web et mobile de gestion de tâches gamifiée, conçue pour motiver les utilisateurs – petits et grands – avec un système de progression ludique. Elle est particulièrement adaptée aux enfants, avec un espace de supervision parentale intégré.

---

## ✨ Fonctionnalités

- ✅ **Gestion des tâches** : Création, modification et suppression de tâches
- 🎮 **Gamification** : Système de succès, points d'expérience et récompenses
- 📊 **Suivi de progression** : Visualisation des statistiques et de l'évolution
- 👨‍👩‍👧 **Supervision parentale** : Interface dédiée pour le suivi des enfants
- 🔐 **Authentification sécurisée** : Inscription et connexion avec JSON Web Token (JWT)
- 📱 **Application mobile** : Version React Native avec Expo

---

## 🧱 Architecture du projet

### Backend – Node.js/Express
- API RESTful construite avec Node.js et Express
- Base de données MongoDB avec Mongoose
- Authentification JWT
- Gestion des succès et tâches

### Frontend Web – React
- Interface utilisateur moderne avec React
- Composants réutilisables
- Communication avec l'API backend

### Mobile – React Native/Expo
- Application mobile native avec React Native
- Framework Expo pour le développement
- Synchronisation avec le backend

---

## ⚙️ Prérequis

- Node.js ≥ 18.0
- npm ≥ 8.0
- MongoDB ≥ 5.0
- Expo CLI (pour le mobile)

---

## 🚀 Installation et démarrage

### 📦 Backend (Port 5000)

1. **Aller dans le dossier backend**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
# Modifier .env avec vos informations MongoDB
MONGODB_URI=mongodb://localhost:27017/focus_carot
JWT_SECRET=votre_secret_jwt
```

4. **Démarrer le serveur**
```bash
npm start
```
🔗 API disponible sur : http://localhost:5000

### 💻 Frontend Web (Port 3000)

1. **Aller dans le dossier frontend**
```bash
cd frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
npm start
```
🔗 Application disponible sur : http://localhost:3000

### 📱 Mobile (Port 8001)

1. **Aller dans le dossier mobile**
```bash
cd mobile
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application Expo**
```bash
npm start
```
🔗 Application Expo disponible sur : http://localhost:8001

---

## 🔌 Configuration des ports

| Service | Port | Description |
|---------|------|-------------|
| **Backend** | `5000` | API Node.js/Express |
| **Frontend Web** | `3000` | Application React |
| **Mobile (Expo)** | `8001` | Application React Native |

## 🔌 API Endpoints

### 🔐 Authentification
- `POST /api/auth/register` → Inscription
- `POST /api/auth/login` → Connexion
- `POST /api/auth/logout` → Déconnexion

### 👤 Utilisateurs
- `GET /api/users/profile` → Profil utilisateur
- `PUT /api/users/profile` → Modifier le profil
- `PUT /api/users/avatar` → Modifier l'avatar

### 📝 Tâches
- `GET /api/tasks` → Lister toutes les tâches
- `POST /api/tasks` → Créer une tâche
- `PUT /api/tasks/:id` → Modifier une tâche
- `DELETE /api/tasks/:id` → Supprimer une tâche
- `PUT /api/tasks/:id/toggle` → Basculer le statut

### 🏆 Succès
- `GET /api/achievements` → Lister tous les succès
- `GET /api/achievements/user` → Succès de l'utilisateur

### 👨‍💼 Admin
- `GET /api/admin/users` → Liste des utilisateurs
- `GET /api/admin/achievements` → Gestion des succès
- `POST /api/admin/achievements` → Créer un succès
- `PUT /api/admin/achievements/:id` → Modifier un succès
- `DELETE /api/admin/achievements/:id` → Supprimer un succès

---

## 🧪 Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Mobile
```bash
cd mobile
npm test
```

---

## 🔄 Ordre de démarrage recommandé

1. **Backend** (port 5000) - Doit être démarré en premier
2. **Frontend Web** (port 3000) - Se connecte au backend
3. **Mobile** (port 8001) - Se connecte au backend

---

## 🚨 Dépannage

### Erreur CORS
Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (Frontend web)
- `http://localhost:8001` (Mobile Expo)
- `exp://localhost:8001` (Expo development server)

### Erreur de connexion
Vérifiez que :
1. Le backend est démarré sur le port 5000
2. MongoDB est en cours d'exécution
3. Les variables d'environnement sont correctement configurées

---

## 🤝 Contribuer

1. **Fork le projet**
2. **Crée ta branche** :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
3. **Commit tes modifications** :
   ```bash
   git commit -am "Ajout : ma fonctionnalité"
   ```
4. **Push ta branche** :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
5. **Crée une Pull Request** 🚀

---

## 📜 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus d'infos.

---

## 📱 Version Mobile

Une version mobile React Native avec Expo SDK 52 est disponible dans le dossier `mobile/` ! 🎉