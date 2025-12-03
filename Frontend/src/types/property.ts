export interface Property {
createdAt?: string; 
  updatedAt?: string;
  id: string;
  title: string;
  city: string;
  price: number;
  surface: number;
  imageUrl: string;
  bedrooms?: number;
  bathrooms?: number;
  type: 'apartment' | 'house' | 'villa' | 'studio';
}
