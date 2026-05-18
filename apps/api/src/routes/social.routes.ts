// src/routes/social.ts
import { FastifyPluginAsync } from 'fastify';
import { requireAuth } from '../plugins/auth';
import { FastifyInstance } from 'fastify';

//const socialRoutes: FastifyPluginAsync = async (app) => {
    export async function socialRoutes(app: FastifyInstance) {
    const prisma = app.db;

    // Resolve current user's Profile.id (1:1)
    async function getMyProfileId(userId: number) {
        const prof = await prisma.profile.findFirst({
            where: { userId },
            select: { id: true },
        });
        return prof?.id ?? null;
    }

    // ---------- FOLLOW ----------
    // Follow a profile (param :id is Profile.id)
    app.post('/profiles/:id/follow', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const targetProfileId = Number((req.params as { id: string }).id);
        if (!Number.isFinite(meUserId) || !Number.isFinite(targetProfileId)) {
            return reply.code(400).send({ error: 'invalid_id' });
        }

        const myProfileId = await getMyProfileId(meUserId);
        if (myProfileId && myProfileId === targetProfileId) {
            return reply.code(400).send({ error: 'cannot_follow_self' });
        }

        await prisma.follow.createMany({
            data: [{ followerId: meUserId, profileId: targetProfileId }],
            skipDuplicates: true,
        });
        reply.code(204).send();
    });

    // Unfollow a profile
    app.delete('/profiles/:id/follow', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const targetProfileId = Number((req.params as { id: string }).id);
        if (!Number.isFinite(meUserId) || !Number.isFinite(targetProfileId)) {
            return reply.code(400).send({ error: 'invalid_id' });
        }

        await prisma.follow.deleteMany({
            where: { followerId: meUserId, profileId: targetProfileId },
        });
        reply.code(204).send();
    });

    // Followers of a profile (people who follow THIS profile)
    app.get('/profiles/:id/followers', async (req, reply) => {
        const profileId = Number((req.params as { id: string }).id);
        const limit = Math.min(50, Number((req.query as any).limit ?? 20));
        const offset = Number((req.query as any).offset ?? 0);
        if (!Number.isFinite(profileId)) return reply.code(400).send({ error: 'invalid_id' });

        const rows = await prisma.follow.findMany({
            where: { profileId },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
            select: {
                follower: {
                    select: {
                        id: true,
                        profile: { select: { id: true, username: true, profile_picture_url: true, bio: true } },
                    },
                },
            },
        });

        // Some users may not have a profile yet
        const items = rows.map(r => r.follower.profile).filter(Boolean);
        reply.send({ items });
    });

    // Profiles the owner of :id is following
    // :id is Profile.id → find its userId, then list follows by that userId
    app.get('/profiles/:id/following', async (req, reply) => {
        const profileId = Number((req.params as { id: string }).id);
        const limit = Math.min(50, Number((req.query as any).limit ?? 20));
        const offset = Number((req.query as any).offset ?? 0);
        if (!Number.isFinite(profileId)) return reply.code(400).send({ error: 'invalid_id' });

        const owner = await prisma.profile.findUnique({
            where: { id: profileId },
            select: { userId: true },
        });
        if (!owner?.userId) return reply.send({ items: [] });

        const rows = await prisma.follow.findMany({
            where: { followerId: owner.userId },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
            select: {
                profile: { select: { id: true, username: true, profile_picture_url: true, bio: true } },
            },
        });

        reply.send({ items: rows.map(r => r.profile) });
    });

    // Quick list of profile IDs the current user follows
    app.get('/profiles/me/follows', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const rows = await prisma.follow.findMany({
            where: { followerId: meUserId },
            select: { profileId: true },
        });
        reply.send({ ids: rows.map(r => r.profileId) });
    });

    // ---------- LIKES ----------
    // Like a media (uses current Profile.id)
    app.post('/media/:id/like', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const mediaId = (req.params as { id: string }).id; // uuid string
        if (!mediaId) return reply.code(400).send({ error: 'invalid_id' });

        const myProfileId = await getMyProfileId(meUserId);
        if (!myProfileId) return reply.code(400).send({ error: 'profile_required' });

        await prisma.mediaLike.createMany({
            data: [{ profileId: myProfileId, mediaId }],
            skipDuplicates: true,
        });

        reply.code(204).send();
    });

    // Unlike a media
    app.delete('/media/:id/like', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const mediaId = (req.params as { id: string }).id; // uuid string
        if (!mediaId) return reply.code(400).send({ error: 'invalid_id' });

        const myProfileId = await getMyProfileId(meUserId);
        if (!myProfileId) return reply.code(400).send({ error: 'profile_required' });

        await prisma.mediaLike.deleteMany({
            where: { profileId: myProfileId, mediaId },
        });

        reply.code(204).send();
    });

    // Like summary for a media
    app.get('/media/:id/likes', async (req, reply) => {
        const mediaId = (req.params as { id: string }).id;
        if (!mediaId) return reply.code(400).send({ error: 'invalid_id' });

        const [count, recent] = await Promise.all([
            prisma.mediaLike.count({ where: { mediaId } }),
            prisma.mediaLike.findMany({
                where: { mediaId },
                orderBy: { created_at: 'desc' },
                take: 12,
                select: {
                    profile: { select: { id: true, username: true, profile_picture_url: true } },
                },
            }),
        ]);

        reply.send({ count, recent: recent.map(r => r.profile) });
    });

    // ---------- FEED ----------
    app.get('/feed', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const limit = Math.min(50, Number((req.query as any).limit ?? 20));
        const cursorStr = (req.query as any).cursor as string | undefined;
        const cursorDate = cursorStr ? new Date(cursorStr) : undefined;

        // Get Profile IDs I follow
        const following = await prisma.follow.findMany({
            where: { followerId: meUserId },
            select: { profileId: true },
        });
        const followeeIds = following.map(f => f.profileId);
        if (followeeIds.length === 0) {
            return reply.send({ items: [], nextCursor: null });
        }

        const myProfileId = await getMyProfileId(meUserId);

        const media = await prisma.media.findMany({
            where: {
                owner_id: { in: followeeIds },
                ...(cursorDate ? { created_at: { lt: cursorDate } } : {}),
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            include: {
                owner: { select: { username: true, profile_picture_url: true } },
                _count: { select: { likes: true } }, // relation name on Media
                ...(myProfileId
                    ? {
                        likes: {
                            where: { profileId: myProfileId },
                            select: { mediaId: true },
                            take: 1,
                        },
                    }
                    : {}),
            },
        });

        const items = media.map(m => ({
            id: m.id,
            url: m.url,
            created_at: m.created_at,
            owner_id: m.owner_id,
            username: m.owner.username,
            profile_picture_url: m.owner.profile_picture_url,
            liked_by_me: myProfileId ? (m as any).likes?.length > 0 : false,
            like_count: m._count.likes,
        }));

        const nextCursor = media.length === limit ? media[media.length - 1].created_at : null;
        reply.header('Cache-Control', 'private, max-age=15');
        reply.send({ items, nextCursor });
    });

    // ---------- Analytics (7d) ----------
    app.get('/analytics/follow/summary', { preHandler: requireAuth }, async (req, reply) => {
        const meUserId = Number((req.user as { id: number | string }).id);
        const myProfileId = await getMyProfileId(meUserId);
        if (!myProfileId) return reply.code(400).send({ error: 'profile_required' });

        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [newFollowers7d, likesReceived7d, followersNow, top] = await Promise.all([
            prisma.follow.count({ where: { profileId: myProfileId, createdAt: { gte: since } } }),
            prisma.mediaLike.count({
                where: { created_at: { gte: since }, media: { owner_id: myProfileId } },
            }),
            prisma.follow.count({ where: { profileId: myProfileId } }),
            prisma.mediaLike.groupBy({
                by: ['mediaId'],
                where: { created_at: { gte: since }, media: { owner_id: myProfileId } },
                _count: { mediaId: true },
                orderBy: { _count: { mediaId: 'desc' } },
                take: 5,
            }),
        ]);

        const topMedia = await prisma.media.findMany({
            where: { id: { in: top.map(t => t.mediaId) } },
            select: { id: true, url: true },
        });
        const urlById = new Map(topMedia.map(m => [m.id, m.url]));
        const topMediaByLikes7d = top.map(t => ({
            id: t.mediaId,
            url: urlById.get(t.mediaId) ?? null,
            like_count: t._count.mediaId,
        }));

        const engagementRate7d = followersNow > 0 ? likesReceived7d / followersNow : 0;
        reply.send({ newFollowers7d, likesReceived7d, engagementRate7d, topMediaByLikes7d });
    });

    // -------- Dashboard metrics extension
    
  /*
  app.get('/analytics/dashboard/summary', { preHandler: requireAuth }, async (req, reply) => {
    const me = req.user.id;
    const [{ count: newFollowers7d }] = await db.$query/* sql `
      SELECT COUNT(*)::int AS count FROM follows
      WHERE followee_id=${me} AND created_at >= now() - interval '7 days'
    `;
    const [{ count: likesReceived7d }] = await db.$query/* sql `
      SELECT COUNT(*)::int AS count FROM media_likes ml
      JOIN media m ON m.id=ml.media_id
      WHERE m.owner_id=${me} AND ml.created_at >= now() - interval '7 days'
    `;
    const [{ count: followersNow }] = await db.$query/* sql `
      SELECT COUNT(*)::int AS count FROM follows WHERE followee_id=${me}
    `;
    const topMediaByLikes7d = await db.$query/* sql `
      SELECT m.id, m.url, COUNT(ml.*)::int AS like_count
      FROM media_likes ml JOIN media m ON m.id=ml.media_id
      WHERE m.owner_id=${me} AND ml.created_at >= now() - interval '7 days'
      GROUP BY m.id
      ORDER BY like_count DESC
      LIMIT 5
    `;
    const engagementRate7d = followersNow > 0 ? likesReceived7d / followersNow : 0;
    reply.send({ newFollowers7d, likesReceived7d, engagementRate7d, topMediaByLikes7d });
  });

  */

};


//export default socialRoutes;
