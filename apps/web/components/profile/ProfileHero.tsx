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
        <div className="border border-zinc-400 rounded-xl overflow-hidden bg-white">
            {/* Cover */}
            <div className="relative h-40 md:h-48 ">
                {profile.hero_banner_url ? (
                    <img
                        src={profile.hero_banner_url}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 hero-animated" /> // uses your gradient CSS from Hero
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {/* Avatar only overlaps */}
                <div className="-mt-14 relative z-10">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-md ring-1 ring-zinc-200">
                        {profile.profile_picture_url ? (
                            <img
                                src={profile.profile_picture_url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-3xl font-semibold uppercase text-zinc-700">
                                {profile.name?.substring(0, 2) || "US"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main info starts below header/avatar */}
                <div className="pt-4">
                    {profile.name && (
                        <h1 className="text-xl md:text-2xl font-bold truncate">
                            {profile.name}
                        </h1>
                    )}

                    {profile.title && (
                        <div className="text-zinc-900 pt-1 truncate">
                            {profile.title}
                        </div>
                    )}

                    {profile.location && (
                        <div className="text-sm md:text-base text-zinc-700 pt-1 truncate">
                            {profile.location}
                        </div>
                    )}

                </div>

                {/* Actions row below avatar/info */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm md:text-base text-gray-700">
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
