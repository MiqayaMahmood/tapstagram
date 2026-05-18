// src/controllers/profile.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import type { UpsertProfileBody } from '../types/profile';
import { mailer } from '../../config/email';
import { getVisibility } from "../services/visibility.service";

function getUserId(req: FastifyRequest): number {
    console.log("profile.controller : getUserId");
    const u = (req as any).user as { id: number } | undefined;
    if (!u?.id) throw new Error('Missing user in request (jwtVerify not called?)');
    return u.id;
}

// GET /profile  (protected – my profile)
export async function getMyProfile(req: FastifyRequest, reply: FastifyReply) {
    console.log("profile.controller : getMyProfile");
    const userId = getUserId(req);
    const profile = await req.server.prisma.profile.findUnique({
        where: { userId: userId },
        include: { socialLinks: true, project: true },
    });
    if (!profile) return reply.code(404).send({ message: 'Profile not found' });
    return reply.send(profile);
}

// GET /profile/:userId  (public)
export async function getProfileByUserId(req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply)
{
    console.log("profile.controller : getProfileByUserId");
    const userId = Number(req.params.userId);
    const profile = await req.server.prisma.profile.findUnique({
        where: { userId: userId },
        include: { socialLinks: true, project: true },
    });
    if (!profile) return reply.code(404).send({ message: 'Profile not found' });
    return reply.send(profile);
}

export async function getProfileByProfileId(req: FastifyRequest<{ Params: { profileId: string } }>, reply: FastifyReply)
{
    console.log("profile.controller : getProfileByProfileId");
    const profileId = Number(req.params.profileId);
    const profile = await req.server.prisma.profile.findUnique({
        where: { id: profileId },
        include: { socialLinks: true, project: true },
    });
    if (!profile) return reply.code(404).send({ message: 'Profile not found' });
    return reply.send(profile);
}


// PUT /profile  (protected – upsert mine)
export async function upsertProfile(req: FastifyRequest<{ Body: UpsertProfileBody }>, reply: FastifyReply)
{
    console.log("profile.controller : upsertProfile");
    const userId = getUserId(req);
    //const { username, name, title, bio, email, phone, location, industry, titleSlug, profile_picture_url, hero_banner_url } = req.body || {};
    const { name, title, bio, email, phone, location, industry, titleSlug, } = req.body || {};

    const profile = await req.server.prisma.profile.upsert({
        where: { userId },
        update: {
            //...(username !== undefined && { username }),
            ...(name !== undefined && { name }),
            ...(title !== undefined && { title }),
            ...(bio !== undefined && { bio }),
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(location !== undefined && { location }),
            ...(industry !== undefined && { industry }),
            ...(titleSlug !== undefined && { titleSlug }),
            //...(profile_picture_url !== undefined && { profile_picture_url }),
            //...(hero_banner_url !== undefined && { hero_banner_url }),
        },
        create: {
            userId,
            //username: username ?? 'User Name',
            name: name ?? 'New User',
            title: title ?? null,
            bio: bio ?? null,
            email: email ?? null,
            phone: phone ?? null,
            location: location ?? null,
            industry: industry ?? null,
            titleSlug: titleSlug ?? null,
            //profile_picture_url: profile_picture_url ?? null,
            //hero_banner_url: hero_banner_url ?? null,
            
        },
    });

    return reply.send(profile);
}

//import type { FastifyReply, FastifyRequest } from "fastify";
import {
    normalizeUsername, validateUsername, usernameReasonToMessage, suggestUsernames
} from "../utils/validate";
import {
    findProfileByUsername, isUsernameTaken, updateProfileUsername, setProfileMediaUrl
} from "../services/profile.service";
import { email } from 'zod/v4/core/regexes.cjs';

// GET /api/username/check?username=foo
export async function checkUsernameController(req: FastifyRequest, reply: FastifyReply) {
    const raw = String((req.query as any)?.username || "");
    const username = normalizeUsername(raw);
    const valid = validateUsername(username);

    if (!valid.ok) {
        return reply.send({
            ok: false,
            username,
            reason: usernameReasonToMessage(valid.code),
            suggestions: suggestUsernames(username)
        });
    }

    const taken = await isUsernameTaken(username);
    return reply.send({
        ok: !taken,
        username,
        reason: taken ? "That username is taken." : null,
        suggestions: taken ? suggestUsernames(username) : []
    });
}

