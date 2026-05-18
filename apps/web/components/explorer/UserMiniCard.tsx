'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Separator } from '@/components/ui/Separator';



type MeProfile = {
    id: number;
    userId: number; 
    name: string | null;
    username: string | null;
    title: string | null;
    phone: string | null; 
    titleSlug: string | null;
    industry: string | null;
    bio: string | null;
    profile_picture_url: string | null;
    location: string | null;
    email: string | null;
    referrer: string | null;
    plan: string | null;
};

export default function UserMiniCard({ profileId }: { profileId: number }) {
    const { user, token } = useAuth();
    const [me, setMe] = useState<MeProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(!!token);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!token) {
                setMe(null);
                setLoading(false);
                return;
            }
            setLoading(true);
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
            }
            catch (err){
                if (!cancelled) setMe(null);
            }
            finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [token, user?.name]);

    // Logged out minimal card
    if (!token) {
        return (
            <div className="border rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">U</div>
                    <div className="min-w-0">
                        <div className="font-medium truncate">Guest</div>
                        <div className="text-xs text-gray-600 truncate">Sign in to manage your profile</div>
                    </div>
                </div>
                <Link href="/login" className="mt-3 inline-flex px-3 py-1.5 rounded bg-black text-white text-sm">
                    Log in
                </Link>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="border rounded-2xl p-4 bg-white animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                    </div>
                </div>
                <div className="h-8 bg-gray-200 rounded mt-3" />
            </div>
        );
    }

    // Logged-in card (with profile details if available)
    const initial = (me?.name || user?.name || 'User').slice(0, 1).toUpperCase();
    const canView = Boolean(me?.id);

    return (

        <div className="border border-zinc-400 rounded-xl p-4 bg-white">

                <div className="flex  gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        {me?.profile_picture_url ?
                            <Image src={me.profile_picture_url} alt={me.name ?? "Me"} fill className="object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-700">{(me?.name ?? me?.username ?? "?")[0]}</div>
                        }
                    </div>
                    <div className="min-w-0 space-y-1 pb-3 gap-5">
                    <div className="text-md truncate">{me?.name ?? me?.username ?? "My profile"}</div>
                        <div className="text-md text-gray-700 truncate">{me?.email || ''}</div>
                        {me?.title && <div className="text-sm text-gray-700 truncate">{me.title}</div>}
                    {me?.location && <div className="text-md text-gray-700 truncate">{me.location}</div>}
                    
                    </div>
                </div>

            <Separator />
            
                <div className="mt-3 flex gap-2">

                <Link href={me?.id ? `/p/${me.id}` : "/"}
                    
                    className="inline-flex flex-1 items-center justify-center rounded-xl border bg-gray-100 border-zinc-400 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:text-white hover:bg-zinc-400"
                >
                        My Profile
                    </Link>
                <Link href="/dashboard" className="inline-flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                        Edit
                    </Link>
                </div>
                
        </div>

    );
}