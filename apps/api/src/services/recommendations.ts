import type { PrismaClient } from "@prisma/client";

type ProfileRec = {
    id: number;
    name: string;
    username: string | null;
    title: string | null;
    location: string | null;
    profile_picture_url: string | null;
    hero_banner_url?: string | null;
};

type ProjectRec = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    country: string | null;
    coverImageUrl: string | null;
    bio: string | null;
    status?: string | null;
    updatedAt?: Date | string | null;
    followerCount?: number;
    bookmarkCount?: number;
    viewCount?: number;
    reason?: string;
    badge?: string;
};

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

type ProjectDiscoveryQuery = {
    limit?: number;
    days?: number;
    category?: string;
    excludeProjectId?: number;
};

function clampLimit(value?: number) {
    if (!Number.isFinite(value ?? NaN)) return DEFAULT_LIMIT;
    return Math.min(MAX_LIMIT, Math.max(1, Math.trunc(value as number)));
}

function clampDays(value?: number) {
    if (!Number.isFinite(value ?? NaN)) return 30;
    return Math.min(90, Math.max(1, Math.trunc(value as number)));
}

function sinceDays(days: number) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
}

function mapProjectRow(
    project: any,
    counts: { followers?: number; bookmarks?: number; views?: number } = {},
    badge?: string
): ProjectRec {
    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        category: project.category ?? null,
        bio: project.bio ?? null,
        coverImageUrl: project.coverImageUrl ?? null,
        status: null,
        country: project.country ?? null,
        updatedAt: project.updatedAt ?? null,
        followerCount: counts.followers ?? project._count?.ProjectFollow ?? 0,
        bookmarkCount: counts.bookmarks ?? project._count?.ProjectBookmark ?? 0,
        viewCount: counts.views ?? project._count?.ProjectView ?? 0,
        reason: badge,
        badge,
    };
}

export async function getProfileRecommendations(prisma: PrismaClient, profileId: number) {
    const [similarProfiles, relatedProjects, peopleAlsoViewed, trendingProjects] =
        await Promise.all([
            getSimilarProfiles(prisma, profileId, 6),
            getRelatedProjectsForProfile(prisma, profileId, 6),
            getPeopleAlsoViewed(prisma, profileId, 6),
            getTrendingProjects(prisma, 6),
        ]);

    return {
        similarProfiles,
        relatedProjects,
        peopleAlsoViewed,
        trendingProjects,
    };
}

export async function getProjectRecommendations(prisma: PrismaClient, projectId: number) {
    const [relatedProjects, similarProfiles, trendingProjects] = await Promise.all([
        getRelatedProjects(prisma, projectId, 6),
        getSimilarProfilesForProject(prisma, projectId, 6),
        getTrendingProjects(prisma, 6),
    ]);

    return {
        relatedProjects,
        similarProfiles,
        trendingProjects,
    };
}

