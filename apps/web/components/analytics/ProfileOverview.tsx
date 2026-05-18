// apps/web/components/analytics/ProfileOverview.tsx
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

export default async function ProfileOverview({ profileId, from, to }: { profileId: number; from?: string; to?: string }) {
    const url = new URL(`${API_BASE}/analytics/profile/${profileId}/overview`);
    if (from) url.searchParams.set("from", from);
    if (to) url.searchParams.set("to", to);
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    const data = await res.json();

    return (
        <div className="border rounded-2xl p-4 space-y-2">
            <div className="text-sm text-neutral-600">
                {data.range?.from} → {data.range?.to}
            </div>
            <div className="flex gap-6">
                <Stat label="Total views" value={data?.totals?.totalViews ?? 0} />
                <Stat label="Unique views" value={data?.totals?.uniqueViews ?? 0} />
            </div>
            <div className="text-sm mt-2">
                <div className="font-medium mb-1">Top referrers</div>
                <ul className="list-disc pl-5">
                    {(data?.topReferrers ?? []).map((r: any) => (
                        <li key={r.host}>{r.host} — {r.count}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-neutral-500">{label}</span>
            <span className="text-xl font-semibold">{value}</span>
        </div>
    );
}
