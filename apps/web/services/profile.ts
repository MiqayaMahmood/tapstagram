// apps/web/src/services/profile.ts
import { apiFetch } from '@/lib/api';
import { User } from './auth';

export type Profile = {
    id: number;
    userId: number;
    name: string | null;
    title: string | null;
    bio: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    industry?: string;
    tags?: string[];
    profile_picture_url: string | null;
    hero_banner_url: string | null;
};
export type Tag = { id: number; name: string };
export async function getMyTags(token: string) {
    try {
        const res = await apiFetch<{ tags: Tag[] }>("/profile/me/tags", { method: "GET" }, token);
        return (res?.tags ?? []).map(t => t.name);
        //if (!res) return null;
        //return res.tags.map(t => t.name);

    }
    catch (e: any) {
        // Treat 404 "profile not found" as zero tags
        if (e?.status === 404 || e?.code === 404) return [];
        // Fallback: don't break the UI
        return [];
    }
    
}

// Public – typeahead search
export async function searchTags(q: string) {
    const res = await apiFetch<{ items: Tag[] }>(`/tags/search?q=${encodeURIComponent(q)}`);
    return res.items.map(x => x.name);
}

// Authenticated – replace my tags
export async function updateMyTags(token: string, tags: string[]) {
    return apiFetch<{ ok: true }>(
        "/profiles/me/tags",
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags }),
        },
        token
    );
}

//export async function getMyProfile(token: string) {
//    return apiFetch<Profile>('/profile', { method: 'GET' }, token);
//}
export async function upsertMyProfile(token: string, data: Partial<Profile>) {
    return apiFetch<Profile>('/profile', { method: 'PUT', body: JSON.stringify(data) }, token);
}
//export async function getProfileByUserId(userId: number) {
//    return apiFetch<Profile>(`/profile/byUserId/${userId}`);
//}

export type DirItem = {
    id: number;
    username: string | null;
    name: string;
    bio: string;
    title: string | null;
    location: string | null;
    industry?: string;
    profile_picture_url: string | null;
    hero_banner_url: string | null;
    tags?: string[]; // NEW (optional)
    followersCount: number;
};

export async function searchProfiles(params:
    {
        q?: string;
        name?: string;
        title?: string;
        location?: string;
        industry?: string;
        tags?: string[];
        page?: number;
        pageSize?: number;
        excludeId?: number;
        sort?: "newest" | "oldest" | "followers" | "active";
        range?: "7d" | "30d" | "90d";
    }) {
    const qs = new URLSearchParams();
    
    for (const [k, v] of Object.entries(params)) {

        if (v == null || v === '') continue;

        if (k === 'tags' && Array.isArray(v)) {
            if (v.length) qs.set('tags', v.join(','));
        }
        else {
            //if (v != null && v !== "") 
            qs.set(k, String(v));
        }
    }
    return apiFetch<{ total: number; page: number; pageSize: number; items: DirItem[] }>(`/profiles?${qs.toString()}`);
}

export type PublicProfile = {
    id: number; username: string | null; name: string; title: string | null; bio: string | null;
    location: string | null; industry?: string; tags?: string[];
    profile_picture_url: string | null; email: string | null; phone: string | null;
    socialLinks: { id: number; platform_name: string; url: string; icon?: string | null; category?: string | null; sort_order: number }[];
    projectLinks: { id: number; title: string; description: string | null; url: string | null; sort_order: number }[];
    followersCount: number; followingCount: number; followedByMe: number; hero_banner_url: string | null;
};

export async function getPublicProfileById(profileId: number) {
    return apiFetch<PublicProfile>(`/profiles/${profileId}`);
}

export async function getPublicProfile(username: string) {
    console.log("services/profile.ts - getPublicProfile - username : " + username);
    return apiFetch<PublicProfile>(`/profiles/${encodeURIComponent(username)}`);
}

export async function updateAvatar(token: string, url: string) {
    return apiFetch<{ ok: boolean; profile: { id: number; profile_picture_url: string } }>(
        '/profile/avatar',
        { method: 'PATCH', body: JSON.stringify({ url }) },
        token
    );
}

export async function updateCover(token: string, url: string) {
    return apiFetch<{ ok: boolean; profile: { id: number; hero_banner_url: string } }>(
        '/profile/cover',
        { method: 'PATCH', body: JSON.stringify({ url }) },
        token
    );
}
export type UsernameCheckResult = { ok: boolean; reason?: string };

// Username availability (public)
export async function checkUsernameAvailability(username: string, excludeId?: number): Promise<UsernameCheckResult> {
    // original backend path came from your old code: /username/check?username=...
    console.log("apps/web/src/services/profile.ts - checkUsernameAvailability - username: " + username + " & excludeId: " + excludeId)
    const qs = new URLSearchParams();
    qs.set("username", username);
    if (excludeId != null) qs.set("excludeId", String(excludeId));

    return apiFetch<UsernameCheckResult>(`/profile/username-check?${qs.toString() }`);

    //return apiFetch<UsernameCheckResult>(`/profiles/username-check?username=${encodeURIComponent(username)}`);
}

// Update my username (auth required)
export async function updateMyUsername(token: string, username: string): Promise<UsernameCheckResult> {
    return apiFetch<UsernameCheckResult>(
        "/profile/username",
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        },
        token
    );
}