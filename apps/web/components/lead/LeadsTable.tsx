import { SourceBadge } from "@/components/ui/SourceBadge";

export function LeadsTable({ leads }: any) {
    return (
        <div className="overflow-hidden rounded-xl border border-zinc-400 bg-white shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="text-left font-medium">Email</th>
                        <th className="text-left font-medium">Message</th>
                        <th className="text-left font-medium">Source</th>
                        <th className="text-left font-medium">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {leads && leads.length > 0 ? (
                        leads.map((lead: any) => (
                            <tr key={lead.id} className="border-t border-zinc-300">
                                <td className="px-4 py-3 font-medium text-zinc-900">{lead.name}</td>
                                <td className="text-zinc-700">{lead.email}</td>
                                <td className="max-w-xs truncate text-zinc-600">{lead.message || "—"}</td>
                                <td><SourceBadge source={lead.source} /></td>
                                <td className="text-zinc-500">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-t border-zinc-300">
                            <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                                No leads yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}