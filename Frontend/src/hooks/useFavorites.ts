import { useState, useEffect, useCallback } from 'react';
import { favoriteService } from '@/services/favoriteService';

const USER_ID = 'user123'; // ID utilisateur fixe pour le test

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoriteService.getUserFavorites(USER_ID);
      const favoriteIds = favoritesData.map(fav => fav.property_id);
      setFavorites(favoriteIds);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des favoris');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = useCallback(async (propertyId: string) => {
    try {
      await favoriteService.toggleFavorite(USER_ID, propertyId);
      setFavorites(prev => [...prev, propertyId]);
    } catch (err) {
      console.error('Failed to add favorite:', err);
      throw err;
    }
  }, []);

  const removeFavorite = useCallback(async (propertyId: string) => {
    try {
      await favoriteService.toggleFavorite(USER_ID, propertyId);
      setFavorites(prev => prev.filter(id => id !== propertyId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      throw err;
    }
  }, []);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    try {
      if (favorites.includes(propertyId)) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites]
  );

  return {
    favorites,
    favoritesCount: favorites.length,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites,
  };
}