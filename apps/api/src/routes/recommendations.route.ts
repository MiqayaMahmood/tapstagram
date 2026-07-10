import { FastifyPluginAsync } from "fastify";
import {
    getPopularProjectsInCategory,
    getProfileRecommendations,
    getProjectRecommendations,
    getRecentlyActiveProjects,
    getSimilarProjects,
    getTrendingProjectRecommendations,
} from "../services/recommendations";

const recommendationsRoutes: FastifyPluginAsync = async (app) => {
    const prisma = () => app.prisma ?? app.db;
    const limitFrom = (query: any) => query?.limit === undefined ? undefined : Number(query.limit);
    const daysFrom = (query: any) => query?.days === undefined ? undefined : Number(query.days);
    const excludeFrom = (query: any) => query?.excludeProjectId === undefined ? undefined : Number(query.excludeProjectId);

    app.get("/recommendations/profile/:id", async (req, reply) => {
        const profileId = Number((req.params as { id: string }).id);
        if (!Number.isFinite(profileId)) {
            return reply.code(400).send({ error: "invalid_profile_id" });
        }

        const data = await getProfileRecommendations(prisma(), profileId);
        return reply.send(data);
    });

    app.get("/recommendations/project/:id", async (req, reply) => {
        const projectId = Number((req.params as { id: string }).id);
        if (!Number.isFinite(projectId)) {
            return reply.code(400).send({ error: "invalid_project_id" });
        }

        const data = await getProjectRecommendations(prisma(), projectId);
        return reply.send(data);
    });

    app.get("/recommendations/projects/trending", async (req, reply) => {
        const query = req.query as any;
        const data = await getTrendingProjectRecommendations(prisma(), {
            limit: limitFrom(query),
            days: daysFrom(query),
            category: query?.category,
            excludeProjectId: excludeFrom(query),
        });
        return reply.send(data);
    });

    app.get("/recommendations/projects/category", async (req, reply) => {
        const query = req.query as any;
        const category = String(query?.category ?? "").trim();
        if (!category) {
            return reply.code(400).send({ error: "category_required" });
        }

        const data = await getPopularProjectsInCategory(prisma(), category, {
            limit: limitFrom(query),
            excludeProjectId: excludeFrom(query),
        });
        return reply.send(data);
    });

    app.get("/recommendations/projects/recently-active", async (req, reply) => {
        const query = req.query as any;
        const data = await getRecentlyActiveProjects(prisma(), {
            limit: limitFrom(query),
            category: query?.category,
            excludeProjectId: excludeFrom(query),
        });
        return reply.send(data);
    });

    app.get("/recommendations/projects/:projectId/similar", async (req, reply) => {
        const projectId = Number((req.params as { projectId: string }).projectId);
        if (!Number.isFinite(projectId)) {
            return reply.code(400).send({ error: "invalid_project_id" });
        }

        const query = req.query as any;
        const data = await getSimilarProjects(prisma(), projectId, {
            limit: limitFrom(query),
        });
        return reply.send(data);
    });
};

export default recommendationsRoutes;
