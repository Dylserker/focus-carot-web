import apiService from './api';

export const getAchievements = async () => {
    try {
        const response = await apiService.getAchievements();
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des achievements:', error);
        throw error;
    }
};

export const getAchievementsByType = async (type) => {
    try {
        const response = await apiService.getAchievementsByType(type);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des achievements par type:', error);
        throw error;
    }
};

export const getAchievement = async (achievementId) => {
    try {
        const response = await apiService.getAchievement(achievementId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'achievement:', error);
        throw error;
    }
};

export const getUserAchievements = async (userId) => {
    try {
        const response = await apiService.getUserAchievements(userId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des achievements utilisateur:', error);
        throw error;
    }
};

export const getCompletedAchievements = async (userId) => {
    try {
        const response = await apiService.getCompletedAchievements(userId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des achievements complétés:', error);
        throw error;
    }
};

export const unlockAchievement = async (userId, achievementId) => {
    try {
        const response = await apiService.unlockAchievement(userId, achievementId);
        return response;
    } catch (error) {
        console.error('Erreur lors du déblocage de l\'achievement:', error);
        throw error;
    }
};

export const updateAchievementProgress = async (userId, achievementId, progress) => {
    try {
        const response = await apiService.updateAchievementProgress(userId, achievementId, progress);
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du progrès de l\'achievement:', error);
        throw error;
    }
};

export const getAchievementStats = async (userId) => {
    try {
        const response = await apiService.getAchievementStats(userId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des achievements:', error);
        throw error;
    }
};

// Fonctions admin pour la gestion des achievements
export const createAchievement = async (achievementData) => {
    try {
        const response = await apiService.createAchievement(achievementData);
        return response;
    } catch (error) {
        console.error('Erreur lors de la création de l\'achievement:', error);
        throw error;
    }
};

export const updateAchievement = async (achievementId, achievementData) => {
    try {
        const response = await apiService.updateAchievement(achievementId, achievementData);
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'achievement:', error);
        throw error;
    }
};

export const deleteAchievement = async (achievementId) => {
    try {
        const response = await apiService.deleteAchievement(achievementId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'achievement:', error);
        throw error;
    }
};