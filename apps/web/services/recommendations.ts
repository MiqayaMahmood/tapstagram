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