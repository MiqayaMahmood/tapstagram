// src/controllers/bookmarks.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';

function getUserId(req: FastifyRequest): number {
    const u = (req as any).user as { id: number } | undefined;
    if (!u?.id) throw new Error('Missing user in request');
    return u.id;
}

// GET /bookmarks (my bookmarks)
export async function listMyBookmarks(req: FastifyRequest, reply: FastifyReply) {
    const userId = getUserId(req);
    const items = await req.server.prisma.bookmark.findMany({
        where: { userId },
        include: { profile: true },
        orderBy: { created_at: 'desc' },
    });
    return reply.send(items);
}

// POST /bookmarks  { profileId }
export async function createBookmark(
    req: FastifyRequest<{ Body: { profileId: number } }>,
    reply: FastifyReply
) {
    const userId = getUserId(req);
    const { profileId } = req.body;
    const created = await req.server.prisma.bookmark.upsert({
        where: { userId_profileId: { userId, profileId } },
        update: {}, // already exists → noop
        create: { userId, profileId },
    });
    return reply.code(201).send(created);
}

// DELETE /bookmarks/:profileId
export async function deleteBookmark(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    const userId = getUserId(req);
    const profileId = Number(req.params.profileId);
    await req.server.prisma.bookmark.delete({
        where: { userId_profileId: { userId, profileId } },
    }).catch(() => { }); // ignore if not found
    return reply.code(204).send();
}

// GET /bookmarks/check/:profileId → { bookmarked: boolean }
export async function isBookmarked(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    const userId = getUserId(req);
    const profileId = Number(req.params.profileId);
    const b = await req.server.prisma.bookmark.findUnique({
        where: { userId_profileId: { userId, profileId } },
    });
    return reply.send({ bookmarked: !!b });
}

// GET /bookmarks/count/:profileId → { count: number }
export async function bookmarkCount(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    const profileId = Number(req.params.profileId);
    const count = await req.server.prisma.bookmark.count({ where: { profileId } });
    return reply.send({ count });
}
