const API_BASE_URL = 'http://localhost:3001/api';

export interface Favorite {
  id: string;
  property_id: string;
  user_id: string;
  created_at: string;
}

export interface FavoriteWithProperty extends Favorite {
  property_title: string;
  property_city: string;
  property_price: number;
  property_image: string;
}

export const favoriteService = {
  // Récupérer les favoris d'un utilisateur
  async getUserFavorites(userId: string): Promise<FavoriteWithProperty[]> {
    const response = await fetch(`${API_BASE_URL}/favorites?userId=${userId}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch favorites');
    }
    
    return result.data;
  },

  // Ajouter ou retirer un favori
  async toggleFavorite(userId: string, propertyId: string): Promise<{ action: string }> {
    const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, propertyId }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to toggle favorite');
    }
    
    return { action: result.action };
  },

  // Vérifier si un bien est en favori
  async checkFavorite(userId: string, propertyId: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/favorites/check?userId=${userId}&propertyId=${propertyId}`
    );
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to check favorite');
    }
    
    return result.data.isFavorite;
  },

  async getFavoriteCount(userId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/favorites/count/${userId}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get favorite count');
    }
    
    return result.data.count;
  },
};