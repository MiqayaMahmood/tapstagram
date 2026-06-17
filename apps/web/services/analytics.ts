import { API_URL } from '@/lib/api';

export async function recordProfileView(profileId: number, payload?: any) {
    try {
        await fetch(`${API_URL}/analytics/profile-view/${profileId}`, {
            
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload ? JSON.stringify(payload) : undefined,
            keepalive: true, // survives tab close
        });
    } catch { }
}

export async function recordSocialClick(profileId: number, socialLinkId: number) {
    try {
        await fetch(`${API_URL}/analytics/social-click/${socialLinkId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId }),
        });
    } catch { }
}

export async function recordProjectClick(profileId: number, projectLinkId: number) {
    try {
        await fetch(`${API_URL}/analytics/project-click/${projectLinkId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId }),
        });
    } catch { }
}

export async function getDashboardSummary(token: string) {
    console.log("services/Analytics - Step - 1 : API_URL" + API_URL);

    const res = await fetch(`${API_URL}/analytics/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    console.log("services/Analytics - Step - 2 : res: " + res.ok + ": " + res.text);
    if (!res.ok) throw new Error('Profile not found or Profile not yet defined.');
    console.log("services/Analytics - Step - 3 : res: " + res.json);
    return res.json() as Promise<{
        views7: number;
        views30: number;
        topSocial: Array<{ id: number; count: number; platform_name?: string; url?: string }>;
        topProjects: Array<{ id: number; count: number; title?: string; url?: string }>;
    }>;
}
