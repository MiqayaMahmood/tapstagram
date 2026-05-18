//apps/api/src/controllers/project.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type SocialGroup = {
    platform: string | null; // or `string | null` if you prefer
    _count: { _all: number } | null;        // Prisma marks aggregates as possibly null
};

function me(req: FastifyRequest) {
    return (req.user as any)?.id as number;
}

function ua(req: any) { return (req.headers["user-agent"] as string) || null; }
function ref(req: any, body?: any) { return (body?.referrer as string) ?? (req.headers.referer as string) ?? null; }
function norm(href: string) { return /^https?:\/\//i.test(href) ? href : `https://${href}`; }

// -------------------- Schemas --------------------

const IdParam = z.object({ id: z.coerce.number().int().positive() });
const ProfileIdParam = z.object({ profileId: z.coerce.number().int().positive() });
const LinkIdParam = z.object({ linkId: z.string() });



const BaseSlug = z
  .string()
  .min(2, "Slug must be at least 2 characters.")
  .max(120, "Slug must be at most 120 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

//const UrlString = z.string().url("Enter a valid URL like https://example.com");

// Use strings for enums; Prisma will validate against DB enum values
const ProjectCategory = z.enum(["DISTRIBUTIONS", "eCOMMERCE", "EDUCATION", "ELECTRICAL_ELECTRONICS",
        "FINANCE", "FOOD_BEVREGES", "HEALTHCARE", "HOTEL_RESTAURANT",
        "IMPORT_EXPORT", "INDUSTRIAL_MACHINARY", "MANUFACTURING", "MARKETING",
        "REAL_ESTATE", "RETAIL", "SALES", "SERVICES",
        "SOFTWARE", "TRADING", "OTHER"])
  .nullable()
  .optional();

const SocialPlatform = z.enum([
  "WEBSITE",
  "FACEBOOK",
  "INSTAGRAM",
  "X",
  "LINKEDIN",
  "YOUTUBE",
  "TIKTOK",
  "GITHUB",
  "TELEGRAM",
  "WHATSAPP",
  "DRIBBLE",
  "BEHANCE",
  "REDDIT",
  "OTHER",
  
]);

const SocialLinkSchema = z.object({
  id: z.number().int().positive(), // for existing rows
  platform: SocialPlatform,
  label: z.string().max(80).optional().nullable(),
  url: z.string().min(1),
  sort_order: z.number().int().optional(),
});

// ---- Create / Update payloads ----

const CreateProjectBody = z.object({
  profileId: z.number().int().positive(),
  title: z.string().min(2).max(100),
  slug: BaseSlug,
  category: ProjectCategory,
  targetIndustry: z.string().max(120).optional().nullable(),
  bio: z.string().max(200).optional().nullable(),
  description: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  url: z.string().optional().nullable(),

  // contact
  website: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(40).optional().nullable(),
  addressLine1: z.string().max(120).optional().nullable(),
  addressLine2: z.string().max(120).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  region: z.string().max(80).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),

  // ops
  startedOn: z.coerce.date().optional().nullable(),
  isPublished: z.coerce.boolean().optional().default(false),
  coverImageUrl: z.string().url().optional().nullable(),

  // links
  socialLinks: z.array(SocialLinkSchema).optional().default([]),
});

const UpdateProjectBody = CreateProjectBody.partial();

// Section bodies
const BasicBody = z.object({
  profileId: z.number().int().positive(),
  title: z.string().min(2).max(100),
  slug: BaseSlug,
  category: ProjectCategory,
  targetIndustry: z.string().max(120).optional().nullable(),
  startedOn: z.coerce.date().optional().nullable(),
  isPublished: z.coerce.boolean().optional().default(false),

  url: z.string().optional().nullable(),
});

const StoryBody = z.object({
  bio: z.string().max(200).optional().nullable(),
  longDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

const ContactBody = z.object({
  website: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(40).optional().nullable(),
  addressLine1: z.string().max(120).optional().nullable(),
  addressLine2: z.string().max(120).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  region: z.string().max(80).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
});

// Reorder payloads
const ReorderProjectsBody = z.object({
  items: z
    .array(z.object({ id: z.number().int().positive(), sort_order: z.number().int().nonnegative() }))
    .min(1),
});

const ReplaceSocialLinksBody = z.object({
  socialLinks: z.array(SocialLinkSchema).default([]),
});

const ReorderLinkIdsBody = z.object({
    ids: z.array(z.coerce.number().int().positive()).min(1),
});

const AddOneLinkBody = SocialLinkSchema.omit({ id: true, sort_order: true });

// -------------------- Helpers --------------------

function ensureOwnedProject(req: FastifyRequest, project: { profile: { userId: number } }) {
  const userId = (req.user as any)?.id as number;
  if (!userId || project.profile.userId !== userId) {
    const err: any = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }
}

async function loadOwnedProject(req: FastifyRequest, id: number) {
  const found = await req.server.prisma.project.findUnique({
    where: { id },
    include: { profile: { select: { id: true, userId: true } } },
  });
  if (!found) {
    const err: any = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  ensureOwnedProject(req, found as any);
  return found;
}

async function ensureOwnedProfile(req: FastifyRequest, profileId: number) {
  const userId = (req.user as any)?.id as number;
  const prof = await req.server.prisma.profile.findUnique({
    where: { id: profileId },
    select: { id: true, userId: true },
  });
  if (!prof) {
    const err: any = new Error("Profile not found");
    err.statusCode = 404;
    throw err;
  }
  if (prof.userId !== userId) {
    const err: any = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }
  return prof;
}

function toPrismaDate(d?: Date | null) {
  return d ? new Date(d) : null;
}

// -------------------- Controllers --------------------

// Public: list for profile page
export async function listProjectsByProfile(req: FastifyRequest, reply: FastifyReply) {
  const { profileId } = ProfileIdParam.parse(req.params);
  const userId = (req.user as any)?.id as number | undefined;

  // If owner, return all; otherwise published only
  const isOwner = userId
    ? !!(await req.server.prisma.profile.findFirst({ where: { id: profileId, userId } }))
    : false;

  const projects = await req.server.prisma.project.findMany({
    where: { profileId, ...(isOwner ? {} : { isPublished: true }) },
    orderBy: [{ sort_order: "asc" }, { createdAt: "asc" }],
    include: { socialLinks: true },
  });

  reply.send(projects);
}

// Mine
export async function listMyProjects(req: FastifyRequest, reply: FastifyReply) {

    const userId = (req.user as any).id as number;
    const profileId = (req.query as any).profileId ? Number((req.query as any).profileId) : undefined;
    console.log("//apps/api/src/controllers/project.controller.ts - listMyProjects - profileId: " + profileId)

    const where = profileId
        ? { profile: { userId }, profileId }
        : { profile: { userId } };

    const projects = await req.server.prisma.project.findMany({
        where,
        orderBy: [{ sort_order: "asc" }, { createdAt: "asc" }],
        include: { profile: { select: { id: true, userId: true, username: true, plan: true } }, socialLinks: { orderBy: { sort_order: "desc" } } },
  });

  reply.send(projects);
}

export async function projectPublicViewById(req: FastifyRequest, reply: FastifyReply) {

    const { id } = IdParam.parse(req.params);

    console.log("//apps/api/src/controllers/project.controller.ts - projectPublicViewById - projectId: " + id)
    const project = await req.server.prisma.project.findUnique({
        where: { id },
        include: { profile: { select: { id: true, userId: true, username: true, plan:true } }, socialLinks: { orderBy: { sort_order: "asc" } } },
    });
    if (!project) return reply.code(404).send({ message: "Project not found" });
    //ensureOwnedProject(req, project as any);
    reply.send(project);
}


// One (edit)
export async function getProjectById(req: FastifyRequest, reply: FastifyReply) {
    
    const { id } = IdParam.parse(req.params);

    console.log("//apps/api/src/controllers/project.controller.ts - getProjectById - projectId: " + id)
  const project = await req.server.prisma.project.findUnique({
    where: { id },
      include: { profile: { select: { id: true, userId: true, username: true, plan: true } }, socialLinks: { orderBy: { sort_order: "asc" } } },
  });
  if (!project) return reply.code(404).send({ message: "Project not found" });
  ensureOwnedProject(req, project as any);
  reply.send(project);
}

// Create
export async function createProject(req: FastifyRequest, reply: FastifyReply) {
  const body = CreateProjectBody.parse(req.body);
  await ensureOwnedProfile(req, body.profileId);

    console.log("ProjectController - body.profileId: " + body.profileId)
  try {
    const created = await req.server.prisma.project.create({
      data: {
        profileId: body.profileId,
        title: body.title,
        slug: body.slug,
        category: (body.category ?? undefined) as any,
        targetIndustry: body.targetIndustry ?? null,
        bio: body.bio ?? null,
        description: body.description ?? null,
        longDescription: body.longDescription ?? null,
        url: body.url ?? null,
        addressLine1: body.addressLine1 ?? null,
        addressLine2: body.addressLine2 ?? null,
        city: body.city ?? null,
        region: body.region ?? null,
        postalCode: body.postalCode ?? null,
        country: body.country ?? null,
        contactEmail: body.contactEmail ?? null,
        contactPhone: body.contactPhone ?? null,
        website: body.website ?? null,
        locationLat: body.locationLat ?? null,
        locationLng: body.locationLng ?? null,
        startedOn: toPrismaDate(body.startedOn),
        isPublished: body.isPublished ?? false,
        coverImageUrl: body.coverImageUrl ?? null,
        sort_order: 0,
        socialLinks: body.socialLinks
          ? {
              create: body.socialLinks.map((l, i) => ({
                platform: l.platform as any,
                label: l.label ?? null,
                url: l.url,
                sort_order: l.sort_order ?? i,
              })),
            }
          : undefined,
      },
      include: { socialLinks: true },
    });
    return reply.code(201).send(created);
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("slug")) {
      return reply.code(409).send({ message: "Slug already exists" });
    }
    throw e;
  }
}

// Update (generic partial)
export async function updateProject(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const body = UpdateProjectBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  try {
    const updated = await req.server.prisma.project.update({
      where: { id: project.id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.category !== undefined ? { category: (body.category ?? undefined) as any } : {}),
        ...(body.targetIndustry !== undefined ? { targetIndustry: body.targetIndustry ?? null } : {}),
        ...(body.bio !== undefined ? { bio: body.bio ?? null } : {}),
        ...(body.description !== undefined ? { description: body.description ?? null } : {}),
        ...(body.longDescription !== undefined ? { longDescription: body.longDescription ?? null } : {}),
        ...(body.url !== undefined ? { url: body.url } : {}),
        ...(body.website !== undefined ? { website: body.website ?? null } : {}),
        ...(body.contactEmail !== undefined ? { contactEmail: body.contactEmail ?? null } : {}),
        ...(body.contactPhone !== undefined ? { contactPhone: body.contactPhone ?? null } : {}),
        ...(body.addressLine1 !== undefined ? { addressLine1: body.addressLine1 ?? null } : {}),
        ...(body.addressLine2 !== undefined ? { addressLine2: body.addressLine2 ?? null } : {}),
        ...(body.city !== undefined ? { city: body.city ?? null } : {}),
        ...(body.region !== undefined ? { region: body.region ?? null } : {}),
        ...(body.postalCode !== undefined ? { postalCode: body.postalCode ?? null } : {}),
        ...(body.country !== undefined ? { country: body.country ?? null } : {}),
        ...(body.locationLat !== undefined ? { locationLat: body.locationLat ?? null } : {}),
        ...(body.locationLng !== undefined ? { locationLng: body.locationLng ?? null } : {}),
        ...(body.startedOn !== undefined ? { startedOn: toPrismaDate(body.startedOn) } : {}),
        ...(body.isPublished !== undefined ? { isPublished: !!body.isPublished } : {}),
        ...(body.coverImageUrl !== undefined ? { coverImageUrl: body.coverImageUrl ?? null } : {}),
      },
      include: { socialLinks: true },
    });
    reply.send(updated);
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("slug")) {
      return reply.code(409).send({ message: "Slug already exists" });
    }
    throw e;
  }
}

// Delete
export async function deleteProject(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const project = await loadOwnedProject(req, id);
  await req.server.prisma.project.delete({ where: { id: project.id } });
  reply.send({ ok: true });
}

// Bulk reorder
export async function reorderProjects(req: FastifyRequest, reply: FastifyReply) {
  const { items } = ReorderProjectsBody.parse(req.body);
  // load all for ownership check
  const ids = items.map((i) => i.id);
  const rows = await req.server.prisma.project.findMany({
    where: { id: { in: ids } },
    include: { profile: { select: { userId: true } } },
  });
  for (const r of rows) ensureOwnedProject(req, r as any);

  await req.server.prisma.$transaction(
    items.map(({ id, sort_order }) =>
      req.server.prisma.project.update({ where: { id }, data: { sort_order } })
    )
  );
  reply.send({ ok: true });
}

// ---------- Sectioned PATCH ----------

export async function updateProjectBasic(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const data = BasicBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  // ensure ownership of profile if it's being changed
  if (data.profileId && data.profileId !== project.profileId) {
    await ensureOwnedProfile(req, data.profileId);
  }

  try {
    const updated = await req.server.prisma.project.update({
      where: { id: project.id },
      data: {
        profileId: data.profileId,
        title: data.title,
        slug: data.slug,
        category: (data.category ?? undefined) as any,
        targetIndustry: data.targetIndustry ?? null,
        startedOn: toPrismaDate(data.startedOn),
        isPublished: !!data.isPublished,
        url: data.url,
      },
      include: { socialLinks: true },
    });
    reply.send(updated);
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("slug")) {
      return reply.code(409).send({ message: "Slug already exists" });
    }
    throw e;
  }
}

