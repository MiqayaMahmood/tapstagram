"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileCard from "@/components/profile/ProfileCard";
import MarketingCard from '@/components/explorer/MarketingCard';
import { searchProfiles, type DirItem } from "@/services/profile";
import { searchProjects, type ProjectLite } from "@/services/project";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import FiltersCard from "@/components/explorer/FiltersCard";
import MyQuickLinks from "@/components/MyQuickLinks";
import Features_OrderCards, { Partner } from "@/components/explorer/Features_OrderCards";
import ProjectCard from "@/components/projects/ProjectCard";
import { Separator } from '@/components/ui/Separator';
import PremiumPresentationCard from '@/components/presentation/PremiumPresentationCard';
import UserMiniCard from '@/components/explorer/UserMiniCard';

const CATEGORY_OPTIONS = [
    { v: "", l: "All categories" },
    { v: "DISTRIBUTIONS", l: "Distributions" },
    { v: "eCOMMERCE", l: "eCommerce" },
    { v: "EDUCATION", l: "Education" },
    { v: "ELECTRICAL_ELECTRONICS", l: "Electrical & Electronics" },
    { v: "FINANCE", l: "Finance" },
    { v: "FOOD_BEVREGES", l: "Food & Bevreges" },
    { v: "HEALTHCARE", l: "Healthcare" },
    { v: "HOTEL_RESTAURANT", l: "Hotel & Restaurants" },
    { v: "IMPORT_EXPORT", l: "Import & Export" },
    { v: "INDUSTRIAL_MACHINARY", l: "Industrial & Machinary" },
    { v: "MANUFACTURING", l: "Manufacturing" },
    { v: "MARKETING", l: "Marketing" },
    { v: "REAL_ESTATE", l: "Real Estate" },
    { v: "RETAIL", l: "Retail" },
    { v: "SALES", l: "Sales" },
    { v: "SERVICES", l: "Services" },
    { v: "SOFTWARE", l: "Software" },
    { v: "TRADING", l: "Trading" },
    { v: "OTHER", l: "Other" },
];
function SortChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 ${active
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
                }`}
        >
            {label}
        </button>
    );
}

function SortChip_old({
    label,
    active,
    onClick,
}: {
    label: string;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={[
                "inline-flex items-center justify-center border border-zinc-400 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

export default function ExplorePage() {
    const router = useRouter();
    const sp = useSearchParams();
    const { token } = useAuth();

    type Mode = "profiles" | "business";
    const mode: Mode = (sp.get("type") === "profiles" ? "profiles" : "business");

    const parsed = useMemo(() => {
        const tags = (sp.get("tags") || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        return {
            q: sp.get("q") || "",
            page: Number(sp.get("page") || 1),
            pageSize: Number(sp.get("pageSize") || 18),

            name: sp.get("name") || "",
            title: sp.get("title") || "",
            location: sp.get("location") || "",
            industry: sp.get("industry") || "",
            tags,
            sortP: (sp.get("sort") as "newest" | "oldest" | "followers" | "active") || "newest",

            category: sp.get("pcat") || "",
            country: sp.get("pcountry") || "",
            sortJ: (sp.get("psort") as "recent" | "a-z" | "z-a" |"started" | "popular") || "recent",
        };
    }, [sp.toString()]);

    const [profiles, setProfiles] = useState<DirItem[]>([]);
    const [projects, setProjects] = useState<ProjectLite[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [me, setMe] = useState<{
        id: number; userId: number; username: string | null;
        name: string | null; title: string | null; bio: string | null;
        profile_picture_url: string | null; phone: string | null; email: string | null;
        location: string | null; titleSlug: string | null; industry: string | null;
        referrer: string | null; plan: string | null;
    } | null>(null);
    
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!token) { setMe(null); return; }
            try {
                const payload = await apiFetch<any>("/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profile = (payload && typeof payload === "object" && "profile" in payload) ? payload.profile : payload;
                if (!cancelled) {
                    setMe({
                        id: profile.id, userId: profile.userId, username: profile.username ?? null,
                        name: profile.name ?? null, title: profile.title ?? null, bio: profile.bio ?? null,
                        profile_picture_url: profile.profile_picture_url ?? null,
                        phone: profile.phone ?? null, email: profile.email ?? null, location: profile.location ?? null,
                        titleSlug: profile.titleSlug ?? null, industry: profile.industry ?? null,
                        referrer: profile.referrer ?? null, plan: profile.plan ?? null,
                    });
                    
                }
            } catch {
                if (!cancelled) setMe(null);
            }
        })();
        return () => { cancelled = true; };
    }, [token]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                if (mode === "profiles") {
                    const res = await searchProfiles({
                        q: parsed.q || undefined,
                        name: parsed.name || undefined,
                        title: parsed.title || undefined,
                        location: parsed.location || undefined,
                        industry: parsed.industry || undefined,
                        tags: parsed.tags,
                        page: parsed.page,
                        pageSize: parsed.pageSize,
                        excludeId: me?.id,
                        sort: parsed.sortP,
                    });
                    if (!cancelled) {
                        setProfiles(res.items ?? []);
                        setTotal(res.total ?? 0);
                    }
                } else {
                    const res = await searchProjects({
                        q: parsed.q || undefined,
                        category: parsed.category || undefined,
                        country: parsed.country || undefined,
                        sort: parsed.sortJ,
                        page: parsed.page,
                        perPage: parsed.pageSize,
                    });
                    if (!cancelled) {
                        setProjects(res.items ?? []);
                        setTotal(res.total ?? 0);
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [
        mode, parsed.q, parsed.name, parsed.title, parsed.location, parsed.industry,
        parsed.tags.join(","), parsed.sortP, parsed.category, parsed.country,
        parsed.sortJ, parsed.page, parsed.pageSize, me?.id
    ]);

    const pushQS = (updates: Record<string, string | number | undefined | null>) => {
        const qs = new URLSearchParams(sp.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v === undefined || v === null || v === "") qs.delete(k);
            else qs.set(k, String(v));
        });
        if (
            updates.type !== undefined ||
            updates.q !== undefined ||
            updates.sort !== undefined ||
            updates.psort !== undefined ||
            updates.pcat !== undefined ||
            updates.pcountry !== undefined
        ) {
            qs.set("page", "1");
        }
        router.push(`/explore?${qs.toString()}`);
    };

    const canPrev = parsed.page > 1;
    const canNext = parsed.page * parsed.pageSize < total;
    const goPage = (nextPage: number) => pushQS({ page: nextPage });
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100/60">
            <div className="grid gap-4 lg:grid-cols-[280px,minmax(0,1fr),320px]">
                <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                    

                    {!token && (
                        <div className="rounded-3xl border border-zinc-400 bg-white/90 backdrop-blur p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-sm font-semibold text-zinc-700 shadow-inner">
                                    U
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-zinc-900 truncate">Guest</div>
                                    <div className="text-xs text-zinc-500 truncate">Sign in to manage your profile</div>
                                </div>
                            </div>
                            <Link
                                href="/login"
                                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                            >
                                Log in
                            </Link>
                        </div>
                    )}

                    {me && (
                        <UserMiniCard profileId={me.id} />
                    )}

                    {me && (
                        <PremiumPresentationCard
                            isPremium={(me?.plan || "").toLowerCase() === "premium"}
                            href="/dashboard/profiles/presentation"
                            title="Premium Profile Presentation"
                            description="Create a richer public profile with custom sections, styled content blocks, media layouts, and a more polished presentation."
                        />
                    )}
                    {me && (
                        <div className="rounded-3xl border border-zinc-200 bg-white/90 shadow-sm">
                            <MyQuickLinks />
                        </div>
                    )}

                    {mode === "profiles" && (
                        <div className="rounded-3xl border border-zinc-200 bg-white/90 shadow-sm overflow-hidden">
                            <FiltersCard />
                        </div>
                    )}
                </aside>

                <section className="space-y-4  ">
                    
                    <div className="lg:block z-30 sticky top-20 bg-white/90">    
                        <div className="rounded-xl border border-zinc-400 bg-white/90 backdrop-blur px-5 py-4 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                    <div>
                                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                                            Explore
                                        </h1>
                                        <p className="text-sm text-zinc-500">
                                            Discover people and businesses across your network
                                        </p>
                                    </div>

                                    <div className="inline-flex rounded-xl bg-zinc-300 p-1">
                                        <button
                                            className={`rounded-xl px-4 py-2 text-sm font-medium border-zinc-400 transition ${mode === "profiles"
                                                    ? "bg-white text-zinc-900 shadow-sm"
                                                    : "text-zinc-600 hover:text-zinc-900"
                                                }`}
                                            onClick={() => pushQS({ type: "profiles", page: 1 })}
                                        >
                                            Individuals
                                        </button>
                                        <button
                                            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${mode === "business"
                                                    ? "bg-white text-zinc-900 shadow-sm"
                                                    : "text-zinc-600 hover:text-zinc-900"
                                                }`}
                                            onClick={() => pushQS({ type: "business", page: 1 })}
                                        >
                                            Businesses
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 border border-zinc-400">
                                    Total {mode === "profiles" ? "Individuals" : "Businesses"}:{" "}
                                    <span className="text-zinc-900">{total}</span>
                                </div>
                            </div>
                        </div>

                        {mode === "profiles" ? (
                            <div className="rounded-xl border border-zinc-400 bg-white backdrop-blur p-4 shadow-sm">
                                <div className="flex flex-wrap gap-2">
                                    <SortChip label="Newest" active={parsed.sortP === "newest"} onClick={() => pushQS({ sort: "newest" })} />
                                    <SortChip label="Oldest" active={parsed.sortP === "oldest"} onClick={() => pushQS({ sort: "oldest" })} />
                                    <SortChip label="Most Followers" active={parsed.sortP === "followers"} onClick={() => pushQS({ sort: "followers" })} />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-zinc-400 bg-white/90 backdrop-blur p-4 shadow-sm">
                                <div className="flex flex-wrap items-center gap-3">
                                    <select
                                        className="rounded-xl border border-zinc-400 bg-white px-4 py-2 text-md text-zinc-700 shadow-sm outline-none transition focus:border-zinc-400"
                                        value={parsed.category}
                                        onChange={(e) => pushQS({ pcat: e.target.value })}
                                    >
                                        {CATEGORY_OPTIONS.map((o) => (
                                            <option key={o.v} value={o.v}>
                                                {o.l}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="rounded-xl border border-zinc-400 bg-white px-4 py-2 text-md text-zinc-700 shadow-sm outline-none transition focus:border-zinc-400"
                                        value={parsed.sortJ}
                                        onChange={(e) => pushQS({ psort: e.target.value })}
                                        >   
                                            <option value="popular">Popular</option>
                                            <option value="recent">Recently Join</option>
                                            <option value="started">Recently started</option>
                                            <option value="a-z">A–Z</option>
                                            <option value="z-a">Z-A</option>
                                    
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    {loading ? (
                        <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
                            Loading…
                        </div>
                    ) : mode === "profiles" ? (
                        profiles.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-500 shadow-sm">
                                No profiles found. Try different filters.
                            </div>
                        ) : (
                            <>
                                <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                    {profiles.map((p) => (
                                        <ProfileCard key={p.id} profile={p} />
                                    ))}
                                </ul>
                                <Pager canPrev={canPrev} canNext={canNext} page={parsed.page} goPage={goPage} pageSize={parsed.pageSize} />
                            </>
                        )
                    ) : projects.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-400 bg-white p-8 text-sm text-zinc-500 shadow-sm">
                            No projects found. Try different filters.
                        </div>
                    ) : (
                        <>
                            <ul className="grid gap-2 sm:grid-cols-1 xl:grid-cols-1">
                                {projects.map((p) => (
                                    <ProjectCard key={p.id} project={p} plan={me?.plan || 'free'} />
                                ))}
                            </ul>
                            <Pager canPrev={canPrev} canNext={canNext} page={parsed.page} goPage={goPage} pageSize={parsed.pageSize} />
                        </>
                    )}
                </section>

                <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                    <MarketingCard />
                    

                    <div className="bg-white/90 shadow-sm overflow-hidden">
                        <Features_OrderCards
                            isPremium={me?.plan === "premium"}
                            partners={[
                                { name: "Salpers", href: "https://salpers.ch", logoUrl: `${process.env.NEXT_PUBLIC_API_URL}/media/salpers_logo.png` },
                                { name: "Miqaya", href: "https://miqaya.ch", logoUrl: `${process.env.NEXT_PUBLIC_API_URL}/media/miqaya_logo.png` },
                            ] as Partner[]}
                            onUpgrade={() => router.push("/subscription")}
                            onManage={() => router.push("/subscription")}
                            onOrderCard={() => router.push("/nfc-card")}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}

function Pager({
    canPrev,
    canNext,
    page,
    goPage,
    pageSize,
}: {
    canPrev: boolean;
    canNext: boolean;
    page: number;
    goPage: (n: number) => void;
    pageSize: number;
}) {
    return (
        <div className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white/90 px-4 py-3 shadow-sm">
            <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canPrev}
                onClick={() => goPage(page - 1)}
            >
                Previous
            </button>

            <div className="text-sm text-zinc-500">
                Page <span className="font-semibold text-zinc-900">{page}</span> · {pageSize} / page
            </div>

            <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canNext}
                onClick={() => goPage(page + 1)}
            >
                Next
            </button>
        </div>
    );
}