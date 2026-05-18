// apps/api/src/types/fastify.d.ts
import 'fastify';
import { PrismaClient } from '@prisma/client';
import type { MediaStorage } from "../storage/types";

declare module 'fastify' {
  interface FastifyInstance {
      prisma: PrismaClient;
      db: PrismaClient;
      storage: MediaStorage;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>; // optional if you want type for authenticate too
  }
}