export async function updateProjectStory(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const data = StoryBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  const updated = await req.server.prisma.project.update({
    where: { id: project.id },
    data: {
      bio: data.bio ?? null,
      description: data.description ?? null,
      longDescription: data.longDescription ?? null,
    },
    include: { socialLinks: true },
  });
  reply.send(updated);
}

export async function updateHeroBanner(req: FastifyRequest, reply: FastifyReply) {
    const { id } = IdParam.parse(req.params);
    const { url } = req.body as { url: string };
    
    const project = await loadOwnedProject(req, id);
    console.log("updateHeroBanner: data.coverImageUrl: " + url)

    const updated = await req.server.prisma.project.update({
        where: { id: project.id },
        data: {
            coverImageUrl: url ?? null,
        }
    });
    reply.send({ ok: true });
}


export async function updateProjectContact(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const data = ContactBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  const updated = await req.server.prisma.project.update({
    where: { id: project.id },
    data: {
      website: data.website ?? null,
      contactEmail: data.contactEmail ?? null,
      contactPhone: data.contactPhone ?? null,
      addressLine1: data.addressLine1 ?? null,
      addressLine2: data.addressLine2 ?? null,
      city: data.city ?? null,
      region: data.region ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country ?? null,
      locationLat: data.locationLat ?? null,
      locationLng: data.locationLng ?? null,
    },
    include: { socialLinks: true },
  });
  reply.send(updated);
}

