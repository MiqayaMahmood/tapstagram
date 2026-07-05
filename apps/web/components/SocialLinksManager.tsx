// apps/web/src/components/SocialLinksManager.tsx
'use client';


import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/services/socialLinks";
import {
    SOCIAL_PLATFORMS,
    type PlatformKey,
} from "@/lib/social-platforms";



const findPlatform = (key?: string | null) => {
    return (
        SOCIAL_PLATFORMS.find((p) => p.key === key) ||
        SOCIAL_PLATFORMS.find(
            (p) => p.label.toLowerCase() === (key ?? "").toLowerCase()
        ) ||
        SOCIAL_PLATFORMS.find((p) => p.key === "custom") ||
        SOCIAL_PLATFORMS[0]
    );
};

function normalizeUrl(url: string) {
    const u = url.trim();
    if (!u) return u;
    if (/^(https?:\/\/|mailto:)/i.test(u)) return u;
    return `https://${u}`;
}

export default function SocialLinksManager({ profileId: propProfileId }: { profileId?: number }) {
    const { token } = useAuth();
    const [profileId, setProfileId] = useState<number | null>(propProfileId ?? null);

    const [items, setItems] = useState<api.SocialLink[]>([]);   
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Draft state with platform selection
    const [draftPlatform, setDraftPlatform] = useState<PlatformKey>("website");
    const [draftUrl, setDraftUrl] = useState("");
    const [draftCategory, setDraftCategory] = useState("");

    const authHeader = useMemo(
        () => (token ? { Authorization: `Bearer ${token}` } : {}),
        [token]
    );

    // Load my profileId if not provided
    useEffect(() => {
        if (propProfileId) return;
        (async () => {
            if (!token) return;
            try {
                const me = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, { headers: authHeader })
                    .then(r => (r.ok ? r.json() : Promise.reject(new Error("Failed to load profile"))));
                setProfileId(me?.profile?.id ?? me?.id ?? null);
            } catch (e: any) {
                setErr(e.message || "Failed to load profile");
                setProfileId(null);
            }
        })();
    }, [propProfileId, token, authHeader]);

    // Load social links
    useEffect(() => {
        (async () => {
            if (!token) return;
            if (!profileId) {
                setItems([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            setErr(null);
            try {
                const data = await api.listMine(token, profileId);
                setItems([...data].sort((a, b) => a.sort_order - b.sort_order));
            } catch (e: any) {
                setErr(e.message || "Failed to load social links");
            } finally {
                setLoading(false);
            }
        })();
    }, [token, profileId]);

    //function prefillUrlForPlatform(key: PlatformKey) {
    //    const p = findPlatform(key);
    //    if (!draftUrl) setDraftUrl(p.base ?? "");
    //}

    function prefillUrlForPlatform(key: PlatformKey) {
        const p = findPlatform(key);
        if (!draftUrl) setDraftUrl(p.placeholder ?? "");
    }

    async function add() {
        if (!token) return;
        if (!profileId) { setErr("Create your profile first."); return; }

        const platform = findPlatform(draftPlatform);
        const platform_name = platform.label;

        let url = draftUrl;

        if (draftPlatform === "email") {
            // sanitize: ensure mailto:
            url = draftUrl.startsWith("mailto:") ? draftUrl : `mailto:${draftUrl.replace(/^mailto:/i, "")}`;
        } else {
            url = normalizeUrl(draftUrl);
        }

        if (!platform_name || !url) return;

        setSaving(true);
        setErr(null);
        try {
            const created = await api.createLink(token, {
                profileId,
                platform_name,
                url,
                icon: draftPlatform,           // save the key; you can keep or drop 'icon' in DB
                category: draftCategory || null,
                sort_order: items.length,
            });
            setItems((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));

            // reset
            setDraftPlatform("website");
            setDraftUrl("");
            setDraftCategory("");
        } catch (e: any) {
            setErr(e.message || "Could not add link");
        } finally {
            setSaving(false);
        }
    }

    async function del(id: number) {
        if (!token) return;
        setErr(null);
        const prev = items;
        setItems(prev.filter((p) => p.id !== id)); // optimistic
        try {
            await api.deleteLink(token, id);
        } catch (e: any) {
            setErr(e.message || "Could not delete link");
            setItems(prev); // revert
        }
    }

    async function move(id: number, dir: -1 | 1) {
        if (!token) return;
        const idx = items.findIndex((i) => i.id === id);
        const j = idx + dir;
        if (idx < 0 || j < 0 || j >= items.length) return;

        // optimistic swap
        const swapped = [...items];
        const tmp = swapped[idx].sort_order;
        swapped[idx].sort_order = swapped[j].sort_order;
        swapped[j].sort_order = tmp;
        swapped.sort((a, b) => a.sort_order - b.sort_order);
        setItems(swapped);

        try {
            await api.reorder(
                token,
                swapped.map((i) => ({ id: i.id, sort_order: i.sort_order }))
            );
        } catch (e: any) {
            setErr(e.message || "Reorder failed");
            // Optional: reload to recover server truth
            if (profileId) {
                const data = await api.listMine(token, profileId);
                setItems([...data].sort((a, b) => a.sort_order - b.sort_order));
            }
        }
    }

    if (!token) return null;

    return (
        <div className="space-y-4">
            
            {err && <div className="text-sm text-red-600">{err}</div>}

            {!profileId && (
                <div className="rounded border p-4 text-sm text-gray-600">
                    You don’t have a profile yet. Create one in{" "}
                    <a className="underline text-blue-600" href="/profile">
                        Tapstagram → Profile
                    </a>
                    .
                </div>
            )}

            {profileId && (
                <>
                    {/* Add form */}
                    <div className="grid max-w-4xl grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-6 md:items-end">
                        <label className="md:col-span-2">
                            <span className="text-xs font-medium text-slate-600">Platform</span>
                            <div className="relative">
                                <select
                                    className="min-h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white p-2.5 pr-8 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    value={draftPlatform}
                                    onChange={(e) => {
                                        const key = e.target.value as PlatformKey;
                                        setDraftPlatform(key);
                                        prefillUrlForPlatform(key);
                                    }}
                                >
                                    {SOCIAL_PLATFORMS.map((p) => (
                                        <option key={p.key} value={p.key}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </label>

                        <label className="md:col-span-3">
                            <span className="text-xs font-medium text-slate-600">URL / handle</span>
                            <input
                                className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                placeholder={findPlatform(draftPlatform)?.placeholder || "https://"}
                                value={draftUrl}
                                onChange={(e) => setDraftUrl(e.target.value)}
                            />
                        </label>

                        <button
                            className="min-h-11 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                            onClick={add}
                            disabled={saving || !draftUrl}
                        >
                            {saving ? "Adding…" : "Add"}
                        </button>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="text-sm  bg-white text-gray-500">Loading…</div>
                    ) : items.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                            No social links yet—add your first one!
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {items.map((i) => {
                                const iconKey = (i.icon as PlatformKey) || "custom";
                                const platform = findPlatform(iconKey);
                                const P = platform.icon
                                return (
                                    <li key={i.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex items-center gap-2">
                                            <P size={18} className="shrink-0 text-slate-700" />
                                            <div className="min-w-0">
                                                <div className="truncate font-semibold text-slate-900">{i.platform_name}</div>
                                                <a className="block truncate text-sm text-blue-600 hover:underline" href={i.url} target="_blank" rel="noreferrer">
                                                    {i.url}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 sm:flex">
                                            <button className="px-2 py-1 border rounded" onClick={() => move(i.id, -1)} title="Move up">↑</button>
                                            <button className="px-2 py-1 border rounded" onClick={() => move(i.id, 1)} title="Move down">↓</button>
                                            <button className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50" onClick={() => del(i.id)} title="Delete">
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
