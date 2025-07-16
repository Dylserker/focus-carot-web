/**
 * Service API qui gère les communications avec le backend Express.js
 */
import API_CONFIG from '../config/api';

const API_URL = API_CONFIG.BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Méthode utilitaire pour obtenir le token d'authentification
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Méthode utilitaire pour gérer les réponses
  async handleResponse(response) {
    let data;
    const text = await response.text();
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Si ce n'est pas du JSON, on retourne le texte brut
      data = { message: text };
    }
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Trop de requêtes. Veuillez attendre quelques minutes avant de réessayer.');
      }
      throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    
    return data;
  }

  // Méthode utilitaire pour faire des requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erreur API (${endpoint}):`, error);
      throw error;
    }
  }

  // ===== AUTHENTIFICATION =====
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // ===== UTILISATEURS =====
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}/profile`);
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getUserProgression(userId) {
    return this.request(`/users/${userId}/progression`);
  }

  async updateUserProgression(userId, progressionData) {
    return this.request(`/users/${userId}/progression`, {
      method: 'PUT',
      body: JSON.stringify(progressionData)
    });
  }

  async addUserExperience(userId, amount) {
    return this.request(`/users/${userId}/experience`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async getUserStats(userId) {
    return this.request(`/users/${userId}/stats`);
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Upload d'avatar
  async uploadAvatar(userId, imageData) {
    return this.request(`/users/${userId}/avatar`, {
      method: 'POST',
      body: JSON.stringify({ image: imageData })
    });
  }

  // Obtenir l'avatar d'un utilisateur
  async getUserAvatar(userId) {
    return this.request(`/users/${userId}/avatar`);
  }

  // ===== TÂCHES =====
  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async getMyTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/tasks/my-tasks?${queryParams}` : '/tasks/my-tasks';
    return this.request(endpoint);
  }

  async getUserTasks(userId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/tasks/user/${userId}?${queryParams}` : `/tasks/user/${userId}`;
    return this.request(endpoint);
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async completeTask(taskId) {
    return this.request(`/tasks/${taskId}/complete`, {
      method: 'PATCH'
    });
  }

  async getTaskStats() {
    return this.request('/tasks/stats/my-tasks');
  }

  // ===== ACHIEVEMENTS =====
  async getAchievements() {
    return this.request('/achievements');
  }

  async getAchievementsByType(type) {
    return this.request(`/achievements/type/${type}`);
  }

  async getAchievement(achievementId) {
    return this.request(`/achievements/${achievementId}`);
  }

  async getUserAchievements(userId) {
    return this.request(`/users/${userId}/achievements`);
  }

  async getCompletedAchievements(userId) {
    return this.request(`/achievements/user/${userId}/completed`);
  }

  async unlockAchievement(userId, achievementId) {
    return this.request(`/achievements/user/${userId}/unlock/${achievementId}`, {
      method: 'POST'
    });
  }

  async updateAchievementProgress(userId, achievementId, progress) {
    return this.request(`/achievements/user/${userId}/progress/${achievementId}`, {
      method: 'PUT',
      body: JSON.stringify({ progress })
    });
  }

  async getAchievementStats(userId) {
    return this.request(`/achievements/user/${userId}/stats`);
  }

  // ===== NOUVELLES MÉTHODES SUCCÈS =====
  async getUserAchievementsWithProgress() {
    return this.request('/achievements/user-progress');
  }

  async getAchievementStats() {
    return this.request('/achievements/stats');
  }

  async checkAllAchievements() {
    return this.request('/achievements/check-all', {
      method: 'POST'
    });
  }

  async checkTaskAchievements() {
    return this.request('/achievements/check-tasks', {
      method: 'POST'
    });
  }

  async checkLevelAchievements() {
    return this.request('/achievements/check-levels', {
      method: 'POST'
    });
  }

  async checkStreakAchievements() {
    return this.request('/achievements/check-streaks', {
      method: 'POST'
    });
  }

  // Valider un succès spécifique
  async validateAchievement(achievementId) {
    return this.request(`/achievements/validate/${achievementId}`, {
      method: 'POST'
    });
  }

  // ===== ADMIN ACHIEVEMENTS =====
  async createAchievement(achievementData) {
    return this.request('/achievements', {
      method: 'POST',
      body: JSON.stringify(achievementData)
    });
  }

  async updateAchievement(achievementId, achievementData) {
    return this.request(`/achievements/${achievementId}`, {
      method: 'PUT',
      body: JSON.stringify(achievementData)
    });
  }

  async deleteAchievement(achievementId) {
    return this.request(`/achievements/${achievementId}`, {
      method: 'DELETE'
    });
  }
}

const apiService = new ApiService();
export default apiService;