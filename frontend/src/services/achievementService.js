const API_URL = 'http://localhost:8000';

export const getAllAchievements = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(`${API_URL}/api/achievements`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la récupération des succès');
        }

        const data = await response.json();
        return {
            success: true,
            achievements: data.achievements || []
        };
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const getUserAchievements = async (userId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(`${API_URL}/api/users/${userId}/achievements`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des succès de l\'utilisateur');
        }

        const data = await response.json();
        return {
            success: true,
            achievements: data.achievements || []
        };
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};