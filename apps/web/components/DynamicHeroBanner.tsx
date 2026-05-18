"use client";

import { Mail, MapPin, Phone, Sparkles } from "lucide-react";

type BannerTone = {
    bg: string;
    chip: string;
    accent: string;
    textMuted: string;
};

type Props = {
    title: string;
    subtitle?: string | null;
    category?: string | null;
    industry?: string | null;
    country?: string | null;
    city?: string | null;
    phone?: string | null;
    email?: string | null;
    stats?: Array<{ label: string; value: string | number }>;
    compact?: boolean;
};

function pickTone(input?: string | null): BannerTone {
    const key = (input || "").toLowerCase();

    if (key.includes("finance") || key.includes("fintech") || key.includes("bank")) {
        return {
            bg: "bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-600",
            chip: "bg-white/15 text-white border-white/20",
            accent: "bg-emerald-300/20",
            textMuted: "text-emerald-50/85",
        };
    }

    if (key.includes("health") || key.includes("med") || key.includes("care")) {
        return {
            bg: "bg-gradient-to-br from-cyan-900 via-sky-700 to-teal-400",
            chip: "bg-white/15 text-white border-white/20",
            accent: "bg-cyan-300/20",
            textMuted: "text-cyan-50/85",
        };
    }

    if (key.includes("retail") || key.includes("fashion") || key.includes("beauty")) {
        return {
            bg: "bg-gradient-to-br from-fuchsia-900 via-rose-700 to-orange-400",
            chip: "bg-white/15 text-white border-white/20",
            accent: "bg-rose-200/20",
            textMuted: "text-rose-50/85",
        };
    }

    if (key.includes("software") || key.includes("saas") || key.includes("technology") || key.includes("ai")) {
        return {
            bg: "bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-500",
            chip: "bg-white/15 text-white border-white/20",
            accent: "bg-blue-300/20",
            textMuted: "text-blue-50/85",
        };
    }

    if (key.includes("education") || key.includes("learning")) {
        return {
            bg: "bg-gradient-to-br from-violet-900 via-indigo-700 to-sky-400",
            chip: "bg-white/15 text-white border-white/20",
            accent: "bg-violet-200/20",
            textMuted: "text-violet-50/85",
        };
    }

    if (key.includes("food") || key.includes("restaurant") || key.includes("hospitality")) {
        return {
            bg: "bg-gradient-to-br from-amber-900 via-orange-700 to-yellow-400",
            chip: "bg-white/15 text-white border-white/20",
            accent: "bg-amber-200/20",
            textMuted: "text-amber-50/85",
        };
    }

    return {
        bg: "bg-gradient-to-br from-slate-900 via-zinc-800 to-blue-700",
        chip: "bg-white/15 text-white border-white/20",
        accent: "bg-white/10",
        textMuted: "text-white/80",
    };
}

function initialsFromTitle(title: string) {
    return title
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

export default function DynamicHeroBanner({
    title,
    subtitle,
    category,
    industry,
    country,
    city,
    phone,
    email,
    stats = [],
    compact = false,
}: Props) {
    const tone = pickTone(industry || category || country);
    const initials = initialsFromTitle(title);

    return (
        <div
            className={`relative overflow-hidden ${tone.bg} ${compact ? "h-52" : "h-72 md:h-80"
                }`}
        >
            {/* Decorative layers */}
            <div className="absolute inset-0">
                <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${tone.accent}`} />
                <div className={`absolute left-1/4 top-1/3 h-36 w-36 rounded-full blur-3xl ${tone.accent}`} />
                <div className={`absolute -bottom-10 left-10 h-44 w-44 rounded-full blur-3xl ${tone.accent}`} />
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_38%,rgba(255,255,255,0.08))]" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-5 md:p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {category ? (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone.chip}`}>
                                {category}
                            </span>
                        ) : null}
                        {industry ? (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone.chip}`}>
                                {industry}
                            </span>
                        ) : null}
                        {country ? (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone.chip}`}>
                                {country}
                            </span>
                        ) : null}
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sm font-bold tracking-widest backdrop-blur-sm">
                        {initials || "TS"}
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured presentation
                    </div>

                    <h2
                        className={`max-w-3xl font-semibold leading-tight tracking-tight ${compact ? "text-2xl" : "text-3xl md:text-4xl"
                            }`}
                    >
                        {title}
                    </h2>

                    {subtitle ? (
                        <p className={`mt-3 max-w-2xl leading-6 ${compact ? "text-sm" : "text-base"} ${tone.textMuted}`}>
                            {subtitle}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className={`flex flex-wrap gap-3 text-sm ${tone.textMuted}`}>
                        {city || country ? (
                            <div className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{[city, country].filter(Boolean).join(", ")}</span>
                            </div>
                        ) : null}

                        {email ? (
                            <div className="inline-flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{email}</span>
                            </div>
                        ) : null}

                        {phone ? (
                            <div className="inline-flex items-center gap-1.5">
                                <Phone className="h-4 w-4" />
                                <span>{phone}</span>
                            </div>
                        ) : null}
                    </div>

                    {stats.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {stats.slice(0, 3).map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right backdrop-blur-sm"
                                >
                                    <div className="text-xs text-white/70">{s.label}</div>
                                    <div className="text-sm font-semibold text-white">{s.value}</div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}