import { Property } from '@/types/property';

const API_BASE_URL = 'http://localhost:3001/api';

export const propertyService = {
  async getAll(filters?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
  }): Promise<Property[]> {
    const queryParams = new URLSearchParams();

    if (filters?.city) queryParams.append('city', filters.city);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';

    const response = await fetch(`${API_BASE_URL}${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch properties');
    }

    return result.data.map((prop: any) => ({
      id: prop.id,
      title: prop.title,
      city: prop.city,
      price: Number(prop.price),
      surface: Number(prop.surface),
      bedrooms: prop.bedrooms ? Number(prop.bedrooms) : undefined,
      bathrooms: prop.bathrooms ? Number(prop.bathrooms) : undefined,
      type: prop.type as 'apartment' | 'house' | 'villa' | 'studio',
      imageUrl: prop.image_url || prop.imageUrl || '',
    }));
  },

  async getById(id: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch property');
    }

    const prop = result.data;
    return {
      id: prop.id,
      title: prop.title,
      city: prop.city,
      price: Number(prop.price),
      surface: Number(prop.surface),
      bedrooms: prop.bedrooms ? Number(prop.bedrooms) : undefined,
      bathrooms: prop.bathrooms ? Number(prop.bathrooms) : undefined,
      type: prop.type as 'apartment' | 'house' | 'villa' | 'studio',
      imageUrl: prop.image_url || prop.imageUrl || '',
    };
  },

  async create(property: Omit<Property, 'id'>): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: property.title,
        city: property.city,
        price: property.price,
        surface: property.surface,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        type: property.type,
        image_url: property.imageUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create property');
    }

    const prop = result.data;
    return {
      id: prop.id,
      title: prop.title,
      city: prop.city,
      price: Number(prop.price),
      surface: Number(prop.surface),
      bedrooms: prop.bedrooms ? Number(prop.bedrooms) : undefined,
      bathrooms: prop.bathrooms ? Number(prop.bathrooms) : undefined,
      type: prop.type as 'apartment' | 'house' | 'villa' | 'studio',
      imageUrl: prop.image_url || prop.imageUrl || '',
    };
  },

  async update(id: string, property: Partial<Property>): Promise<Property> {
    console.log('🔄 UPDATE - Sending:', { id, property });

    const cleanData: any = {};
    if (property.title !== undefined) cleanData.title = property.title;
    if (property.city !== undefined) cleanData.city = property.city;
    if (property.price !== undefined) cleanData.price = property.price;
    if (property.surface !== undefined) cleanData.surface = property.surface;
    if (property.bedrooms !== undefined) cleanData.bedrooms = property.bedrooms;
    if (property.bathrooms !== undefined) cleanData.bathrooms = property.bathrooms;
    if (property.type !== undefined) cleanData.type = property.type;
    if (property.imageUrl !== undefined) cleanData.image_url = property.imageUrl;

    console.log('🔄 UPDATE - Clean data:', cleanData);

    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });

    console.log('🔄 UPDATE - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔄 UPDATE - Error:', errorText);
      throw new Error(`Failed to update property: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('🔄 UPDATE - Result:', result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to update property');
    }

    const prop = result.data;
    return {
      id: prop.id,
      title: prop.title,
      city: prop.city,
      price: Number(prop.price),
      surface: Number(prop.surface),
      bedrooms: prop.bedrooms ? Number(prop.bedrooms) : undefined,
      bathrooms: prop.bathrooms ? Number(prop.bathrooms) : undefined,
      type: prop.type as 'apartment' | 'house' | 'villa' | 'studio',
      imageUrl: prop.image_url || prop.imageUrl || '',
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete property');
    }
  },

  async getCities(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/properties/cities`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch cities');
    }

    return result.data;
  },
};