"use client";

import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";

function hasStoredProfile(user: any) {
    return Boolean(user?.profileId || user?.profile?.id);
}

export default function MarketingCard() {
    const { token, user, loading } = useAuth();

    if (loading) return null;

    if (token && hasStoredProfile(user)) {
        return null;
    }

    if (token) {
        return (
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5">
                <div className="text-base font-semibold text-slate-950">Complete your Tapstagram profile</div>
                <p className="mt-1 text-sm leading-6 text-slate-600">Add your profile details to improve visibility.</p>
                <Link href="/dashboard" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
                    <span>Complete profile</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5">
            <div className="text-base font-semibold text-slate-950">Are you not on Tapstagram?</div>
            <p className="mt-1 text-sm leading-6 text-slate-600">Create and share your profile with the world.</p>
            <Link href="/register" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
                <span>Create your profile</span>
            </Link>
        </div>
    );
}
