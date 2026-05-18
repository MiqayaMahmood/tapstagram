import Image from 'next/image';
import LikeButton from './LikeButton';

export default function MediaCard({ item }: {
    item: { id: string; url: string; username: string; avatar_url: string; liked_by_me: boolean; like_count: number; created_at: string; }
}) {
    return (
        <div className="rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-3 flex items-center gap-2">
                <Image src={item.avatar_url} alt="" width={28} height={28} className="rounded-full" />
                <div className="text-sm font-medium">@{item.username}</div>
                <div className="ml-auto text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</div>
            </div>
            <div className="relative aspect-square bg-zinc-100">
                <Image src={item.url} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" />
            </div>
            <div className="p-3">
                <LikeButton mediaId={item.id} initialLiked={item.liked_by_me} initialCount={item.like_count} />
            </div>
        </div>
    );
}
