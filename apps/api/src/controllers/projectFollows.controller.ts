// src/controllers/projectFollows.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";

function getUserId(req: FastifyRequest) {
    const u = (req as any).user as { id: number } | undefined;
    if (!u?.id) throw new Error("Missing user");
    return u.id;
}

export async function follow(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    console.log("export async function follow: profileId")
    const prisma = req.server.prisma;
    const projectId = Number(req.params.projectId);
    console.log("export async function follow: profileId" + projectId)

    const userId = getUserId(req);
    console.log("export async function follow: followerId" + userId)

    // Ensure target profile exists
    const target = await prisma.profile.findUnique({
        where: { id: projectId },
        select: { id: true, userId: true },
    });
    if (!target) return reply.code(404).send({ ok: false, error: "PROFILE_NOT_FOUND" });

    // Prevent following own profile
    if (target.userId === userId) {
        return reply.code(400).send({ ok: false, error: "CANNOT_FOLLOW_SELF" });
    }

    await prisma.projectFollow.upsert({
        where: { userId_projectId: { userId, projectId } },
        update: {},
        create: { userId, projectId },
    });

    return reply.code(201).send({ ok: true });
}

export async function unfollow(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    console.log("export async function unfollow: profileId" )
    const prisma = req.server.prisma;
    const userId = getUserId(req);
    const projectId = Number(req.params.projectId);

    // Use deleteMany to avoid throwing if not found
    await prisma.projectFollow.deleteMany({
        where: { userId, projectId },
    });

    return reply.code(204).send();
}

export async function followerCount(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    const prisma = req.server.prisma;
    const projectId = Number(req.params.projectId);

    const followers = await prisma.projectFollow.count({ where: { projectId } });
    return reply.send({ followers });
}

export async function myFollowingCount(req: FastifyRequest, reply: FastifyReply) {
    const prisma = req.server.prisma;
    const userId = getUserId(req);

    const following = await prisma.projectFollow.count({ where: { userId } });
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
        prisma.projectFollow.count({ where: { userId: userId } }),
        myProfile ? prisma.projectFollow.count({ where: { userId: myProfile.id } }) : Promise.resolve(0),
    ]);

    return reply.send({ following, followers });
}

export async function isFollowing(
    req: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    console.log("export async function isfollow: profileId" )
    const prisma = req.server.prisma;
    const userId = getUserId(req);
    const projectId = Number(req.params.projectId);

    const f = await prisma.projectFollow.findUnique({
        where: { userId_projectId: { userId, projectId } },
    });
    return reply.send({ following: !!f });
}
