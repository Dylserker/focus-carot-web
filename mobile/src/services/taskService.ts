import { apiService, Task, ApiResponse } from './api';

export interface TaskFormData {
    title: string;
    description: string;
}

export class TaskService {
    // Récupérer toutes les tâches de l'utilisateur
    async getTasks(): Promise<{ success: boolean; data?: Task[]; message?: string }> {
        try {
            const response = await apiService.getTasks();
            console.log('🔍 Réponse getTasks:', JSON.stringify(response, null, 2));
            
            // Gérer la structure réelle de l'API
            if (response.success && (response as any).tasks) {
                return {
                    success: true,
                    data: (response as any).tasks,
                    message: undefined
                };
            } else if (response.success && response.data) {
                return {
                    success: true,
                    data: response.data,
                    message: undefined
                };
            } else {
                return {
                    success: false,
                    data: undefined,
                    message: response.error || 'Aucune tâche trouvée'
                };
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches:', error);
            return {
                success: false,
                message: 'Erreur lors de la récupération des tâches'
            };
        }
    }

    // Créer une nouvelle tâche
    async createTask(taskData: TaskFormData): Promise<{ success: boolean; data?: Task; message?: string }> {
        try {
            const response = await apiService.createTask(taskData);
            console.log('🔍 Réponse createTask:', JSON.stringify(response, null, 2));
            
            // Gérer la structure réelle de l'API
            if (response.success && (response as any).task) {
                return {
                    success: true,
                    data: (response as any).task,
                    message: undefined
                };
            } else if (response.success && response.data) {
                return {
                    success: true,
                    data: response.data,
                    message: undefined
                };
            } else {
                return {
                    success: false,
                    data: undefined,
                    message: response.error || 'Impossible de créer la tâche'
                };
            }
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            return {
                success: false,
                message: 'Erreur lors de la création de la tâche'
            };
        }
    }

    // Mettre à jour une tâche
    async updateTask(taskId: string, taskData: Partial<Task>): Promise<{ success: boolean; data?: Task; message?: string }> {
        try {
            const response = await apiService.updateTask(taskId, taskData);
            return {
                success: response.success,
                data: response.data,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
            return {
                success: false,
                message: 'Erreur lors de la mise à jour de la tâche'
            };
        }
    }

    // Supprimer une tâche
    async deleteTask(taskId: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await apiService.deleteTask(taskId);
            return {
                success: response.success,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
            return {
                success: false,
                message: 'Erreur lors de la suppression de la tâche'
            };
        }
    }

    // Basculer le statut d'une tâche (complétée/non complétée)
    async toggleTaskComplete(taskId: string): Promise<{ success: boolean; data?: Task; message?: string }> {
        try {
            const response = await apiService.toggleTaskComplete(taskId);
            return {
                success: response.success,
                data: response.data,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors du basculement de la tâche:', error);
            return {
                success: false,
                message: 'Erreur lors du basculement de la tâche'
            };
        }
    }

    // Valider les données d'une tâche
    validateTaskData(taskData: TaskFormData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!taskData.title || taskData.title.trim().length === 0) {
            errors.push('Le titre est requis');
        }

        if (taskData.title && taskData.title.trim().length > 100) {
            errors.push('Le titre ne peut pas dépasser 100 caractères');
        }

        if (!taskData.description || taskData.description.trim().length === 0) {
            errors.push('La description est requise');
        }

        if (taskData.description && taskData.description.trim().length > 500) {
            errors.push('La description ne peut pas dépasser 500 caractères');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export const taskService = new TaskService();
export default taskService; 