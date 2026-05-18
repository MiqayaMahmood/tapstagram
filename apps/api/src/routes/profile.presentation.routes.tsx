import { FastifyPluginAsync } from "fastify";
import { isPremiumPlan } from "../utils/premium";

const profilePresentationRoutes: FastifyPluginAsync = async (app) => {
    app.get("/profiles/me/presentation", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);

        const me = await req.server.prisma.profile.findUnique({
            where: { userId },
            select: {
                id: true,
                plan: true,
                presentation: true,
            },
        });

        if (!me) return reply.code(404).send({ message: "Profile not found" });

        reply.send({
            ok: true,
            profileId: me.id,
            plan: me.plan,
            isPremium: isPremiumPlan(me.plan),
            presentation: me.presentation,
        });
    });

    app.patch("/profiles/me/presentation", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = Number((req.user as any)?.id);
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
            select: {
                id: true,
                plan: true,
            },
        });

        if (!me) return reply.code(404).send({ message: "Profile not found" });
        if (!isPremiumPlan(me.plan)) {
            return reply.code(403).send({ message: "Premium plan required" });
        }

        const saved = await req.server.prisma.profilePresentation.upsert({
            where: { profileId: me.id },
            update: {
                enabled: body.enabled ?? true,
                status: body.status ?? "draft",
                template: body.template ?? "professional",
                themeJson: body.themeJson ?? undefined,
                contentJson: body.contentJson ?? undefined,
                seoTitle: body.seoTitle ?? undefined,
                seoDescription: body.seoDescription ?? undefined,
                ogImageUrl: body.ogImageUrl ?? undefined,
            },
            create: {
                profileId: me.id,
                enabled: body.enabled ?? true,
                status: body.status ?? "draft",
                template: body.template ?? "professional",
                themeJson: body.themeJson ?? undefined,
                contentJson: body.contentJson ?? undefined,
                seoTitle: body.seoTitle ?? undefined,
                seoDescription: body.seoDescription ?? undefined,
                ogImageUrl: body.ogImageUrl ?? undefined,
            },
        });

        await req.server.prisma.profile.update({
            where: { id: me.id },
            data: { hasPremiumPresentation: !!saved.enabled },
        });

        reply.send({ ok: true, presentation: saved });
    });

    app.get("/profiles/:id/presentation/public", async (req, reply) => {
        const profileId = Number((req.params as any).id);

        const row = await req.server.prisma.profile.findUnique({
            where: { id: profileId },
            select: {
                id: true,
                plan: true,
                hasPremiumPresentation: true,
                presentation: true,
            },
        });

        if (!row || !isPremiumPlan(row.plan) || !row.hasPremiumPresentation) {
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

export default profilePresentationRoutes;