// ---------- Social Links ----------

// Replace entire links array (sort normalized)
export async function replaceSocialLinks(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const { socialLinks } = ReplaceSocialLinksBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  // Remove all, then recreate in desired order (simplest and safe)
  await req.server.prisma.$transaction([
    req.server.prisma.projectSocialLink.deleteMany({ where: { projectId: project.id } }),
    ...socialLinks.map((l, i) =>
      req.server.prisma.projectSocialLink.create({
        data: {
          projectId: project.id,
          platform: l.platform as any,
          label: l.label ?? null,
          url: l.url,
          sort_order: l.sort_order ?? i,
        },
      })
    ),
  ]);

  const fresh = await req.server.prisma.project.findUnique({
    where: { id: project.id },
    include: { socialLinks: { orderBy: { sort_order: "asc" } } },
  });
  reply.send(fresh);
}

// Reorder by list of link ids
export async function reorderSocialLinks(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const { ids } = ReorderLinkIdsBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  // Verify all belong to project
  const rows = await req.server.prisma.projectSocialLink.findMany({
    where: { id: { in: ids } },
    select: { id: true, projectId: true },
  });
  if (rows.some((r) => r.projectId !== project.id)) {
    return reply.code(400).send({ message: "Link does not belong to this project" });
  }

  await req.server.prisma.$transaction(
    ids.map((linkId, idx) =>
      req.server.prisma.projectSocialLink.update({ where: { id: linkId }, data: { sort_order: idx } })
    )
  );
  reply.send({ ok: true });
}

