import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

import { profileRoutes } from './routes/profile.routes';
import { socialRoutes } from './routes/social.routes';
import { projectRoutes } from './routes/project.routes';
import { authRoutes } from './routes/auth.routes';

dotenv.config();

const app = Fastify({ logger: true });

app.register(cors);

// ✅ Register JWT
app.register(jwt, {
    secret: process.env.JWT_SECRET || 'tapstagram_secret'
});

// ✅ Decorator to verify JWT
app.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }
});

// ✅ Routes
app.register(authRoutes, { prefix: '/api' });
app.register(profileRoutes, { prefix: '/api' });
app.register(socialRoutes, { prefix: '/api' });


app.listen({ port: Number(process.env.PORT) || 3001 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 API running at ${address}`);
});