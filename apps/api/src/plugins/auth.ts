// src/plugins/auth.ts
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Tell TS what "user" looks like on req after jwtVerify()
//declare module '@fastify/jwt' {
//    // Adjust shape if your JWT has more fields
//    interface FastifyJWT {
//        user: { id: string }; // <- req.user
//        payload: { id: string };
//    }
//}
declare module '@fastify/jwt' {
    interface FastifyJWT {
        // what you put into the token:
        payload: { id: number; email: string };
        // what you get back on request.user after verify:
        user: { id: number; email: string };
    }
}

// Optional (helps when not all files import @fastify/jwt types)
//declare module 'fastify' {
//    interface FastifyRequest {
//        user: { id: string } | null;
//    }
//    interface FastifyInstance {
//        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//    }
//}

const authPlugin = fp(async (app: FastifyInstance) => {
    // Decorator so you can do: { preHandler: app.authenticate } when registering routes inline
    app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify(); // sets request.user
        } catch {
            return reply.code(401).send({ error: 'unauthorized' });
        }
    });
}, { name: 'auth-plugin' });

export default authPlugin;

// Named export for route files that do: import { requireAuth } from '../plugins/auth'
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
    try {
        await req.jwtVerify();
    } catch {
        return reply.code(401).send({ error: 'unauthorized' });
    }
}
