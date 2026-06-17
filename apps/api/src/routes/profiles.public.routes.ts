// src/routes/profiles.public.routes.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { validateQuery, validateParams } from "../utils/validate";
import path from "node:path";
import { findProfileByUsername } from "../services/profile.service";


//const BASE = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
//const toPublic = (p?: string | null) => (p ? `${BASE}/media/${path.basename(p)}` : null);

// Replace your ListQuery with a superset of the old filters + new sort/pagination
const ListQuery = z.object({
    // filters
    q: z.string().trim().optional(),
    name: z.string().trim().optional(),
    title: z.string().trim().optional(),
    location: z.string().trim().optional(),
    industry: z.string().trim().optional(),
    tags: z.string().trim().optional(),         // comma-separated
    excludeId: z.coerce.number().int().positive().optional(),

    // sort & range
    sort: z.enum(["newest", "oldest", "followers"]).default("newest"),
    range: z.string().trim().optional(),        // e.g. "7d", "30d" (optional)

    // pagination
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
});

function sinceFromRange(range?: string): Date | undefined {
    if (!range) return;
    const m = /^(\d+)\s*d$/.exec(range.toLowerCase());
    if (!m) return;
    const days = Number(m[1]);
    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    return dt;
}

const IdParams = z.object({ id: z.coerce.number().int().positive() });

// ---------- Where builder (MySQL-safe: no "mode") ----------
function buildProfileWhere(params: z.infer<typeof ListQuery>) {
    const where: any = {};

    if (params.excludeId) where.id = { not: params.excludeId };
    if (params.name) where.name = { contains: params.name };
    if (params.location) where.location = { contains: params.location };
    if (params.title) where.title = { contains: params.title };
    if (params.industry) where.industry = { contains: params.industry };

    // tags = comma-separated list; match ANY
    if (params.tags) {
        const tagList = params.tags.split(",").map(t => t.trim()).filter(Boolean);
        if (tagList.length) {
            where.profileTags = { some: { tag: { name: { in: tagList } } } };
            // If you ever want ALL tags (AND), replace the line above with:
            // where.AND = (where.AND ?? []).concat(
            //   tagList.map(tagName => ({ profileTags: { some: { tag: { name: tagName } } } }))
            // );
        }
    }

    if (params.q) {
        where.OR = [
            { name: { contains: params.q } },
            { title: { contains: params.q } },
            { bio: { contains: params.q } },
            { location: { contains: params.q } },
        ];
    }

    return where;
}

// ---------- Typed SELECT for list rows ----------
const PROFILE_LIST_SELECT = {
    id: true,
    username: true,
    name: true,
    bio: true,
    title: true,
    location: true,
    industry: true,
    plan: true,
    profile_picture_url: true,
    hero_banner_url: true,
    hasPremiumPresentation: true,
    _count: { select: { followers: true, project: true } },
    tags: { select: { tag: true } },
} as const;

type ProfileTagRelation = { tag: string };
type ProfileListRow = Prisma.ProfileGetPayload<{ select: typeof PROFILE_LIST_SELECT }> & {
    tags: ProfileTagRelation[];
};

