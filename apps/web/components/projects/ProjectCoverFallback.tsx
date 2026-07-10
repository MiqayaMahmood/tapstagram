"use client";

type ProjectCoverFallbackProps = {
    title?: string | null;
    subtitle?: string | null;
    category?: string | null;
    className?: string;
    variant?: "hero" | "card" | "thumbnail" | "tiny";
};

function initials(title?: string | null) {
    return (title || "TS")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export default function ProjectCoverFallback({
    title,
    subtitle,
    category,
    className = "",
    variant = "card",
}: ProjectCoverFallbackProps) {
    const isSmall = variant === "thumbnail" || variant === "tiny";
    const showText = variant !== "tiny";

    return (
        <div
            className={`relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-600 via-blue-800 to-blue-600 text-white ${className}`}
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300/80 via-blue-400/70 to-emerald-300/80" />
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-3xl sm:h-40 sm:w-40" />
            <div className="absolute -bottom-12 left-4 h-32 w-32 rounded-full bg-emerald-300/15 blur-3xl sm:h-44 sm:w-44" />
            <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-white/5" />

            <div className={`relative flex h-full flex-col justify-between ${isSmall ? "p-2.5" : "p-4 sm:p-5"}`}>
                <div className="flex items-start justify-between gap-2">
                    {category && showText ? (
                        <span className="max-w-full truncate rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-blue-50 backdrop-blur">
                            {category}
                        </span>
                    ) : <span />}
                    <div className={`${isSmall ? "h-8 w-8 text-[10px]" : "h-11 w-11 text-sm"} flex shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-bold tracking-widest text-blue-50 backdrop-blur`}>
                        {initials(title)}
                    </div>
                </div>

                {showText ? (
                    <div className="min-w-0">
                        <div className={`${isSmall ? "line-clamp-2 text-xs" : "line-clamp-2 text-lg sm:text-2xl"} font-semibold leading-tight tracking-tight`}>
                            {title || "Tapstagram Project"}
                        </div>
                        {subtitle && !isSmall ? (
                            <p className="mt-2 line-clamp-2 text-sm leading-5 text-blue-50/80">{subtitle}</p>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
