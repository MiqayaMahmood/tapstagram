export function VisibilityScoreCard({ data }: any) {
    return (
        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Visibility Score</p>

            <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-semibold tracking-tight text-zinc-900">
                    {data?.score || 0}
                </span>
                <span className="pb-1 text-zinc-500">/ 100</span>
            </div>

            <div className="mt-4 space-y-2 text-sm leading-6 text-zinc-900">
                {(data?.suggestions || []).map((s: string, i: number) => (
                    <div key={i}>• {s}</div>
                ))}
            </div>
        </div>
    );
}