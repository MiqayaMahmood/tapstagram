// apps/web/lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const ABS_ORIGIN = process.env.NEXT_PUBLIC_WEB_ORIGIN || 'http://localhost:3000';
import { useAuth } from "@/context/AuthContext";

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tapstagram_token');
}

export async function apiFetch<T = unknown>(
    path: string,
    options: RequestInit = {},
    token?: string
): Promise<T> {

    const tokenToUse = token ?? getStoredToken() ?? undefined;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            ...(tokenToUse  ? { Authorization: `Bearer ${tokenToUse}` } : {}),
            ...(options.headers || {}),
        },
        // CORS is fine; credentials optional depending on your auth
        mode: options.mode ?? "cors",
    });

    const contentType = res.headers.get("content-type") || "";

    if (res.ok) {
        // 204 No Content
        if (res.status === 204) return undefined as T;

        // JSON response
        if (contentType.includes("application/json")) {
            return (await res.json()) as T;
        }

        // Non-JSON success (rare) — return text as T
        const txt = await res.text();
        return txt as unknown as T;
    }

    // Not OK ? extract best error message and throw
    let message = `HTTP ${res.status}`;
    try {
        if (contentType.includes("application/json")) {
            const j = await res.json();
            message = j.error || j.message || message;
        } else {
            const txt = await res.text();
            if (txt) message = txt;
        }
    }
    catch {
        /* ignore parse errors */
        
    }
    throw new Error(message);  
}


// Follows
export const follow = (id: string) => apiFetch<void>(`/profiles/${id}/follow`, { method: 'POST' });
export const unfollow = (id: string) => apiFetch<void>(`/profiles/${id}/follow`, { method: 'DELETE' });
export const myFollows = () => apiFetch<{ ids: string[] }>(`/profiles/me/follows`);

// Likes
export const like = (id: string) => apiFetch<void>(`/media/${id}/like`, { method: 'POST' });
export const unlike = (id: string) => apiFetch<void>(`/media/${id}/like`, { method: 'DELETE' });
export const getLikes = (id: string) => apiFetch<{ count: number; recent: Array<{ id: string; username: string; avatar_url: string }> }>(`/media/${id}/likes`);

// Feed
export const getFeed = (cursor?: string, limit = 20) =>
    apiFetch<{ items: FeedItem[]; nextCursor: string | null }>(`/feed?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
// Types
export type FeedItem = {
    id: string; url: string; created_at: string;
    owner_id: string; username: string; avatar_url: string;
    liked_by_me: boolean; like_count: number;
};


