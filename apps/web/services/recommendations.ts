import { apiFetch } from "@/lib/api";

export type ProfileRec = {
    id: number;
    name: string;
    username: string | null;
    title: string | null;
    location: string | null;
    profile_picture_url: string | null;
    hero_banner_url?: string | null;
};

export type ProjectRec = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    country: string | null;
    coverImageUrl: string | null;
    bio: string | null;
    status?: string | null;
    updatedAt?: string | null;
    followerCount?: number;
    bookmarkCount?: number;
    viewCount?: number;
    reason?: string;
    badge?: string;
};

export type ProfileRecommendationResponse = {
    similarProfiles: ProfileRec[];
    relatedProjects: ProjectRec[];
    peopleAlsoViewed: ProfileRec[];
    trendingProjects: ProjectRec[];
};

export type ProjectRecommendationResponse = {
    relatedProjects: ProjectRec[];
    similarProfiles: ProfileRec[];
    trendingProjects: ProjectRec[];
};

export const getProfileRecommendations = (profileId: number) =>
    apiFetch<ProfileRecommendationResponse>(`/recommendations/profile/${profileId}`);

export const getProjectRecommendations = (projectId: number) =>
    apiFetch<ProjectRecommendationResponse>(`/recommendations/project/${projectId}`);

function projectRecommendationQuery(params: {
    limit?: number;
    days?: number;
    category?: string;
    excludeProjectId?: number;
}) {
    const qs = new URLSearchParams();
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.days) qs.set("days", String(params.days));
    if (params.category) qs.set("category", params.category);
    if (params.excludeProjectId) qs.set("excludeProjectId", String(params.excludeProjectId));
    const suffix = qs.toString();
    return suffix ? `?${suffix}` : "";
}

export const getTrendingProjects = (params: {
    limit?: number;
    days?: number;
    category?: string;
    excludeProjectId?: number;
} = {}) =>
    apiFetch<ProjectRec[]>(`/recommendations/projects/trending${projectRecommendationQuery(params)}`);

export const getPopularProjectsInCategory = (params: {
    category: string;
    limit?: number;
    excludeProjectId?: number;
}) =>
    apiFetch<ProjectRec[]>(`/recommendations/projects/category${projectRecommendationQuery(params)}`);

export const getRecentlyActiveProjects = (params: {
    limit?: number;
    category?: string;
    excludeProjectId?: number;
} = {}) =>
    apiFetch<ProjectRec[]>(`/recommendations/projects/recently-active${projectRecommendationQuery(params)}`);

export const getSimilarProjects = (projectId: number, params: { limit?: number } = {}) =>
    apiFetch<ProjectRec[]>(`/recommendations/projects/${projectId}/similar${projectRecommendationQuery(params)}`);