// Add one link
export async function addSocialLink(req: FastifyRequest, reply: FastifyReply) {
  const { id } = IdParam.parse(req.params);
  const data = AddOneLinkBody.parse(req.body);
  const project = await loadOwnedProject(req, id);

  const max = await req.server.prisma.projectSocialLink.aggregate({
    where: { projectId: project.id },
    _max: { sort_order: true },
  });
  const nextOrder = (max._max.sort_order ?? -1) + 1;

  const created = await req.server.prisma.projectSocialLink.create({
    data: {
      projectId: project.id,
      platform: data.platform as any,
      label: data.label ?? null,
      url: data.url,
      sort_order: nextOrder,
    },
  });
  reply.code(201).send(created);
}

// Delete one link
export async function deleteSocialLink(req: FastifyRequest, reply: FastifyReply) {
    const { id, linkId } = z
        .object({
            id: z.coerce.number().int().positive(),
            linkId: z.coerce.number().int().positive(),
        })
        .parse({ ...(req.params as any) });

  const project = await loadOwnedProject(req, id);
  const link = await req.server.prisma.projectSocialLink.findUnique({
    where: { id: linkId },
  });
  if (!link || link.projectId !== project.id) {
    return reply.code(404).send({ message: "Link not found" });
  }
  await req.server.prisma.projectSocialLink.delete({ where: { id: linkId } });
  reply.send({ ok: true });
}

