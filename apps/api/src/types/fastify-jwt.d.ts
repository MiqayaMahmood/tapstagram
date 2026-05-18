// src/types/fastify-jwt.d.ts
import '@fastify/jwt';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        // payload type used when signing/verifying
        payload: { id: number; email: string };
        // what you get as req.user after jwtVerify()
        user: { id: number; email: string };
    }
}
