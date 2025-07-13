// Configuration de l'API
const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Timeout des requêtes (en millisecondes)
  TIMEOUT: 10000,
  
  // Configuration des headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify',
    },
    
    // Utilisateurs
    USERS: {
      LIST: '/users',
      DETAIL: (id) => `/users/${id}`,
      PROFILE: (id) => `/users/${id}/profile`,
      PROGRESSION: (id) => `/users/${id}/progression`,
      EXPERIENCE: (id) => `/users/${id}/experience`,
      STATS: (id) => `/users/${id}/stats`,
    },
    
    // Tâches
    TASKS: {
      CREATE: '/tasks',
      MY_TASKS: '/tasks/my-tasks',
      USER_TASKS: (userId) => `/tasks/user/${userId}`,
      DETAIL: (id) => `/tasks/${id}`,
      COMPLETE: (id) => `/tasks/${id}/complete`,
      STATS: '/tasks/stats/my-tasks',
    },
    
    // Achievements
    ACHIEVEMENTS: {
      LIST: '/achievements',
      BY_TYPE: (type) => `/achievements/type/${type}`,
      DETAIL: (id) => `/achievements/${id}`,
      USER: (userId) => `/achievements/user/${userId}`,
      COMPLETED: (userId) => `/achievements/user/${userId}/completed`,
      UNLOCK: (userId, achievementId) => `/achievements/user/${userId}/unlock/${achievementId}`,
      PROGRESS: (userId, achievementId) => `/achievements/user/${userId}/progress/${achievementId}`,
      STATS: (userId) => `/achievements/user/${userId}/stats`,
    },
  },
  
  // Codes de statut HTTP
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // Messages d'erreur par défaut
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette ressource',
    FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
    NOT_FOUND: 'La ressource demandée n\'existe pas',
    VALIDATION_ERROR: 'Les données fournies sont invalides',
    SERVER_ERROR: 'Erreur interne du serveur',
    UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite',
  },
};

export default API_CONFIG; 