/** POST /projects/:id/visit */
export async function trackProjectVisit(req: any, reply: any) {
    const { id } = IdParam.parse(req.params);
    // no need to load the whole project—trust fk, or 404 if missing:
    const exists = await req.server.prisma.project.count({ where: { id } });
    if (!exists) return reply.code(404).send({ message: "Project not found" });

    const profileId = Number((req.body as any)?.profileId);

    if (!profileId || !id) return reply.code(400).send({ ok: false, error: "INVALID_IDS" });

    await req.server.prisma.projectClick.create({
        data: { projectId: id, profileId: profileId,  kind: "VISIT", referrer: ref(req, req.body), userAgent: ua(req) },
    });
    reply.send({ ok: true });
}

/** GET /projects/r/:id/site -> log + redirect to project.url (or website) */
export async function redirectProjectSite(req: any, reply: any) {
    const { id } = IdParam.parse(req.params);
    const p = await req.server.prisma.project.findUnique({
        where: { id }, select: { id: true, url: true, website: true }
    });
    if (!p) return reply.code(404).send({ message: "Project not found" });

    const target = p.url || p.website;
    if (!target) return reply.code(404).send({ message: "No site URL" });

    await req.server.prisma.projectClick.create({
        data: { projectId: id, kind: "SITE", referrer: ref(req), userAgent: ua(req) },
    });
    reply.redirect(302, norm(target));
}

/** GET /projects/r/link/:linkId -> log + redirect to social url */
export async function redirectProjectLink(req: any, reply: any) {
    const { linkId } = LinkIdParam.parse(req.params);
    const link = await req.server.prisma.projectSocialLink.findUnique({
        where: { id: linkId }, select: { id: true, url: true, platform: true, projectId: true }
    });
    if (!link) return reply.code(404).send({ message: "Link not found" });

    await req.server.prisma.projectClick.create({
        data: {
            projectId: link.projectId,
            linkId: link.id,
            kind: "SOCIAL",
            platform: link.platform as any,
            referrer: ref(req),
            userAgent: ua(req),
        },
    });
    reply.redirect(302, norm(link.url));
}



