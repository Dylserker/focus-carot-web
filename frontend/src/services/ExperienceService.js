class ExperienceService {
    static async updateExperience(userId, amount) {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${userId}/experience`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ experience: amount })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            return data.progression;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'expérience:', error);
            throw error;
        }
    }
}

export default ExperienceService;