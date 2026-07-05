"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/Separator";
import { followProject, unfollowProject } from "@/services/follow";
import {
    ExternalLink,
    CalendarDays,
    MapPin,
    Globe,
    Users,
    Bookmark,
} from "lucide-react";
import  DynamicHeroBanner  from "@/components/DynamicHeroBanner"; 
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectOpenForChips from "@/components/projects/ProjectOpenForChips";

type ProjectLite = {
    id: number;
    slug: string;
    title: string;
    category?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    bio?: string | null;
    targetIndustry?: string | null;
    city?: string | null;
    country?: string | null;
    contactEmail?: string | null;
    website?: string | null;
    phone?: string | null;
    startedOn?: string | null;
    updatedAt?: string | null;
    isPublished?: boolean;
    status?: "active" | "paused" | "completed" | "draft" | string | null;
    openFor?: unknown;
    collaborationNote?: string | null;
    followersCount?: number;
    bookmarksCount?: number;
    isFollowing?: boolean;
};

type Props = {
    project: ProjectLite;
    onFollowChange?: (isFollowing: boolean) => void;
    plan?: string;
};

function formatDate(value?: string | null) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function getHostname(url?: string | null) {
    if (!url) return null;
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

export default function ProjectCard({ project, onFollowChange, plan }: Props) {
    const { token } = useAuth();
    const [isFollowing, setIsFollowing] = useState(!!project.isFollowing);
    const [busy, setBusy] = useState(false);

    const projectHref = useMemo(
        () => `/projects/${project.id}${plan ? `?plan=${encodeURIComponent(plan)}` : ""}`,
        [project.id, plan]
    );

    const started = formatDate(project.startedOn);
    const updated = formatDate(project.updatedAt);
    const websiteLabel = getHostname(project.website);

    async function toggleFollow() {
        if (!token || busy) return;
        setBusy(true);

        try {
            if (isFollowing) {
                await unfollowProject(token, project.id);
                setIsFollowing(false);
                onFollowChange?.(false);
            } else {
                await followProject(token, project.id);
                setIsFollowing(true);
                onFollowChange?.(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-950/10">
            <div className="h-1 bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-400" />
            <Link href={projectHref} className="block">
                {project.coverImageUrl ? (
                    <div className="relative overflow-hidden bg-emerald-50">
                        <img
                            src={project.coverImageUrl}
                            alt={project.title}
                            className="h-52 w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    </div>
                ) : (
                        <DynamicHeroBanner
                          compact
                          title={project.title}
                          subtitle={project.bio || project.description || "A professional project presentation on Tapstagram."}
                          category={project.category}
                          industry={project.targetIndustry}
                          country={project.country}
                          city={project.city}
                          email={project.contactEmail}
                          phone={project.phone}
                          stats={[
                            ...(project.followersCount !== undefined ? [{ label: "Followers", value: project.followersCount }] : []),
                            ...(project.bookmarksCount !== undefined ? [{ label: "Saved", value: project.bookmarksCount }] : []),
                            ...(project.status ? [{ label: "Status", value: project.status }] : []),
                          ]}
                        />
                        
                )}
            </Link>

            <div className="p-5">
                <div className="flex flex-wrap gap-2">
                    {project.category ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            {project.category}
                        </span>
                    ) : null}

                    {project.targetIndustry ? (
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                            {project.targetIndustry}
                        </span>
                    ) : null}

                    {project.status ? <ProjectStatusBadge status={project.status} compact /> : null}

                    {!project.status && project.isPublished !== undefined ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            {project.isPublished ? "Published" : "Draft"}
                        </span>
                    ) : null}
                </div>

                <div className="mt-4">
                    <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-slate-950 transition group-hover:text-emerald-700 sm:text-lg">
                        {project.title}
                    </h3>

                    {project.bio ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
                            {project.bio}
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-zinc-400">
                            No short description yet.
                        </p>
                    )}
                </div>

                <div className="mt-4 grid gap-2 text-sm text-zinc-500">
                    {(project.city || project.country) ? (
                        <div className="flex items-center gap-2 truncate">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                            <span className="truncate">
                                {[project.city, project.country].filter(Boolean).join(", ")}
                            </span>
                        </div>
                    ) : null}

                    {websiteLabel ? (
                        <div className="flex items-center gap-2 truncate">
                            <Globe className="h-4 w-4 text-emerald-600" />
                            <span className="truncate">{websiteLabel}</span>
                        </div>
                    ) : null}

                    {started ? (
                        <div className="flex items-center gap-2 truncate">
                            <CalendarDays className="h-4 w-4 text-emerald-600" />
                            <span>Since {started}</span>
                        </div>
                    ) : null}

                    {updated ? (
                        <div className="flex items-center gap-2 truncate">
                            <CalendarDays className="h-4 w-4 text-zinc-400" />
                            <span>Updated {updated}</span>
                        </div>
                    ) : null}
                </div>

                {project.openFor ? (
                    <div className="mt-4">
                        <ProjectOpenForChips openFor={project.openFor} limit={2} compact />
                    </div>
                ) : null}

                {(project.followersCount !== undefined || project.bookmarksCount !== undefined) ? (
                    <>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                            {project.followersCount !== undefined ? (
                                <div className="inline-flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                    <span>{project.followersCount} followers</span>
                                </div>
                            ) : null}

                            {project.bookmarksCount !== undefined ? (
                                <div className="inline-flex items-center gap-1.5">
                                    <Bookmark className="h-4 w-4 text-emerald-600" />
                                    <span>{project.bookmarksCount} saved</span>
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : null}

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                    <Link
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        href={projectHref}
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                    </Link>

                    <button
                        onClick={toggleFollow}
                        disabled={busy || !token}
                        title={!token ? "Sign in required" : ""}
                        className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${isFollowing
                                ? "bg-blue-700 text-white hover:bg-blue-800"
                                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {busy ? "Please wait…" : isFollowing ? "Following" : "Follow"}
                    </button>
                </div>
            </div>
        </div>
    );
}
