// src/routes/profile.media.routes.ts
import { FastifyInstance } from 'fastify';

export async function profileMediaRoutes(app: FastifyInstance) {
    app.patch('/profiles/me/avatar', { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = (req.user as any).id as number;
        const { url } = req.body as { url?: string };
        if (!url) return reply.code(400).send({ ok: false, error: 'NO_URL' });

        const updated = await req.server.prisma.profile.update({
            where: { userId },
            data: { profile_picture_url: url },
            select: { id: true, profile_picture_url: true },
        });
        reply.send({ ok: true, profile: updated });
    });

    app.patch('/profiles/me/hero-banner', { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = (req.user as any).id as number;
        const { url } = req.body as { url?: string };
        if (!url) return reply.code(400).send({ ok: false, error: 'NO_URL' });

        const updated = await req.server.prisma.profile.update({
            where: { userId },
            data: { hero_banner_url: url },
            select: { id: true, hero_banner_url: true },
        });
        reply.send({ ok: true, profile: updated });
    });
}
