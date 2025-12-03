import { FastifyRequest, FastifyReply } from 'fastify';
import { FavoritesService } from '../services/favorites.service';

const favoritesService = new FavoritesService();

export class FavoritesController {
    async getUserFavorites(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId } = request.query as { userId: string };

            if (!userId) {
                return reply.status(400).send({
                    success: false,
                    error: 'User ID is required'
                });
            }

            const favorites = await favoritesService.getUserFavorites(userId);

            reply.send({
                success: true,
                data: favorites
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to fetch favorites'
            });
        }
    }

    async toggleFavorite(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId, propertyId } = request.body as { userId: string; propertyId: string };

            if (!userId || !propertyId) {
                return reply.status(400).send({
                    success: false,
                    error: 'User ID and Property ID are required'
                });
            }

            const result = await favoritesService.toggleFavorite(userId, propertyId);

            reply.send({
                success: true,
                action: result.action,
                data: result.favorite || null
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to toggle favorite'
            });
        }
    }

    async checkFavorite(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId, propertyId } = request.query as { userId: string; propertyId: string };

            if (!userId || !propertyId) {
                return reply.status(400).send({
                    success: false,
                    error: 'User ID and Property ID are required'
                });
            }

            const isFavorite = await favoritesService.isFavorite(userId, propertyId);

            reply.send({
                success: true,
                data: { isFavorite }
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to check favorite status'
            });
        }
    }

    async getFavoriteCount(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId } = request.params as { userId: string };

            if (!userId) {
                return reply.status(400).send({
                    success: false,
                    error: 'User ID is required'
                });
            }

            const count = await favoritesService.getFavoriteCount(userId);

            reply.send({
                success: true,
                data: { count }
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to get favorite count'
            });
        }
    }
}