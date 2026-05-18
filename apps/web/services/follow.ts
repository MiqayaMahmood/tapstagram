import { apiFetch } from "@/lib/api";

export async function followProfile(token: string, profileId: number) {
    return apiFetch(`/profiles/${profileId}/follow`, {
        method: "POST",
         headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId }),
    });
}

export async function unfollowProfile(token: string, profileId: number) {
    return apiFetch(`/profiles/${profileId}/follow`, {
        method: "DELETE",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId }),
    });
}

export async function followProject(token: string, projectId: number) {
    return apiFetch(`/projects/${projectId}/follow`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
    });
}

export async function unfollowProject(token: string, projectId: number) {
    return apiFetch(`/projects/${projectId}/follow`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
    });
}