"use client";

import { useEffect, useState } from "react";
import ExplorerShell from "@/components/layout/ExplorerShell";
import MyQuickLinks from "@/components/MyQuickLinks";
import MarketingCard from "@/components/explorer/MarketingCard";
import FiltersCard from "@/components/explorer/FiltersCard";
import ProfileLeads from "@/components/lead/ProfileLeads";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProfileRightRail from '@/components/recommendations/ProfileRightRail';
import UserMiniCard from '@/components/explorer/UserMiniCard';
import CollapsibleNetworkSection from '@/components/network/CollapsibleNetworkSection';
import { toast } from 'sonner';



export default function MyNetworkClient() {
    const { token, user } = useAuth();
    const [data, setData] = useState<any>(null);


    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await apiFetch<any>("/network/me");
                if (!cancelled)
                    setData(res);
            } catch {
                if (!cancelled) setData(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    async function removeFollowedProfile(item: any) {
        await apiFetch(`/profiles/${item.id}/follow`, { method: 'DELETE' }, token);
        setData((prev: any) => ({
            ...prev,
            followedProfiles: prev.followedProfiles.filter((x: any) => x.id !== item.id),
        }));
        toast.success('Profile removed from followed list');
    }

    async function removeBookmarkedProfile(item: any) {
        await apiFetch(`/profiles/${item.id}/bookmark`, { method: 'DELETE' }, token);
        setData((prev: any) => ({
            ...prev,
            bookmarkedProfiles: prev.bookmarkedProfiles.filter((x: any) => x.id !== item.id),
        }));
        toast.success('Profile removed from bookmarks');
    }

    async function removeFollowedProject(item: any) {
        await apiFetch(`/projects/${item.id}/follow`, { method: 'DELETE' }, token);
        setData((prev: any) => ({
            ...prev,
            followedProjects: prev.followedProjects.filter((x: any) => x.id !== item.id),
        }));
        toast.success('Project removed from followed list');
    }

    async function removeBookmarkedProject(item: any) {
        await apiFetch(`/projects/${item.id}/bookmark`, { method: 'DELETE' }, token);
        setData((prev: any) => ({
            ...prev,
            bookmarkedProjects: prev.bookmarkedProjects.filter((x: any) => x.id !== item.id),
        }));
        toast.success('Project removed from bookmarks');
    }

    return (
        <ExplorerShell
            left={
                <>
                    <UserMiniCard profileId={user?.id} />
                    <MyQuickLinks />
                    <FiltersCard />
                </>
            }
            right={
                <>
                    <MarketingCard />
                    <aside className="hidden lg:block sticky top-20 self-start h-fit">
                        <ProfileRightRail profileId={user?.id} />
                    </aside>
                </>


            }
        >

            <div className="space-y-3">
                <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm shadow-blue-950/5">
                    <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">My Network</h1>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Manage the people and projects you follow, save, and revisit.
                    </p>
                </div>

                <CollapsibleNetworkSection
                    title="Followed Profiles"
                    count={data?.followedProfiles?.length || 0}
                    items={data?.followedProfiles || []}
                    type="profile"
                    buttonLabel="Un Follow"
                    defaultOpen={true}
                    emptyText="No followed profiles yet."
                    onRemove={removeFollowedProfile}
                    renderItem={(item, onRemove) => (
                        <ProfileMiniCard item={item} onRemove={onRemove} />
                    )}
                />

                <CollapsibleNetworkSection
                    title="Bookmarked Profiles"
                    count={data?.bookmarkedProfiles?.length || 0}
                    items={data?.bookmarkedProfiles || []}
                    type="profile"
                    buttonLabel="Remove Bookmark"
                    emptyText="No bookmarked profiles yet."
                    onRemove={removeBookmarkedProfile}
                    renderItem={(item, onRemove) => (
                        <ProfileMiniCard item={item} onRemove={onRemove} />
                    )}
                />

                <CollapsibleNetworkSection
                    title="Followed Projects"
                    count={data?.followedProjects?.length || 0}
                    items={data?.followedProjects || []}
                    type="project"
                    buttonLabel="Un Follow"
                    emptyText="No followed projects yet."
                    onRemove={removeFollowedProject}
                    renderItem={(item, onRemove) => (
                        <ProjectMiniCard item={item} onRemove={onRemove} />
                    )}
                />

                <CollapsibleNetworkSection
                    title="Bookmarked Projects"
                    count={data?.bookmarkedProjects?.length || 0}
                    items={data?.bookmarkedProjects || []}
                    type="project"
                    buttonLabel="Remove Bookmark"
                    emptyText="No bookmarked projects yet."
                    onRemove={removeBookmarkedProject}
                    renderItem={(item, onRemove) => (
                        <ProjectMiniCard item={item} onRemove={onRemove} />
                    )}
                />

                <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm shadow-blue-950/5">
                    {user?.profileId ? (
                        <div id="leads" className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5">
                            <div className="mb-3 text-sm font-semibold text-zinc-900">Leads</div>
                            <ProfileLeads profileId={user.profileId} />
                        </div>
                    ) : null}
                </div>
            </div>
        </ExplorerShell>
    );
}

function ProfileMiniCard({ item }: any) {
    return (
        <Link
            href={`/p/${item.id}`}
            className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-3 shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:bg-white"
        >
            <div className="h-12 w-12 overflow-hidden rounded-full bg-blue-50 ring-1 ring-blue-100">
                {item.profile_picture_url ? (
                    <img src={item.profile_picture_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 text-sm font-semibold uppercase text-blue-700">
                        {item.name?.charAt(0) || "U"}
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900">{item.name}</div>
                {item.title && <div className="truncate text-xs text-zinc-500">{item.title}</div>}
                {item.location && <div className="truncate text-xs text-zinc-400">{item.location}</div>}
            </div>
        </Link>
    );
}

function ProjectMiniCard({ item }: any) {
    return (
        <Link
            href={`/projects/${item.id}`}
            className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 shadow-sm shadow-emerald-950/5 transition hover:-translate-y-0.5 hover:bg-white"
        >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                {item.coverImageUrl ? (
                    <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-700 to-emerald-400" />
                )}
            </div>

            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900">{item.title}</div>
                {item.category && <div className="truncate text-xs text-zinc-500">{item.category}</div>}
                {item.profile?.name && <div className="truncate text-xs text-zinc-400">by {item.profile.name}</div>}
            </div>
        </Link>
    );
}

function SectionBlock({ title, count, children }: any) {
    return (
        <section className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                    {count}
                </span>
            </div>
            <div className="grid gap-3">{children}</div>
        </section>
    );
}
