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
};

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