import { Database } from '../config/database';
import { Property } from './properties.service';

export interface Favorite {
    id: string;
    property_id: string;
    user_id: string;
    created_at: Date;
}

export interface FavoriteWithProperty extends Favorite {
    property_title: string;
    property_city: string;
    property_price: number;
    property_image: string;
}

export class FavoritesService {
    async getUserFavorites(userId: string): Promise<FavoriteWithProperty[]> {
        const connection = await Database.getConnection();

        try {
            const [rows] = await connection.execute(
                `SELECT f.*, p.title as property_title, p.city as property_city, 
                p.price as property_price, p.image_url as property_image
         FROM favorites f
         JOIN properties p ON f.property_id = p.id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`,
                [userId]
            );

            return rows as FavoriteWithProperty[];
        } finally {
            connection.release();
        }
    }

    async addFavorite(userId: string, propertyId: string): Promise<Favorite> {
        const connection = await Database.getConnection();

        try {
            const id = crypto.randomUUID();

            await connection.execute(
                'INSERT INTO favorites (id, property_id, user_id) VALUES (?, ?, ?)',
                [id, propertyId, userId]
            );

            const [rows] = await connection.execute(
                'SELECT * FROM favorites WHERE id = ?',
                [id]
            );

            const favorites = rows as Favorite[];
            return favorites[0];
        } finally {
            connection.release();
        }
    }

    async removeFavorite(userId: string, propertyId: string): Promise<boolean> {
        const connection = await Database.getConnection();

        try {
            const [result] = await connection.execute(
                'DELETE FROM favorites WHERE user_id = ? AND property_id = ?',
                [userId, propertyId]
            );

            return (result as any).affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    async toggleFavorite(userId: string, propertyId: string): Promise<{ action: string; favorite?: Favorite }> {
        const connection = await Database.getConnection();

        try {
            const [existing] = await connection.execute(
                'SELECT id FROM favorites WHERE user_id = ? AND property_id = ?',
                [userId, propertyId]
            );

            if ((existing as any[]).length > 0) {
                // Supprimer
                await this.removeFavorite(userId, propertyId);
                return { action: 'removed' };
            } else {
                // Ajouter
                const favorite = await this.addFavorite(userId, propertyId);
                return { action: 'added', favorite };
            }
        } finally {
            connection.release();
        }
    }

    async isFavorite(userId: string, propertyId: string): Promise<boolean> {
        const connection = await Database.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT id FROM favorites WHERE user_id = ? AND property_id = ?',
                [userId, propertyId]
            );

            return (rows as any[]).length > 0;
        } finally {
            connection.release();
        }
    }

    async getFavoriteCount(userId: string): Promise<number> {
        const connection = await Database.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
                [userId]
            );

            return (rows as any[])[0].count;
        } finally {
            connection.release();
        }
    }
}