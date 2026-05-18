// apps/web/src/components/FollowButton.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

type Props = {
    projectId: number;
    initialFollowing?: boolean; // 👈 allow passing initial state
};

export default function ProjectBookmarkButton({ projectId, initialFollowing }: Props) {
    const { token } = useAuth();
    const [on, setOn] = useState<boolean>(!!initialFollowing);
    const [loading, setLoading] = useState(false);

    const headers = (t?: string) => ({
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
    });

    // If token changes (login/logout), refresh following status
    useEffect(() => {
        if (!token) { setOn(!!initialFollowing); return; }
        let cancelled = false;
        (async () => {
            try {
                const r = await fetch(`${API_URL}/projectFollows/check/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store',
                });
                const j = await r.json();
                if (!cancelled) setOn(!!j.following);
            } catch {/* ignore */ }
        })();
        return () => { cancelled = true; };
    }, [token, projectId, initialFollowing]);

    const toggle = async () => {
        if (!token || loading) return;
        setLoading(true);
        try {
            const method = on ? 'DELETE' : 'POST';
            await fetch(`${API_URL}/projectFollows/${projectId}`, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });
            setOn(!on);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            onClick={toggle}
            disabled={!token || loading}
            className={`px-3 py-1 rounded ${on ? 'bg-blue-600 text-white' : 'border'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
            {on ? 'Following' : 'Follow'}
        </button>
    );

}
