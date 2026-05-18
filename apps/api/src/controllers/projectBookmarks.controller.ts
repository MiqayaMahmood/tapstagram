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
    const items = await req.server.prisma.projectBookmark.findMany({
        where: { userId },
        include: { project: true },
        orderBy: { createdAt: 'desc' },
    });
    return reply.send(items);
}

// POST /bookmarks  { profileId }
export async function createBookmark(
    req: FastifyRequest<{ Body: { projectId: number } }>,
    reply: FastifyReply
) {
    const userId = getUserId(req);
    const { projectId } = req.body;
    const created = await req.server.prisma.projectBookmark.upsert({
        where: { userId_projectId: { userId, projectId } },
        update: {}, // already exists → noop
        create: { userId, projectId },
    });
    return reply.code(201).send(created);
}

// DELETE /bookmarks/:profileId
export async function deleteBookmark(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    const userId = getUserId(req);
    const projectId = Number(req.params.projectId);
    await req.server.prisma.projectBookmark.delete({
        where: { userId_projectId: { userId, projectId } },
    }).catch(() => { }); // ignore if not found
    return reply.code(204).send();
}

// GET /bookmarks/check/:profileId → { bookmarked: boolean }
export async function isBookmarked(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    const userId = getUserId(req);
    const projectId = Number(req.params.projectId);
    const b = await req.server.prisma.projectBookmark.findUnique({
        where: { userId_projectId: { userId, projectId } },
    });
    return reply.send({ bookmarked: !!b });
}

// GET /bookmarks/count/:profileId → { count: number }
export async function bookmarkCount(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    const projectId = Number(req.params.projectId);
    const count = await req.server.prisma.projectBookmark.count({ where: { projectId } });
    return reply.send({ count });
}
