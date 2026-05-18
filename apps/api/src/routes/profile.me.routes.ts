// apps/api/src/routes/profile.me.routes.ts
import { FastifyInstance } from "fastify";
import path from "node:path";

const BASE = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
const toPublic = (p?: string | null) => (p ? `${BASE}/media/${path.basename(p)}` : null);

export async function profileMeRoutes(app: FastifyInstance) {
    app.get("/profiles/me", { preHandler: [app.authenticate] }, async (req, reply) => {
        
        const userId = (req as any).user?.id ?? (req as any).user?.sub;
        
        if (!userId) return reply.code(401).send({ ok: false, error: "UNAUTHORIZED" });
        let requesterId: number | null = null;

        const profile = await req.server.prisma.profile.findUnique({
            where: { userId: Number(userId) },
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
                //socialLinks: {
                //    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
                //    select: { id: true, platform_name: true, url: true, icon: true, category: true, sort_order: true },
                //},
                //projectLinks: {
                //    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
                //    select: { id: true, title: true, description: true, url: true, sort_order: true },
                //},
                //_count: { select: { followers: true } },

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
        console.log("src/routes/profile.me.routes.ts - 1: name: " + profile.name)
        reply.send({
            id: profile.id,
            userId: profile.userId,
            username: profile.username,
            name: profile.name,
            title: profile.title,
            bio: profile.bio ?? null,
            profile_picture_url: toPublic(profile.profile_picture_url),
            hero_banner_url: toPublic(profile.hero_banner_url),
            phone: profile.phone,
            email: profile.email,
            location: profile.location,
            titleSlug: profile.titleSlug,
            industry: profile.industry,
            referrer: profile.referrer,
            //socialLinks: profile.socialLinks,
            //projectLinks: profile.projectLinks,
            //followersCount: profile._count.followers,
            //followingCount,
            //followedByMe,
        });

        //return reply.send({ items: profile.map(r => ({ ...r, profile_picture_url: toPublic(r.profile_picture_url) })) });

        //return reply.send({ ok: true, profile }); // profile can be null for brand-new users
    });
}
