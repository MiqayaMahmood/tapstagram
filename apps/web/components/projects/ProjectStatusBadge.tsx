import { getProjectStatusMeta } from "@/lib/project-status";

export default function ProjectStatusBadge({
    status,
    compact = false,
    className = "",
}: {
    status?: string | null;
    compact?: boolean;
    className?: string;
}) {
    const meta = getProjectStatusMeta(status);
    if (!meta) return null;

    const Icon = meta.Icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${meta.badgeClassName} ${
                compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } ${className}`}
        >
            <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            {meta.label}
        </span>
    );
}
