export function LeadsFilters() {
    return (
        <div className="flex flex-wrap gap-3">
            <select className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="all">All time</option>
            </select>

            <select className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm">
                <option value="">All sources</option>
                <option value="nfc">NFC</option>
                <option value="web">Web</option>
                <option value="qr">QR</option>
            </select>

            <input
                placeholder="Search name or email"
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm"
            />
        </div>
    );
}