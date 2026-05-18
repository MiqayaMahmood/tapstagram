'use client';
import { useState, useEffect, useRef } from 'react';
import { getFeed, FeedItem } from '@/lib/api';

export function useFeed() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const endReached = useRef(false);

    const loadMore = async () => {
        if (loading || endReached.current) return;
        setLoading(true);
        try {
            const { items: newItems, nextCursor } = await getFeed(cursor ?? undefined);
            setItems((prev) => [...prev, ...newItems]);
            setCursor(nextCursor);
            if (!nextCursor) endReached.current = true;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMore(); }, []); // initial

    return { items, loadMore, loading, hasMore: !endReached.current };
}
