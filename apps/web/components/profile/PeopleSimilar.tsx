const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default async function PeopleSimilar({ profileId }: { profileId: number }) {
    const res = await fetch(`${API_BASE}/profiles/${profileId}/recommendations?limit=8`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const data = await res.json();
    const items = (data?.items ?? []) as Array<{
        id: number; username?: string | null; name?: string | null; title?: string | null;
        location?: string | null; profile_picture_url?: string | null; followersCount?: number; score?: number;
    }>;
    if (!items.length) return null;

    return (
        <div className="space-y-2 mt-6">
            <div className="text-lg font-semibold">People similar to this profile</div>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {items.map((p) => (
                    <a key={p.id} href={p.username ? `/${p.username}` : `/p/${p.id}`} className="border rounded-2xl p-3 flex gap-3 hover:shadow bg-white">
                        <img src={p.profile_picture_url || "/default-avatar.png"} className="w-12 h-12 rounded-full object-cover" alt="" />
                        <div className="min-w-0">
                            <div className="font-medium truncate">{p.name}</div>
                            <div className="text-sm text-neutral-600 truncate">{p.title}</div>
                            <div className="text-xs text-neutral-500">
                                {p.followersCount ?? 0} followers · {p.score ?? 0} shared interests
                            </div>
                        </div>
                    </a>
                ))}
            </ul>
        </div>
    );
}