// PATCH /api/profile/username  { username: "new_name" }
export async function updateUsernameController(req: FastifyRequest, reply: FastifyReply) {
    // assumes you already attach user to request (see your auth plugin)
    const userId = (req as any).user?.id;
    if (!userId) return reply.code(401).send({ ok: false, reason: "Unauthorized" });

    const raw = String((req.body as any)?.username || "");
    const username =  normalizeUsername(raw);
    const valid = validateUsername(username);
    if (!valid.ok) return reply.code(400).send({ ok: false, reason: usernameReasonToMessage(valid.code) });

    const existing = await findProfileByUsername(username);
    if (existing && existing.userId !== Number(userId)) {
        return reply.code(409).send({ ok: false, reason: "That username is taken." });
    }

    await updateProfileUsername(Number(userId), username);
    return reply.send({ ok: true, username, publicUrl: `https://tapstagram.com/${username}` });
}


// PATCH /api/profile/media  { type: "avatar" | "banner", url: "https://..." }
export async function updateProfileMediaController(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req as any).user?.id;
    if (!userId) return reply.code(401).send({ ok: false, reason: "Unauthorized" });

    const { type, url } = (req.body as any) as { type: "avatar" | "banner"; url: string };
    if (!type || !url || !/^https?:\/\//.test(url)) return reply.code(400).send({ ok: false, reason: "Bad payload" });

    await setProfileMediaUrl(Number(userId), type, url);
    return reply.send({ ok: true, url });
}

export async function recordProfileView(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply)
{
  const profileId = Number(request.params.id);

  await request.server.prisma.profileView.create({
    data: { profileId }
  });

  reply.code(204).send();
}
type LeadBody = {
    firstName: string;
    lastName: string;
    contactEmail: string;
    contactPhone?: string;
    country?: string;
    message?: string;
    source?: string;
};

export async function createLead(request: FastifyRequest<{ Params: { id: string }; Body: LeadBody }>, reply: FastifyReply)
{
    const profileId = Number(request.params.id);
    const { firstName, lastName, contactEmail, contactPhone, country, message, source } = request.body;

    if (!contactEmail) {
        return reply.code(400).send({ message: "Email is required" });
    }

    const profile = await request.server.prisma.profile.findUnique({
        where: { id: profileId },
        select: { id: true, email: true, name: true },
    });

    if (!profile) {
        return reply.code(404).send({ message: "Profile not found" });
    }

    await request.server.prisma.lead.create({
        data: {
            profileId,
            firstName,
            lastName,
            contactEmail,
            contactPhone,
            country,
            message,
            source: source ?? "web",
        },
    });

    // email notification hook here

     mailer.sendMail({
        from: `"Tapstagram" <notifications@tapstagram.com>`,
        to: profile.email || '"TAPSTAGRAM" <noreply@tapstagram.com>', // profile owner email
        subject: "New Lead from Tapstagram",
        html: `
        <p>You have a new lead:</p>
        <p><strong>Name:</strong> ${firstName}  ${lastName}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        <p><strong>Message:</strong><br/>${message || "-"}</p>
      `,
    });

    await mailer.sendMail({
        to: contactEmail,
        subject: "Thanks for contacting me",
        text: "Thanks for reaching out. I’ll get back to you shortly.",
    });

    return reply.send({ ok: true });

}

//export async function getProfileLeads(req: FastifyRequest, reply: FastifyReply) {
//    const userId = (req as any).user?.id;
//    if (!userId) return reply.code(401).send({ ok: false, reason: "Unauthorized" });

//    const rows = await req.server.prisma.project.findMany({
//        where: { ProjectFollow: { some: { userId } } },
        
//        orderBy: [{ updatedAt: "desc" }],
//    });
//    reply.send(rows);
//}

export async function getProfileLeads(request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) {
    const userId = (request as any).user?.id;
    if (!userId) return reply.code(401).send({ ok: false, reason: "Unauthorized" });

    const profileId = Number(request.params.id);
    const prisma = request.server.prisma;

    const [leads, totalLeads, leadsThisWeek, profileViews] =
        await Promise.all([
            prisma.lead.findMany({
                where: { profileId },
                orderBy: { createdAt: "desc" },
            }),
            prisma.lead.count({ where: { profileId } }),
            prisma.lead.count({
                where: {
                    profileId,
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 86400000),
                    },
                },
            }),
            prisma.profileView.count({ where: { profileId } }),
        ]);

    const conversionRate =
        profileViews > 0
            ? Math.round((totalLeads / profileViews) * 100)
            : 0;

    const visibility = await getVisibility(profileId, prisma);

    reply.send({
        stats: {
            totalLeads,
            leadsThisWeek,
            profileViews,
            conversionRate,
        },
        leads,
        visibility,
    });
}

export async function getVisibilityController(request: FastifyRequest, reply: FastifyReply) {
    const profileId = (request as any).profileId;
    //const profileId = Number(request.query.profileId);

    const data = await getVisibility(profileId, request.server.prisma);

    reply.send(data);
}