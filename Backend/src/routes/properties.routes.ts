import { FastifyInstance } from 'fastify';
import { PropertiesController } from '../controllers/properties.controller';

const controller = new PropertiesController();

export async function propertiesRoutes(fastify: FastifyInstance) {
    // GET /api/properties - Liste des biens (avec filtres)
    fastify.get('/', controller.getAll);

    // GET /api/properties/cities - Liste des villes disponibles
    fastify.get('/cities', controller.getCities);

    // GET /api/properties/:id - Un bien par ID
    fastify.get('/:id', controller.getById);

    // POST /api/properties - Créer un bien
    fastify.post('/', controller.create);

    // PUT /api/properties/:id - Mettre à jour un bien
    fastify.put('/:id', controller.update);

    // DELETE /api/properties/:id - Supprimer un bien
    fastify.delete('/:id', controller.delete);
}