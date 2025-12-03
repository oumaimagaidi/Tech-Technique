import { Database } from '../config/database';

export interface Property {
    id: string;
    title: string;
    city: string;
    price: number;
    surface: number;
    bedrooms?: number;
    bathrooms?: number;
    type: string;
    image_url?: string;
    created_at: Date;
}

export class PropertiesService {
    async findAll(filters?: {
        city?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: string;
    }): Promise<Property[]> {
        const connection = await Database.getConnection();

        try {
            let query = 'SELECT * FROM properties WHERE 1=1';
            const params: any[] = [];

            if (filters?.city) {
                query += ' AND city = ?';
                params.push(filters.city);
            }

            if (filters?.type) {
                query += ' AND type = ?';
                params.push(filters.type);
            }

            if (filters?.minPrice) {
                query += ' AND price >= ?';
                params.push(filters.minPrice);
            }

            if (filters?.maxPrice) {
                query += ' AND price <= ?';
                params.push(filters.maxPrice);
            }

            query += ' ORDER BY created_at DESC';

            const [rows] = await connection.execute(query, params);
            return rows as Property[];
        } finally {
            connection.release();
        }
    }

    async findById(id: string): Promise<Property | null> {
        const connection = await Database.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT * FROM properties WHERE id = ?',
                [id]
            );

            const properties = rows as Property[];
            return properties[0] || null;
        } finally {
            connection.release();
        }
    }

    async create(data: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
        const connection = await Database.getConnection();

        try {
            const id = crypto.randomUUID();

            await connection.execute(
                `INSERT INTO properties (id, title, city, price, surface, bedrooms, bathrooms, type, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    data.title,
                    data.city,
                    data.price,
                    data.surface,
                    data.bedrooms || null,
                    data.bathrooms || null,
                    data.type,
                    data.image_url || null
                ]
            );

            return this.findById(id) as Promise<Property>;
        } finally {
            connection.release();
        }
    }

    async update(id: string, data: Partial<Property>): Promise<Property | null> {
  const connection = await Database.getConnection();
  try {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updates: string[] = [];
    const params: any[] = [];

    if (data.title !== undefined) { 
      updates.push('title = ?'); 
      params.push(data.title); 
    }
    
    if (data.city !== undefined) { 
      updates.push('city = ?'); 
      params.push(data.city); 
    }
    
    if (data.price !== undefined) { 
      updates.push('price = ?'); 
      params.push(data.price); 
    }
    
    if (data.surface !== undefined) { 
      updates.push('surface = ?'); 
      params.push(data.surface); 
    }
    
    if (data.bedrooms !== undefined) {
      if (data.bedrooms === null  || Number(data.bedrooms) <= 0) {
        updates.push('bedrooms = NULL');
      } else {
        updates.push('bedrooms = ?');
        params.push(Number(data.bedrooms)); 
      }
    }
    
    if (data.bathrooms !== undefined) {
      if (data.bathrooms === null  || Number(data.bathrooms) <= 0) {
        updates.push('bathrooms = NULL');
      } else {
        updates.push('bathrooms = ?');
        params.push(Number(data.bathrooms)); 
      }
    }
    
    if (data.type !== undefined) { 
      updates.push('type = ?'); 
      params.push(data.type); 
    }
    
    if (data.image_url !== undefined) {
      if (data.image_url === '') {
        updates.push('image_url = NULL');
      } else {
        updates.push('image_url = ?');
        params.push(data.image_url);
      }
    }

    if (updates.length === 0) {
      return existing;
    }

    params.push(id);
    
    await connection.execute(
      `UPDATE properties SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    return this.findById(id);
  } finally { 
    connection.release(); 
  }
}

    async delete(id: string): Promise<boolean> {
        const connection = await Database.getConnection();

        try {
            const [result] = await connection.execute(
                'DELETE FROM properties WHERE id = ?',
                [id]
            );

            return (result as any).affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    async getCities(): Promise<string[]> {
        const connection = await Database.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT DISTINCT city FROM properties ORDER BY city'
            );

            const cities = rows as { city: string }[];
            return cities.map(c => c.city);
        } finally {
            connection.release();
        }
    }
    
}