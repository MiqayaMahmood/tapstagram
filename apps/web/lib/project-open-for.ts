import {
    BriefcaseBusiness,
    Building2,
    Code2,
    Handshake,
    Landmark,
    Network,
    Route,
    UserCheck,
    Users,
    Wrench,
    type LucideIcon,
} from "lucide-react";

export const PROJECT_OPEN_FOR_VALUES = [
    "CLIENTS",
    "PARTNERSHIP",
    "INVESTORS",
    "COFOUNDER",
    "TECHNICAL_PARTNER",
    "AGENCIES",
    "DISTRIBUTORS",
    "FREELANCERS",
    "DEVELOPERS",
    "ADVISORS",
] as const;

export type ProjectOpenForValue = (typeof PROJECT_OPEN_FOR_VALUES)[number];

type ProjectOpenForMeta = {
    value: ProjectOpenForValue;
    label: string;
    Icon: LucideIcon;
};

export const PROJECT_OPEN_FOR_META: Record<ProjectOpenForValue, ProjectOpenForMeta> = {
    CLIENTS: { value: "CLIENTS", label: "Clients", Icon: BriefcaseBusiness },
    PARTNERSHIP: { value: "PARTNERSHIP", label: "Partnership", Icon: Handshake },
    INVESTORS: { value: "INVESTORS", label: "Investors", Icon: Landmark },
    COFOUNDER: { value: "COFOUNDER", label: "Co-founder", Icon: Users },
    TECHNICAL_PARTNER: { value: "TECHNICAL_PARTNER", label: "Technical Partner", Icon: Wrench },
    AGENCIES: { value: "AGENCIES", label: "Agencies", Icon: Building2 },
    DISTRIBUTORS: { value: "DISTRIBUTORS", label: "Distributors", Icon: Route },
    FREELANCERS: { value: "FREELANCERS", label: "Freelancers", Icon: UserCheck },
    DEVELOPERS: { value: "DEVELOPERS", label: "Developers", Icon: Code2 },
    ADVISORS: { value: "ADVISORS", label: "Advisors", Icon: Network },
};

export function normalizeOpenForValue(value?: string | null): ProjectOpenForValue | null {
    if (!value) return null;
    const normalized = value.toUpperCase().trim().replace(/[-\s]+/g, "_");
    return PROJECT_OPEN_FOR_VALUES.includes(normalized as ProjectOpenForValue)
        ? (normalized as ProjectOpenForValue)
        : null;
}

export function normalizeProjectOpenFor(input: unknown): ProjectOpenForValue[] {
    if (!Array.isArray(input)) return [];

    const values = input
        .map((item) => {
            if (typeof item === "string") return normalizeOpenForValue(item);
            if (item && typeof item === "object") {
                const row = item as Record<string, unknown>;
                return normalizeOpenForValue(
                    String(row.value ?? row.type ?? row.openFor ?? row.key ?? "")
                );
            }
            return null;
        })
        .filter(Boolean) as ProjectOpenForValue[];

    return Array.from(new Set(values));
}
