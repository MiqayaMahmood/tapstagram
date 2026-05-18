// plugins/prisma.ts
import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin = fp(async (app: FastifyInstance) => {
    const prisma = new PrismaClient();
    await prisma.$connect();

    app.decorate('prisma', prisma);

    app.addHook('onClose', async (app) => {
        await app.prisma.$disconnect();
    });
}, {
    name: 'prisma',
});

export default prismaPlugin;