export async function getTrendingProjectRecommendations(prisma: PrismaClient, query: ProjectDiscoveryQuery = {}) {
    const limit = clampLimit(query.limit);
    const days = clampDays(query.days);
    const since = sinceDays(days);
    const category = query.category?.trim() || undefined;
    const excludeProjectId = query.excludeProjectId;

    const [views, clicks, follows, bookmarks, recent] = await Promise.all([
        prisma.projectView.groupBy({
            by: ["project_id"],
            where: { created_at: { gte: since }, ...(excludeProjectId ? { project_id: { not: excludeProjectId } } : {}) },
            _count: { _all: true },
            orderBy: { _count: { project_id: "desc" } },
            take: 40,
        }),
        prisma.projectClick.groupBy({
            by: ["projectId"],
            where: { createdAt: { gte: since }, ...(excludeProjectId ? { projectId: { not: excludeProjectId } } : {}) },
            _count: { _all: true },
            orderBy: { _count: { projectId: "desc" } },
            take: 40,
        }),
        prisma.projectFollow.groupBy({
            by: ["projectId"],
            where: { createdAt: { gte: since }, ...(excludeProjectId ? { projectId: { not: excludeProjectId } } : {}) },
            _count: { _all: true },
            orderBy: { _count: { projectId: "desc" } },
            take: 40,
        }),
        prisma.projectBookmark.groupBy({
            by: ["projectId"],
            where: { createdAt: { gte: since }, ...(excludeProjectId ? { projectId: { not: excludeProjectId } } : {}) },
            _count: { _all: true },
            orderBy: { _count: { projectId: "desc" } },
            take: 40,
        }),
        prisma.project.findMany({
            where: {
                isPublished: true,
                ...(category ? { category: category as any } : {}),
                ...(excludeProjectId ? { id: { not: excludeProjectId } } : {}),
            },
            select: { id: true },
            orderBy: { updatedAt: "desc" },
            take: 40,
        }),
    ]);

    const ids = new Set<number>(recent.map((row) => row.id));
    views.forEach((row) => ids.add(row.project_id));
    clicks.forEach((row) => ids.add(row.projectId));
    follows.forEach((row) => ids.add(row.projectId));
    bookmarks.forEach((row) => ids.add(row.projectId));

    if (!ids.size) return [];

    const projects = await prisma.project.findMany({
        where: {
            id: { in: [...ids] },
            isPublished: true,
            ...(category ? { category: category as any } : {}),
        },
        select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            bio: true,
            coverImageUrl: true,
            country: true,
            updatedAt: true,
            _count: { select: { ProjectFollow: true, ProjectBookmark: true, ProjectView: true } },
        },
    });

    const viewMap = new Map(views.map((row) => [row.project_id, row._count._all]));
    const clickMap = new Map(clicks.map((row) => [row.projectId, row._count._all]));
    const followMap = new Map(follows.map((row) => [row.projectId, row._count._all]));
    const bookmarkMap = new Map(bookmarks.map((row) => [row.projectId, row._count._all]));
    const now = Date.now();

    return projects
        .map((project) => {
            const viewCount = viewMap.get(project.id) ?? 0;
            const clickCount = clickMap.get(project.id) ?? 0;
            const followCount = followMap.get(project.id) ?? 0;
            const bookmarkCount = bookmarkMap.get(project.id) ?? 0;
            const ageDays = Math.max(0, (now - project.updatedAt.getTime()) / 86400000);
            const activityScore = Math.max(0, 10 - Math.min(10, ageDays / 3));
            return {
                project,
                score: viewCount * 1 + clickCount * 2 + followCount * 4 + bookmarkCount * 3 + activityScore,
                viewCount,
            };
        })
        .sort((a, b) => b.score - a.score || b.project.updatedAt.getTime() - a.project.updatedAt.getTime())
        .slice(0, limit)
        .map(({ project, viewCount }) => mapProjectRow(project, { views: viewCount }, "Trending"));
}

