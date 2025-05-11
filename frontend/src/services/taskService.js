const API_URL = 'http://localhost:8000';

export const createTask = async (taskData) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                ...taskData,
                user_id: user.id
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la création de la tâche');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const getTasks = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(`${API_URL}/api/tasks/user/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des tâches');
        }

        const data = await response.json();
        return {
            success: true,
            tasks: data.tasks || []
        };
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de la tâche');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la tâche');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};