"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { followProfile, unfollowProfile } from "@/services/follow";
import {
    MapPin,
    BriefcaseBusiness,
    CalendarDays,
    Users,
    FolderKanban,
} from "lucide-react";

type ProfileLite = {
    id: number;
    username: string | null;
    name: string;
    bio: string;
    title: string | null;
    location: string | null;
    industry?: string | null;
    profile_picture_url: string | null;
    hero_banner_url: string | null;
    isFollowing?: boolean;

    // optional richer fields
    created_at?: string | null;
    followersCount?: number;
    projectsCount?: number;
    isVerified?: boolean;
    plan?: string | null;
};

type Props = {
    profile: ProfileLite;
    onFollowChange?: (isFollowing: boolean) => void;
};

function formatDate(value?: string | null) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function ProfileCard({ profile, onFollowChange }: Props) {
    const { token } = useAuth();
    const [isFollowing, setIsFollowing] = useState(!!profile.isFollowing);
    const [busy, setBusy] = useState(false);

    const profilePath = useMemo(() => `/p/${encodeURIComponent(profile.id)}`, [profile.id]);
    const joined = formatDate(profile.created_at);

    async function toggleFollow() {
        if (!token || busy) return;
        setBusy(true);
        try {
            if (isFollowing) {
                await unfollowProfile(token, profile.id);
                setIsFollowing(false);
                onFollowChange?.(false);
            } else {
                await followProfile(token, profile.id);
                setIsFollowing(true);
                onFollowChange?.(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    }

    const showVerified = !!profile.isVerified;
    const showPremium = (profile.plan || "").toLowerCase() === "premium";

    return (
        <div className="group overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <Link href={profilePath} className="block">
                <div className="relative h-24 w-full overflow-hidden bg-blue-50">
                    {profile.hero_banner_url ? (
                        <img
                            src={profile.hero_banner_url}
                            alt=""
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200" />
                    )}
                </div>
            </Link>

            <div className="relative px-5 pb-5">
                <div className="-mt-14 flex justify-center">
                    <Link href={profilePath}>
                        <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-md ring-1 ring-zinc-200">
                            {profile.profile_picture_url ? (
                                <img
                                    src={profile.profile_picture_url}
                                    alt={profile.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-3xl font-semibold uppercase text-zinc-700">
                                    {profile.name?.substring(0, 2) || "US"}
                                </div>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link href={profilePath} className="inline-flex max-w-full items-center gap-2">
                        <h3
                            title={profile.name}
                            className="max-w-[220px] truncate text-xl font-semibold tracking-tight text-zinc-900 transition group-hover:text-blue-700"
                        >
                            {profile.name}
                        </h3>

                        {showVerified ? (
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                ✓
                            </span>
                        ) : null}
                    </Link>

                    {profile.title ? (
                        <p className="mx-auto mt-2 max-w-[260px] truncate text-sm leading-6 text-zinc-700">
                            {profile.title}
                        </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        {profile.industry ? (
                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                                {profile.industry}
                            </span>
                        ) : null}

                        {showPremium ? (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                Premium
                            </span>
                        ) : null}
                    </div>

                    {profile.location ? (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-600">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span>{profile.location}</span>
                        </div>
                    ) : null}

                    {profile.bio ? (
                        <p
                            title={profile.bio}
                            className="mx-auto mt-4 max-w-[260px] truncate text-sm leading-6 text-zinc-600"
                        >
                            {profile.bio}
                        </p>
                    ) : (
                        <p className="mx-auto mt-4 max-w-[280px] text-sm text-zinc-400">
                            No bio added yet.
                        </p>
                    )}

                    {(profile.followersCount !== undefined ||
                        profile.projectsCount !== undefined ||
                        joined) ? (
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-600">
                            {profile.followersCount !== undefined ? (
                                <div className="inline-flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span>{profile.followersCount} followers</span>
                                </div>
                            ) : null}

                            {profile.projectsCount !== undefined ? (
                                <div className="inline-flex items-center gap-1.5">
                                    <FolderKanban className="h-4 w-4 text-blue-600" />
                                    <span>{profile.projectsCount} projects</span>
                                </div>
                            ) : null}

                            {joined ? (
                                <div className="inline-flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4 text-blue-600" />
                                    <span>Joined {joined}</span>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        <Link
                            href={profilePath}
                            className="inline-flex min-w-[82px] items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            View
                        </Link>

                        <button
                            onClick={toggleFollow}
                            disabled={busy || !token}
                            title={!token ? "Sign in required" : ""}
                            className={`inline-flex min-w-[82px] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${isFollowing
                                    ? "bg-zinc-900 text-white hover:bg-zinc-700"
                                    : "border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                            {busy ? "Please wait…" : isFollowing ? "Following" : "Follow"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}