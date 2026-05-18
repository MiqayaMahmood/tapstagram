    import { FastifyPluginAsync } from "fastify";
import { isPremiumPlan } from "../utils/premium";

const projectPresentationRoutes: FastifyPluginAsync = async (app) => {
    app.get("/projects/:id/presentation", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
        const projectId = Number((req.params as any).id);

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true, plan: true },
        });

        if (!me) return reply.code(404).send({ message: "Profile not found" });

        const project = await req.server.prisma.project.findFirst({
            where: { id: projectId, profileId: me.id },
            select: {
                id: true,
                presentation: true,
            },
        });

        if (!project) return reply.code(404).send({ message: "Project not found" });

        reply.send({
            ok: true,
            projectId: project.id,
            plan: me.plan,
            isPremium: isPremiumPlan(me.plan),
            presentation: project.presentation,
        });
    });

    app.patch("/projects/:id/presentation", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
        const projectId = Number((req.params as any).id);
        const body = req.body as {
            enabled?: boolean;
            status?: "draft" | "published";
            template?: string;
            themeJson?: any;
            contentJson?: any;
            seoTitle?: string;
            seoDescription?: string;
            ogImageUrl?: string;
        };

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: { id: true, plan: true },
        });

        if (!me) return reply.code(404).send({ message: "Profile not found" });
        if (!isPremiumPlan(me.plan)) {
            return reply.code(403).send({ message: "Premium plan required" });
        }

        const project = await req.server.prisma.project.findFirst({
            where: { id: projectId, profileId: me.id },
            select: { id: true },
        });

        if (!project) return reply.code(404).send({ message: "Project not found" });

        const saved = await req.server.prisma.projectPresentation.upsert({
            where: { projectId: project.id },
            update: {
                enabled: body.enabled ?? true,
                status: body.status ?? "draft",
                template: body.template ?? "business",
                themeJson: body.themeJson ?? undefined,
                contentJson: body.contentJson ?? undefined,
                seoTitle: body.seoTitle ?? undefined,
                seoDescription: body.seoDescription ?? undefined,
                ogImageUrl: body.ogImageUrl ?? undefined,
            },
            create: {
                projectId: project.id,
                enabled: body.enabled ?? true,
                status: body.status ?? "draft",
                template: body.template ?? "business",
                themeJson: body.themeJson ?? undefined,
                contentJson: body.contentJson ?? undefined,
                seoTitle: body.seoTitle ?? undefined,
                seoDescription: body.seoDescription ?? undefined,
                ogImageUrl: body.ogImageUrl ?? undefined,
            },
        });

        await req.server.prisma.project.update({
            where: { id: project.id },
            data: { hasPremiumPresentation: !!saved.enabled },
        });

        reply.send({ ok: true, presentation: saved });
    });

    app.get("/projects/:id/presentation/public", async (req, reply) => {
        const projectId = Number((req.params as any).id);

        const row = await req.server.prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                profile: { select: { plan: true } },
                hasPremiumPresentation: true,
                presentation: true,
            },
        });

        if (!row || !isPremiumPlan(row.profile?.plan) || !row.hasPremiumPresentation) {
            return reply.code(404).send({ message: "Presentation not found" });
        }

        if (!row.presentation || !row.presentation.enabled || row.presentation.status !== "published") {
            return reply.code(404).send({ message: "Presentation not found" });
        }

        reply.send({
            ok: true,
            presentation: row.presentation,
        });
    });
};

export default projectPresentationRoutes;