/**
 * Service API qui gère les communications avec le backend PHP
 */
const API_URL = 'http://localhost/focus-carot-web/backend';

class ApiService {
  async getItems() {
    try {
      const response = await fetch(`${API_URL}/api/items`);
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments:', error);
      throw error;
    }
  }

  async getItem(id) {
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`);
      if (!response.ok) {
        throw new Error('Élément non trouvé');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'élément ${id}:`, error);
      throw error;
    }
  }

  async createItem(itemData) {
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'élément:', error);
      throw error;
    }
  }

  async updateItem(id, itemData) {
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'élément ${id}:`, error);
      throw error;
    }
  }

  async deleteItem(id) {
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'élément ${id}:`, error);
      throw error;
    }
  }
}

export default new ApiService();
