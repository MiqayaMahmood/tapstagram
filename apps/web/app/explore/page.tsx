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
import ProjectDiscoveryBand from "@/components/recommendations/ProjectDiscoveryBand";
import { Separator } from '@/components/ui/Separator';
import PremiumPresentationCard from '@/components/presentation/PremiumPresentationCard';
import UserMiniCard from '@/components/explorer/UserMiniCard';
import { Building2, Search, SlidersHorizontal, UsersRound, X } from "lucide-react";
import {
    getPopularProjectsInCategory,
    getRecentlyActiveProjects,
    getTrendingProjects,
    type ProjectRec,
} from "@/services/recommendations";

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

function categoryLabel(value: string) {
    return CATEGORY_OPTIONS.find((item) => item.v === value)?.l ?? value;
}
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
            className={`inline-flex min-h-10 items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 ${active
                    ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
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
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [trendingProjects, setTrendingProjects] = useState<ProjectRec[]>([]);
    const [popularCategoryProjects, setPopularCategoryProjects] = useState<ProjectRec[]>([]);
    const [recentlyActiveProjects, setRecentlyActiveProjects] = useState<ProjectRec[]>([]);

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

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (mode !== "business") {
                setTrendingProjects([]);
                setPopularCategoryProjects([]);
                setRecentlyActiveProjects([]);
                return;
            }

            try {
                const [trending, recent, popular] = await Promise.all([
                    getTrendingProjects({ limit: 6, days: 30, category: parsed.category || undefined }),
                    getRecentlyActiveProjects({ limit: 6, category: parsed.category || undefined }),
                    parsed.category
                        ? getPopularProjectsInCategory({ category: parsed.category, limit: 6 })
                        : Promise.resolve([]),
                ]);
                if (!cancelled) {
                    setTrendingProjects(trending ?? []);
                    setRecentlyActiveProjects(recent ?? []);
                    setPopularCategoryProjects(popular ?? []);
                }
            } catch {
                if (!cancelled) {
                    setTrendingProjects([]);
                    setPopularCategoryProjects([]);
                    setRecentlyActiveProjects([]);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [mode, parsed.category]);

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
    const activeSortLabel =
        mode === "profiles"
            ? parsed.sortP === "followers"
                ? "Most followers"
                : parsed.sortP === "oldest"
                    ? "Oldest"
                    : "Newest"
            : parsed.sortJ === "popular"
                ? "Popular"
                : parsed.sortJ === "started"
                    ? "Recently started"
                    : parsed.sortJ === "a-z"
                        ? "A-Z"
                        : parsed.sortJ === "z-a"
                            ? "Z-A"
                            : "Recently joined";
    
    return (
        <div className="min-h-screen rounded-t-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(29,78,216,0.10),transparent_28%),linear-gradient(180deg,rgba(239,246,255,0.85),rgba(255,255,255,0.95)_38%,rgba(248,250,252,0.95))] py-4 sm:py-6">
            <div className="grid gap-4 lg:grid-cols-[280px,minmax(0,1fr),320px]">
                <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                    

                    {!token && (
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-950/5 backdrop-blur">
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

                <section className="min-w-0 space-y-3 lg:space-y-4">
                    
                    <div className="sticky top-16 z-30 space-y-2 rounded-b-3xl bg-blue-50/80 pb-2 pt-1.5 backdrop-blur-xl lg:top-20 lg:space-y-3 lg:pb-3 lg:pt-2">
                        <div className="rounded-2xl border border-blue-100 bg-white/90 px-3 py-2.5 shadow-sm shadow-blue-950/5 backdrop-blur sm:px-4 lg:rounded-3xl lg:px-5 lg:py-4">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 hidden h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-950/20 lg:flex">
                                            <Search className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl lg:text-2xl">
                                                Explore
                                            </h1>
                                            <p className="hidden text-sm leading-6 text-slate-500 sm:block">
                                                Discover people and businesses across your network
                                            </p>
                                        </div>
                                    </div>

                                    <div className="inline-flex w-full rounded-2xl bg-blue-950/5 p-1 ring-1 ring-blue-100 lg:w-auto">
                                        <button
                                            className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition sm:text-sm lg:flex-none lg:px-4 ${mode === "profiles"
                                                    ? "bg-white text-blue-700 shadow-sm"
                                                    : "text-slate-600 hover:text-slate-950"
                                                }`}
                                            onClick={() => pushQS({ type: "profiles", page: 1 })}
                                        >
                                            <UsersRound className="h-4 w-4" />
                                            Individuals
                                        </button>
                                        <button
                                            className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition sm:text-sm lg:flex-none lg:px-4 ${mode === "business"
                                                    ? "bg-white text-blue-700 shadow-sm"
                                                    : "text-slate-600 hover:text-slate-950"
                                                }`}
                                            onClick={() => pushQS({ type: "business", page: 1 })}
                                        >
                                            <Building2 className="h-4 w-4" />
                                            Businesses
                                        </button>
                                    </div>
                                </div>

                                
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2 lg:hidden">
                                <div className="min-w-0 truncate text-xs font-medium text-slate-600">
                                    {mode === "profiles" ? "Individuals" : "Businesses"} · {total} results · {activeSortLabel}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen((open) => !open)}
                                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-blue-100 bg-white px-3 text-xs font-semibold text-blue-700 shadow-sm"
                                >
                                    {mobileFiltersOpen ? <X className="h-3.5 w-3.5" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
                                    Filters
                                </button>
                            </div>
                        </div>

                        {mode === "profiles" ? (
                            <div className="hidden rounded-3xl border border-blue-100 bg-white/90 p-3 shadow-sm shadow-blue-950/5 backdrop-blur sm:p-4 lg:block">
                                <div className="flex flex-wrap gap-2">
                                    <SortChip label="Newest" active={parsed.sortP === "newest"} onClick={() => pushQS({ sort: "newest" })} />
                                    <SortChip label="Oldest" active={parsed.sortP === "oldest"} onClick={() => pushQS({ sort: "oldest" })} />
                                    <SortChip label="Most Followers" active={parsed.sortP === "followers"} onClick={() => pushQS({ sort: "followers" })} />
                                </div>
                            </div>
                        ) : (
                            <div className="hidden rounded-3xl border border-blue-100 bg-white/90 p-3 shadow-sm shadow-blue-950/5 backdrop-blur sm:p-4 lg:block">
                                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                                        Filters
                                    </div>
                                    <select
                                        className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-auto"
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
                                        className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-auto"
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
                        {mobileFiltersOpen ? (
                            <div className="rounded-2xl border border-blue-100 bg-white/95 p-3 shadow-lg shadow-blue-950/10 backdrop-blur lg:hidden">
                                {mode === "profiles" ? (
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            <SortChip label="Newest" active={parsed.sortP === "newest"} onClick={() => pushQS({ sort: "newest" })} />
                                            <SortChip label="Oldest" active={parsed.sortP === "oldest"} onClick={() => pushQS({ sort: "oldest" })} />
                                            <SortChip label="Most Followers" active={parsed.sortP === "followers"} onClick={() => pushQS({ sort: "followers" })} />
                                        </div>
                                        <FiltersCard />
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        <select
                                            className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                            className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            value={parsed.sortJ}
                                            onChange={(e) => pushQS({ psort: e.target.value })}
                                        >
                                            <option value="popular">Popular</option>
                                            <option value="recent">Recently Join</option>
                                            <option value="started">Recently started</option>
                                            <option value="a-z">A-Z</option>
                                            <option value="z-a">Z-A</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                    {loading ? (
                        <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 text-sm text-slate-600 shadow-sm shadow-blue-950/5">
                            Loading…
                        </div>
                    ) : mode === "profiles" ? (
                        profiles.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 p-8 text-sm text-slate-600 shadow-sm">
                                No profiles found. Try different filters.
                            </div>
                        ) : (
                            <>
                                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {profiles.map((p) => (
                                        <ProfileCard key={p.id} profile={p} />
                                    ))}
                                </ul>
                                <Pager canPrev={canPrev} canNext={canNext} page={parsed.page} goPage={goPage} pageSize={parsed.pageSize} />
                            </>
                        )
                    ) : projects.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 p-8 text-sm text-slate-600 shadow-sm">
                            No projects found. Try different filters.
                        </div>
                    ) : (
                        <>
                            <ul className="grid gap-3">
                                {projects.map((p) => (
                                    <ProjectCard key={p.id} project={p} plan={me?.plan || 'free'} />
                                ))}
                            </ul>
                            <div className="space-y-3">
                                {parsed.category ? (
                                    <ProjectDiscoveryBand
                                        title={`Popular in ${categoryLabel(parsed.category)}`}
                                        items={popularCategoryProjects}
                                        badge="Popular"
                                        compact
                                    />
                                ) : null}
                                <ProjectDiscoveryBand
                                    title="Trending Projects"
                                    items={trendingProjects}
                                    badge="Trending"
                                    compact
                                />
                                <ProjectDiscoveryBand
                                    title="Recently Active"
                                    items={recentlyActiveProjects}
                                    badge="Updated recently"
                                    compact
                                />
                            </div>
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
        <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <button
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canPrev}
                onClick={() => goPage(page - 1)}
            >
                Previous
            </button>

            <div className="text-center text-sm text-slate-500">
                Page <span className="font-semibold text-slate-950">{page}</span> / {pageSize} per page
            </div>

            <button
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canNext}
                onClick={() => goPage(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
