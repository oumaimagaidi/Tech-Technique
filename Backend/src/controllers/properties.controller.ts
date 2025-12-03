import { FastifyRequest, FastifyReply } from 'fastify';
import { PropertiesService } from '../services/properties.service';

const propertiesService = new PropertiesService();

export class PropertiesController {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const filters = request.query as any;
            const properties = await propertiesService.findAll(filters);

            reply.send({
                success: true,
                data: properties
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to fetch properties'
            });
        }
    }

    async getById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const property = await propertiesService.findById(id);

            if (!property) {
                return reply.status(404).send({
                    success: false,
                    error: 'Property not found'
                });
            }

            reply.send({
                success: true,
                data: property
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to fetch property'
            });
        }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const property = await propertiesService.create(request.body as any);

            reply.status(201).send({
                success: true,
                data: property
            });
        } catch (error) {
            reply.status(400).send({
                success: false,
                error: 'Failed to create property'
            });
        }
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };

           
            console.log('🔄 UPDATE Controller - ID:', id);
            console.log('🔄 UPDATE Controller - Body:', request.body);

            const property = await propertiesService.update(id, request.body as any);

            if (!property) {
                return reply.status(404).send({ success: false, error: 'Property not found' });
            }

            reply.send({ success: true, data: property });
        } catch (error) {
            console.error('❌ UPDATE Controller - Error:', error);
            reply.status(400).send({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update property'
            });
        }
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const deleted = await propertiesService.delete(id);

            if (!deleted) {
                return reply.status(404).send({
                    success: false,
                    error: 'Property not found'
                });
            }

            reply.send({
                success: true,
                message: 'Property deleted successfully'
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to delete property'
            });
        }
    }

    async getCities(request: FastifyRequest, reply: FastifyReply) {
        try {
            const cities = await propertiesService.getCities();

            reply.send({
                success: true,
                data: cities
            });
        } catch (error) {
            reply.status(500).send({
                success: false,
                error: 'Failed to fetch cities'
            });
        }
    }
}