export async function getProjectStats(req: any, reply: any) {
    const { id } = IdParam.parse(req.params);

    const [visits, siteClicks, byPlatform] = await Promise.all([
        req.server.prisma.projectClick.count({ where: { projectId: id, kind: "VISIT" } }),
        req.server.prisma.projectClick.count({ where: { projectId: id, kind: "SITE" } }),
        req.server.prisma.projectClick.groupBy({
            by: ["platform"],
            where: { projectId: id, kind: "SOCIAL" },
            _count: { _all: true },
        }) as Promise<SocialGroup[]>, // <— ensure typed (req.server is `any`)
    ]);

    reply.send({
        visits,
        siteClicks,
        social: byPlatform.map(({ platform, _count }) => ({
            platform,
            count: _count?._all ?? 0, // handle null just in case
        })),
    });
}

/** GET /projects/:id/stats (owner only) */
//export async function getProjectStats(req: any, reply: any) {
//    const { id } = IdParam.parse(req.params);
//    await loadOwnedProject(req, id); // reuse the helper we wrote earlier

//    const [visits, siteClicks, byPlatform] = await Promise.all([
//        req.server.prisma.projectClick.count({ where: { projectId: id, kind: "VISIT" } }),
//        req.server.prisma.projectClick.count({ where: { projectId: id, kind: "SITE" } }),
//        req.server.prisma.projectClick.groupBy({
//            by: ["platform"],
//            where: { projectId: id, kind: "SOCIAL" },
//            _count: { _all: true },
//        }),
//    ]);

//    reply.send({
//        visits,
//        siteClicks,
//        social: byPlatform.map(r => ({ platform: r.platform, count: (r as any)._count._all })),
//    });
//}

export async function bookmarkProject(req: FastifyRequest, reply: FastifyReply) {
    const { id } = IdParam.parse(req.params);
    const userId = me(req);
    // ensure project exists and is viewable (optional: only published for non-owners)
    const exists = await req.server.prisma.project.count({ where: { id } });
    if (!exists) return reply.code(404).send({ message: "Project not found" });

    await req.server.prisma.projectBookmark
        .create({ data: { userId, projectId: id } })
        .catch(() => { }); // ignore if already exists
    reply.code(204).send();
}

export async function unbookmarkProject(req: FastifyRequest, reply: FastifyReply) {
    const { id } = IdParam.parse(req.params);
    const userId = me(req);
    await req.server.prisma.projectBookmark
        .delete({ where: { userId_projectId: { userId, projectId: id } } })
        .catch(() => { });
    reply.code(204).send();
}

export async function followProject(req: FastifyRequest, reply: FastifyReply) {
    const { id } = IdParam.parse(req.params);
    const userId = me(req);
    const exists = await req.server.prisma.project.count({ where: { id } });
    if (!exists) return reply.code(404).send({ message: "Project not found" });

    await req.server.prisma.projectFollow
        .create({ data: { userId, projectId: id } })
        .catch(() => { });
    reply.code(204).send();
}

export async function unfollowProject(req: FastifyRequest, reply: FastifyReply) {
    const { id } = IdParam.parse(req.params);
    const userId = me(req);
    await req.server.prisma.projectFollow
        .delete({ where: { userId_projectId: { userId, projectId: id } } })
        .catch(() => { });
    reply.code(204).send();
}

// ----- State for current user + counts -----

export async function getMyProjectRelationState(req: FastifyRequest, reply: FastifyReply) {
    const { id } = IdParam.parse(req.params);
    const userId = me(req);

    const [bookmarked, following, bookmarkCount, followerCount] = await Promise.all([
        req.server.prisma.projectBookmark.findUnique({ where: { userId_projectId: { userId, projectId: id } } }),
        req.server.prisma.projectFollow.findUnique({ where: { userId_projectId: { userId, projectId: id } } }),
        req.server.prisma.projectBookmark.count({ where: { projectId: id } }),
        req.server.prisma.projectFollow.count({ where: { projectId: id } }),
    ]);

    reply.send({
        bookmarked: !!bookmarked,
        following: !!following,
        bookmarkCount,
        followerCount,
    });
}

// ----- Lists for "My Quick Links" -----

