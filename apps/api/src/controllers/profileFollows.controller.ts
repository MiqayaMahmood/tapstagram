// src/controllers/follows.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";

function getUserId(req: FastifyRequest) {
    const u = (req as any).user as { id: number } | undefined;
    if (!u?.id) throw new Error("Missing user");
    return u.id;
}

export async function follow(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    console.log("export async function follow: profileId")
    const prisma = req.server.prisma;
    const profileId = Number(req.params.profileId);
    console.log("export async function follow: profileId" + profileId)

    const followerId = getUserId(req);
    console.log("export async function follow: followerId" + followerId)

    // Ensure target profile exists
    const target = await prisma.profile.findUnique({
        where: { id: profileId },
        select: { id: true, userId: true },
    });
    if (!target) return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });

    // Prevent following own profile
    if (target.userId === followerId) {
        return reply.code(400).send({ ok: false, error: "CANNOT_FOLLOW_SELF" });
    }

    await prisma.follow.upsert({
        where: { followerId_profileId: { followerId, profileId } },
        update: {},
        create: { followerId, profileId },
    });

    return reply.code(201).send({ ok: true });
}

export async function unfollow(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    console.log("export async function unfollow: profileId" )
    const prisma = req.server.prisma;
    const followerId = getUserId(req);
    const profileId = Number(req.params.profileId);

    // Use deleteMany to avoid throwing if not found
    await prisma.follow.deleteMany({
        where: { followerId, profileId },
    });

    return reply.code(204).send();
}

export async function followerCount(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    const prisma = req.server.prisma;
    const profileId = Number(req.params.profileId);

    const followers = await prisma.follow.count({ where: { profileId } });
    return reply.send({ followers });
}

export async function myFollowingCount(req: FastifyRequest, reply: FastifyReply) {
    const prisma = req.server.prisma;
    const followerId = getUserId(req);

    const following = await prisma.follow.count({ where: { followerId } });
    return reply.send({ following });
}

// Optional: both counts for the logged-in user (handy for headers/widgets)
export async function myCounts(req: FastifyRequest, reply: FastifyReply) {
    const prisma = req.server.prisma;
    const userId = getUserId(req);

    // Find the user's profile to compute their followers
    const myProfile = await prisma.profile.findUnique({
        where: { userId },
        select: { id: true },
    });

    const [following, followers] = await Promise.all([
        prisma.follow.count({ where: { followerId: userId } }),
        myProfile ? prisma.follow.count({ where: { profileId: myProfile.id } }) : Promise.resolve(0),
    ]);

    return reply.send({ following, followers });
}

export async function isFollowing(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    console.log("export async function isfollow: profileId" )
    const prisma = req.server.prisma;
    const followerId = getUserId(req);
    const profileId = Number(req.params.profileId);

    const f = await prisma.follow.findUnique({
        where: { followerId_profileId: { followerId, profileId } },
    });
    return reply.send({ following: !!f });
}