export async function getPopularProjectsInCategory(
    prisma: PrismaClient,
    category: string,
    query: Pick<ProjectDiscoveryQuery, "limit" | "excludeProjectId"> = {}
) {
    const limit = clampLimit(query.limit);
    const excludeProjectId = query.excludeProjectId;

    const candidates = await prisma.project.findMany({
        where: {
            isPublished: true,
            category: category as any,
            ...(excludeProjectId ? { id: { not: excludeProjectId } } : {}),
        },
        select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            bio: true,
            coverImageUrl: true,
            country: true,
            updatedAt: true,
            _count: { select: { ProjectFollow: true, ProjectBookmark: true, ProjectView: true, ProjectClick: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 80,
    });

    return candidates
        .map((project) => ({
            project,
            score:
                project._count.ProjectFollow * 4 +
                project._count.ProjectBookmark * 3 +
                project._count.ProjectClick * 2 +
                project._count.ProjectView,
        }))
        .sort((a, b) => b.score - a.score || b.project.updatedAt.getTime() - a.project.updatedAt.getTime())
        .slice(0, limit)
        .map(({ project }) => mapProjectRow(project, undefined, "Popular"));
}

export async function getRecentlyActiveProjects(prisma: PrismaClient, query: Pick<ProjectDiscoveryQuery, "limit" | "category" | "excludeProjectId"> = {}) {
    const limit = clampLimit(query.limit);
    const category = query.category?.trim() || undefined;

    const projects = await prisma.project.findMany({
        where: {
            isPublished: true,
            ...(category ? { category: category as any } : {}),
            ...(query.excludeProjectId ? { id: { not: query.excludeProjectId } } : {}),
        },
        select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            bio: true,
            coverImageUrl: true,
            country: true,
            updatedAt: true,
            _count: { select: { ProjectFollow: true, ProjectBookmark: true, ProjectView: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
    });

    return projects.map((project) => mapProjectRow(project, undefined, "Recently Active"));
}

export async function getSimilarProjects(prisma: PrismaClient, projectId: number, query: Pick<ProjectDiscoveryQuery, "limit"> = {}) {
    const limit = clampLimit(query.limit);
    const base = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            category: true,
            targetIndustry: true,
            country: true,
            ProjectTag: { select: { tag: true }, take: 20 },
        },
    });
    if (!base) return [];

    const tags = base.ProjectTag.map((row) => row.tag).filter(Boolean);
    const candidates = await prisma.project.findMany({
        where: {
            id: { not: projectId },
            isPublished: true,
            OR: [
                { category: base.category },
                ...(base.targetIndustry ? [{ targetIndustry: base.targetIndustry }] : []),
                ...(base.country ? [{ country: base.country }] : []),
                ...(tags.length ? [{ ProjectTag: { some: { tag: { in: tags } } } }] : []),
            ],
        },
        select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            targetIndustry: true,
            bio: true,
            coverImageUrl: true,
            country: true,
            updatedAt: true,
            ProjectTag: { select: { tag: true }, take: 20 },
            _count: { select: { ProjectFollow: true, ProjectBookmark: true, ProjectView: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 60,
    });

    return candidates
        .map((project) => {
            const projectTags = new Set(project.ProjectTag.map((row) => row.tag));
            const tagOverlap = tags.filter((tag) => projectTags.has(tag)).length;
            const score =
                (project.category === base.category ? 50 : 0) +
                (base.targetIndustry && project.targetIndustry === base.targetIndustry ? 30 : 0) +
                tagOverlap * 8 +
                (base.country && project.country === base.country ? 4 : 0) +
                Math.min(10, project._count.ProjectFollow + project._count.ProjectBookmark);
            return { project, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || b.project.updatedAt.getTime() - a.project.updatedAt.getTime())
        .slice(0, limit)
        .map(({ project }) => mapProjectRow(project, undefined, "Similar"));
}

async function getSimilarProfiles(prisma: PrismaClient, profileId: number, limit = 6) {
    const rows = await prisma.$queryRawUnsafe<ProfileRec[]>(`
    SELECT
      p.id,
      p.name,
      p.username,
      p.title,
      p.location,
      p.profile_picture_url,
      p.hero_banner_url
    FROM profile p
    JOIN profile base ON base.id = ?
    WHERE p.id <> base.id
      AND (
        (p.industry IS NOT NULL AND base.industry IS NOT NULL AND p.industry = base.industry)
        OR
        (p.location IS NOT NULL AND base.location IS NOT NULL AND p.location = base.location)
        OR
        (p.title IS NOT NULL AND base.title IS NOT NULL AND p.title = base.title)
      )
    ORDER BY
      (p.industry <=> base.industry) DESC,
      (p.location <=> base.location) DESC,
      (p.title <=> base.title) DESC,
      p.created_at DESC
    LIMIT ?
  `, profileId, limit);

    return rows;
}

async function getRelatedProjectsForProfile(prisma: PrismaClient, profileId: number, limit = 6) {
    const rows = await prisma.$queryRawUnsafe<ProjectRec[]>(`
    SELECT
      pr.id,
      pr.title,
      pr.slug,
      pr.category,
      pr.country,
      pr.coverImageUrl,
      pr.bio
    FROM project pr
    JOIN profile p ON p.id = ?
    WHERE pr.isPublished = 1
      AND (
        (p.industry IS NOT NULL AND pr.targetIndustry = p.industry)
        OR
        (p.location IS NOT NULL AND pr.country = p.location)
        OR
        pr.profileId = p.id
      )
    ORDER BY pr.createdAt DESC
    LIMIT ?
  `, profileId, limit);

    return rows;
}

async function getPeopleAlsoViewed(prisma: PrismaClient, profileId: number, limit = 6) {
    const rows = await prisma.$queryRawUnsafe<ProfileRec[]>(`
    SELECT
      p.id,
      p.name,
      p.username,
      p.title,
      p.location,
      p.profile_picture_url,
      p.hero_banner_url
    FROM profilevisit pv1
    JOIN profilevisit pv2
      ON pv1.sessionId = pv2.sessionId
     AND pv1.profileId <> pv2.profileId
    JOIN profile p
      ON p.id = pv2.profileId
    WHERE pv1.profileId = ?
    GROUP BY p.id, p.name, p.username, p.title, p.location, p.profile_picture_url, p.hero_banner_url
    ORDER BY COUNT(*) DESC, p.created_at DESC
    LIMIT ?
  `, profileId, limit);

    return rows;
}

async function getTrendingProjects(prisma: PrismaClient, limit = 6) {
    const rows = await prisma.$queryRawUnsafe<ProjectRec[]>(`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.category,
      p.country,
      p.coverImageUrl,
      p.bio
    FROM project p
    LEFT JOIN (
      SELECT projectId, COUNT(*) AS bookmark_count
      FROM projectbookmark
      WHERE createdAt >= NOW() - INTERVAL 14 DAY
      GROUP BY projectId
    ) pb ON pb.projectId = p.id
    LEFT JOIN (
      SELECT project_id, COUNT(*) AS click_count
      FROM project_click
      WHERE created_at >= NOW() - INTERVAL 14 DAY
      GROUP BY project_id
    ) pc ON pc.project_id = p.id
    LEFT JOIN (
      SELECT project_id, COUNT(*) AS view_count
      FROM project_view
      WHERE created_at >= NOW() - INTERVAL 14 DAY
      GROUP BY project_id
    ) pv ON pv.project_id = p.id
    WHERE p.isPublished = 1
    ORDER BY (
      COALESCE(pb.bookmark_count, 0) * 4 +
      COALESCE(pc.click_count, 0) * 2 +
      COALESCE(pv.view_count, 0)
    ) DESC,
    p.createdAt DESC
    LIMIT ?
  `, limit);

    return rows;
}

async function getRelatedProjects(prisma: PrismaClient, projectId: number, limit = 6) {
    const rows = await prisma.$queryRawUnsafe<ProjectRec[]>(`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.category,
      p.country,
      p.coverImageUrl,
      p.bio
    FROM project p
    JOIN project base ON base.id = ?
    WHERE p.id <> base.id
      AND p.isPublished = 1
      AND (
        p.category = base.category
        OR (p.country IS NOT NULL AND p.country = base.country)
        OR p.profileId = base.profileId
      )
    ORDER BY
      (p.category <=> base.category) DESC,
      (p.country <=> base.country) DESC,
      (p.profileId = base.profileId) DESC,
      p.createdAt DESC
    LIMIT ?
  `, projectId, limit);

    return rows;
}

async function getSimilarProfilesForProject(prisma: PrismaClient, projectId: number, limit = 6) {
    const rows = await prisma.$queryRawUnsafe<ProfileRec[]>(`
    SELECT
      p.id,
      p.name,
      p.username,
      p.title,
      p.location,
      p.profile_picture_url,
      p.hero_banner_url
    FROM profile p
    JOIN project pr ON pr.id = ?
    WHERE
      p.id <> pr.profileId
      AND (
        (p.industry IS NOT NULL AND pr.targetIndustry IS NOT NULL AND p.industry = pr.targetIndustry)
        OR
        (p.location IS NOT NULL AND pr.country IS NOT NULL AND p.location = pr.country)
      )
    ORDER BY p.created_at DESC
    LIMIT ?
  `, projectId, limit);

    return rows;
}
