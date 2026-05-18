// src/controllers/socialLinks.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import type { SocialLinkCreate, SocialLinkUpdate, ReorderBody } from '../types/links';

function getUserId(req: FastifyRequest): number {
    const u = (req as any).user as { id: number } | undefined;
    if (!u?.id) throw new Error('Missing user in request');
    return u.id;
}

async function ensureProfileOwner(req: FastifyRequest, profileId: number) {
    const p = await req.server.prisma.profile.findUnique({
        where: { id: profileId },
        select: { id: true, userId: true },
    });
    if (!p) return { ok: false, code: 404, msg: 'Profile not found' as const };
    if (p.userId !== getUserId(req)) return { ok: false, code: 403, msg: 'Forbidden' as const };
    return { ok: true as const, profile: p };
}

// PUBLIC: list by profileId
export async function listSocialLinksByProfile(
    req: FastifyRequest<{ Params: { profileId: string } }>,
    reply: FastifyReply
) {
    const profileId = Number(req.params.profileId);
    const items = await req.server.prisma.socialLink.findMany({
        where: { profileId },
        orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return reply.send(items);
}

// PROTECTED: list mine (by my profileId)
export async function listMySocialLinks(
    req: FastifyRequest<{ Querystring: { profileId: string } }>,
    reply: FastifyReply
) {
    const profileId = Number(req.query.profileId);
    const check = await ensureProfileOwner(req, profileId);
    if (!check.ok) return reply.code(check.code).send({ message: check.msg });

    const items = await req.server.prisma.socialLink.findMany({
        where: { profileId },
        orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return reply.send(items);
}

// PROTECTED: create
export async function createSocialLink(
    req: FastifyRequest<{ Body: SocialLinkCreate }>,
    reply: FastifyReply
) {
    const { profileId, platform_name, url, icon, category, sort_order } = req.body;
    const check = await ensureProfileOwner(req, profileId);
    if (!check.ok) return reply.code(check.code).send({ message: check.msg });

    const created = await req.server.prisma.socialLink.create({
        data: {
            profileId,
            platform_name,
            url,
            icon: icon ?? null,
            category: category ?? null,
            sort_order: sort_order ?? 0,
        },
    });
    return reply.code(201).send(created);
}

// PROTECTED: update
export async function updateSocialLink(
    req: FastifyRequest<{ Params: { id: string }; Body: SocialLinkUpdate }>,
    reply: FastifyReply
) {
    const id = Number(req.params.id);
    const existing = await req.server.prisma.socialLink.findUnique({
        where: { id },
        select: { id: true, profileId: true },
    });
    if (!existing) return reply.code(404).send({ message: 'Not found' });

    const check = await ensureProfileOwner(req, existing.profileId);
    if (!check.ok) return reply.code(check.code).send({ message: check.msg });

    const { platform_name, url, icon, category, sort_order } = req.body || {};
    const updated = await req.server.prisma.socialLink.update({
        where: { id },
        data: {
            ...(platform_name !== undefined && { platform_name }),
            ...(url !== undefined && { url }),
            ...(icon !== undefined && { icon }),
            ...(category !== undefined && { category }),
            ...(sort_order !== undefined && { sort_order }),
        },
    });
    return reply.send(updated);
}

// PROTECTED: delete
export async function deleteSocialLink(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const id = Number(req.params.id);
    const existing = await req.server.prisma.socialLink.findUnique({
        where: { id },
        select: { id: true, profileId: true },
    });
    if (!existing) return reply.code(404).send({ message: 'Not found' });

    const check = await ensureProfileOwner(req, existing.profileId);
    if (!check.ok) return reply.code(check.code).send({ message: check.msg });

    await req.server.prisma.socialLink.delete({ where: { id } });
    return reply.code(204).send();
}

// PROTECTED: bulk reorder
export async function reorderSocialLinks(
    req: FastifyRequest<{ Body: ReorderBody }>,
    reply: FastifyReply
) {
    const { items } = req.body || { items: [] };
    if (!items.length) return reply.send([]);

    // validate ownership for all ids
    const ids = items.map(i => i.id);
    const found = await req.server.prisma.socialLink.findMany({
        where: { id: { in: ids } },
        select: { id: true, profileId: true },
    });
    if (!found.length) return reply.code(400).send({ message: 'Invalid items' });

    const profileId = found[0].profileId;
    const check = await ensureProfileOwner(req, profileId);
    if (!check.ok) return reply.code(check.code).send({ message: check.msg });

    await req.server.prisma.$transaction(
        items.map(i =>
            req.server.prisma.socialLink.update({
                where: { id: i.id },
                data: { sort_order: i.sort_order },
            })
        )
    );

    const refreshed = await req.server.prisma.socialLink.findMany({
        where: { profileId },
        orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return reply.send(refreshed);
}

export async function recordSocialLinkClick(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const socialLinkId = Number(request.params.id);

  const link = await request.server.prisma.socialLink.findUnique({
    where: { id: socialLinkId },
    select: { profileId: true }
  });

  if (!link) return reply.code(404).send();

  await request.server.prisma.socialLinkClick.create({
    data: {
      socialLinkId,
      profileId: link.profileId
    }
  });

  reply.code(204).send();
}