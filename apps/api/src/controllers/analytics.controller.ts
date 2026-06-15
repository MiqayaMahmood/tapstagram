import { FastifyRequest, FastifyReply } from "fastify";

/**
 * POST /analytics/view/:profileId
 * Body: —
 */

type SocialAggRow = {
    socialLinkId: number;
    _count: {
        _all: number;
    };
};

type ProjectAggRow = {
    projectId: number;
    _count: {
        _all: number;
    };
};

type SocialMetaRow = {
    id: number;
    platform_name: string | null;
    url: string | null;
};

type ProjectMetaRow = {
    id: number;
    title: string | null;
    url: string | null;
};

export async function dashboardSummary(req: FastifyRequest, reply: FastifyReply) {
    const prisma = (req.server as any).prisma;

    const userId = (req as any).user?.id ?? (req as any).user?.sub;
    if (!userId) {
        return reply.code(401).send({ ok: false, error: "UNAUTHORIZED" });
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: Number(userId) },
        select: { id: true },
    });

    if (!profile) {
        return reply.send({
            views7: 0,
            views30: 0,
            topSocial: [],
            topProjects: [],
        });
    }

    const now = new Date();
    const since7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [views7, views30, socialAggRaw, projectAggRaw] = await Promise.all([
        prisma.profileView.count({
            where: {
                profileId: profile.id,
                createdAt: { gte: since7 },
            },
        }),

        prisma.profileView.count({
            where: {
                profileId: profile.id,
                createdAt: { gte: since30 },
            },
        }),

        prisma.socialLinkClick.groupBy({
            by: ["socialLinkId"],
            where: {
                profileId: profile.id,
            },
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    _all: "desc",
                },
            },
            take: 5,
        }),

        prisma.projectClick.groupBy({
            by: ["projectId"],
            where: {
                profileId: profile.id,
            },
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    _all: "desc",
                },
            },
            take: 5,
        }),
    ]);

    const socialAgg = socialAggRaw as SocialAggRow[];
    const projectAgg = projectAggRaw as ProjectAggRow[];

    const socialIds = socialAgg.map((s: SocialAggRow) => s.socialLinkId);
    const projectIds = projectAgg.map((p: ProjectAggRow) => p.projectId);

    const [socialLinksRaw, projectsRaw] = await Promise.all([
        socialIds.length
            ? prisma.socialLink.findMany({
                where: { id: { in: socialIds } },
                select: {
                    id: true,
                    platform_name: true,
                    url: true,
                },
            })
            : Promise.resolve([]),

        projectIds.length
            ? prisma.project.findMany({
                where: { id: { in: projectIds } },
                select: {
                    id: true,
                    title: true,
                    url: true,
                },
            })
            : Promise.resolve([]),
    ]);

    const socialLinks = socialLinksRaw as SocialMetaRow[];
    const projects = projectsRaw as ProjectMetaRow[];

    const socialMeta = new Map<number, SocialMetaRow>(
        socialLinks.map((s: SocialMetaRow) => [s.id, s])
    );

    const projectMeta = new Map<number, ProjectMetaRow>(
        projects.map((p: ProjectMetaRow) => [p.id, p])
    );

    const topSocial = socialAgg.map((s: SocialAggRow) => ({
        id: s.socialLinkId,
        count: s._count._all,
        platform_name: socialMeta.get(s.socialLinkId)?.platform_name ?? null,
        url: socialMeta.get(s.socialLinkId)?.url ?? null,
    }));

    const topProjects = projectAgg.map((p: ProjectAggRow) => ({
        id: p.projectId,
        count: p._count._all,
        title: projectMeta.get(p.projectId)?.title ?? null,
        url: projectMeta.get(p.projectId)?.url ?? null,
    }));

    return reply.send({
        views7,
        views30,
        topSocial,
        topProjects,
    });
}
