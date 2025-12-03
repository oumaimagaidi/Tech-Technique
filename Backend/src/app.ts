import Fastify from 'fastify';
import cors from '@fastify/cors';
import { propertiesRoutes } from './routes/properties.routes';
import { favoritesRoutes } from './routes/favorites.routes';
import { Database } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify();

// CORS
app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8081'
});

// Routes
app.register(propertiesRoutes, { prefix: '/api/properties' });
app.register(favoritesRoutes, { prefix: '/api/favorites' });

// Health check
app.get('/health', async () => {
    return { status: 'OK', timestamp: new Date().toISOString() };
});

// Gestion d'erreur
app.setErrorHandler((error, request, reply) => {
    console.error('Error:', error);

    reply.status(500).send({
        success: false,
        error: 'Internal server error'
    });
});

// Démarrer le serveur
const start = async () => {
    try {
        // Initialiser la DB
        await Database.getConnection();

        const port = parseInt(process.env.PORT || '3001');
        await app.listen({ port, host: '0.0.0.0' });

        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`📡 Health check: http://localhost:${port}/health`);
        console.log(`🏠 Properties API: http://localhost:${port}/api/properties`);
        console.log(`⭐ Favorites API: http://localhost:${port}/api/favorites`);

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

start();