export async function profilesPublicRoutes(app: FastifyInstance) {

    // GET /profiles — directory search (public)
    app.get("/profiles", { preHandler: [validateQuery(ListQuery)] }, async (req, reply) => {
        const params = (req as any).validatedQuery as z.infer<typeof ListQuery>;
        const skip = (params.page - 1) * params.limit;

        // Build the base filters
        const where: any = buildProfileWhere(params);

        where.userId = { ...(where.userId || {}), gte: 2 };

        // If you want to support a created_at window via ?range=7d/30d/etc
        const since = sinceFromRange(params.range);
        if (since) {
            where.created_at = { ...(where.created_at || {}), gte: since };
        }

        
        const orderByArr: Prisma.ProfileOrderByWithRelationInput[] =
            params.sort === 'followers'
                ? [{ followers: { _count: 'desc' as const } }, { created_at: 'desc' as const }]
                : (params.sort === 'newest'
                    ? [{ created_at: 'desc' as const }]
                    : [{ created_at: 'asc' as const }]);


        // Query with both where + sort + pagination
        // Query with 
        
        const [total, rows] = await Promise.all([
            req.server.prisma.profile.count({ where }),
            req.server.prisma.profile.findMany({
                where,
                orderBy: orderByArr,
                skip,
                take: params.limit,
                select: {
                    id: true,
                    username: true,
                    name: true, 
                    bio: true,
                    title: true,
                    location: true,
                    industry: true,
                    email: true,
                    profile_picture_url: true,
                    hero_banner_url: true,
                    hasPremiumPresentation: true,   
                    created_at: true,
                    plan: true,
                    _count: { select: { followers: true, project: true, } },

                        
                    
                },
            }),
        ]);
        

        const items = rows.map((p) => ({
            id: p.id,
            username: p.username,
            name: p.name,
            bio: p.bio,
            title: p.title,
            location: p.location,
            industry: p.industry ?? null,
            email: p.email ?? null,
            plan: p.plan,
            hasPremiumPresentation: p.hasPremiumPresentation,
            profile_picture_url: (p.profile_picture_url),
            hero_banner_url: (p.hero_banner_url),
            created_at: p.created_at,
            followersCount: p._count.followers,
            projectsCount: p._count.project,

        }));

        reply.send({
            total,
            page: params.page,
            pageSize: params.limit,
            items,
        });
    });

    app.get("/profiles0000", { preHandler: [validateQuery(ListQuery)] }, async (req, reply) => {
        const { sort, range, page, limit } = (req as any).validatedQuery as z.infer<typeof ListQuery>;
        const skip = (page - 1) * limit;

        if (sort === "newest") {
            const rows = await req.server.prisma.profile.findMany({
                orderBy: { created_at: "desc" },
                skip, take: limit,
                select: {
                    id: true, username: true, name: true, title: true, location: true, plan: true, hasPremiumPresentation: true,
                    profile_picture_url: true, _count: { select: { followers: true } }
                },
            });
            return reply.send({ items: rows.map(r => ({ ...r, profile_picture_url: (r.profile_picture_url) })) });
        }
        if (sort === "oldest") {
            const rows = await req.server.prisma.profile.findMany({
                orderBy: { created_at: "asc" },
                skip, take: limit,
                select: {
                    id: true, username: true, name: true, title: true, location: true, plan: true, hasPremiumPresentation: true,
                    profile_picture_url: true, _count: { select: { followers: true } }
                },
            });
            return reply.send({ items: rows.map(r => ({ ...r, profile_picture_url: (r.profile_picture_url) })) });
        }

        if (sort === "followers") {
            const rows = await req.server.prisma.profile.findMany({
                orderBy: { followers: { _count: "desc" } },
                skip, take: limit,
                select: {
                    id: true, username: true, name: true, title: true, location: true,
                    profile_picture_url: true, _count: { select: { followers: true } }
                },
            });
            return reply.send({ items: rows.map(r => ({ ...r, profile_picture_url: (r.profile_picture_url) })) });
        }

        // "most active" = most views in last X days (using ProfileView table)
        const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
        const rows = await req.server.prisma.$queryRaw<Array<{ id: number; views: bigint }>>
            `
            SELECT p.id, COALESCE(COUNT(v.id),0) AS views
            FROM "Profile" p
            LEFT JOIN "ProfileView" v ON v."profileId" = p.id AND v."created_at" >= NOW() - INTERVAL '${days} days'
            GROUP BY p.id
            ORDER BY views DESC
            OFFSET ${skip} LIMIT ${limit};
            `;
        const ids = rows.map(r => r.id);
        const profiles = await req.server.prisma.profile.findMany({
            where: { id: { in: ids } },
            select: {
                id: true, username: true, name: true, title: true, location: true,
                profile_picture_url: true, _count: { select: { followers: true } }
            },
        });
        const byId = new Map(profiles.map(p => [p.id, p]));
        return reply.send({
            items: rows.map(r => {
                const p = byId.get(r.id)!;
                return {
                    ...p,
                    profile_picture_url: (p.profile_picture_url),
                    recentViews: Number(r.views),
                };
            }),
        });
    });

    app.get("/profiles/tags/search", async (req, reply) => {
        const q = String((req.query as any)?.q || "").trim();
        if (!q) return reply.send({ items: [] });

        const items = await req.server.prisma.tag.findMany({
            where: { name: { contains: q } },
            orderBy: [{ name: "asc" }],
            take: 20,
            select: { id: true, name: true },
        });

        reply.send({ items });
    });

    app.get("/profiles/:id(\\d+)/recommendations", async (req, reply) => {
        const id = Number((req.params as any).id);
        const limit = Math.min(Math.max(Number((req.query as any)?.limit || 8), 1), 24);

        // 1) current profile tags
        const myTags = await req.server.prisma.profileTag.findMany({
            where: { profileId: id },
            select: { tag: true },
        });

        if (!myTags.length) {
            return reply.send({ items: [] });
        }

        const myTagNames = myTags.map((t) => t.tag);
        const myTagNameSet = new Set(myTagNames);

        // 2) find all other profileTag rows sharing any of those tags
        const overlapRows = await req.server.prisma.profileTag.findMany({
            where: {
                profileId: { not: id },
                tag: { in: myTagNames },
            },
            select: {
                profileId: true,
                tag: true,
            },
        });

        if (!overlapRows.length) {
            return reply.send({ items: [] });
        }

        // 3) count shared tags per candidate profile
        const score = new Map<number, number>();
        for (const row of overlapRows) {
            score.set(row.profileId, (score.get(row.profileId) ?? 0) + 1);
        }

        const candidateIds = [...score.keys()];

        // 4) fetch candidate profiles with followers count + their tags
        const profiles = await req.server.prisma.profile.findMany({
            where: { id: { in: candidateIds } },
            select: {
                id: true,
                username: true,
                name: true,
                bio: true,
                title: true,
                location: true,
                industry: true,
                email: true,
                plan: true,
                hasPremiumPresentation: true,
                profile_picture_url: true,
                hero_banner_url: true,
                _count: { select: { followers: true } },
                ProfileTags: {
                    select: { tag: true },
                },
            },
        });

        // 5) rank
        const ranked = profiles
            .sort((a, b) =>
                (score.get(b.id)! - score.get(a.id)!) ||
                (b._count.followers - a._count.followers) ||
                (a.name ?? "").localeCompare(b.name ?? "")
            )
            .slice(0, limit)
            .map((p) => ({
                id: p.id,
                username: p.username,
                name: p.name,
                title: p.title,
                location: p.location,
                industry: p.industry ?? null,
                email: p.email ?? null,
                plan: p.plan,
                hasPremiumPresentation: p.hasPremiumPresentation,
                profile_picture_url: (p.profile_picture_url),
                hero_banner_url: (p.hero_banner_url),
                followersCount: p._count.followers,
                sharedTags: p.ProfileTags
                    .map((t) => t.tag)
                    .filter((tagName) => myTagNameSet.has(tagName)),
                score: score.get(p.id) ?? 0,
            }));

        reply.send({ items: ranked });
    });

    //app.get("/profiles/:id(\\d+)/recommendations", async (req, reply) => {
    //    const id = Number((req.params as any).id);
    //    const limit = Math.min(Math.max(Number((req.query as any)?.limit || 8), 1), 24);

    //    // 1) get this profile's tags (IDs + names for intersection)
    //    const myTags = await req.server.prisma.profileTag.findMany({
    //        where: { profileId: id },
    //        select: { tagId: true, tag: { select: { name: true } } },
    //    });
    //    if (!myTags.length) return reply.send({ items: [] });

    //    const myTagIds = myTags.map(t => t.tagId);
    //    const myTagNameSet = new Set(myTags.map(t => t.tag.name));

    //    // 2) other profiles sharing those tags, counted
    //    const overlaps = await req.server.prisma.profileTag.groupBy({
    //        by: ["profileId"],
    //        where: { tagId: { in: myTagIds }, profileId: { not: id } },
    //        _count: { _all: true },
    //        // FIX: order by a field count (works across Prisma versions)
    //        orderBy: { _count: { profileId: "desc" } },
    //        take: limit * 3, // overfetch to allow later tiebreaks
    //    });

    //    const candidateIds = overlaps.map(o => o.profileId);
    //    if (!candidateIds.length) return reply.send({ items: [] });

    //    // 3) fetch candidate cards
    //    const profiles = await req.server.prisma.profile.findMany({
    //        where: { id: { in: candidateIds } },
    //        select: {
    //            id: true, username: true, name: true, title: true, location: true,
    //            profile_picture_url: true,
    //            hero_banner_url: true,
    //            _count: { select: { followers: true } },
    //            ProfileTags: { select: { tag: { select: { name: true } } } },
    //        },
    //    });

    //    // Build score map (FIX: correct variable)
    //    const score = new Map<number, number>();
    //    for (const o of overlaps) score.set(o.profileId, o._count._all);

    //    // 4) rank by shared-tags score desc, then followers desc, then name
    //    const ranked = profiles
    //        .sort((a, b) =>
    //            (score.get(b.id)! - score.get(a.id)!) ||
    //            (b._count.followers - a._count.followers) ||
    //            (a.name ?? "").localeCompare(b.name ?? "")
    //        )
    //        .slice(0, limit)
    //        .map(p => ({
    //            id: p.id,
    //            username: p.username,
    //            name: p.name,
    //            title: p.title,
    //            location: p.location,
    //            profile_picture_url: (p.profile_picture_url),
    //            hero_banner_url: (p.hero_banner_url),
                
    //            followersCount: p._count.followers,
    //            // Show only tags shared with the source profile
    //            sharedTags: p.ProfileTags.map(t => t.tag.name).filter(n => myTagNameSet.has(n)),
    //            score: score.get(p.id) ?? 0,
    //        }));

    //    reply.send({ items: ranked });
    //});

    // GET /profiles/:id — profile detail (public, ID-based)
    app.get("/profiles/:id(\\d+)",
        { preHandler: [validateParams(IdParams)] },
        async (req, reply) => {
            const { id } = (req as any).validatedParams as z.infer<typeof IdParams>;

            // Optional auth to compute followedByMe
            let requesterId: number | null = null;
            const auth = req.headers.authorization;
            if (auth?.startsWith("Bearer ")) {
                try {
                    await req.jwtVerify();
                    requesterId = (req.user as any).id as number;
                } catch { }
            }

            const profile = await req.server.prisma.profile.findUnique({
                where: { id },
                select: {
                    id: true,
                    userId: true,
                    username: true,
                    name: true,
                    title: true,
                    bio: true,
                    profile_picture_url: true,
                    hero_banner_url: true,
                    phone: true,
                    email: true,
                    location: true,
                    titleSlug: true,
                    industry: true,
                    referrer: true,
                    plan: true,
                    hasPremiumPresentation: true,
                    socialLinks: {
                        orderBy: [{ sort_order: "asc" }, { id: "asc" }],
                        select: { id: true, platform_name: true, url: true, icon: true, category: true, sort_order: true },
                    },
                    project: {
                        orderBy: [{ sort_order: "asc" }, { id: "asc" }],
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            url: true,
                            website: true,
                            coverImageUrl: true,
                            sort_order: true,
                            startedOn: true,
                            category: true,
                            targetIndustry: true,
                            country: true,
                            bio: true,
                            contactEmail: true,
                        },
                    },
                    _count: { select: { followers: true } },
                },
            });

            if (!profile) return reply.code(404).send({ message: "Profile not found" });

            const [followingCount, followedByMe] = await Promise.all([
                req.server.prisma.follow.count({ where: { followerId: profile.userId } }),
                requesterId
                    ? req.server.prisma.follow.findUnique({
                        where: { followerId_profileId: { followerId: requesterId, profileId: profile.id } },
                        select: { id: true },
                    }).then(Boolean)
                    : Promise.resolve(false),
            ]);

            reply.send({
                id: profile.id,
                userId: profile.userId,
                username: profile.username,
                name: profile.name,
                title: profile.title,
                bio: profile.bio ?? null,
                profile_picture_url: (profile.profile_picture_url),
                hero_banner_url: (profile.hero_banner_url),
                phone: profile.phone,
                email: profile.email,
                location: profile.location,
                titleSlug: profile.titleSlug,
                industry: profile.industry,
                referrer: profile.referrer,
                plan: profile.plan,
                hasPremiumPresentation: profile.hasPremiumPresentation,
                socialLinks: profile.socialLinks,
                projectLinks: profile.project,
                followersCount: profile._count.followers,
                followingCount,
                followedByMe,
            });
        }
    );

    app.get("/profiles/by-username/:username", async (req, reply) => {
        const username = String((req.params as any).username || "").toLowerCase();

        // Optional auth (for followedByMe), same as the :id route
        let requesterId: number | null = null;
        const auth = req.headers.authorization;
        if (auth?.startsWith("Bearer ")) {
            try {
                await req.jwtVerify();
                requesterId = (req.user as any).id as number;
            } catch { }
        }

        const profile = await req.server.prisma.profile.findUnique({
            where: { username },
            select: {
                id: true,
                userId: true,
                name: true,
                title: true,
                bio: true,
                location: true,
                profile_picture_url: true,
                hero_banner_url: true,
                email: true,
                phone: true,
                plan: true,
                hasPremiumPresentation: true,
                socialLinks: {
                    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
                    select: { id: true, platform_name: true, url: true, icon: true, category: true, sort_order: true },
                },
                project: {
                    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
                    select: { id: true, title: true, description: true, url: true, sort_order: true },
                },
                _count: { select: { followers: true } },
            },
        });

        if (!profile) return reply.code(404).send({ message: "Profile not found" });

        const [followingCount, followedByMe] = await Promise.all([
            req.server.prisma.follow.count({ where: { followerId: profile.userId } }),
            requesterId
                ? req.server.prisma.follow
                    .findUnique({
                        where: { followerId_profileId: { followerId: requesterId, profileId: profile.id } },
                        select: { id: true },
                    })
                    .then(Boolean)
                : Promise.resolve(false),
        ]);

        // IMPORTANT: ensure `toPublic` is imported/available just like in the :id route
        reply.send({
            id: profile.id,
            name: profile.name,
            title: profile.title,
            bio: profile.bio ?? null,
            location: profile.location,
            profile_picture_url: (profile.profile_picture_url),
            hero_banner_url: (profile.hero_banner_url),
            email: profile.email,
            phone: profile.phone,
            plan: profile.plan,
            hasPremiumPresentation: profile.hasPremiumPresentation,
            socialLinks: profile.socialLinks,
            projectLinks: profile.project,
            followersCount: profile._count.followers,
            followingCount,
            followedByMe,
        });
    });
}
