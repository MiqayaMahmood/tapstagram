"use client";

import Link from "next/link";
import type { ProjectRec } from "@/services/recommendations";

export default function RelatedProjectsCard({
    items,
    title = "Related Projects",
}: {
    items: ProjectRec[];
    title?: string;
}) {
    if (!items?.length) return null;

    return (
        <div className="rounded-xl border border-zinc-400 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
            <div className="mt-4 space-y-3">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/projects/${item.id}`}
                        className="flex gap-3 rounded-2xl p-2 transition hover:bg-zinc-50"
                    >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                            {item.coverImageUrl ? (
                                <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                            ) : null}
                        </div>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-zinc-900">{item.title}</div>
                            {item.category && <div className="truncate text-xs text-zinc-500">{item.category}</div>}
                            {item.bio && <div className="line-clamp-2 text-xs text-zinc-400">{item.bio}</div>}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}