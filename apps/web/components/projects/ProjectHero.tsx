'use client';
import ProjectFollowButton from '@/components/ProjectFollowButton';
import ProjectBookmarkButton from '@/components/ProjectBookmarkButton';
import { ExternalLink, ArrowLeft, CalendarDays, CheckCircle, MapPin, Mail, Phone } from "lucide-react";
import React from 'react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectCoverFallback from "@/components/projects/ProjectCoverFallback";

type P = {
    id: number;
    username?: string;
    name?: string | null;
    title?: string | null;
    bio?: string | null;
    url?: string | null;
    contactEmail?: string | null;
    description?: string | null;
    email?: string | null;
    phone?: string | null;
    country?: string | null;
    city?: string | null;
    category?: string | null;
    isPublished?: string | null;
    startedOn?: string | null;
    targetIndustry?: string | null;
    titleSlug?: string | null; 
    profile_picture_url?: string | null;
    coverImageUrl?: string | null;            // optional, if you add later
    followersCount?: number;
    followingCount?: number;
    bookmarksCount?: number;
    followedByMe?: boolean;
    status?: "active" | "paused" | "completed" | "draft" | string | null;
    updatedAt?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ProjectHero({ project }: { project: P }) {
    const followers = project.followersCount ?? 0;
    const following = project.followingCount ?? 0;


    const [stats, setStats] = useState<{ visits: number; siteClicks: number; social: { platform: string; count: number }[] } | null>(null);
    const updatedAt = project.updatedAt ? new Date(project.updatedAt) : null;
    const updatedLabel =
        updatedAt && !Number.isNaN(updatedAt.getTime())
            ? updatedAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
            : null;

    useEffect(() => {
        (async () => {
            const r = await fetch(`${API_BASE}/projects/${project.id}/stats`, { credentials: "include" });
            if (r.ok) setStats(await r.json());
        })();
    }, [project.id]);

    return (
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white/90 shadow-sm shadow-blue-950/5 backdrop-blur">
            <div className="h-1 bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-400" />
            {/* Cover */}
            <div className="relative h-44 sm:h-56 md:h-64">
                {project.coverImageUrl ? (
                    <img
                        src={project.coverImageUrl}
                        alt=""
                        className="h-full w-full select-none object-cover"
                    />
                ) : (
                        <ProjectCoverFallback
                            variant="hero"
                            title={project.title}
                            subtitle={project.bio || project.description || "A professional project presentation on Tapstagram."}
                            category={project.category}
                        />
                )}
            </div>

            {/* Header row */}
            <div className="bg-gradient-to-br from-white via-white to-blue-50/40 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="-mt-6 flex flex-col gap-3 rounded-3xl border border-white/80 bg-white/85 p-3 shadow-lg shadow-blue-950/10 backdrop-blur sm:flex-row sm:items-end sm:gap-4 sm:p-4">
                    {/* Avatar */}
                    <div className="shrink-0 z-10">
                        {project.profile_picture_url ? (
                            <img
                                src={project.profile_picture_url}
                                alt=""
                                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg shadow-blue-950/10 md:h-24 md:w-24"
                            />
                        ) : (
                                <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-950/10 md:h-24 md:w-24" />
                        )}
                    </div>

                    {/* Name and basics */}
                    <div className="z-10 min-w-0 flex-1 space-y-2">
                        {project.title && <h1 className="break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">{project.title}</h1>}
                        {(project.targetIndustry || project.bio || project.description) && (
                            <p className="max-w-3xl break-words text-sm leading-6 text-slate-600 md:text-base">
                                {project.targetIndustry || project.bio || project.description}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                            <ProjectStatusBadge status={project.status} compact />
                            {project.category ? (
                                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                    {project.category}
                                </span>
                            ) : null}
                            {(project.city || project.country) ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                    <MapPin className="h-3 w-3" />
                                    {[project.city, project.country].filter(Boolean).join(", ")}
                                </span>
                            ) : null}
                            {updatedLabel ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                    <CalendarDays className="h-3 w-3" />
                                    Updated {updatedLabel}
                                </span>
                            ) : null}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            <b>{followers}</b> followers · <b>{following}</b> following
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            {project.isPublished ? (
                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${project.coverImageUrl ? "bg-emerald-500/80 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Published
                                </span>
                            ) : (
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${project.coverImageUrl ? "bg-amber-500/80 text-white" : "bg-amber-100 text-amber-700"}`}>
                                    Draft
                                </span>
                            )}

                            {stats && (
                                <div className="mt-2 text-xs text-slate-600">
                                    {stats.visits} visits · {stats.social.reduce((a, b) => a + b.count, 0)} social clicks
                                </div>
                            )}

                            
                            
                        </div>

                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                        <ProjectFollowButton projectId={project.id} initialFollowing={!!project.followedByMe} />
                        <ProjectBookmarkButton projectId={project.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
