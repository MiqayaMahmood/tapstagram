// apps/web/src/app/dashboard/page.tsx  (Next 13/14 app router)
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import DashboardAnalyticsCard from '@/components/DashboardAnalyticsCard';
import ProfileLeads from '@/components/lead/ProfileLeads';

import TagEditor from "@/components/profile/TagEditor";
import HeroBannerCropper from '@/components/profile/HeroBannerCropper';
import ProfileAvatarUploader from '@/components/profile/ProfileAvatarUploader';
import UsernameEditor from '@/components/profile/UsernameEditor';
import SocialLinksManager from '@/components/SocialLinksManager';
import ProjectsSection from "@/components/ProjectsSection";
import { Separator } from '@/components/ui/Separator';
import Features_OrderCards, { Partner } from "@/components/explorer/Features_OrderCards";
import PremiumPresentationCard from '@/components/presentation/PremiumPresentationCard';
import {
    ExternalLink, ArrowLeft, CalendarDays, CheckCircle, MapPin, Mail, Phone,
    ImageIcon,
    UserCircle2,
    AtSign,
    Tags,
    ChartColumn,
    Share2,
    BriefcaseBusiness,
    
} from "lucide-react";

type Owner = { type: "user" | "project"; ownerId: string };

type Me = {
    id: number;
    username: string | "";
    name: string | "";
    title: string | "";
    bio: string | "";
    email: string | "";
    phone: string | "";
    location: string | "";
    industry: string | "";
    profile_picture_url: string | null;
    hero_banner_url?: string | null;
    plan?: string | null;
};
type ProjectViewData = /* (as above) */ any;
const EXPLORE_PATH = "/explore";

function profileHref(p?: ProjectViewData["profile"]) {
    // Prefer username route if you have one, else userId, else profileId if that’s your route.

    if (p?.id) return `/p/${p.id}`;
    if (p?.username) return `/${p.username}`;
    if (p?.userId) return `/p/${p.userId}`;

    return EXPLORE_PATH;
}

