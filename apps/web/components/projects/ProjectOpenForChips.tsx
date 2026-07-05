import {
    PROJECT_OPEN_FOR_META,
    normalizeProjectOpenFor,
    type ProjectOpenForValue,
} from "@/lib/project-open-for";

export default function ProjectOpenForChips({
    openFor,
    limit,
    compact = false,
}: {
    openFor?: unknown;
    limit?: number;
    compact?: boolean;
}) {
    const values = normalizeProjectOpenFor(openFor);
    if (!values.length) return null;

    const visible = typeof limit === "number" ? values.slice(0, limit) : values;
    const extra = typeof limit === "number" ? values.length - visible.length : 0;

    return (
        <div className="flex flex-wrap gap-2">
            {visible.map((value: ProjectOpenForValue) => {
                const meta = PROJECT_OPEN_FOR_META[value];
                const Icon = meta.Icon;
                return (
                    <span
                        key={value}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/70 font-semibold text-blue-700 ${
                            compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
                        }`}
                    >
                        <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                        {meta.label}
                    </span>
                );
            })}
            {extra > 0 ? (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    +{extra}
                </span>
            ) : null}
        </div>
    );
}
