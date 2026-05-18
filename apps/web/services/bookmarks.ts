// apps/web/src/services/bookmarks.ts
import { apiFetch } from '@/lib/api';

// Function for profile bookmarks & follows
export async function listMyProfileBookmarks(token: string) {
    return apiFetch<any[]>('/profileBookmarks', {}, token);
}
export async function createProfileBookmark(token: string, profileId: number) {
    return apiFetch('/profileBookmarks', { method: 'POST', body: JSON.stringify({ profileId }) }, token);
}
export async function deleteProfileBookmark(token: string, profileId: number) {
    return apiFetch(`/profileBookmarks/${profileId}`, { method: 'DELETE' }, token);
}
export async function isProfileBookmarked(token: string, profileId: number) {
    return apiFetch<{ bookmarked: boolean }>(`/profileBookmarks/check/${profileId}`, {}, token);
}
export async function profileBookmarkCount(profileId: number) {
    return apiFetch<{ count: number }>(`/profileBookmarks/count/${profileId}`);
}

// Function for project bookmarks & follows
export async function listMyProjecteBookmarks(token: string) {
    return apiFetch<any[]>('/projectBookmarks', {}, token);
}
export async function createProjectBookmark(token: string, projectId: number) {
    return apiFetch('/projectBookmarks', { method: 'POST', body: JSON.stringify({ projectId }) }, token);
}
export async function deleteProjectBookmark(token: string, projectId: number) {
    return apiFetch(`/projectBookmarks/${projectId}`, { method: 'DELETE' }, token);
}
export async function isProjectBookmarked(token: string, projectId: number) {
    return apiFetch<{ bookmarked: boolean }>(`/projectBookmarks/check/${projectId}`, {}, token);
}
export async function projectBookmarkCount(projectId: number) {
    return apiFetch<{ count: number }>(`/projectBookmarks/count/${projectId}`);
}

