import { FastifyInstance } from 'fastify';
import { register, login } from '../controllers/auth.controller';
import { checkUsernameController } from "../controllers/profile.controller";

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (req, reply) => register(app, req, reply));
    app.post('/login', async (req, reply) => login(app, req, reply));
    app.get("/api/username/check", checkUsernameController);
}
