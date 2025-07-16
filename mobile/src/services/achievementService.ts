import { apiService, Achievement, UserAchievement, ApiResponse } from './api';

export interface AchievementFormData {
    name: string;
    description: string;
    icon: string;
    points: number;
}

export class AchievementService {
    // Récupérer tous les succès disponibles
    async getAchievements(): Promise<{ success: boolean; data?: Achievement[]; message?: string }> {
        try {
            const response = await apiService.getAchievements();
            console.log('🔍 Réponse getAchievements:', JSON.stringify(response, null, 2));
            
            // Gérer la structure réelle de l'API
            if (response.success && (response as any).achievements) {
                return {
                    success: true,
                    data: (response as any).achievements,
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
                    message: response.error || 'Aucun succès trouvé'
                };
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des succès:', error);
            return {
                success: false,
                message: 'Erreur lors de la récupération des succès'
            };
        }
    }

    // Récupérer les succès de l'utilisateur
    async getUserAchievements(): Promise<{ success: boolean; data?: UserAchievement[]; message?: string }> {
        try {
            const response = await apiService.getUserAchievements();
            console.log('🔍 Réponse getUserAchievements:', JSON.stringify(response, null, 2));
            
            // Gérer la structure réelle de l'API
            if (response.success && (response as any).userAchievements) {
                return {
                    success: true,
                    data: (response as any).userAchievements,
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
                    message: response.error || 'Aucun succès utilisateur trouvé'
                };
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des succès utilisateur:', error);
            return {
                success: false,
                message: 'Erreur lors de la récupération des succès utilisateur'
            };
        }
    }

    // === MÉTHODES ADMIN ===
    
    // Récupérer tous les succès (admin)
    async getAdminAchievements(): Promise<{ success: boolean; data?: Achievement[]; message?: string }> {
        try {
            const response = await apiService.getAdminAchievements();
            return {
                success: response.success,
                data: response.data,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des succès admin:', error);
            return {
                success: false,
                message: 'Erreur lors de la récupération des succès admin'
            };
        }
    }

    // Créer un nouveau succès (admin)
    async createAchievement(achievementData: AchievementFormData): Promise<{ success: boolean; data?: Achievement; message?: string }> {
        try {
            const response = await apiService.createAchievement(achievementData);
            return {
                success: response.success,
                data: response.data,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors de la création du succès:', error);
            return {
                success: false,
                message: 'Erreur lors de la création du succès'
            };
        }
    }

    // Mettre à jour un succès (admin)
    async updateAchievement(achievementId: string, achievementData: Partial<Achievement>): Promise<{ success: boolean; data?: Achievement; message?: string }> {
        try {
            const response = await apiService.updateAchievement(achievementId, achievementData);
            return {
                success: response.success,
                data: response.data,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du succès:', error);
            return {
                success: false,
                message: 'Erreur lors de la mise à jour du succès'
            };
        }
    }

    // Supprimer un succès (admin)
    async deleteAchievement(achievementId: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await apiService.deleteAchievement(achievementId);
            return {
                success: response.success,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors de la suppression du succès:', error);
            return {
                success: false,
                message: 'Erreur lors de la suppression du succès'
            };
        }
    }

    // Basculer le statut bloqué d'un succès (admin)
    async toggleAchievementBlock(achievementId: string): Promise<{ success: boolean; data?: Achievement; message?: string }> {
        try {
            const response = await apiService.toggleAchievementBlock(achievementId);
            return {
                success: response.success,
                data: response.data,
                message: response.error
            };
        } catch (error) {
            console.error('Erreur lors du basculement du succès:', error);
            return {
                success: false,
                message: 'Erreur lors du basculement du succès'
            };
        }
    }

    // Valider les données d'un succès
    validateAchievementData(achievementData: AchievementFormData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!achievementData.name || achievementData.name.trim().length === 0) {
            errors.push('Le nom est requis');
        }

        if (achievementData.name && achievementData.name.trim().length > 100) {
            errors.push('Le nom ne peut pas dépasser 100 caractères');
        }

        if (!achievementData.description || achievementData.description.trim().length === 0) {
            errors.push('La description est requise');
        }

        if (achievementData.description && achievementData.description.trim().length > 500) {
            errors.push('La description ne peut pas dépasser 500 caractères');
        }

        if (!achievementData.icon || achievementData.icon.trim().length === 0) {
            errors.push('L\'icône est requise');
        }

        if (achievementData.points < 0) {
            errors.push('Les points ne peuvent pas être négatifs');
        }

        if (achievementData.points > 1000) {
            errors.push('Les points ne peuvent pas dépasser 1000');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Obtenir les statistiques des succès
    getAchievementStats(achievements: Achievement[], userAchievements: UserAchievement[]) {
        const totalAchievements = achievements.length;
        const unlockedAchievements = userAchievements.length;
        const totalPoints = userAchievements.reduce((sum, userAchievement) => {
            return sum + (userAchievement.achievement?.points || 0);
        }, 0);
        const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

        return {
            totalAchievements,
            unlockedAchievements,
            totalPoints,
            completionRate: Math.round(completionRate * 100) / 100
        };
    }

    // Vérifier si un succès est débloqué
    isAchievementUnlocked(achievementId: string, userAchievements: UserAchievement[]): boolean {
        return userAchievements.some(userAchievement => userAchievement.achievementId === achievementId);
    }

    // Obtenir la date de déblocage d'un succès
    getAchievementUnlockDate(achievementId: string, userAchievements: UserAchievement[]): string | null {
        const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);
        return userAchievement ? userAchievement.unlockedAt : null;
    }
}

export const achievementService = new AchievementService();
export default achievementService; 