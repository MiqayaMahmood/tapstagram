'use client';
import ProfileFollowButton from '@/components/ProfileFollowButton';
import ProfileBookmarkButton from '@/components/ProfileBookmarkButton';
import React from 'react';

type P = {
    id: number;
    username?: string;
    name?: string | null;
    title?: string | null;
    bio?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    industry?: string | null;
    titleSlug?: string | null; 
    profile_picture_url?: string | null;
    hero_banner_url?: string | null;            // optional, if you add later
    followersCount?: number;
    followingCount?: number;
    followedByMe?: boolean;
};

export default function ProfileHero({ profile }: { profile: P }) {
    const followers = profile.followersCount ?? 0;
    const following = profile.followingCount ?? 0;
    

    return (
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5">
            <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-400" />
            {/* Cover */}
            <div className="relative h-40 md:h-48 ">
                {profile.hero_banner_url ? (
                    <img
                        src={profile.hero_banner_url}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.35),transparent_34%),linear-gradient(135deg,#0f172a,#1d4ed8_58%,#e0f2fe)]" />
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {/* Avatar only overlaps */}
                <div className="-mt-14 relative z-10">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg shadow-blue-950/10 ring-1 ring-blue-100 sm:h-28 sm:w-28">
                        {profile.profile_picture_url ? (
                            <img
                                src={profile.profile_picture_url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl font-semibold uppercase text-blue-700 sm:text-3xl">
                                {profile.name?.substring(0, 2) || "US"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main info starts below header/avatar */}
                <div className="pt-4">
                    {profile.name && (
                        <h1 className="truncate text-xl font-bold tracking-tight text-slate-950 md:text-2xl">
                            {profile.name}
                        </h1>
                    )}

                    {profile.title && (
                        <div className="truncate pt-1 text-sm text-slate-700 md:text-base">
                            {profile.title}
                        </div>
                    )}

                    {profile.location && (
                        <div className="truncate pt-1 text-sm text-slate-600 md:text-base">
                            {profile.location}
                        </div>
                    )}

                </div>

                {/* Actions row below avatar/info */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-slate-700 md:text-base">
                        <b>{followers}</b> followers · <b>{following}</b> following
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <ProfileFollowButton profileId={profile.id} initialFollowing={!!profile.followedByMe} />
                        <ProfileBookmarkButton profileId={profile.id} />

                    </div>
                </div>
            </div>
        </div>
    );
}
