# Focus Carot - Application Mobile

Application mobile React Native/Expo pour Focus Carot, connectée au backend Node.js.

## 🚀 Configuration

### Prérequis

- Node.js (version 18 ou supérieure)
- Expo CLI
- Backend Focus Carot en cours d'exécution

### Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer l'API :**
   - Ouvrir `app/config/config.ts`
   - Modifier `API_BASE_URL` selon votre configuration :
     - Développement local : `http://localhost:5000/api`
     - Production : `https://votre-domaine.com/api`

3. **Démarrer l'application :**
   ```bash
   npm start
   ```

## 🔧 Configuration de l'API

### Variables d'environnement

L'application utilise une configuration centralisée dans `app/config/config.ts` :

```typescript
export const CONFIG = {
    API_BASE_URL: __DEV__ 
        ? 'http://localhost:5000/api'  // Développement
        : 'https://votre-domaine.com/api', // Production
    // ... autres configurations
};
```

### Services disponibles

- **`apiService`** : Service principal pour les appels API
- **`taskService`** : Gestion des tâches
- **`achievementService`** : Gestion des succès
- **`AuthContext`** : Contexte d'authentification

## 📱 Fonctionnalités

### Authentification
- Connexion/Inscription
- Gestion des tokens JWT
- Persistance de session

### Tâches
- Création, modification, suppression
- Marquage comme complétée
- Synchronisation avec le backend

### Succès
- Affichage des succès disponibles
- Succès débloqués par l'utilisateur
- Statistiques de progression

### Profil utilisateur
- Modification des informations
- Upload d'avatar
- Gestion des préférences

## 🔌 Connexion au Backend

### Endpoints utilisés

- **Authentification :**
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`

- **Utilisateurs :**
  - `GET /api/users/profile`
  - `PUT /api/users/profile`
  - `PUT /api/users/avatar`

- **Tâches :**
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `DELETE /api/tasks/:id`
  - `PUT /api/tasks/:id/toggle`

- **Succès :**
  - `GET /api/achievements`
  - `GET /api/achievements/user`

### Gestion des erreurs

L'application gère automatiquement :
- Erreurs de réseau
- Tokens expirés
- Erreurs de validation
- Erreurs serveur

## 🛠️ Développement

### Structure des dossiers

```
mobile/
├── app/
│   ├── config/          # Configuration
│   ├── context/         # Contextes React
│   ├── screen/          # Écrans de l'application
│   ├── services/        # Services API
│   └── types/           # Types TypeScript
├── assets/              # Images et ressources
└── components/          # Composants réutilisables
```

### Ajouter un nouveau service

1. Créer un fichier dans `app/services/`
2. Importer `apiService` depuis `./api`
3. Utiliser les types définis dans `./api`

Exemple :
```typescript
import { apiService, ApiResponse } from './api';

export class MonService {
    async maMethode(): Promise<ApiResponse<MonType>> {
        return apiService.apiCall<MonType>('/mon-endpoint');
    }
}
```

## 🚨 Dépannage

### Erreur de connexion à l'API

1. Vérifier que le backend est démarré
2. Vérifier l'URL dans `config.ts`
3. Vérifier les paramètres réseau (proxy, firewall)

### Erreur d'authentification

1. Vérifier que les tokens sont correctement stockés
2. Vérifier la validité du token côté serveur
3. Redémarrer l'application si nécessaire

### Erreur de synchronisation

1. Vérifier la connectivité réseau
2. Vérifier les permissions de l'application
3. Vider le cache de l'application

## 📦 Build et Déploiement

### Build pour Android
```bash
expo build:android
```

### Build pour iOS
```bash
expo build:ios
```

### Publication sur les stores
```bash
expo publish
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
