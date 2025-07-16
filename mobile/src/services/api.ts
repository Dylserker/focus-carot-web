import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/config';

// Configuration de l'API
const API_BASE_URL = CONFIG.API_BASE_URL;

// Types pour les réponses API
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    title?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserAchievement {
    id: string;
    userId: string;
    achievementId: string;
    unlockedAt: string;
    achievement: Achievement;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Classe pour gérer les appels API
class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Méthode pour obtenir le token d'authentification
    private async getAuthToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem('authToken');
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return null;
        }
    }

    // Méthode générique pour les appels API
    private async apiCall<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const token = await this.getAuthToken();
            const url = `${this.baseURL}${endpoint}`;

            console.log(`🌐 Tentative de connexion à: ${url}`);

            const config: RequestInit = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers,
                },
                ...options,
            };

            // Ajout d'un timeout de 15 secondes
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log(`✅ Réponse reçue: ${response.status} ${response.statusText}`);
            
            const data = await response.json();
            console.log(`📦 Données reçues:`, JSON.stringify(data, null, 2));

            if (!response.ok) {
                throw new Error(data.message || `Erreur ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`❌ Erreur API (${endpoint}):`, error);
            if (error instanceof Error && error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Timeout de la requête (15s)',
                };
            }
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue',
            };
        }
    }

    // === AUTHENTIFICATION ===
    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        return this.apiCall<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(name: string, email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        return this.apiCall<LoginResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async logout(): Promise<ApiResponse<void>> {
        return this.apiCall<void>('/auth/logout', {
            method: 'POST',
        });
    }

    async getProfile(): Promise<ApiResponse<User>> {
        return this.apiCall<User>('/users/profile');
    }

    async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
        return this.apiCall<User>('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async updateAvatar(avatarData: string): Promise<ApiResponse<User>> {
        return this.apiCall<User>('/users/avatar', {
            method: 'PUT',
            body: JSON.stringify({ avatar: avatarData }),
        });
    }

    // === TÂCHES ===
    async getTasks(): Promise<ApiResponse<Task[]>> {
        return this.apiCall<Task[]>('/tasks/my-tasks');
    }

    async createTask(taskData: { title: string; description: string }): Promise<ApiResponse<Task>> {
        return this.apiCall<Task>('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async updateTask(taskId: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
        return this.apiCall<Task>(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    }

    async deleteTask(taskId: string): Promise<ApiResponse<void>> {
        return this.apiCall<void>(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
    }

    async toggleTaskComplete(taskId: string): Promise<ApiResponse<Task>> {
        return this.apiCall<Task>(`/tasks/${taskId}/toggle`, {
            method: 'PUT',
        });
    }

    // === SUCCÈS ===
    async getAchievements(): Promise<ApiResponse<Achievement[]>> {
        return this.apiCall<Achievement[]>('/achievements');
    }

    async getUserAchievements(): Promise<ApiResponse<UserAchievement[]>> {
        return this.apiCall<UserAchievement[]>('/achievements/user-progress');
    }

    // === ADMIN ===
    async getUsers(): Promise<ApiResponse<User[]>> {
        return this.apiCall<User[]>('/admin/users');
    }

    async getAdminAchievements(): Promise<ApiResponse<Achievement[]>> {
        return this.apiCall<Achievement[]>('/admin/achievements');
    }

    async toggleAchievementBlock(achievementId: string): Promise<ApiResponse<Achievement>> {
        return this.apiCall<Achievement>(`/admin/achievements/${achievementId}/toggle`, {
            method: 'PUT',
        });
    }

    async deleteAchievement(achievementId: string): Promise<ApiResponse<void>> {
        return this.apiCall<void>(`/admin/achievements/${achievementId}`, {
            method: 'DELETE',
        });
    }

    async createAchievement(achievementData: {
        name: string;
        description: string;
        icon: string;
        points: number;
    }): Promise<ApiResponse<Achievement>> {
        return this.apiCall<Achievement>('/admin/achievements', {
            method: 'POST',
            body: JSON.stringify(achievementData),
        });
    }

    async updateAchievement(
        achievementId: string,
        achievementData: Partial<Achievement>
    ): Promise<ApiResponse<Achievement>> {
        return this.apiCall<Achievement>(`/admin/achievements/${achievementId}`, {
            method: 'PUT',
            body: JSON.stringify(achievementData),
        });
    }
}

// Instance singleton du service API
export const apiService = new ApiService();
export default apiService; 