function projectSummarySelect() {
    return {
        id: true,
        title: true,
        slug: true,
        coverImageUrl: true,
        category: true,
        url: true,
    } as const;
}

export async function listMyBookmarkedProjects(req: FastifyRequest, reply: FastifyReply) {
    const userId = me(req);
    const rows = await req.server.prisma.project.findMany({
        where: { ProjectBookmark: { some: { userId } } },
        select: projectSummarySelect(),
        orderBy: [{ updatedAt: "desc" }],
    });
    reply.send(rows);
}

export async function listMyFollowedProjects(req: FastifyRequest, reply: FastifyReply) {
    const userId = me(req);
    const rows = await req.server.prisma.project.findMany({
        where: { ProjectFollow: { some: { userId } } },
        select: projectSummarySelect(),
        orderBy: [{ updatedAt: "desc" }],
    });
    reply.send(rows);
}

export async function getMyQuickLinks(req: FastifyRequest, reply: FastifyReply) {
    const userId = me(req);
    const [bookmarkedProjects, followedProjects] = await Promise.all([
        req.server.prisma.project.findMany({
            where: { ProjectBookmark: { some: { userId } } },
            select: projectSummarySelect(),
            orderBy: [{ updatedAt: "desc" }],
        }),
        req.server.prisma.project.findMany({
            where: { ProjectFollow: { some: { userId } } },
            select: projectSummarySelect(),
            orderBy: [{ updatedAt: "desc" }],
        }),
    ]);

    // If you already have profile bookmarks/follows endpoints, you can fetch and include them here too.
    reply.send({
        projects: { bookmarks: bookmarkedProjects, follows: followedProjects },
        // profiles: { bookmarks: [...], follows: [...] } // optional: from your profile controllers
    });
}

const ExploreProjectQuery = z.object({
    q: z.string().trim().optional(),
    category: z.enum(["DISTRIBUTIONS", "eCOMMERCE", "EDUCATION", "ELECTRICAL_ELECTRONICS",
        "FINANCE", "FOOD_BEVREGES", "HEALTHCARE", "HOTEL_RESTAURANT",
        "IMPORT_EXPORT", "INDUSTRIAL_MACHINARY", "MANUFACTURING", "MARKETING",
        "REAL_ESTATE", "RETAIL", "SALES", "SERVICES",
        "SOFTWARE", "TRADING", "OTHER"]).optional(),
    country: z.string().trim().optional(),
    published: z.coerce.boolean().optional(), // default true below
    sort: z.enum(["recent", "a-z", "z-a", "started", "popular"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    perPage: z.coerce.number().int().min(1).max(50).optional(),
});

export async function listExploreProjects(req: FastifyRequest, reply: FastifyReply) {
    const {
        q, category, country, published = true,
        sort = "recent", page = 1, perPage = 24
    } = ExploreProjectQuery.parse((req as any).query || {});

    // basic where
    const where: any = {};
    if (published) where.isPublished = true;
    if (category) where.category = category;
    if (country) where.country = country;

    if (q) {
        const term = q.trim();
        where.OR = [
            { title: { contains: term, mode: "insensitive" } },
            { bio: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { longDescription: { contains: term, mode: "insensitive" } },
            // if you join tags:
            // { ProjectTag: { some: { tag: { name: { contains: term, mode: "insensitive" } } } } },
        ];
    }

    // order
    let orderBy: any = [{ sort_order: "asc" as const }, { updatedAt: "desc" as const }];
    if (sort === "a-z") orderBy = [{ title: "asc" }];
    if (sort === "z-a") orderBy = [{ title: "desc" }];
    if (sort === "started") orderBy = [{ startedOn: "desc" }, { updatedAt: "desc" }];
    if (sort === "popular") orderBy = [{ updatedAt: "desc" }]; // TODO: replace with clicks if available

    const prisma = (req.server as any).prisma;
    const [total, items] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({
            where,
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true, slug: true, title: true, category: true,
                coverImageUrl: true, bio: true, country: true,
                startedOn: true, updatedAt: true, url: true,
                profileId: true,
            },
        }),
    ]);

    reply.send({
        page, perPage, total,
        items,
    });
}