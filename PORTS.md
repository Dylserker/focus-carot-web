# Configuration des Ports - Focus Carot

## 📋 Vue d'ensemble des ports

| Service | Port | Description |
|---------|------|-------------|
| **Backend** | `5000` | API Node.js/Express |
| **Frontend Web** | `3000` | Application React |
| **Mobile (Expo)** | `8001` | Application React Native |

## 🚀 Démarrage des services

### 1. Backend (Port 5000)
```bash
cd backend
npm start
```
- API disponible sur : `http://localhost:5000`
- Endpoints : `http://localhost:5000/api/*`

### 2. Frontend Web (Port 3000)
```bash
cd frontend
npm start
```
- Application disponible sur : `http://localhost:3000`
- Se connecte au backend sur : `http://localhost:5000/api`

### 3. Mobile (Port 8001)
```bash
cd mobile
npm start
```
- Application Expo disponible sur : `http://localhost:8001`
- Se connecte au backend sur : `http://localhost:5000/api`

## 🔧 Configuration CORS

Le backend est configuré pour accepter les requêtes depuis :

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',  // Frontend web
    'http://localhost:3001',  // Frontend web (port alternatif)
    'http://localhost:8001',  // Application mobile Expo
    'http://localhost:8081',  // Application mobile Expo (port alternatif)
    'exp://localhost:8001',   // Expo development server
    'exp://localhost:8081'    // Expo development server (port alternatif)
  ],
  credentials: true
}));
```

## 📱 Configuration Mobile

L'application mobile est configurée pour se connecter au backend :

```typescript
// mobile/app/config/config.ts
API_BASE_URL: __DEV__ 
    ? 'http://localhost:5000/api'  // Développement local (backend sur port 5000)
    : 'https://votre-domaine.com/api', // Production
```

## 🔄 Ordre de démarrage recommandé

1. **Démarrer le backend en premier** :
   ```bash
   cd backend
   npm start
   ```

2. **Démarrer le frontend web** :
   ```bash
   cd frontend
   npm start
   ```

3. **Démarrer l'application mobile** :
   ```bash
   cd mobile
   npm start
   ```

## 🚨 Dépannage

### Erreur "Port déjà utilisé"
Si un port est déjà utilisé, vous pouvez :

1. **Trouver le processus** :
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```

2. **Arrêter le processus** :
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # macOS/Linux
   kill -9 <PID>
   ```

### Erreur CORS
Si vous obtenez des erreurs CORS :

1. Vérifiez que le backend est démarré sur le port 5000
2. Vérifiez que l'origine est bien dans la liste CORS
3. Redémarrez le backend après modification de la config CORS

### Erreur de connexion mobile
Si l'app mobile ne peut pas se connecter :

1. Vérifiez que le backend est démarré
2. Vérifiez l'URL dans `mobile/app/config/config.ts`
3. Testez la connexion avec : `http://localhost:5000/api/health`

## 🌐 Production

En production, modifiez les URLs dans :

- `mobile/app/config/config.ts` : URL de production
- `frontend/src/config/api.js` : URL de production
- `backend/server.js` : Origines CORS de production 