import apiService from './api';

class ExperienceService {
    static async updateExperience(userId, amount) {
        try {
            const response = await apiService.addUserExperience(userId, amount);
            
            if (response.success) {
                return response.progression;
            } else {
                throw new Error(response.message || 'Erreur lors de la mise à jour de l\'expérience');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'expérience:', error);
            throw error;
        }
    }

    static async getUserProgression(userId) {
        try {
            const response = await apiService.getUserProgression(userId);
            
            if (response.success) {
                return response.progression;
            } else {
                throw new Error(response.message || 'Erreur lors de la récupération de la progression');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la progression:', error);
            throw error;
        }
    }

    static async updateUserProgression(userId, progressionData) {
        try {
            const response = await apiService.updateUserProgression(userId, progressionData);
            
            if (response.success) {
                return response.progression;
            } else {
                throw new Error(response.message || 'Erreur lors de la mise à jour de la progression');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la progression:', error);
            throw error;
        }
    }

    static async getUserStats(userId) {
        try {
            const response = await apiService.getUserStats(userId);
            
            if (response.success) {
                return response.stats;
            } else {
                throw new Error(response.message || 'Erreur lors de la récupération des statistiques');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }
}

export default ExperienceService;