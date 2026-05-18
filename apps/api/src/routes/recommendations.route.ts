import { FastifyPluginAsync } from "fastify";
import { getProfileRecommendations,getProjectRecommendations,} from "../services/recommendations";

const recommendationsRoutes: FastifyPluginAsync = async (app) => {
    app.get("/recommendations/profile/:id", async (req, reply) => {
        const profileId = Number((req.params as { id: string }).id);
        if (!Number.isFinite(profileId)) {
            return reply.code(400).send({ error: "invalid_profile_id" });
        }

        const data = await getProfileRecommendations(app.db, profileId);
        return reply.send(data);
    });

    app.get("/recommendations/project/:id", async (req, reply) => {
        const projectId = Number((req.params as { id: string }).id);
        if (!Number.isFinite(projectId)) {
            return reply.code(400).send({ error: "invalid_project_id" });
        }

        const data = await getProjectRecommendations(app.db, projectId);
        return reply.send(data);
    });
};

export default recommendationsRoutes;