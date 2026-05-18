"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { listMineProject, type Project } from "@/services/project";
import {
    BriefcaseBusiness,
    CalendarDays,
    Globe,
    MapPin,
    Plus,
    Building2,
} from "lucide-react";

type Props = {
    profileId: number;
    plan: string;
};

function formatDate(value?: string | Date | null) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function getProjectHref(id: number, profileId: number, plan: string) {
    return `/dashboard/projects/${id}?profileId=${profileId}&plan=${plan}`;
}

function getNewProjectHref(profileId: number, plan: string) {
    return `/dashboard/projects/new?profileId=${profileId}&plan=${plan}`;
}

function ProjectListCard({
    project,
    profileId,
    plan,
}: {
    project: Project;
    profileId: number;
    plan: string;
}) {
    const started = formatDate((project as any).startedOn);
    const updated = formatDate((project as any).updatedAt);

    return (
        <Link
            href={getProjectHref(project.id, profileId, plan)}
            className="group overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="relative h-40 w-full overflow-hidden bg-emerald-50">
                {project.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-sm font-medium text-emerald-700">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            No cover image
                        </div>
                    </div>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {project.category ? (
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-sm">
                            {project.category}
                        </span>
                    ) : null}

                    {(project as any).isPublished ? (
                        <span className="rounded-full bg-emerald-600/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                            Published
                        </span>
                    ) : (
                        <span className="rounded-full bg-zinc-800/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                            Draft
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-1 text-base font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                            {project.title}
                        </h3>

                        {(project as any).bio ? (
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600">
                                {(project as any).bio}
                            </p>
                        ) : (project as any).description ? (
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600">
                                {(project as any).description}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {(project as any).targetIndustry ? (
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                            {(project as any).targetIndustry}
                        </span>
                    ) : null}

                    {(project as any).country ? (
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                            {(project as any).country}
                        </span>
                    ) : null}

                    {started ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Since {started}
                        </span>
                    ) : null}
                </div>

                <div className="mt-4 grid gap-2 text-sm text-zinc-500 sm:grid-cols-2">
                    {(project as any).website ? (
                        <div className="flex items-center gap-2 truncate">
                            <Globe className="h-4 w-4 text-emerald-600" />
                            <span className="truncate">
                                {(project as any).website}
                            </span>
                        </div>
                    ) : null}

                    {(project as any).city || (project as any).country ? (
                        <div className="flex items-center gap-2 truncate">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                            <span className="truncate">
                                {[(project as any).city, (project as any).country].filter(Boolean).join(", ")}
                            </span>
                        </div>
                    ) : null}

                    {updated ? (
                        <div className="flex items-center gap-2 truncate sm:col-span-2">
                            <CalendarDays className="h-4 w-4 text-emerald-600" />
                            <span>Updated {updated}</span>
                        </div>
                    ) : null}
                </div>
            </div>
        </Link>
    );
}

export default function ProjectsSection({ profileId, plan }: Props) {
    const { token } = useAuth();
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const stableProfileId = useMemo(() => profileId, [profileId]);
    const ranOnceRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setError(null);
            try {
                setLoading(true);
                const data = await listMineProject(token, stableProfileId);
                if (!cancelled) setProjects(data);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Failed to load projects");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (!token || !stableProfileId) {
            setProjects([]);
            return;
        }

        if (process.env.NODE_ENV === "development") {
            if (!ranOnceRef.current) {
                ranOnceRef.current = true;
                run();
            } else {
                run();
            }
        } else {
            run();
        }

        return () => {
            cancelled = true;
        };
    }, [token, stableProfileId]);

    const hasProjects = !!projects && projects.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <BriefcaseBusiness className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900">
                            Projects & Businesses
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Manage your businesses, services, projects, and public pages.
                        </p>
                    </div>
                </div>

                <Link
                    href={getNewProjectHref(profileId, plan)}
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Business
                </Link>
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm animate-pulse"
                        >
                            <div className="h-40 w-full bg-zinc-200" />
                            <div className="space-y-3 p-4">
                                <div className="h-4 w-1/2 rounded bg-zinc-200" />
                                <div className="h-3 w-2/3 rounded bg-zinc-200" />
                                <div className="h-3 w-1/3 rounded bg-zinc-200" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Couldn’t load businesses for profile <strong>{profileId}</strong>: {error}
                </div>
            ) : null}

            {!loading && !error && !!projects && projects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-600">
                    No business, service, or project yet for this profile.{" "}
                    <Link
                        href={getNewProjectHref(profileId, plan)}
                        className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
                    >
                        Create the first one
                    </Link>
                    .
                </div>
            ) : null}

            {!loading && !error && hasProjects ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {projects!.map((p) => (
                        <ProjectListCard
                            key={p.id}
                            project={p}
                            profileId={profileId}
                            plan={plan}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}