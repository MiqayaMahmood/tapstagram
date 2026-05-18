// src/routes/follows.routes.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
    follow,
    unfollow,
    followerCount,
    isFollowing,
    myCounts, // or myFollowingCount if you prefer the old one
} from "../controllers/profileFollows.controller";
import { validateBody } from "../utils/validate";

const ProfileIdParamsSchema = z.object({
    profileId: z.coerce.number().int().positive(),
});

// Reuse this generic for all routes that have :profileId
type ProfileIdParams = { Params: { profileId: string } };

export async function profileFollowsRoutes(app: FastifyInstance) {
    // Public: follower count for a profile
    app.get<ProfileIdParams>(
        "/count/:profileId",
        { preHandler: [validateBody(ProfileIdParamsSchema)] },
        followerCount
    );

    // Auth: both counts for current user
    app.get(
        "/my-counts",
        { preHandler: [app.authenticate] },
        myCounts // or myFollowingCount
    );

    // Auth: is current user following this profile?
    app.get<ProfileIdParams>("/check/:profileId", { preHandler: [app.authenticate] }, isFollowing );

    // Auth: follow
    app.post<ProfileIdParams>("/:profileId", { preHandler: [app.authenticate] }, follow );

    // Auth: unfollow
    app.delete<ProfileIdParams>("/:profileId", { preHandler: [app.authenticate ] },unfollow );
}
