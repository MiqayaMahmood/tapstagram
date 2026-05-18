// apps/web/src/services/socialLinks.ts
import { apiFetch } from '@/lib/api';

export type SocialLink = {
    id: number;
    profileId: number;
    platform_name: string;
    url: string;
    icon: string | null;
    category: string | null;
    sort_order: number;
};

export async function listMine(token: string, profileId: number): Promise<SocialLink[]> {
    return apiFetch(`/social-links?profileId=${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function createLink(token: string, payload: Partial<SocialLink>) {
    return apiFetch<SocialLink>("/social-links", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function deleteLink(token: string, id: number) {
    return apiFetch(`/social-links/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function reorder(
    token: string,
    items: { id: number; sort_order: number }[]
): Promise<SocialLink[]> {
    return apiFetch("/social-links/reorder", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });
}

//export type SocialLink = {
//    id: number;
//    profileId: number;
//    platform_name: string;
//    url: string;
//    icon?: string | null;
//    category?: string | null;
//    sort_order: number;
//    created_at?: string; // or createdAt if you mapped it
//};

////export type SocialLink = {
////    id: number; profileId: number; platform_name: string; url: string;
////    icon?: string | null; category?: string | null; sort_order: number;
////};

//export async function listPublic(profileId: number) {
//    return apiFetch<SocialLink[]>(`/social-links/public/${profileId}`);
//}
//export async function listMine(token: string, profileId: number)
//{
//    return apiFetch<SocialLink[]>(`/social-links?profileId=${profileId}`,
//        {
//            headers: { Authorization: `Bearer ${token}` }
//        });
//}

//export async function createLink(token: string,
//    payload: { profileId: number; platform_name: string; url: string; icon?: string | null; category?: string | null; sort_order?: number })
//{
//    return apiFetch<SocialLink>(`/social-links`,
//        {
//            method: "POST",
//            headers: { Authorization: `Bearer ${token}` },
//            body: JSON.stringify(payload),
//        }
//    );
//}

//export async function updateLink(token: string, id: number, payload: Partial<SocialLink>) {
//    return apiFetch<SocialLink>(`/social-links/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
//}
////export async function deleteLink(token: string, id: number) {
////    return apiFetch<void>(`/social-links/${id}`, { method: 'DELETE' }, token);
////}
//export async function deleteLink(token: string, id: number) {
//    return apiFetch<void>(`/social-links/${id}`,
//        {
//            method: "DELETE",
//            headers: { Authorization: `Bearer ${token}` }
//        }
//    );
//}
////export async function reorder(token: string, items: Array<{ id: number; sort_order: number }>) {
////    return apiFetch<SocialLink[]>('/social-links/reorder', { method: 'PUT', body: JSON.stringify({ items }) }, token);
////}

//export async function reorder(token: string, items: Array<{ id: number; sort_order: number }>)
//{
//    return apiFetch<{ ok: true }>(`/social-links/reorder`,
//        {
//            method: "POST",
//            headers: { Authorization: `Bearer ${token}` },
//            body: JSON.stringify({ items }),
//        }
//    );
//}