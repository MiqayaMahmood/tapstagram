"use client";

import Link from "next/link";
import type { ProfileRec } from "@/services/recommendations";

export default function PeopleAlsoViewedCard({
    items,
    title = "People Also Viewed",
}: {
    items: ProfileRec[];
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
                        href={`/p/${item.id}`}
                        className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-zinc-50"
                    >
                        {item.profile_picture_url ? (
                            <img
                                src={item.profile_picture_url}
                                alt={item.name}
                                className="h-14 w-14 object-cover rounded-full object-center"
                            />
                        ) : (
                            <div className="flex h-14 w-14 items-center rounded-full justify-center bg-zinc-200 text-3xl font-semibold uppercase text-zinc-700">
                                {item.name?.substring(0, 2) || "US"}
                            </div>
                        )}
                        
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-zinc-900">{item.name}</div>
                            {item.title && <div className="truncate text-xs text-zinc-500">{item.title}</div>}
                            {item.location && <div className="truncate text-xs text-zinc-400">{item.location}</div>}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}