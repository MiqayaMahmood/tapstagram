"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth} from '@/context/AuthContext';
import ProjectCoverFallback from "@/components/projects/ProjectCoverFallback";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProjectSummary = { id: number; title: string; slug: string; coverImageUrl?: string | null; category?: string | null; url?: string | null; };
type QuickLinks = {
    projects: { bookmarks: ProjectSummary[]; follows: ProjectSummary[] };
    // profiles?: { bookmarks: ProfileSummary[]; follows: ProfileSummary[] }
};

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tapstagram_token');
}

export default function MyQuickLinks() {
    const [data, setData] = useState<QuickLinks | null>(null);
    const { token} = useAuth();

    const tokenToUse = token ?? getStoredToken() ?? undefined;

    useEffect(() => {
        (async () => {
            const r = await fetch(`${API_BASE}/projects/me/quicklinks`,
            { headers: { Authorization: `Bearer ${tokenToUse}`} ,
             credentials: "include", cache: "no-store" }
            );
            if (r.ok) setData(await r.json());
        })();
    }, []);
    

    return (
        <div className="space-y-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5">
            <div className="text-lg font-bold text-neutral-800">My Network</div>

            <section>
                <div className="text-md font-semibold text-neutral-500 mb-2">Bookmarked Businesses</div>
                <ul className="space-y-2">
                    {data?.projects.bookmarks.slice(0, 6).map(p => (
                        <li key={p.id} className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {p.coverImageUrl ? <img alt="" src={p.coverImageUrl} className="h-6 w-6 rounded object-cover" /> : <div className="h-6 w-6 overflow-hidden rounded"><ProjectCoverFallback title={p.title} category={p.category} variant="tiny" /></div>}
                            <Link className="text-sm hover:underline truncate" href={`/projects/${p.id}`}>{p.title}</Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <div className="text-md font-semibold text-neutral-500 mb-2">Followed Businesses</div>
                <ul className="space-y-2">
                    {data?.projects.follows.slice(0, 6).map(p => (
                        <li key={p.id} className="flex items-center gap-2">
                            {p.coverImageUrl ? <img alt="" src={p.coverImageUrl} className="h-6 w-6 rounded object-cover" /> : <div className="h-6 w-6 overflow-hidden rounded"><ProjectCoverFallback title={p.title} category={p.category} variant="tiny" /></div>}
                            <Link className="text-sm hover:underline truncate" href={`/projects/${p.id}`}>{p.title}</Link>
                        </li>
                    ))}
                </ul>
            </section>

            <Button asChild variant="outline" className="w-full">
                <Link href="/mynetwork">View all</Link>
            </Button>
        </div>
    );
}