export default function DashboardPage() {
    const { token } = useAuth();
    const [me, setMe] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const onBack = () => {
        // Try browser back; if nothing meaningful, go to profile; else explore
        if (typeof window !== "undefined" && document.referrer && new URL(document.referrer).origin === location.origin) {
            router.back();
        } else {
            router.push(profileHref(me) || EXPLORE_PATH);
        }
    };

    // Load my profile (plus optional extras)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!token) { setMe(null); setLoading(false); return; }
            try {
                const base = await apiFetch<{ ok?: boolean; profile?: any } | any>('/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const p = (base?.profile ?? base) || {};
                if (!cancelled) {
                    setMe({
                        id: p.id,
                        username: p.username ?? "",
                        name: p.name ?? "",
                        title: p.title ?? "",
                        bio: p.bio ?? "",
                        email: p.email ?? "",
                        phone: p.phone ?? "",
                        location: p.location ?? "",
                        industry: p.industry ?? "",
                        profile_picture_url: p.profile_picture_url ?? null,
                        hero_banner_url: p.hero_banner_url ?? null,
                        plan: p.plan ?? null,
                    });
                }

            } 
            finally {

                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [token]);

    if (!token) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-white border rounded-2xl p-6">
                    <div className="text-lg font-semibold mb-2">Please sign in</div>
                    <div className="text-sm text-neutral-600">You need to be logged in to manage your profile.</div>
                    <Link href="/login" className="inline-flex mt-3 px-3 py-2 bg-blue-600 text-white rounded">Go to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div id="dashboard" className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-slate-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Back + breadcrumbs */}
                <div className="mb-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                                Dashboard
                            </div>
                            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                                Manage your profile
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500">
                                Update your public identity, media, tags, social links, projects, and leads.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={onBack}
                                variant="outline"
                                className="rounded-xl border-zinc-300 px-5"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>

                            {me?.username ? (
                                <Link
                                    href={`/${me.username}`}
                                    className="inline-flex rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
                                >
                                    View Public Profile
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[260px,minmax(0,1fr),300px]">
                {/* Left rail: sticky nav */}
                    <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                        <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 text-sm font-semibold text-zinc-900">Navigation</div>
                            <nav className="flex flex-col gap-1 text-sm">
                                <a href="#dashboard" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Dashboard</a>
                                <a href="#media" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Profile Media</a>
                                <a href="#basics" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Basics</a>
                                <a href="#username" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Username</a>
                                <a href="#tags" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Tags</a>
                                
                                <a href="#social" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Social Links</a>
                                <a href="#projects" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Businesses, Services & Projects</a>
                                <a href="#analytics" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Analytics</a>
                                <a href="#profile-leads" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100">Contact & Leads</a>
                            </nav>
                        </div>

                        <PremiumPresentationCard
                            isPremium={(me?.plan || "").toLowerCase() === "premium"}
                            href="/dashboard/profiles/presentation"
                            title="Premium Profile Presentation"
                            description="Create a richer public profile with custom sections, styled content blocks, media layouts, and a more polished presentation."
                        />
                    </aside>
                

                {/* Center: main editors */}
                <section className="space-y-2">
                    
                    
                    {loading || !me ? (
                        <div className="bg-white border rounded-xl border-zinc-400 p-4 text-sm text-neutral-600">Loading…</div>
                    ) : (
                        <>
                            {/* Media */}
                            <DashboardSectionCard
                                id="media"
                                title="Profile media"
                                description="Update your banner and avatar."
                                icon={ImageIcon}
                            >
                                <div className="relative">
                                    <HeroBannerCropper initialUrl={me.hero_banner_url ?? undefined} />
                                    <div className="-mt-12 ml-6">
                                        <ProfileAvatarUploader initialUrl={me.profile_picture_url ?? undefined} />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-zinc-500">
                                    Recommended banner 1500×500; avatar 512×512. JPG/PNG up to 5MB.
                                </p>
                            </DashboardSectionCard>
                            

                                    {/* Basics */}

                            <BasicsCard me={me} onSaved={(upd) => setMe((prev) => prev ? { ...prev, ...upd } : prev)} />

                            {/* Username */}
                            <DashboardSectionCard
                                id="username"
                                title="User Name"
                                description="Create or update user name, should be unique at Tapstagram."
                                icon={AtSign}
                            >
                                <div className="space-y-3">
                                
                                        <UsernameEditor initial={me.username ?? undefined} profileId={me.id} />
                                </div>
                            </DashboardSectionCard>
                            {/* Tags */}
                            <DashboardSectionCard
                                id="tags"
                                title="Tags"
                                description="Create or update tags, useful to rank & search at Tapstagram."
                                icon={Tags}
                            >
                                <div className="space-y-3">
                                    <TagEditor />
                                </div>
                            </DashboardSectionCard>
                            
                            {/* Socials */}
                            <DashboardSectionCard
                                id="social"
                                title="Social Links"
                                description="Create or update your social links."
                                icon={Share2}
                            >
                                <div className="space-y-3">
                                    <SocialLinksManager profileId={me.id} />
                                </div>
                                
                            </DashboardSectionCard>
                                
                            {/* Projects */}
                            <DashboardSectionCard
                                id="projects"
                                title="Businesses, Services & Projects"
                                description="Modify & update or showcase your new Business, Service & Project."
                                icon={BriefcaseBusiness}
                            >
                                <div className="space-y-3">
                                    <ProjectsSection profileId={me.id} plan={me.plan} />
                                </div>
                            </DashboardSectionCard>
                            <DashboardSectionCard
                                id="analytics"
                                title="Analytics Card"
                                description="Create or update tags, useful to rank & search at Tapstagram."
                                icon={Tags}
                            >
                                    <div className="space-y-3">
                                        <DashboardAnalyticsCard />
                                    </div>
                            </DashboardSectionCard>
                            <DashboardSectionCard
                                id="profile-leads"
                                title="Contacts & Leads"
                                description=""
                                icon={Mail}
                            >
                                <div className="space-y-3">
                                    <ProfileLeads profileId={me.id} />
                                </div>
                            </DashboardSectionCard>
                        </>
                    )}
                </section>

                    {/* Right rail: tips / CTA */}

                    <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                        <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                            <div className="mb-2 text-sm font-semibold text-zinc-900">Tips</div>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
                                <li>Keep your title short and descriptive.</li>
                                <li>Add tags so search and recommendations work better.</li>
                                <li>Upload a banner to stand out in shares.</li>
                            </ul>
                        </div>

                        <Features_OrderCards
                            isPremium={me?.plan === "premium"}
                            partners={[
                                { name: "Salpers", href: "https://salpers.ch", logoUrl: "http://localhost:5000/media/salpers_logo.png" },
                                { name: "Miqaya", href: "https://miqaya.ch", logoUrl: "http://localhost:5000/media/miqaya_logo.png" },
                            ] as Partner[]}
                            onUpgrade={() => router.push("/billing/upgrade")}
                            onManage={() => router.push("/billing")}
                            onOrderCard={() => router.push("/store/nfc-card")}
                        />
                    </aside>


            </div>
        </div>
        </div>
    );
}

function BasicsCard({ me, onSaved }: { me: Me; onSaved: (u: Partial<Me>) => void; }) {
    const { token } = useAuth();
    const [name, setName] = useState(me.name ?? '');
    const [title, setTitle] = useState(me.title ?? '');
    const [bio, setBio] = useState(me.bio ?? '');
    const [email, setEmail] = useState(me.email ?? '');
    const [phone, setPhone] = useState(me.phone ?? '');
    const [location, setLocation] = useState(me.location ?? '');
    const [industry, setIndustry] = useState(me.industry ?? '');
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);

    async function save() {
        if (!token) return;
        setSaving(true);
        try {
            // Uses your existing PATCH /profiles/me (adjust if your endpoint differs)
            const body = { name, title, bio, email, phone, location, industry };
            await apiFetch('/profile/', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            onSaved(body);
            setSavedAt(Date.now());
        } finally {
            setSaving(false);
            setTimeout(() => setSavedAt(null), 1500);
        }
    }

    return (
        <DashboardSectionCard
            id="basics"
            title="Basics"
            description="Update your public identity and contact details."
            icon={UserCircle2}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                    <div className="mb-1.5 text-zinc-600">Full name</div>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Jane Doe"
                    />
                </label>

                <label className="text-sm">
                    <div className="mb-1.5 text-zinc-600">Title</div>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Product Designer"
                    />
                </label>

                <label className="text-sm">
                    <div className="mb-1.5 text-zinc-600">Email</div>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="name@example.com"
                    />
                </label>

                <label className="text-sm">
                    <div className="mb-1.5 text-zinc-600">Phone</div>
                    <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="+41 77 777 77 77"
                    />
                </label>

                <label className="sm:col-span-2 text-sm">
                    <div className="mb-1.5 text-zinc-600">Bio</div>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="h-28 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Short intro…"
                    />
                </label>

                <label className="text-sm">
                    <div className="mb-1.5 text-zinc-600">Location</div>
                    <input
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="City, Country"
                    />
                </label>

                <label className="text-sm">
                    <div className="mb-1.5 text-zinc-600">Industry</div>
                    <input
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="e.g. Fintech"
                    />
                </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
                {savedAt ? (
                    <div className="text-xs font-medium text-emerald-600">Saved</div>
                ) : null}

                <button
                    onClick={save}
                    disabled={saving}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-600 disabled:opacity-60"
                >
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </DashboardSectionCard>
    );
}

import { LucideIcon } from "lucide-react";

function DashboardSectionCard({
    id,
    title,
    description,
    icon: Icon,
    children,
}: {
    id?: string;
    title: string;
    description?: string;
    icon: LucideIcon;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
                    {description ? (
                        <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
                    ) : null}
                </div>
            </div>

            {children}
        </section>
    );
}