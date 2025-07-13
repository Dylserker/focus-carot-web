import apiService from './api';

export const createTask = async (taskData) => {
    try {
        const response = await apiService.createTask(taskData);
        return response;
    } catch (error) {
        console.error('Erreur lors de la création de la tâche:', error);
        throw error;
    }
};

export const getTasks = async (filters = {}) => {
    try {
        const response = await apiService.getMyTasks(filters);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        throw error;
    }
};

export const getUserTasks = async (userId, filters = {}) => {
    try {
        const response = await apiService.getUserTasks(userId, filters);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches utilisateur:', error);
        throw error;
    }
};

export const getTask = async (taskId) => {
    try {
        const response = await apiService.getTask(taskId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération de la tâche:', error);
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        const response = await apiService.updateTask(taskId, taskData);
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await apiService.deleteTask(taskId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
        throw error;
    }
};

export const completeTask = async (taskId) => {
    try {
        const response = await apiService.completeTask(taskId);
        return response;
    } catch (error) {
        console.error('Erreur lors de la finalisation de la tâche:', error);
        throw error;
    }
};

export const getTaskStats = async () => {
    try {
        const response = await apiService.getTaskStats();
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des tâches:', error);
        throw error;
    }
};