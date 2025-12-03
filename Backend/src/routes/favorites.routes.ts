import { FastifyInstance } from 'fastify';
import { FavoritesController } from '../controllers/favorites.controller';

const controller = new FavoritesController();

export async function favoritesRoutes(fastify: FastifyInstance) {
    // GET /api/favorites - Favoris d'un utilisateur
    fastify.get('/', controller.getUserFavorites);

    // POST /api/favorites/toggle - Ajouter/retirer un favori
    fastify.post('/toggle', controller.toggleFavorite);

    // GET /api/favorites/check - Vérifier si un bien est en favori
    fastify.get('/check', controller.checkFavorite);

    // GET /api/favorites/count/:userId - Nombre de favoris
    fastify.get('/count/:userId', controller.getFavoriteCount);
}