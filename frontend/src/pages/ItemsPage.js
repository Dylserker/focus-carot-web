import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import Button from '../component/Button';
import Input from '../component/Input';

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await apiService.getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des éléments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const newItem = await apiService.createItem({ name: newItemName });
      setItems([...items, newItem]);
      setNewItemName('');
    } catch (err) {
      setError('Erreur lors de la création de l\'élément');
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await apiService.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'élément');
      console.error(err);
    }
  };

  return (
    <div className="items-page">
      <h1>Liste des éléments</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleCreateItem} className="item-form">
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nom du nouvel élément"
        />
        <Button type="submit" variant="primary">Ajouter</Button>
      </form>
      
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <ul className="items-list">
          {items.length === 0 ? (
            <p>Aucun élément disponible</p>
          ) : (
            items.map(item => (
              <li key={item.id} className="item">
                <span>{item.name}</span>
                <Button 
                  onClick={() => handleDeleteItem(item.id)}
                  variant="danger"
                  size="small"
                >
                  Supprimer
                </Button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ItemsPage;
