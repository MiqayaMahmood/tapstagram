// src/routes/profileSearch.routes.ts
import { FastifyInstance } from 'fastify';
import { searchProfiles } from '../controllers/profileSearch.controller';

export async function profileSearchRoutes(app: FastifyInstance) {
    app.get('/search', searchProfiles);
}
