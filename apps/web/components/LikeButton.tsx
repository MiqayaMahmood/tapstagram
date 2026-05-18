'use client';
import { useState } from 'react';
import { like, unlike } from '@/lib/api';

export default function LikeButton({ mediaId, initialLiked, initialCount }:
    { mediaId: string; initialLiked: boolean; initialCount: number }) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);

    const toggle = async () => {
        setLiked(v => !v);
        setCount(c => c + (liked ? -1 : 1));
        try {
            liked ? await unlike(mediaId) : await like(mediaId);
        } catch {
            // rollback
            setLiked(v => !v);
            setCount(c => c + (liked ? 1 : -1));
        }
    };

    return (
        <button onClick={toggle} className="flex items-center gap-2" aria-pressed={liked}>
            <span aria-hidden>{liked ? '♥' : '♡'}</span>
            <span className="text-sm">{count}</span>
            <span className="sr-only">{liked ? 'Unlike' : 'Like'}</span>
        </button>
    );
}
