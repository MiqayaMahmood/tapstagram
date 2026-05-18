'use client';
import useSWR from 'swr';
import { myFollows, follow, unfollow } from '@/lib/api';

export function useFollowState() {
    const { data, mutate } = useSWR('me:follows', myFollows, { revalidateOnFocus: false });
    const ids = data?.ids ?? [];
    const isFollowing = (id: string) => ids.includes(id);

    const toggle = async (id: string) => {
        const next = isFollowing(id) ? ids.filter(x => x !== id) : [...ids, id];
        await mutate({ ids: next }, { revalidate: false }); // optimistic
        try {
            isFollowing(id) ? await unfollow(id) : await follow(id);
            mutate(); // background revalidate
        } catch (e) {
            await mutate(); // rollback by revalidate
        }
    };

    return { ids, isFollowing, toggle, ready: !!data };
}
