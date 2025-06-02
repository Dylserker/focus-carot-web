# 🎯 Focus Carot Web

**Focus Carot** est une application web de gestion de tâches gamifiée, conçue pour motiver les utilisateurs – petits et grands – avec un système de progression ludique. Elle est particulièrement adaptée aux enfants, avec un espace de supervision parentale intégré.

---

## ✨ Fonctionnalités

- ✅ **Gestion des tâches** : Création, modification et suppression de tâches
- 🎮 **Gamification** : Système de niveaux, points d’expérience et récompenses
- 📊 **Suivi de progression** : Visualisation des statistiques et de l’évolution
- 👨‍👩‍👧 **Supervision parentale** : Interface dédiée pour le suivi des enfants
- 🔐 **Authentification sécurisée** : Inscription et connexion avec JSON Web Token (JWT)

---

## 🧱 Structure du projet

### Backend – PHP

- API RESTful construite avec PHP
- Authentification JWT
- Base de données MySQL

### Frontend – React

- Interface utilisateur moderne avec React
- Composants réutilisables
- Communication avec l’API backend

---

## ⚙️ Prérequis

- PHP ≥ 8.0
- MySQL ≥ 5.7
- Composer
- Node.js ≥ 16
- npm ≥ 8

---

## 🚀 Installation

### 📦 Backend

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/focus-carot-web.git
cd focus-carot-web/backend
```

2. **Installer les dépendances**
```bash
composer install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
# Modifier .env avec vos infos :
DB_HOST=localhost
DB_DATABASE=focus_carot
DB_USERNAME=utilisateur
DB_PASSWORD=motdepasse
```

4. **Initier la Base de données*
```bash
php artisan migrate
php artisan db:seed
```

5. **Générer la clé JWT**
```bash
php artisan jwt:secret
```

### 💻 Frontend

1. **Aller dans le dossier frontend**
```bash
cd ../frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
cp .env.example .env
# Modifier .env avec l’URL de l’API
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Lancer l’application**
```bash
npm start
```
🔗 Accédez à l’application sur : http://localhost:3000


## 🔌 API Endpoints

### 🔐 Authentification

POST /api/auth/register → Inscription

POST /api/auth/login → Connexion

POST /api/auth/logout → Déconnexion

### 👤 Utilisateurs

GET /api/users/{id} → Obtenir un utilisateur

PUT /api/users/{id} → Modifier un utilisateur

GET /api/users/{id}/experience → Récupérer l’expérience

### 📝 Tâches

GET /api/tasks → Lister toutes les tâches

POST /api/tasks → Créer une tâche

PUT /api/tasks/{id} → Modifier une tâche

DELETE /api/tasks/{id} → Supprimer une tâche

## 🧪 Tests

### Backend
```bash
composer test
```

### Frontend
```bash
npm test
```

### 🤝 Contribuer
Fork le projet

Crée ta branche :
git checkout -b feature/ma-fonctionnalite

Commit tes modifications :
git commit -am "Ajout : ma fonctionnalité"

Push ta branche :
git push origin feature/ma-fonctionnalite

Crée une Pull Request 🚀

### 📜 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus d’infos.


Petit bonus il y a une version mobile react native SDK 52 qui est en cours de production :)