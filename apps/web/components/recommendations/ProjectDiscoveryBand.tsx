"use client";

import Link from "next/link";
import { ArrowUpRight, Bookmark, Eye, Users } from "lucide-react";
import type { ProjectRec } from "@/services/recommendations";
import ProjectCoverFallback from "@/components/projects/ProjectCoverFallback";

export default function ProjectDiscoveryBand({
    title,
    items,
    badge,
    compact = false,
}: {
    title: string;
    items: ProjectRec[];
    badge?: string;
    compact?: boolean;
}) {
    if (!items?.length) return null;

    return (
        <section className="rounded-3xl border border-blue-100 bg-white/90 p-3 shadow-sm shadow-blue-950/5 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-tight text-slate-950 sm:text-base">{title}</h2>
                {badge ? (
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        {badge}
                    </span>
                ) : null}
            </div>

            <div className={compact ? "grid gap-2 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"}>
                {items.map((item) => {
                    const displayBadge = item.badge || item.reason || badge;
                    return (
                        <Link
                            key={item.id}
                            href={`/projects/${item.id}`}
                            className="group flex min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm hover:shadow-blue-950/10"
                        >
                            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-blue-50">
                                {item.coverImageUrl ? (
                                    <img src={item.coverImageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <ProjectCoverFallback title={item.title} category={item.category} variant="thumbnail" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-2">
                                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-950 group-hover:text-blue-700">
                                        {item.title}
                                    </h3>
                                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                    {displayBadge ? (
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                            {displayBadge}
                                        </span>
                                    ) : null}
                                    {item.category ? (
                                        <span className="max-w-full truncate rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                            {item.category}
                                        </span>
                                    ) : null}
                                </div>
                                {item.bio ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.bio}</p> : null}
                                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                                    {item.followerCount !== undefined ? (
                                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{item.followerCount}</span>
                                    ) : null}
                                    {item.bookmarkCount !== undefined ? (
                                        <span className="inline-flex items-center gap-1"><Bookmark className="h-3 w-3" />{item.bookmarkCount}</span>
                                    ) : null}
                                    {item.viewCount !== undefined ? (
                                        <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{item.viewCount}</span>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
