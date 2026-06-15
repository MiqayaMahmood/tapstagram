// src/routes/analytics.routes.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";


const ProfileIdParams = z.object({ profileId: z.coerce.number().int().positive() });
const SocialClickParams = z.object({ socialLinkId: z.coerce.number().int().positive() });
const ProjectClickParams = z.object({ projectId: z.coerce.number().int().positive() });
const WithProfileBody = z.object({ profileId: z.number().int().positive() });


export default async function analyticsRoutes(app: FastifyInstance) {
    // Public: record a profile view
    app.post('/profile-view/:profileId', async (req, reply) => {
        const profileId = Number((req.params as any).profileId);
        if (!Number.isFinite(profileId)) return reply.code(400).send({ message: 'Invalid profileId' });

        const b = (req.body as any) || {};
        const data: any = { profileId };
        for (const k of ['sessionId', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'referrer']) {
            if (b?.[k]) data[k] = String(b[k]).slice(0, k === 'referrer' ? 1024 : 128);
        }

        //await req.server.prisma.profileView.create({ data: { profileId } });
        await req.server.prisma.profileView.create({ data });
        reply.code(204).send();
    });

    // Public: record a click on a social link
    app.post('/social-click/:socialLinkId', async (req, reply) => {
        const socialLinkId = Number((req.params as any).socialLinkId);
        const { profileId } = (req.body as any) || {};
        if (!Number.isFinite(socialLinkId) || !Number.isFinite(profileId)) {
            return reply.code(400).send({ message: 'Invalid ids' });
        }
        await req.server.prisma.socialLinkClick.create({ data: { socialLinkId, profileId } });
        reply.code(204).send();
    });

    // Public: record a click on a project link
    app.post('/project-click/:projectId', async (req, reply) => {
        const projectId = Number((req.params as any).projectId);
        const { profileId } = (req.body as any) || {};
        if (!Number.isFinite(projectId) || !Number.isFinite(profileId)) {
            return reply.code(400).send({ message: 'Invalid ids' });
        }
        await req.server.prisma.projectClick.create({ data: { projectId, profileId } });
        reply.code(204).send();
    });

    // Protected: dashboard summary for the logged-in user's profile
    app.get('/dashboard/summary', { preHandler: [app.authenticate] }, async (req, reply) => {

        console.log("analytics.routes - Step - 1 : user: " + req.user.id);
        const userId = (req as any).user.id as number;
        try {
                // Support both { id } and { sub } payloads
                const raw = (req as any).user;
                const userId: number | null = 
                    typeof raw?.id === "number" ? raw.id :
                        typeof raw?.sub === "number" ? raw.sub :
                            typeof raw?.sub === "string" ? Number(raw.sub) :
                                null;

                if (!userId || Number.isNaN(userId)) {
                    return reply.code(401).send({ message: 'Unauthorized' });
                }

                
                const profile = await req.server.prisma.profile.findUnique({ where: { userId }, select: { id: true } });

                console.log("analytics.routes - Step - 3 : profile: " + profile);

                //if (!profile) return reply.code(404).send({ message: 'Profile not found' });
                if (!profile) {
                    return reply.send({
                        views7: 0, views30: 0, topSocial: [], topProjects: [], meta: {
                            hasProfile: false,
                            reason: 'no_profile_for_user',
                        action: 'create_profile',},});
                }

                const pid = profile.id;

                const since7 = new Date(Date.now() - 7 * 864e5);
                const since30 = new Date(Date.now() - 30 * 864e5);

                const [views7, views30, topSocial, topProjects] = await Promise.all([
                    req.server.prisma.profileView.count({ where: { profileId: pid, createdAt: { gte: since7 } } }),
                    req.server.prisma.profileView.count({ where: { profileId: pid, createdAt: { gte: since30 } } }),
                    req.server.prisma.socialLinkClick.groupBy({
                        by: ['socialLinkId'],
                        where: { profileId: pid, createdAt: { gte: since30 } },
                        _count: { socialLinkId: true },
                        orderBy: { _count: { socialLinkId: 'desc' } },
                        take: 5,
                    }),
                    req.server.prisma.projectClick.groupBy({
                        by: ['projectId'],
                        where: { profileId: pid, createdAt: { gte: since30 } },
                        _count: { projectId: true },
                        orderBy: { _count: { projectId: 'desc' } },
                        take: 5,
                    }),
                ]);

                // hydrate with link titles/urls
                const socialIds = topSocial.map(t => t.socialLinkId);
                const projectIds = topProjects.map(t => t.projectId);

                const [socialDetails, projectDetails] = await Promise.all([
                    socialIds.length
                        ? req.server.prisma.socialLink.findMany({ where: { id: { in: socialIds } }, select: { id: true, platform_name: true, url: true } })
                        : Promise.resolve([]),
                    projectIds.length
                        ? req.server.prisma.project.findMany({ where: { id: { in: projectIds } }, select: { id: true, title: true, url: true } })
                        : Promise.resolve([]),
                ]);

                const socialMap = new Map(socialDetails.map(s => [s.id, s]));
                const projectMap = new Map(projectDetails.map(p => [p.id, p]));

                

        reply.send({
            views7,
            views30,
            topSocial: topSocial.map(t => ({ id: t.socialLinkId, count: t._count.socialLinkId, ...socialMap.get(t.socialLinkId) })),
            topProjects: topProjects.map(t => ({ id: t.projectId, count: t._count.projectId, ...projectMap.get(t.projectId) })),
        });
        } catch (err) {
            // If the profile exists but something failed while loading analytics, return zeros with a helpful meta
            req.log.error({ err }, 'dashboard/summary failed');
            return reply.code(200).send({
                views7: 0,
                views30: 0,
                topSocial: [],
                topProjects: [],
                meta: {
                    hasProfile: true,
                    hasData: false,
                    reason: 'analytics_error',
                },
            });
        }
    });
}
