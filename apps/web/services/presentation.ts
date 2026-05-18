import { apiFetch } from "@/lib/api";

export const getMyProfilePresentation = (token?: string) =>
    apiFetch("/profiles/me/presentation", {}, token);

export const saveMyProfilePresentation = (payload: any, token?: string) =>
    apiFetch("/profiles/me/presentation", {
        method: "PATCH",
        body: JSON.stringify(payload),
    }, token);

export const getPublicProfilePresentation = (profileId: number) =>
    apiFetch(`/profiles/${profileId}/presentation/public`);

export const getProjectPresentation = (projectId: number, token?: string) =>
    apiFetch(`/projects/${projectId}/presentation`, {}, token);

export const saveProjectPresentation = (projectId: number, payload: any, token?: string) =>
    apiFetch(`/projects/${projectId}/presentation`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    }, token);

export const getPublicProjectPresentation = (projectId: number) =>
    apiFetch(`/projects/${projectId}/presentation/public`);