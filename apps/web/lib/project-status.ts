import {
    CheckCircle2,
    CirclePause,
    Flag,
    Rocket,
    Sparkles,
    Wrench,
    type LucideIcon,
} from "lucide-react";

export const PROJECT_STATUS_VALUES = [
    "active",
    "in_development",
    "beta",
    "launched",
    "paused",
    "completed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];

type ProjectStatusMeta = {
    value: ProjectStatus;
    label: string;
    Icon: LucideIcon;
    badgeClassName: string;
};

export const PROJECT_STATUS_META: Record<ProjectStatus, ProjectStatusMeta> = {
    active: {
        value: "active",
        label: "Active",
        Icon: CheckCircle2,
        badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    in_development: {
        value: "in_development",
        label: "In Development",
        Icon: Wrench,
        badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
    },
    beta: {
        value: "beta",
        label: "Beta",
        Icon: Sparkles,
        badgeClassName: "border-indigo-200 bg-indigo-50 text-indigo-700",
    },
    launched: {
        value: "launched",
        label: "Launched",
        Icon: Rocket,
        badgeClassName: "border-cyan-200 bg-cyan-50 text-cyan-700",
    },
    paused: {
        value: "paused",
        label: "Paused",
        Icon: CirclePause,
        badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    },
    completed: {
        value: "completed",
        label: "Completed",
        Icon: Flag,
        badgeClassName: "border-slate-200 bg-slate-50 text-slate-700",
    },
};

export function normalizeProjectStatus(value?: string | null): ProjectStatus | null {
    if (!value) return null;
    const normalized = value.toLowerCase().trim().replace(/[-\s]+/g, "_");
    return PROJECT_STATUS_VALUES.includes(normalized as ProjectStatus)
        ? (normalized as ProjectStatus)
        : null;
}

export function getProjectStatusMeta(value?: string | null) {
    const status = normalizeProjectStatus(value);
    return status ? PROJECT_STATUS_META[status] : null;
}
