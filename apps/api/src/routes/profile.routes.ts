// src/routes/profile.routes.ts
import { FastifyInstance } from 'fastify';
import type { UpsertProfileBody } from '../types/profile';
import { getMyProfile, getProfileByUserId, getProfileByProfileId, upsertProfile, recordProfileView, createLead, getProfileLeads } from '../controllers/profile.controller';
import { checkTitleAvailability, checkUsernameAvailability, saveProfileTitle, saveProfileUserName } from "../services/profile.service";
import { updateUsernameController, updateProfileMediaController } from "../controllers/profile.controller";

export async function profileRoutes(app: FastifyInstance) {

    // public
    app.get('/byUserId/:userId(\\d+)', getProfileByUserId);
    app.get('/:profileId(\\d+)', getProfileByProfileId);
    app.post('/:id/view', recordProfileView);

    app.get("/me/tags", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);

        const profile = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: {
                id: true,
                ProfileTags: {
                    select: { id: true, tag: true },
                    orderBy: { tag: "asc" },
                },
            },
        });

        if (!profile) {
            return reply.code(404).send({ message: "Profile not found" });
        }

        const tags = profile.ProfileTags.map((pt) => ({
            id: pt.id,
            name: pt.tag,
        }));

        reply.send({ tags });
    });
    //// GET /profiles/me/tags
    //app.get("/me/tags", { preHandler: [app.authenticate] }, async (req, reply) => {
    //    const userId = (req.user as any)?.id as number;
        
    //    const profile = await req.server.prisma.profile.findUnique({
    //        where: { userId },
    //        select: { id: true, ProfileTags: { select: { tag: { select: { id: true, name: true } } } } },
    //    });
    //    if (!profile) return reply.code(404).send({ message: "Profile not found" });
    //    const tags = profile.ProfileTags.map((pt) => pt.tag);
    //    reply.send({ tags });
    //});

    app.get("/username-check", async (req, reply) => {
        const { username, excludeId } = (req.query ?? {}) as { username?: string; excludeId?: string };
        if (!username) return reply.code(400).send({ ok: false, reason: "empty" });
        console.log("/profiles/username-check - " + username + "excludeId: " + excludeId)
        const res = await checkUsernameAvailability(username, excludeId ? Number(excludeId) : undefined);
        reply.send(res);
    });

    app.get("/check-title", async (req, reply) => {
        const { title, excludeId } = (req.query ?? {}) as { title?: string; excludeId?: string };
        if (!title) return reply.code(400).send({ ok: false, reason: "empty" });
        const res = await checkTitleAvailability(title, excludeId ? Number(excludeId) : undefined);
        reply.send(res);
    });

    app.get<{ Params: { id: string } }>("/:id/leads", { preHandler: app.authenticate }, getProfileLeads);

    app.patch("/username", { preHandler: [app.authenticate] }, updateUsernameController);
    app.patch("/media", { preHandler: [app.authenticate] }, updateProfileMediaController);
    app.post('/:id/leads', createLead);        // No Authorization as any one can contact, Account is not require

    app.patch("/me/tags", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
        const list = (req.body as any)?.tags as string[] | undefined;

        if (!Array.isArray(list)) {
            return reply.code(400).send({ ok: false, message: "tags must be string[]" });
        }

        const wanted = Array.from(
            new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))
        );

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: {
                id: true,
                ProfileTags: {
                    select: { id: true, tag: true },
                },
            },
        });

        if (!me) {
            return reply.code(404).send({ message: "Profile not found" });
        }

        const currentNames = new Set(me.ProfileTags.map((x) => x.tag));

        const toAddNames = wanted.filter((name) => !currentNames.has(name));
        const toRemoveNames = me.ProfileTags
            .map((x) => x.tag)
            .filter((name) => !wanted.includes(name));

        // add new rows
        if (toAddNames.length) {
            await req.server.prisma.profileTag.createMany({
                data: toAddNames.map((tag) => ({
                    profileId: me.id,
                    tag,
                })),
                skipDuplicates: true,
            });
        }

        // remove rows no longer wanted
        if (toRemoveNames.length) {
            await req.server.prisma.profileTag.deleteMany({
                where: {
                    profileId: me.id,
                    tag: { in: toRemoveNames },
                },
            });
        }

        // fetch fresh state
        const fresh = await req.server.prisma.profile.findUnique({
            where: { id: me.id },
            select: {
                ProfileTags: {
                    select: { id: true, tag: true },
                    orderBy: { tag: "asc" },
                },
            },
        });

        const tags = (fresh?.ProfileTags || []).map((pt) => ({
            id: pt.id,
            name: pt.tag,
        }));

        reply.send({ ok: true, tags });
    });

    // PATCH /profiles/me/tags   body: { tags: string[] }
    //app.patch("/me/tags", { preHandler: [app.authenticate] }, async (req, reply) => {
    //    const userId = (req.user as any)?.id as number;
    //    const list = (req.body as any)?.tags as string[] | undefined;
    //    if (!Array.isArray(list)) return reply.code(400).send({ ok: false, message: "tags must be string[]" });

    //    const wanted = Array.from(
    //        new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))
    //    );

    //    const me = await req.server.prisma.profile.findUnique({
    //        where: { userId },
    //        select: { id: true, ProfileTags: { select: { tagId: true, tag: { select: { name: true } } } } },
    //    });
    //    if (!me) return reply.code(404).send({ message: "Profile not found" });

    //    const currentNames = new Set(me.ProfileTags.map((x) => x.tag.name));
    //    const toAddNames = wanted.filter((n) => !currentNames.has(n));
    //    const toRemoveNames = me.ProfileTags.map((x) => x.tag.name).filter((n) => !wanted.includes(n));

    //    // Upsert Tag rows for any new names
    //    const addedTags = await Promise.all(
    //        toAddNames.map((name) =>
    //            req.server.prisma.tag.upsert({
    //                where: { name },
    //                update: {},
    //                create: { name },
    //                select: { id: true, name: true },
    //            })
    //        )
    //    );
    //    // Connect new links
    //    if (addedTags.length) {
    //        await req.server.prisma.profileTag.createMany({
    //            data: addedTags.map((t) => ({ profileId: me.id, tagId: t.id })),
    //            skipDuplicates: true,
    //        });
    //    }

    //    // Disconnect removed links
    //    if (toRemoveNames.length) {
    //        const removeTagIds = await req.server.prisma.tag.findMany({
    //            where: { name: { in: toRemoveNames } },
    //            select: { id: true },
    //        });
    //        await req.server.prisma.profileTag.deleteMany({
    //            where: { profileId: me.id, tagId: { in: removeTagIds.map((t) => t.id) } },
    //        });
    //    }

    //    // Return fresh list
    //    const fresh = await req.server.prisma.profile.findUnique({
    //        where: { id: me.id },
    //        select: { ProfileTags: { select: { tag: { select: { id: true, name: true } } } } },
    //    });
    //    const tags = (fresh?.ProfileTags || []).map((pt) => pt.tag);
    //    reply.send({ ok: true, tags });
    //});
    // protected
    app.get('/', { preHandler: [app.authenticate] }, getMyProfile);
    app.put<{ Body: UpsertProfileBody }>('/', { preHandler: [app.authenticate] }, upsertProfile);

    app.post("/:id(\\d+)/title", async (req, reply) => {
        const { id } = req.params as { id: string };
        const { title } = req.body as { title: string };
        if (!title) return reply.code(400).send({ ok: false, error: "INVALID_TITLE" });

        try {
            const updated = await saveProfileTitle(Number(id), title);
            reply.send({ ok: true, slug: updated.titleSlug });
        } catch (e: any) {
            // unique violation => suggest alternative via GET /profiles/check-title on the client
            reply.code(409).send({ ok: false, error: "TITLE_TAKEN" });
        }
    });

    app.post("/:id(\\d+)/username", async (req, reply) => {
        const { id } = req.params as { id: string };
        const { username } = req.body as { username: string };
        if (!username) return reply.code(400).send({ ok: false, error: "INVALID_USERNAME" });

        try {
            const updated = await saveProfileUserName(Number(id), username);
            reply.send({ ok: true, username: updated.username });
        } catch (e: any) {
            // unique violation => suggest alternative via GET /profiles/check-title on the client
            reply.code(409).send({ ok: false, error: "USERNAME_TAKEN" });
        }
    });

    //app.patch('/avatar', { preHandler: [app.authenticate] }, async (req, reply) => {
    //    const userId = (req.user as any).id as number;
    //    const { url } = (req.body as any) as { url: string };
    //    if (!url) return reply.code(400).send({ ok: false, error: 'NO_URL' });

    //    const updated = await req.server.prisma.profile.update({
    //        where: { userId },
    //        data: { profile_picture_url: url },
    //        select: { id: true, profile_picture_url: true },
    //    });
    //    reply.send({ ok: true, profile: updated });
    //});

    //app.patch('/cover', { preHandler: [app.authenticate] }, async (req, reply) => {
    //    const userId = (req.user as any).id as number;
    //    const { url } = (req.body as any) as { url: string };
    //    if (!url) return reply.code(400).send({ ok: false, error: 'NO_URL' });

    //    const updated = await req.server.prisma.profile.update({
    //        where: { userId },
    //        data: { hero_banner_url: url },
    //        select: { id: true, hero_banner_url: true },
    //    });
    //    reply.send({ ok: true, profile: updated });
    //});

    // PATCH avatar
    app.patch('/me/avatar', { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = (req.user as any).id as number;
        const { url } = req.body as { url: string };
        if (!url) return reply.code(400).send({ ok: false, error: 'NO_URL' });

        const updated = await req.server.prisma.profile.update({
            where: { userId },
            data: { profile_picture_url: url },
            select: { id: true, profile_picture_url: true },
        });
        return { ok: true, profile: updated };
    });

    // PATCH hero banner
    app.patch('/me/hero-banner', { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = (req.user as any).id as number;
        const { url } = req.body as { url: string };
        if (!url) return reply.code(400).send({ ok: false, error: 'NO_URL' });

        const updated = await req.server.prisma.profile.update({
            where: { userId },
            data: { hero_banner_url: url },
            select: { id: true, hero_banner_url: true },
        });
        return { ok: true, profile: updated };
    });

    /*
    // FOLLOW
    app.post('/profiles/:id/follow', { preHandler: [app.authenticate] }, async (req, reply) => {
      const me = req.user.id, target = req.params.id;
      if (me === target) return reply.code(400).send({ error: 'cannot_follow_self' });
      await req.server.prisma.follow.insert({ follower_id: me, followee_id: target }).onConflictDoNothing();
      return reply.code(204).send();
    });

    app.delete('/profiles/:id/follow', { preHandler: [app.authenticate] }, async (req, reply) => {
      const me = req.user.id, target = req.params.id;
      await req.server.prisma.follow.delete({ follower_id: me, followee_id: target });
      return reply.code(204).send();
    });

    app.get('/profiles/:id/followers', async (req, reply) => {
      const id = req.params.id;
      const rows = await req.server.prisma.$query/*sql`
        SELECT p.id, p.username, p.bio, p.avatar_url
        FROM follows f JOIN profiles p ON p.id = f.follower_id
        WHERE f.followee_id = ${id}
        ORDER BY f.created_at DESC
        LIMIT ${req.query.limit ?? 20} OFFSET ${req.query.offset ?? 0}
      `;
      reply.send({ items: rows });
    });

    app.get('/profiles/:id/following', async (req, reply) => {
      const id = req.params.id;
      const rows = await req.server.prisma.$query/*sql`
        SELECT p.id, p.username, p.bio, p.avatar_url
        FROM follows f JOIN profiles p ON p.id = f.followee_id
        WHERE f.follower_id = ${id}
        ORDER BY f.created_at DESC
        LIMIT ${req.query.limit ?? 20} OFFSET ${req.query.offset ?? 0}
      `;
      reply.send({ items: rows });
    });

    app.get('/profiles/me/follows', { preHandler: auth }, async (req, reply) => {
      const me = req.user.id;
      const ids = await req.server.prisma.follow.findMany({ where: { follower_id: me }, select: ['followee_id'] });
      reply.send({ ids: ids.map(x => x.followee_id) });
    });

    // LIKES
    app.post('/media/:id/like', { preHandler: auth }, async (req, reply) => {
      await req.server.prisma.media_likes.insert({ profile_id: req.user.id, media_id: req.params.id }).onConflictDoNothing();
      reply.code(204).send();
    });

    app.delete('/media/:id/like', { preHandler: auth }, async (req, reply) => {
      await req.server.prisma.media_likes.delete({ profile_id: req.user.id, media_id: req.params.id });
      reply.code(204).send();
    });

    
    app.get('/media/:id/likes', async (req, reply) => {
      const id = req.params.id;
      const [countRow] = await db.$query`SELECT COUNT(*)::int AS count FROM media_likes WHERE media_id=${id}`;
      const recent = await db.$query/*sql`
        SELECT p.id, p.username, p.avatar_url
        FROM media_likes ml JOIN profiles p ON p.id = ml.profile_id
        WHERE ml.media_id=${id}
        ORDER BY ml.created_at DESC
        LIMIT 12
      `;
      reply.send({ count: countRow.count, recent });
    });

    // FEED
    app.get('/feed', { preHandler: auth }, async (req, reply) => {
      const me = req.user.id;
      const limit = Number(req.query.limit ?? 20);
      const cursor = req.query.cursor ?? null;

      const rows = await db.$query/*sql`
        WITH following AS (
          SELECT followee_id FROM follows WHERE follower_id=${me}
        )
        SELECT m.id, m.url, m.created_at, m.owner_id,
               p.username, p.avatar_url,
               EXISTS(SELECT 1 FROM media_likes ml WHERE ml.media_id=m.id AND ml.profile_id=${me}) AS liked_by_me,
               (SELECT COUNT(*) FROM media_likes ml WHERE ml.media_id=m.id) AS like_count
        FROM media m
        JOIN following f ON f.followee_id = m.owner_id
        JOIN profiles p ON p.id = m.owner_id
        WHERE (${cursor}::timestamptz IS NULL OR m.created_at < ${cursor}::timestamptz)
        ORDER BY m.created_at DESC
        LIMIT ${limit};
      `;
      const nextCursor = rows.length === limit ? rows[rows.length - 1].created_at : null;
      reply.send({ items: rows, nextCursor });
    });

    */

}