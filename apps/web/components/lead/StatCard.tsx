export function StatCard({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-xl border border-zinc-400 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
        </div>
    );
}