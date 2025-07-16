// Configuration de l'application mobile
export const CONFIG = {
    // URL de l'API backend
    API_BASE_URL: __DEV__ 
        ? 'http://192.168.1.75:5000/api'  // Développement local (backend sur port 5000)
        : 'https://votre-domaine.com/api', // Production
    
    // Configuration des timeouts
    API_TIMEOUT: 10000, // 10 secondes
    
    // Configuration du stockage
    STORAGE_KEYS: {
        AUTH_TOKEN: 'authToken',
        USER_DATA: 'user',
        SETTINGS: 'settings',
        TASKS_CACHE: 'tasksCache',
        ACHIEVEMENTS_CACHE: 'achievementsCache'
    },
    
    // Configuration des messages d'erreur
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Erreur de connexion réseau',
        SERVER_ERROR: 'Erreur du serveur',
        AUTH_ERROR: 'Erreur d\'authentification',
        VALIDATION_ERROR: 'Erreur de validation',
        UNKNOWN_ERROR: 'Erreur inconnue'
    },
    
    // Configuration des limites
    LIMITS: {
        TASK_TITLE_MAX_LENGTH: 100,
        TASK_DESCRIPTION_MAX_LENGTH: 500,
        ACHIEVEMENT_NAME_MAX_LENGTH: 100,
        ACHIEVEMENT_DESCRIPTION_MAX_LENGTH: 500,
        ACHIEVEMENT_POINTS_MAX: 1000,
        USER_NAME_MAX_LENGTH: 50
    },
    
    // Configuration des animations
    ANIMATIONS: {
        DURATION: {
            FAST: 200,
            NORMAL: 300,
            SLOW: 500
        },
        EASING: {
            EASE_IN: 'ease-in',
            EASE_OUT: 'ease-out',
            EASE_IN_OUT: 'ease-in-out'
        }
    },
    
    // Configuration des couleurs (si nécessaire pour des thèmes)
    COLORS: {
        PRIMARY: '#8B4513',
        SECONDARY: '#D2691E',
        SUCCESS: '#4CAF50',
        WARNING: '#FF9800',
        ERROR: '#F44336',
        INFO: '#2196F3'
    }
};

// Fonction pour obtenir l'URL complète d'un endpoint
export const getApiUrl = (endpoint: string): string => {
    return `${CONFIG.API_BASE_URL}${endpoint}`;
};

// Fonction pour vérifier si l'application est en mode développement
export const isDevelopment = (): boolean => {
    return __DEV__;
};

// Fonction pour obtenir la configuration selon l'environnement
export const getEnvironmentConfig = () => {
    if (isDevelopment()) {
        return {
            ...CONFIG,
            API_BASE_URL: 'http://localhost:5000/api',
            DEBUG: true
        };
    }
    
    return {
        ...CONFIG,
        API_BASE_URL: 'https://votre-domaine.com/api',
        DEBUG: false
    };
}; 