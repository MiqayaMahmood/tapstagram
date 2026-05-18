"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { followProfile, unfollowProfile } from "@/services/follow";
import { MapPin, Verified } from "lucide-react";

type ProfileLite = {
    id: number;
    username: string | null;
    name: string;
    bio: string;
    title: string | null;
    location: string | null;
    industry?: string;
    profile_picture_url: string | null;
    hero_banner_url: string | null;
    isFollowing?: boolean;
};

type Props = {
    profile: ProfileLite;
    onFollowChange?: (isFollowing: boolean) => void;
};

export default function ProfileCard({ profile, onFollowChange }: Props) {
    const { token } = useAuth();
    const [isFollowing, setIsFollowing] = useState(!!profile.isFollowing);
    const [busy, setBusy] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const profilePath = useMemo(() => `/p/${encodeURIComponent(profile.id)}`, [profile.id]);

    const absoluteUrl = useMemo(() => {
        const base =
            typeof window !== "undefined"
                ? window.location.origin
                : (process.env.NEXT_PUBLIC_WEB_BASE_URL || "https://example.com");
        return `${base}${profilePath}`;
    }, [profilePath]);

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

    function mailtoHref() {
        const subject = encodeURIComponent(`Check out ${profile.name} on Tapstagram`);
        const body = encodeURIComponent(`I thought you might like this profile:\n\n${absoluteUrl}`);
        return `mailto:?subject=${subject}&body=${body}`;
    }

    function facebookShareHref() {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`;
    }

    async function webShare() {
        if (typeof navigator !== "undefined" && (navigator as any).share) {
            try {
                await (navigator as any).share({
                    title: profile.name,
                    text: `Check out ${profile.name} on Tapstagram`,
                    url: absoluteUrl,
                });
            } catch { }
        } else {
            await copyLink();
        }
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            window.prompt("Copy this link:", absoluteUrl);
        }
    }

    return (
        <div className="group overflow-hidden rounded-xl border border-zinc-400 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            {/* Banner */}
            <Link href={profilePath} className="block">
                <div className="relative h-24 w-full overflow-hidden bg-zinc-200">
                    {profile.hero_banner_url ? (
                        <img
                            src={profile.hero_banner_url}
                            alt=""
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-t from-slate-200 via-zinc-200 to-slate-400" />
                    )}
                </div>
            </Link>

            {/* Avatar overlap */}
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
                                        {profile.name?.substring(0,2)  || "US"}
                                </div>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Main content */}
                <div className="mt-4 text-center">
                    <Link href={profilePath} className="inline-flex items-center gap-2">
                        <h1 title={profile.name} className="max-w-[200px] truncate text-[22px] font-semibold tracking-tight text-zinc-900">
                            {profile.name}
                        </h1>
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Verified className="h-4 w-4" />
                            </span>
                    </Link>

                    {profile.title && (
                        <p className="mx-auto mt-4 max-w-[260px] truncate text-sm leading-5 text-zinc-800">
                            {profile.title}
                        </p>
                    )}

                    {profile.location && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-700">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.location}</span>
                        </div>
                    )}

                    {profile.bio && (
                        
                        <p title={profile.bio} className="mx-auto mt-4 max-w-[260px] truncate text-sm leading-6 text-zinc-800">
                            {profile.bio}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        <Link
                            href={profilePath}
                            className="inline-flex min-w-[82px] items-center justify-center rounded-full border border-zinc-800 bg-white px-2 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
                        >
                            View
                        </Link>

                        <button
                            onClick={toggleFollow}
                            disabled={busy || !token}
                            className={`inline-flex min-w-[82px] items-center justify-center rounded-full px-2 py-2 text-sm font-semibold transition ${isFollowing
                                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                                    : "border border-blue-600 text-blue-700 bg-white hover:bg-blue-50"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                            title={!token ? "Sign in required" : ""}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}