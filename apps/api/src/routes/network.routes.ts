import { FastifyPluginAsync } from "fastify";
import path from "node:path";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const toPublic = (p?: string | null) => (p ? `${BASE}/media/${path.basename(p)}` : null);

const networkRoutes: FastifyPluginAsync = async (app) => {
    app.get("/network/me", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!me) {
            return reply.code(404).send({ message: "Profile not found" });
        }

        const [
            followedProfiles,
            bookmarkedProfiles,
            followedProjects,
            bookmarkedProjects,
        ] = await Promise.all([
            req.server.prisma.follow.findMany({
                where: { followerId: userId },
                orderBy: { createdAt: "desc" },
                select: {
                    profile: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            title: true,
                            location: true,
                            bio: true,
                            profile_picture_url: true,
                            hero_banner_url: true,
                            _count: { select: { followers: true } },
                        },
                    },
                },
            }),

            req.server.prisma.bookmark.findMany({
                where: { userId },
                orderBy: { created_at: "desc" },
                select: {
                    profile: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            title: true,
                            location: true,
                            bio: true,
                            profile_picture_url: true,
                            hero_banner_url: true,
                            _count: { select: { followers: true } },
                        },
                    },
                },
            }),

            req.server.prisma.projectFollow.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                select: {
                    project: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            category: true,
                            bio: true,
                            coverImageUrl: true,
                            country: true,
                            profile: {
                                select: {
                                    id: true,
                                    name: true,
                                    profile_picture_url: true,
                                },
                            },
                        },
                    },
                },
            }),

            req.server.prisma.projectBookmark.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                select: {
                    project: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            category: true,
                            bio: true,
                            coverImageUrl: true,
                            country: true,
                            profile: {
                                select: {
                                    id: true,
                                    name: true,
                                    profile_picture_url: true,
                                },
                            },
                        },
                    },
                },
            }),
        ]);

        reply.send({
            followedProfiles: followedProfiles.map((x) => ({
                ...x.profile,
                profile_picture_url: toPublic(x.profile.profile_picture_url),
                hero_banner_url: toPublic(x.profile.hero_banner_url),
                followersCount: x.profile._count.followers,
            })),

            bookmarkedProfiles: bookmarkedProfiles.map((x) => ({
                ...x.profile,
                profile_picture_url: toPublic(x.profile.profile_picture_url),
                hero_banner_url: toPublic(x.profile.hero_banner_url),
                followersCount: x.profile._count.followers,
            })),

            followedProjects: followedProjects.map((x) => ({
                ...x.project,
                coverImageUrl: toPublic(x.project.coverImageUrl),
                profile: {
                    ...x.project.profile,
                    profile_picture_url: toPublic(x.project.profile.profile_picture_url),
                },
            })),

            bookmarkedProjects: bookmarkedProjects.map((x) => ({
                ...x.project,
                coverImageUrl: toPublic(x.project.coverImageUrl),
                profile: {
                    ...x.project.profile,
                    profile_picture_url: toPublic(x.project.profile.profile_picture_url),
                },
            })),
        });
    });
};

export default networkRoutes;