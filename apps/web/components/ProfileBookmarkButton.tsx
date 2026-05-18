// apps/web/src/components/BookmarkButton.tsx
'use client';
import React, { useEffect, useState } from 'react';
import * as api from '@/services/bookmarks';
import { useAuth } from '@/context/AuthContext';

export default function ProfileBookmarkButton({ profileId }: { profileId: number }) {
    const { token } = useAuth();
    const [on, setOn] = useState(false);
    const refresh = async () => {
        if (!token) return;
        const s = await api.isProfileBookmarked(token, profileId);
        setOn(s.bookmarked);
    };
    useEffect(() => { refresh(); }, [token, profileId]);

    const toggle = async () => {
        if (!token) return;
        if (on) await api.deleteProfileBookmark(token, profileId);
        else await api.createProfileBookmark(token, profileId);
        refresh();
    };

    return (
        <button onClick={toggle} className={`px-3 py-1 rounded ${on ? 'bg-yellow-500' : 'bg-gray-200'}`}>
            {on ? '★ Bookmarked' : '☆ Bookmark'}
        </button>
    );
}
