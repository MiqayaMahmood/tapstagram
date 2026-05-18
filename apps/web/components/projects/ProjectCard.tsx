"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/Separator";
import { followProject, unfollowProject } from "@/services/follow";
import {
    BriefcaseBusiness,
    ExternalLink,
    CalendarDays,
    MapPin,
    Globe,
    Users,
    Bookmark,
} from "lucide-react";
import  DynamicHeroBanner  from "@/components/DynamicHeroBanner"; 

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

function statusClasses(status?: string | null, isPublished?: boolean) {
    const s = (status || "").toLowerCase();

    if (!isPublished || s === "draft") {
        return "bg-zinc-100 text-zinc-700";
    }
    if (s === "active") {
        return "bg-emerald-50 text-emerald-700";
    }
    if (s === "paused") {
        return "bg-amber-50 text-amber-700";
    }
    if (s === "completed") {
        return "bg-blue-50 text-blue-700";
    }

    return "bg-zinc-100 text-zinc-700";
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
        <div className="group overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
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

                    {(project.status || project.isPublished !== undefined) ? (
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses(
                                project.status,
                                project.isPublished
                            )}`}
                        >
                            {project.status
                                ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
                                : project.isPublished
                                    ? "Published"
                                    : "Draft"}
                        </span>
                    ) : null}
                </div>

                <div className="mt-4">
                    <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-zinc-900 transition group-hover:text-emerald-700">
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

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        href={projectHref}
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                    </Link>

                    <button
                        onClick={toggleFollow}
                        disabled={busy || !token}
                        title={!token ? "Sign in required" : ""}
                        className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${isFollowing
                                ? "bg-zinc-900 text-white hover:bg-zinc-700"
                                : "border border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {busy ? "Please wait…" : isFollowing ? "Following" : "Follow"}
                    </button>
                </div>
            </div>
        </div>
    );
}