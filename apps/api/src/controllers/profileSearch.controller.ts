// src/controllers/profileSearch.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';

type QS = {
    q?: string;
    location?: string;
    tag?: string;        // if you later add profile tags/interests
    limit?: string;
    cursor?: string;     // for cursor pagination
};

export async function searchProfiles(

    req: FastifyRequest<{ Querystring: QS }>,
    reply: FastifyReply
) {
    console.log("profileSearch.controller : searchProfiles ");
    const { q, location, limit = '20', cursor } = req.query;
    const take = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

    // Basic filters; expand as needed
    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { title: { contains: q, mode: 'insensitive' } },
            { bio: { contains: q, mode: 'insensitive' } },
        ];
    }
    if (location) where.location = { contains: location, mode: 'insensitive' };

    const results = await req.server.prisma.profile.findMany({
        where,
        take: take + 1,
        ...(cursor ? { skip: 1, cursor: { id: Number(cursor) } } : {}),
        orderBy: { id: 'asc' },
        select: {
            id: true, name: true, title: true, bio: true, location: true, profile_picture_url: true,
            userId: true,
            _count: { select: { followers: true } }, // after we add follow model below
        },
    });

    const nextCursor = results.length > take ? String(results.pop()!.id) : null;
    return reply.send({ items: results, nextCursor });
}
