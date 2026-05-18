import { FastifyRequest, FastifyReply } from "fastify";

/**
 * POST /analytics/view/:profileId
 * Body: —
 */
export async function recordProfileView(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    const prisma = (req.server as any).prisma;
    const profileId = Number(req.params.profileId);
    if (!profileId) return reply.code(400).send({ ok: false, error: "INVALID_PROFILE_ID" });

    // Assumes you have a ProfileView model/table.
    await prisma.profileView.create({ data: { profileId } });
    return reply.code(201).send({ ok: true });
}

/**
 * POST /analytics/social/:socialLinkId
 * Body: { profileId: number }
 */
export async function recordSocialClick(
    req: FastifyRequest<{ Params: { socialLinkId: string }; Body: { profileId: number } }>,
    reply: FastifyReply
) {
    const prisma = (req.server as any).prisma;
    const socialLinkId = Number(req.params.socialLinkId);
    const profileId = Number((req.body as any)?.profileId);
    if (!profileId || !socialLinkId) return reply.code(400).send({ ok: false, error: "INVALID_IDS" });

    const exists = await prisma.socialLink.findUnique({ where: { id: socialLinkId }, select: { id: true } });
    if (!exists) return reply.code(404).send({ ok: false, error: "SOCIAL_LINK_NOT_FOUND" });

    await prisma.socialLinkClick.create({ data: { profileId, socialLinkId } });
    return reply.code(201).send({ ok: true });
}

/**
 * POST /analytics/project/:projectId
 * Body: { profileId: number }
 *
 * (Backwards-compat: also accepts :projectLinkId param name)
 */
export async function recordProjectClick(
    req: FastifyRequest<{ Params: { projectId?: string; projectLinkId?: string }; Body: { profileId: number } }>,
    reply: FastifyReply
) {
    const prisma = (req.server as any).prisma;
    const rawParam = (req.params.projectId ?? (req.params as any).projectLinkId) as string | undefined;
    const projectId = Number(rawParam);
    const profileId = Number((req.body as any)?.profileId);

    if (!profileId || !projectId) return reply.code(400).send({ ok: false, error: "INVALID_IDS" });

    const exists = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!exists) return reply.code(404).send({ ok: false, error: "PROJECT_NOT_FOUND" });

    await prisma.projectClick.create({ data: { profileId, projectId } });
    return reply.code(201).send({ ok: true });
}

/**
 * GET /analytics/dashboard/summary
 * Requires auth preHandler to set req.user
 */
export async function dashboardSummary(req: FastifyRequest, reply: FastifyReply) {
    const prisma = (req.server as any).prisma;

    // JWT -> user id. If your user id is not numeric, adapt the lookup accordingly.
    const userId = (req as any).user?.id ?? (req as any).user?.sub;
    if (!userId) return reply.code(401).send({ ok: false, error: "UNAUTHORIZED" });

    // Resolve the profile for this user
    const profile = await prisma.profile.findUnique({
        where: { userId: Number(userId) },
        select: { id: true },
    });

    if (!profile) {
        return reply.send({ views7: 0, views30: 0, topSocial: [], topProjects: [] });
    }

    const now = new Date();
    const since7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Note the groupBy keys: socialLinkId and projectId (as per your models)
    const [views7, views30, socialAgg, projectAgg] = await Promise.all([
        prisma.profileView.count({ where: { profileId: profile.id, createdAt: { gte: since7 } } }),
        prisma.profileView.count({ where: { profileId: profile.id, createdAt: { gte: since30 } } }),

        prisma.socialLinkClick.groupBy({
            by: ["socialLinkId"],
            where: { profileId: profile.id },
            _count: { _all: true },
            orderBy: { _count: { _all: "desc" } },
            take: 5,
        }),

        prisma.projectClick.groupBy({
            by: ["projectId"], // ✅ was projectLinkId; now matches your ProjectClick model
            where: { profileId: profile.id },
            _count: { _all: true },
            orderBy: { _count: { _all: "desc" } },
            take: 5,
        }),
    ]);

    // Hydrate metadata for the top items
    const socialIds = socialAgg.map((s) => s.socialLinkId);
    const projectIds = projectAgg.map((p) => p.projectId);

    const [socialLinks, projects] = await Promise.all([
        socialIds.length
            ? prisma.socialLink.findMany({
                where: { id: { in: socialIds } },
                select: { id: true, platform_name: true, url: true },
            })
            : Promise.resolve([] as Array<{ id: number; platform_name: string; url: string }>),

        projectIds.length
            ? prisma.project.findMany({
                where: { id: { in: projectIds } },
                select: { id: true, title: true, url: true },
            })
            : Promise.resolve([] as Array<{ id: number; title: string; url: string }>),
    ]);

    const socialMeta = new Map(socialLinks.map((s) => [s.id, s]));
    const projectMeta = new Map(projects.map((p) => [p.id, p]));

    const topSocial = socialAgg.map((s) => ({
        id: s.socialLinkId,
        count: s._count._all,
        platform_name: socialMeta.get(s.socialLinkId)?.platform_name,
        url: socialMeta.get(s.socialLinkId)?.url,
    }));

    const topProjects = projectAgg.map((p) => ({
        id: p.projectId,
        count: p._count._all,
        title: projectMeta.get(p.projectId)?.title,
        url: projectMeta.get(p.projectId)?.url,
    }));

    return reply.send({ views7, views30, topSocial, topProjects });
}
