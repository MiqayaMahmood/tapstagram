// src/routes/follows.routes.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
    follow,
    unfollow,
    followerCount,
    isFollowing,
    myCounts, // or myFollowingCount if you prefer the old one
} from "../controllers/projectFollows.controller";
import { validateBody } from "../utils/validate";

const ProjectIdParamsSchema = z.object({
    projectId: z.coerce.number().int().positive(),
});

// Reuse this generic for all routes that have :profileId
type ProjectIdParams = { Params: { projectId: string } };

export async function projectFollowsRoutes(app: FastifyInstance) {
    // Public: follower count for a profile
    app.get<ProjectIdParams>(
        "/count/:projectId",
        { preHandler: [validateBody(ProjectIdParamsSchema)] },
        followerCount
    );

    // Auth: both counts for current user
    app.get(
        "/my-counts",
        { preHandler: [app.authenticate] },
        myCounts // or myFollowingCount
    );

    // Auth: is current user following this profile?
    app.get<ProjectIdParams>("/check/:projectId", { preHandler: [app.authenticate] }, isFollowing );

    // Auth: follow
    app.post<ProjectIdParams>("/:projectId", { preHandler: [app.authenticate] }, follow );

    // Auth: unfollow
    app.delete<ProjectIdParams>("/:projectId", { preHandler: [app.authenticate ] },unfollow );
}
