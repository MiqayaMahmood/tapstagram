"use client";

import ProjectSocialLinks from "@/components/projects/ProjectSocialLinks";
import HeroBannerCropper from "@/components/profile/HeroBannerCropper";
import Link from "next/link";
import { ArrowLeft, BarChart3, CalendarDays, CheckCircle2, CircleDot, ExternalLink, FileText, Handshake, Link2, ListChecks, MapPinned, MousePointerClick, Package, PenSquare, Plus, Quote, Save, Sparkles, Star, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Path } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import PremiumPresentationCard from '@/components/presentation/PremiumPresentationCard';

import {
    useForm,
    type SubmitHandler,
    type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    ProjectUpsertSchema,
    ProjectCategoryEnum,
    type ProjectFormValues,
    ProjectSocialLinkSchema,
} from "@/lib/projects";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/checkbox";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import { PROJECT_STATUS_META, PROJECT_STATUS_VALUES } from "@/lib/project-status";
import {
    PROJECT_OPEN_FOR_META,
    PROJECT_OPEN_FOR_VALUES,
    normalizeProjectOpenFor,
} from "@/lib/project-open-for";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ---------- helpers ---------- */

const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const dateInputValue = (value?: string | Date | null) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

/* ---------- section schemas ---------- */

const BasicSchema = ProjectUpsertSchema.pick({
    profileId: true,
    title: true,
    slug: true,
    category: true,
    targetIndustry: true,
    startedOn: true,
    isPublished: true,
    url: true,
    plan: true,
});

type BasicValues = z.infer<typeof BasicSchema>;

const StorySchema = ProjectUpsertSchema.pick({
    bio: true,
    longDescription: true,
});
type StoryValues = z.infer<typeof StorySchema>;

const CoverImageUrlSchema = ProjectUpsertSchema.pick({
    coverImageUrl: true,
});
type CoverImageUrlValues = z.infer<typeof CoverImageUrlSchema>;

const ContactSchema = ProjectUpsertSchema.pick({
    website: true,
    contactEmail: true,
    contactPhone: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    region: true,
    postalCode: true,
    country: true,
    locationLat: true,
    locationLng: true,
});
type ContactValues = z.infer<typeof ContactSchema>;

const SocialLinkInputSchema = z.object({
    platform: ProjectSocialLinkSchema.shape.platform,
    url: ProjectSocialLinkSchema.shape.url,
});

/* ---------- props ---------- */

type Props = {
    mode: "create" | "edit";
    initial?: Partial<ProjectFormValues> & {
        id?: number;
        status?: string | null;
        openFor?: unknown;
        collaborationNote?: string | null;
        packages?: ProjectPackageFormValue[];
        scope?: ProjectScopeFormValue | null;
        milestones?: ProjectMilestoneFormValue[];
    };
};

type ProjectMilestoneFormValue = {
    id?: number;
    type: string;
    title: string;
    description?: string | null;
    date: string | Date;
    completed?: boolean;
    sortOrder?: number | null;
};

type ProjectPackageFormValue = {
    id?: number;
    name: string;
    description?: string | null;
    price?: string | null;
    timeline?: string | null;
    deliverablesText?: string | null;
    ctaLabel?: string | null;
    ctaLink?: string | null;
    isFeatured?: boolean;
    sortOrder?: number | null;
};

type ProjectScopeFormValue = {
    includedText?: string | null;
    excludedText?: string | null;
    toolsText?: string | null;
    timeline?: string | null;
};

const emptyPackage: ProjectPackageFormValue = {
    name: "",
    description: "",
    price: "",
    timeline: "",
    deliverablesText: "",
    ctaLabel: "",
    ctaLink: "",
    isFeatured: false,
    sortOrder: 0,
};

const MILESTONE_TYPES = [
    "FOUNDED",
    "PROTOTYPE",
    "MVP",
    "BETA",
    "LAUNCHED",
    "FIRST_CLIENT",
    "100_USERS",
    "1000_USERS",
    "FUNDING",
    "PARTNERSHIP",
    "EXPANSION",
    "VERSION_RELEASE",
    "AWARD",
    "OTHER",
] as const;

const emptyMilestone: ProjectMilestoneFormValue = {
    type: "FOUNDED",
    title: "",
    description: "",
    date: "",
    completed: true,
    sortOrder: 0,
};

function getProjectCompletion(input: {
    title?: unknown;
    category?: unknown;
    bio?: unknown;
    longDescription?: unknown;
    coverImageUrl?: unknown;
    website?: unknown;
    contactEmail?: unknown;
    contactPhone?: unknown;
    city?: unknown;
    country?: unknown;
    socialLinks?: unknown[];
    status?: unknown;
    openFor?: unknown;
    packages?: unknown[];
    scope?: ProjectScopeFormValue | null;
    milestones?: unknown[];
}) {
    const openForValues = normalizeProjectOpenFor(input.openFor);
    const checks = [
        { done: !!input.title, label: "Add project name" },
        { done: !!input.category, label: "Select category" },
        { done: !!input.bio, label: "Add short bio" },
        { done: !!input.longDescription, label: "Add story" },
        { done: !!input.coverImageUrl, label: "Upload cover image" },
        { done: !!input.website, label: "Add website" },
        { done: !!(input.contactEmail || input.contactPhone), label: "Add contact info" },
        { done: !!(input.country || input.city), label: "Add location" },
        { done: !!input.socialLinks?.length, label: "Add social links" },
        { done: !!input.status, label: "Set project status" },
        { done: openForValues.length > 0, label: "Add Open For tags" },
        { done: !!input.packages?.length, label: "Add service package" },
        {
            done: !!(input.scope?.includedText || input.scope?.excludedText || input.scope?.toolsText || input.scope?.timeline),
            label: "Add scope details",
        },
        { done: !!input.milestones?.length, label: "Add project milestones" },
    ];
    const done = checks.filter((item) => item.done).length;
    return {
        score: Math.round((done / checks.length) * 100),
        missing: checks.filter((item) => !item.done).map((item) => item.label),
    };
}

/* ---------- small UI helpers ---------- */

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs font-medium text-red-600">{message}</p>;
}

function SectionHeader({
    icon,
    title,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 ring-1 ring-blue-100">
                {icon}
            </div>
            <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-tight text-slate-950 sm:text-lg">{title}</h2>
                {subtitle && <p className="text-sm leading-6 text-zinc-500">{subtitle}</p>}
            </div>
        </div>
    );
}

function FormCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Card className={`rounded-3xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-950/5 ${className}`}>
            {children}
        </Card>
    );
}

function RailLink({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        <a
            href={href}
            className="block rounded-2xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
        >
            {label}
        </a>
    );
}

function ProjectHealthCard({
    completion,
}: {
    completion: { score: number; missing: string[] };
}) {
    const suggestions = completion.missing.slice(0, 5);
    return (
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/40 p-4 shadow-sm shadow-blue-950/5 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-slate-950">
                            Project health: {completion.score}%
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Strong project pages include a story, media, contact details, offers, and proof.
                        </p>
                    </div>
                </div>
                <div className="text-sm font-semibold text-blue-700">{completion.score >= 80 ? "Business-ready" : "Improve profile"}</div>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-blue-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 transition-all"
                    style={{ width: `${completion.score}%` }}
                />
            </div>

            {suggestions.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                        <span key={item} className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-emerald-700">Project essentials are complete.</p>
            )}
        </div>
    );
}

/* ---------- component ---------- */

export default function ProjectForm({ mode, initial }: Props) {
    const router = useRouter();
    const { token } = useAuth();
    const [projectId, setProjectId] = useState<number | undefined>(initial?.id);
    const [packages, setPackages] = useState<ProjectPackageFormValue[]>(initial?.packages ?? []);
    const [packageDraft, setPackageDraft] = useState<ProjectPackageFormValue>(emptyPackage);
    const [scopeDraft, setScopeDraft] = useState<ProjectScopeFormValue>({
        includedText: initial?.scope?.includedText ?? "",
        excludedText: initial?.scope?.excludedText ?? "",
        toolsText: initial?.scope?.toolsText ?? "",
        timeline: initial?.scope?.timeline ?? "",
    });
    const [milestones, setMilestones] = useState<ProjectMilestoneFormValue[]>(initial?.milestones ?? []);
    const [milestoneDraft, setMilestoneDraft] = useState<ProjectMilestoneFormValue>(emptyMilestone);
    const [savingPackage, setSavingPackage] = useState(false);
    const [savingScope, setSavingScope] = useState(false);
    const [savingMilestone, setSavingMilestone] = useState(false);

    /* ===== BASIC ===== */
    const basic = useForm<BasicValues>({
        resolver: zodResolver(BasicSchema),
        defaultValues: {
            profileId: initial?.profileId!,
            title: initial?.title ?? "",
            slug: initial?.slug ?? "",
            category: (initial?.category as any) ?? null,
            targetIndustry: initial?.targetIndustry ?? "",
            startedOn: initial?.startedOn ? new Date(initial.startedOn as any) : undefined,
            isPublished: initial?.isPublished ?? false,
            url: initial?.url ?? "",
            plan: initial?.plan ?? "",
        },
    });

    const searchParams = useSearchParams();

    const onBack = () => {
        router.back();
    };

    useEffect(() => {
        const qsProjectId = Number(searchParams.get("projectId") ?? searchParams.get("id") ?? "");
        if (!projectId && Number.isFinite(qsProjectId)) setProjectId(qsProjectId);

        const qsProfileId = Number(searchParams.get("profileId") ?? "");
        const currentProfileId = basic.getValues("profileId");
        if ((!currentProfileId || !Number.isFinite(currentProfileId as any)) && Number.isFinite(qsProfileId)) {
            basic.setValue("profileId", qsProfileId as any, { shouldDirty: false });
        }
    }, [searchParams, projectId, basic]);

    useEffect(() => {
        const sub = basic.watch((values, { name }) => {
            if (name === "title") {
                const currentSlug = basic.getValues("slug");
                if (!currentSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentSlug)) {
                    const next = slugify(values.title ?? "");
                    basic.setValue("slug", next, { shouldValidate: true });
                }
            }
        });
        return () => sub.unsubscribe();
    }, [basic]);

    function focusFirstError<T extends Record<string, unknown>>(
        errs: Record<string, any>,
        setFocus: (name: Path<T>) => void
    ) {
        const first = Object.keys(errs)[0] as Path<T> | undefined;
        if (first) setFocus(first);
    }

    const saveBasic: SubmitHandler<BasicValues> = async (values) => {
        const payload = { ...values, category: values.category ?? null } as BasicValues;

        const url = projectId
            ? `${API_BASE}/projects/${projectId}/basic`
            : `${API_BASE}/projects`;

        const method = projectId ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not save Basic");
            return;
        }

        const data = await res.json().catch(() => ({}));
        if (!projectId) setProjectId(data?.id);
        toast.success(projectId ? "Basic updated" : "Project created");
    };

    const onInvalidBasic: SubmitErrorHandler<BasicValues> = (errs) => {
        focusFirstError<BasicValues>(errs, basic.setFocus);
        toast.error("Please fix the highlighted fields in Basic.");
    };

    /* ===== STORY ===== */
    const coverImage = useForm<CoverImageUrlValues>({
        resolver: zodResolver(CoverImageUrlSchema),
        defaultValues: {
            coverImageUrl: initial?.coverImageUrl ?? "",
        },
    });

    const story = useForm<StoryValues>({
        resolver: zodResolver(StorySchema),
        defaultValues: {
            bio: initial?.bio ?? "",
            longDescription: initial?.longDescription ?? "",
        },
    });

    const saveStory: SubmitHandler<StoryValues> = async (values) => {
        if (!projectId) {
            toast.info("Save Basic first to create the project.");
            return;
        }
        const res = await fetch(`${API_BASE}/projects/${projectId}/story`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not save Story");
            return;
        }
        toast.success("Story saved");
    };

    const onInvalidStory: SubmitErrorHandler<StoryValues> = (errs) => {
        focusFirstError<StoryValues>(errs, story.setFocus);
        toast.error("Please fix the highlighted fields in Story.");
    };

    /* ===== CONTACT ===== */
    const contact = useForm<ContactValues>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            website: initial?.website ?? "",
            contactEmail: initial?.contactEmail ?? "",
            contactPhone: initial?.contactPhone ?? "",
            addressLine1: initial?.addressLine1 ?? "",
            addressLine2: initial?.addressLine2 ?? "",
            city: initial?.city ?? "",
            region: initial?.region ?? "",
            postalCode: initial?.postalCode ?? "",
            country: initial?.country ?? "",
            locationLat: initial?.locationLat ?? undefined,
            locationLng: initial?.locationLng ?? undefined,
        },
    });

    const saveContact: SubmitHandler<ContactValues> = async (values) => {
        if (!projectId) {
            toast.info("Save Basic first to create the project.");
            return;
        }
        const res = await fetch(`${API_BASE}/projects/${projectId}/contact`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not save Address & Contact");
            return;
        }
        toast.success("Address & Contact saved");
    };

    const onInvalidContact: SubmitErrorHandler<ContactValues> = (errs) => {
        focusFirstError<ContactValues>(errs, contact.setFocus);
        toast.error("Please fix the highlighted fields in Address & Contact.");
    };

    /* ===== SOCIAL LINKS ===== */
    const [addingPlatform, setAddingPlatform] = useState("WEBSITE");
    const [addingUrl, setAddingUrl] = useState("");

    const canUseSocial = !!projectId;

    async function addSocialLink() {
        if (!projectId) {
            toast.info("Save Basic info first to create the project.");
            return;
        }
        const parsed = SocialLinkInputSchema.safeParse({
            platform: addingPlatform,
            url: addingUrl.trim(),
        });
        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Invalid social link";
            toast.error(msg);
            return;
        }

        const resGet = await fetch(`${API_BASE}/projects/${projectId}/social-links`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
        });
        const proj = await resGet.json().catch(() => ({} as ProjectFormValues));
        const next = [...(proj.socialLinks ?? []), parsed.data];

        const res = await fetch(`${API_BASE}/projects/${projectId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ socialLinks: next }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not add social link");
            return;
        }

        setAddingUrl("");
        toast.success("Link added");
        router.refresh();
    }

    const onDelete = async () => {
        if (!projectId) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this project?\nThis action cannot be undone."
        );

        if (!confirmed) return;

        const res = await fetch(`${API_BASE}/projects/${projectId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(projectId),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not delete the Business");
            return;
        }
        toast.success("Project deleted");
        router.refresh();
    };

    async function savePackage(pkg: ProjectPackageFormValue) {
        if (!projectId) {
            toast.info("Save Basic first to create the project.");
            return;
        }
        if (!pkg.name.trim()) {
            toast.error("Package name is required.");
            return;
        }

        setSavingPackage(true);
        try {
            const isUpdate = !!pkg.id;
            const res = await fetch(
                `${API_BASE}/projects/${projectId}/packages${isUpdate ? `/${pkg.id}` : ""}`,
                {
                    method: isUpdate ? "PATCH" : "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        name: pkg.name,
                        description: pkg.description ?? "",
                        price: pkg.price ?? "",
                        timeline: pkg.timeline ?? "",
                        deliverablesText: pkg.deliverablesText ?? "",
                        ctaLabel: pkg.ctaLabel ?? "",
                        ctaLink: pkg.ctaLink ?? "",
                        isFeatured: !!pkg.isFeatured,
                        sortOrder: Number(pkg.sortOrder ?? 0),
                    }),
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err?.message ?? "Could not save package");
                return;
            }

            const saved = await res.json();
            setPackages((current) =>
                isUpdate
                    ? current.map((item) => (item.id === saved.id ? saved : item))
                    : [...current, saved].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
            );
            if (!isUpdate) setPackageDraft(emptyPackage);
            toast.success(isUpdate ? "Package updated" : "Package added");
        } finally {
            setSavingPackage(false);
        }
    }

    async function deletePackage(packageId?: number) {
        if (!projectId || !packageId) return;
        const confirmed = window.confirm("Delete this package?");
        if (!confirmed) return;

        const res = await fetch(`${API_BASE}/projects/${projectId}/packages/${packageId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not delete package");
            return;
        }

        setPackages((current) => current.filter((item) => item.id !== packageId));
        toast.success("Package deleted");
    }

    async function saveScope() {
        if (!projectId) {
            toast.info("Save Basic first to create the project.");
            return;
        }

        setSavingScope(true);
        try {
            const res = await fetch(`${API_BASE}/projects/${projectId}/scope`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(scopeDraft),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err?.message ?? "Could not save scope");
                return;
            }

            const saved = await res.json();
            setScopeDraft({
                includedText: saved.includedText ?? "",
                excludedText: saved.excludedText ?? "",
                toolsText: saved.toolsText ?? "",
                timeline: saved.timeline ?? "",
            });
            toast.success("Scope saved");
        } finally {
            setSavingScope(false);
        }
    }

    async function saveMilestone(milestone: ProjectMilestoneFormValue) {
        if (!projectId) {
            toast.info("Save Basic first to create the project.");
            return;
        }
        if (!milestone.title.trim() || !milestone.date) {
            toast.error("Milestone title and date are required.");
            return;
        }

        setSavingMilestone(true);
        try {
            const isUpdate = !!milestone.id;
            const res = await fetch(`${API_BASE}/projects/${projectId}/milestones${isUpdate ? `/${milestone.id}` : ""}`, {
                method: isUpdate ? "PATCH" : "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    type: milestone.type || "OTHER",
                    title: milestone.title,
                    description: milestone.description ?? "",
                    date: milestone.date,
                    completed: !!milestone.completed,
                    sortOrder: Number(milestone.sortOrder ?? 0),
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err?.message ?? "Could not save milestone");
                return;
            }

            const saved = await res.json();
            setMilestones((current) =>
                (isUpdate
                    ? current.map((item) => (item.id === saved.id ? saved : item))
                    : [...current, saved]
                ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
            );
            if (!isUpdate) setMilestoneDraft(emptyMilestone);
            toast.success(isUpdate ? "Milestone updated" : "Milestone added");
        } finally {
            setSavingMilestone(false);
        }
    }

    async function deleteMilestone(milestoneId?: number) {
        if (!projectId || !milestoneId) return;
        const confirmed = window.confirm("Delete this milestone?");
        if (!confirmed) return;

        const res = await fetch(`${API_BASE}/projects/${projectId}/milestones/${milestoneId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not delete milestone");
            return;
        }

        setMilestones((current) => current.filter((item) => item.id !== milestoneId));
        toast.success("Milestone deleted");
    }

    const basicErrors = basic.formState.errors;
    const storyErrors = story.formState.errors;
    const contactErrors = contact.formState.errors;

    const progress = useMemo(() => {
        const steps = [
            !!basic.watch("title"),
            !!basic.watch("slug"),
            !!basic.watch("category"),
            !!story.watch("bio"),
            !!story.watch("longDescription"),
            !!contact.watch("contactEmail") || !!contact.watch("contactPhone"),
            !!contact.watch("country"),
            !!projectId,
        ];
        const completed = steps.filter(Boolean).length;
        return Math.round((completed / steps.length) * 100);
    }, [
        basic.watch("title"),
        basic.watch("slug"),
        basic.watch("category"),
        story.watch("bio"),
        story.watch("longDescription"),
        contact.watch("contactEmail"),
        contact.watch("contactPhone"),
        contact.watch("country"),
        projectId,
    ]);

    const projectCompletion = useMemo(() => getProjectCompletion({
        title: basic.watch("title"),
        category: basic.watch("category"),
        bio: story.watch("bio"),
        longDescription: story.watch("longDescription"),
        coverImageUrl: coverImage.watch("coverImageUrl") || initial?.coverImageUrl,
        website: contact.watch("website"),
        contactEmail: contact.watch("contactEmail"),
        contactPhone: contact.watch("contactPhone"),
        city: contact.watch("city"),
        country: contact.watch("country"),
        socialLinks: initial?.socialLinks ?? [],
        status: initial?.status,
        openFor: initial?.openFor,
        packages,
        scope: scopeDraft,
        milestones,
    }), [
        basic.watch("title"),
        basic.watch("category"),
        story.watch("bio"),
        story.watch("longDescription"),
        coverImage.watch("coverImageUrl"),
        contact.watch("website"),
        contact.watch("contactEmail"),
        contact.watch("contactPhone"),
        contact.watch("city"),
        contact.watch("country"),
        initial?.coverImageUrl,
        initial?.socialLinks,
        initial?.status,
        initial?.openFor,
        packages,
        scopeDraft,
        milestones,
    ]);

    return (
        <div className="min-h-screen py-4 sm:py-6">
            <div className="mx-auto mb-3 max-w-7xl rounded-3xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm shadow-slate-950/5 backdrop-blur sm:px-5 sm:py-6">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-zinc-600">
                            <Sparkles className="h-3.5 w-3.5" />
                            {projectId ? "Editing existing project" : "New project setup"}
                        </div>

                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
                            {projectId ? "Edit Project" : "Create Your Project"}
                        </h1>

                        <p className="max-w-3xl text-sm md:text-base leading-7 text-zinc-500">
                            Set up your business or project presence with strong media, a clean story, contact details, and social links.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="rounded-2xl border-zinc-200 px-5"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </div>
                </div>
            </div>

                <div className="grid gap-4 lg:grid-cols-[270px,minmax(0,1fr),310px]">
                    {/* Left rail */}
                    <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-950/5">
                            <div className="text-base font-bold text-slate-800 sm:text-lg">
                                Editor Navigation
                            </div>

                            <nav className="mt-4 flex flex-col gap-1">
                                <RailLink href="#media" label="Media" />
                                <RailLink href="#basic" label="Basics" />
                                <RailLink href="#story" label="Story" />
                                <RailLink href="#collaboration" label="Status & Open For" />
                                <RailLink href="#conversion" label="Conversion Toolkit" />
                                <RailLink href="#trust" label="Trust Builder" />
                                <RailLink href="#packages-scope" label="Packages & Scope" />
                                <RailLink href="#journey" label="Project Journey" />
                                <RailLink href="#contact" label="Address & Contact" />
                                <RailLink href="#links" label="Social Links" />
                                <RailLink href="#add-links" label="Add Social Link" />
                            </nav>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-950/5">
                            <div className="text-base font-bold text-slate-800 sm:text-lg">
                                Project Status
                            </div>

                            <div className="mt-4 space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-medium text-zinc-700">Completion</span>
                                        <span className="font-semibold text-zinc-900">{progress}%</span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-zinc-700">
                                        {projectId ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <CircleDot className="h-4 w-4 text-zinc-400" />}
                                        <span>{projectId ? "Project record created" : "Create Basic first"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-zinc-700">
                                        {basic.watch("isPublished") ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <CircleDot className="h-4 w-4 text-zinc-400" />}
                                        <span>{basic.watch("isPublished") ? "Published" : "Draft mode"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-sm shadow-slate-950/5">
                            <Button
                                onClick={onDelete}
                                disabled={!projectId}
                                variant="destructive"
                                className="w-full rounded-xl"
                            >
                                Delete Project
                            </Button>
                    </div>
                    <PremiumPresentationCard
                        isPremium={(initial?.plan || "").toLowerCase() === "premium"}
                        href={projectId ? `/dashboard/projects/${projectId}/presentation` : "#"}
                        title="Premium Project Presentation"
                        description="Design a richer project page with hero sections, image-text layouts, product or service catalog blocks, and stronger calls to action."
                    />
                    </aside>

                    {/* Main */}
                    <div className="grid gap-2">
                        <ProjectHealthCard completion={projectCompletion} />

                        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50/50 p-4 shadow-sm shadow-blue-950/5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <UserRound className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-950">Creator profile visibility</h2>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Your creator profile is shown on public project pages. Update your profile to improve trust.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                    Update profile
                                </Link>
                            </div>
                        </div>

                        {/* Media */}
                        <fieldset disabled={!projectId} className={!projectId ? "opacity-60 pointer-events-none" : ""}>
                            <div id="media">
                                <FormCard>
                                    <CardHeader className="pb-3">
                                        <SectionHeader
                                            icon={<ExternalLink className="h-5 w-5" />}
                                            title="Project media"
                                            subtitle="Upload a strong visual cover that helps your project stand out in listings and previews."
                                        />
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="overflow-hidden rounded-xl border border-zinc-400 bg-zinc-50 p-2">
                                            <HeroBannerCropper
                                                initialUrl={initial?.coverImageUrl ?? undefined}
                                                initMode="project"
                                                entityId={projectId}
                                            />
                                        </div>

                                        <p className="text-sm leading-6 text-zinc-500">
                                            Recommended size: 1500×500. Use a clean banner that represents the business, product, or service.
                                        </p>
                                    </CardContent>
                                </FormCard>
                            </div>
                        </fieldset>

                        {/* Basic */}
                        <form id="basic" onSubmit={basic.handleSubmit(saveBasic, onInvalidBasic)}>
                            <input type="hidden" {...basic.register("profileId", { valueAsNumber: true })} />

                            <FormCard>
                                <CardHeader className="pb-3">
                                    <SectionHeader
                                        icon={<PenSquare className="h-5 w-5" />}
                                        title="Basic details"
                                        subtitle="Define the core identity, category, URL, and publishing status of the project."
                                    />
                                </CardHeader>

                                <CardContent className="grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="title" className="text-sm font-semibold text-zinc-800">
                                            Project name
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Acme Robotics"
                                            className="h-12 rounded-2xl text-base"
                                            {...basic.register("title")}
                                        />
                                        <FieldError message={basicErrors.title?.message as string | undefined} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="slug" className="text-sm font-semibold text-zinc-800">
                                            Slug / Tag
                                        </Label>
                                        <Input
                                            id="slug"
                                            placeholder="acme-robotics"
                                            className="h-12 rounded-2xl text-base"
                                            {...basic.register("slug")}
                                        />
                                        <FieldError message={basicErrors.slug?.message as string | undefined} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-semibold text-zinc-800">Category</Label>
                                        <Select
                                            value={basic.watch("category") ?? ""}
                                            onValueChange={(v) =>
                                                basic.setValue("category", v ? (v as any) : null, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="h-12 rounded-2xl text-base">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ProjectCategoryEnum.options.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>
                                                        {opt}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="">(none)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={basicErrors.category?.message as string | undefined} />
                                    </div>

                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="targetIndustry" className="text-sm font-semibold text-zinc-800">
                                            Target industry
                                        </Label>
                                        <Input
                                            id="targetIndustry"
                                            placeholder="Healthcare, Retail, SaaS, Manufacturing..."
                                            className="h-12 rounded-2xl text-base"
                                            {...basic.register("targetIndustry")}
                                        />
                                        <FieldError message={basicErrors.targetIndustry?.message as string | undefined} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="startedOn" className="text-sm font-semibold text-zinc-800">
                                            Started on
                                        </Label>
                                        <Input
                                            id="startedOn"
                                            type="date"
                                            className="h-12 rounded-2xl text-base"
                                            value={
                                                basic.watch("startedOn")
                                                    ? new Date(basic.watch("startedOn") as any).toISOString().slice(0, 10)
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                basic.setValue(
                                                    "startedOn",
                                                    e.target.value ? (new Date(e.target.value) as any) : undefined,
                                                    {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                    }
                                                )
                                            }
                                        />
                                        <FieldError message={basicErrors.startedOn?.message as string | undefined} />
                                    </div>

                                    <div className="flex items-center rounded-xl border border-zinc-400 bg-zinc-50 px-4 py-3 mt-7">
                                        <Checkbox
                                            id="isPublished"
                                            checked={!!basic.watch("isPublished")}
                                            onCheckedChange={(v) =>
                                                basic.setValue("isPublished", !!v, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                })
                                            }
                                        />
                                        <Label htmlFor="isPublished" className="ml-3 text-sm font-medium text-zinc-800">
                                            Published
                                        </Label>
                                    </div>

                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="url" className="text-sm font-semibold text-zinc-800">
                                            Primary URL
                                        </Label>
                                        <Input
                                            id="url"
                                            placeholder="https://your-project.com"
                                            className="h-12 rounded-2xl text-base"
                                            {...basic.register("url")}
                                        />
                                        <FieldError message={basicErrors.url?.message as string | undefined} />
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-end gap-3 border-t border-zinc-400 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/dashboard/projects")}
                                        className="rounded-2xl px-5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={basic.formState.isSubmitting}
                                        className="rounded-2xl px-5"
                                    >
                                        {projectId ? "Save Basic" : "Create Project"}
                                    </Button>
                                </CardFooter>
                            </FormCard>
                        </form>

                        <section id="collaboration">
                            <FormCard>
                                <CardHeader className="pb-3">
                                    <SectionHeader
                                        icon={<Handshake className="h-5 w-5" />}
                                        title="Status & Open For"
                                        subtitle="Sprint 1 display fields are prepared here. Saving requires backend support for Project.status, collaborationNote, and Open For records."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {/* TODO(Sprint 1 backend): Enable these inputs once Project.status, collaborationNote, and ProjectOpenFor/openFor are exposed by the API. */}
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-800">
                                        Project status and Open For are not present in the current Prisma Project model/API payload. The UI below is read-only until backend support is available.
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="grid gap-2">
                                            <span className="text-sm font-semibold text-slate-800">Project status</span>
                                            <select
                                                disabled
                                                value={initial?.status ?? ""}
                                                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600"
                                                onChange={() => undefined}
                                            >
                                                <option value="">No status available</option>
                                                {PROJECT_STATUS_VALUES.map((status) => (
                                                    <option key={status} value={status}>
                                                        {PROJECT_STATUS_META[status].label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="grid gap-2">
                                            <span className="text-sm font-semibold text-slate-800">Collaboration note</span>
                                            <textarea
                                                disabled
                                                rows={3}
                                                value={initial?.collaborationNote ?? ""}
                                                placeholder="Add a short note about what you are open to."
                                                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                                                onChange={() => undefined}
                                            />
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-slate-800">Open For</div>
                                        <div className="flex flex-wrap gap-2">
                                            {PROJECT_OPEN_FOR_VALUES.map((value) => {
                                                const selected = normalizeProjectOpenFor(initial?.openFor).includes(value);
                                                const meta = PROJECT_OPEN_FOR_META[value];
                                                return (
                                                    <span
                                                        key={value}
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                                            selected
                                                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                                                : "border-slate-200 bg-slate-50 text-slate-500"
                                                        }`}
                                                    >
                                                        <meta.Icon className="h-3.5 w-3.5" />
                                                        {meta.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </FormCard>
                        </section>

                        <section id="conversion">
                            <FormCard>
                                <CardHeader className="pb-3">
                                    <SectionHeader
                                        icon={<MousePointerClick className="h-5 w-5" />}
                                        title="Conversion Toolkit"
                                        subtitle="Prepare project CTAs and brochure assets for public project pages."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {/* TODO(Sprint 2 backend): Enable once ProjectCta and ProjectBrochure models/API routes are available. */}
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-800">
                                        CTA and brochure management is read-only because ProjectCta and ProjectBrochure API support is not present in the current backend schema.
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <MousePointerClick className="h-4 w-4 text-blue-700" />
                                                CTA manager
                                            </div>
                                            <div className="grid gap-3">
                                                <input disabled placeholder="Label" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="Type" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="URL" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                                                        <input disabled type="checkbox" />
                                                        Primary
                                                    </label>
                                                    <input disabled placeholder="Sort order" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <FileText className="h-4 w-4 text-blue-700" />
                                                Brochure / catalog
                                            </div>
                                            <div className="grid gap-3">
                                                <input disabled placeholder="Title" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="File name" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="PDF file URL" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <button disabled className="h-10 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-500">
                                                    Upload PDF disabled
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </FormCard>
                        </section>

                        <section id="trust">
                            <FormCard>
                                <CardHeader className="pb-3">
                                    <SectionHeader
                                        icon={<Quote className="h-5 w-5" />}
                                        title="Trust Builder"
                                        subtitle="Prepare testimonials and project impact metrics for public project pages."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {/* TODO(Sprint 3 backend): Enable once ProjectTestimonial and ProjectMetric models/API routes are available. */}
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-800">
                                        Testimonials and metrics are read-only because ProjectTestimonial and ProjectMetric API support is not present in the current backend schema.
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <Quote className="h-4 w-4 text-blue-700" />
                                                Testimonials
                                            </div>
                                            <div className="grid gap-3">
                                                <input disabled placeholder="Name" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="Company" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="Role" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <textarea disabled rows={3} placeholder="Quote" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
                                                <input disabled placeholder="Logo URL" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                                                        <input disabled type="checkbox" />
                                                        Featured
                                                    </label>
                                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                                                        <Star className="h-4 w-4" />
                                                        Rating
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <BarChart3 className="h-4 w-4 text-blue-700" />
                                                Project metrics
                                            </div>
                                            <div className="grid gap-3">
                                                <input disabled placeholder="Metric value" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <input disabled placeholder="Metric label" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                                                <textarea disabled rows={3} placeholder="Optional description" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
                                                <button disabled className="h-10 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-500">
                                                    Add metric disabled
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </FormCard>
                        </section>

                        <section id="packages-scope">
                            <FormCard>
                                <CardHeader className="pb-3">
                                    <SectionHeader
                                        icon={<Package className="h-5 w-5" />}
                                        title="Packages & Scope"
                                        subtitle="Prepare service packages, deliverables, and scope details for business-ready project pages."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <Package className="h-4 w-4 text-blue-700" />
                                                Service package
                                            </div>
                                            <div className="grid gap-3">
                                                <input value={packageDraft.name} onChange={(e) => setPackageDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Package name" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <textarea value={packageDraft.description ?? ""} onChange={(e) => setPackageDraft((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Short description" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <input value={packageDraft.price ?? ""} onChange={(e) => setPackageDraft((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                    <input value={packageDraft.timeline ?? ""} onChange={(e) => setPackageDraft((p) => ({ ...p, timeline: e.target.value }))} placeholder="Timeline" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                </div>
                                                <textarea value={packageDraft.deliverablesText ?? ""} onChange={(e) => setPackageDraft((p) => ({ ...p, deliverablesText: e.target.value }))} rows={4} placeholder="Deliverables, one per line" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <input value={packageDraft.ctaLabel ?? ""} onChange={(e) => setPackageDraft((p) => ({ ...p, ctaLabel: e.target.value }))} placeholder="CTA label" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                    <input value={packageDraft.ctaLink ?? ""} onChange={(e) => setPackageDraft((p) => ({ ...p, ctaLink: e.target.value }))} placeholder="CTA link" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                                        <input checked={!!packageDraft.isFeatured} onChange={(e) => setPackageDraft((p) => ({ ...p, isFeatured: e.target.checked }))} type="checkbox" />
                                                        Featured
                                                    </label>
                                                    <input value={packageDraft.sortOrder ?? 0} onChange={(e) => setPackageDraft((p) => ({ ...p, sortOrder: Number(e.target.value) }))} type="number" min={0} placeholder="Sort order" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                </div>
                                                <Button type="button" disabled={!projectId || savingPackage} onClick={() => savePackage(packageDraft)} className="h-10 rounded-xl bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add package
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <ListChecks className="h-4 w-4 text-blue-700" />
                                                Scope & deliverables
                                            </div>
                                            <div className="grid gap-3">
                                                <textarea value={scopeDraft.includedText ?? ""} onChange={(e) => setScopeDraft((p) => ({ ...p, includedText: e.target.value }))} rows={4} placeholder="What's included, one item per line" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <textarea value={scopeDraft.excludedText ?? ""} onChange={(e) => setScopeDraft((p) => ({ ...p, excludedText: e.target.value }))} rows={4} placeholder="What's not included, one item per line" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <textarea value={scopeDraft.toolsText ?? ""} onChange={(e) => setScopeDraft((p) => ({ ...p, toolsText: e.target.value }))} rows={3} placeholder="Tools used, one item per line" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <input value={scopeDraft.timeline ?? ""} onChange={(e) => setScopeDraft((p) => ({ ...p, timeline: e.target.value }))} placeholder="Timeline" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                <Button type="button" disabled={!projectId || savingScope} onClick={saveScope} className="h-10 rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800">
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {savingScope ? "Saving..." : "Save scope"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {packages.length > 0 ? (
                                        <div className="grid gap-3">
                                            {packages.map((pkg) => (
                                                <div key={pkg.id ?? pkg.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <input value={pkg.name} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, name: e.target.value } : item))} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <input value={pkg.price ?? ""} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, price: e.target.value } : item))} placeholder="Price" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <textarea value={pkg.description ?? ""} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, description: e.target.value } : item))} rows={2} placeholder="Description" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2" />
                                                        <input value={pkg.timeline ?? ""} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, timeline: e.target.value } : item))} placeholder="Timeline" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <input value={pkg.sortOrder ?? 0} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, sortOrder: Number(e.target.value) } : item))} type="number" min={0} placeholder="Sort order" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <textarea value={pkg.deliverablesText ?? ""} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, deliverablesText: e.target.value } : item))} rows={3} placeholder="Deliverables, one per line" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2" />
                                                        <input value={pkg.ctaLabel ?? ""} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, ctaLabel: e.target.value } : item))} placeholder="CTA label" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <input value={pkg.ctaLink ?? ""} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, ctaLink: e.target.value } : item))} placeholder="CTA link" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                                            <input checked={!!pkg.isFeatured} onChange={(e) => setPackages((items) => items.map((item) => item.id === pkg.id ? { ...item, isFeatured: e.target.checked } : item))} type="checkbox" />
                                                            Featured package
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button type="button" disabled={savingPackage} onClick={() => savePackage(pkg)} className="h-10 rounded-xl bg-blue-700 text-sm text-white hover:bg-blue-800">
                                                                <Save className="mr-2 h-4 w-4" />
                                                                Save
                                                            </Button>
                                                            <Button type="button" variant="outline" onClick={() => deletePackage(pkg.id)} className="h-10 rounded-xl border-red-200 text-sm text-red-600 hover:bg-red-50">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </CardContent>
                            </FormCard>
                        </section>

                        <section id="journey">
                            <FormCard>
                                <CardHeader className="pb-3">
                                    <SectionHeader
                                        icon={<CalendarDays className="h-5 w-5" />}
                                        title="Project Journey"
                                        subtitle="Add milestones that show how the project has evolved over time."
                                    />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <CalendarDays className="h-4 w-4 text-blue-700" />
                                            Add milestone
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <input value={milestoneDraft.title} onChange={(e) => setMilestoneDraft((m) => ({ ...m, title: e.target.value }))} placeholder="Title" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                            <select value={milestoneDraft.type} onChange={(e) => setMilestoneDraft((m) => ({ ...m, type: e.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                                {MILESTONE_TYPES.map((type) => (
                                                    <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
                                                ))}
                                            </select>
                                            <input value={dateInputValue(milestoneDraft.date)} onChange={(e) => setMilestoneDraft((m) => ({ ...m, date: e.target.value }))} type="date" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                            <input value={milestoneDraft.sortOrder ?? 0} onChange={(e) => setMilestoneDraft((m) => ({ ...m, sortOrder: Number(e.target.value) }))} type="number" min={0} placeholder="Display order" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                            <textarea value={milestoneDraft.description ?? ""} onChange={(e) => setMilestoneDraft((m) => ({ ...m, description: e.target.value }))} rows={3} placeholder="Short description" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2" />
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
                                                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                                    <input checked={!!milestoneDraft.completed} onChange={(e) => setMilestoneDraft((m) => ({ ...m, completed: e.target.checked }))} type="checkbox" />
                                                    Completed
                                                </label>
                                                <Button type="button" disabled={!projectId || savingMilestone} onClick={() => saveMilestone(milestoneDraft)} className="h-10 rounded-xl bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add milestone
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {milestones.length > 0 ? (
                                        <div className="grid gap-3">
                                            {milestones.map((milestone) => (
                                                <div key={milestone.id ?? milestone.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <input value={milestone.title} onChange={(e) => setMilestones((items) => items.map((item) => item.id === milestone.id ? { ...item, title: e.target.value } : item))} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <select value={milestone.type} onChange={(e) => setMilestones((items) => items.map((item) => item.id === milestone.id ? { ...item, type: e.target.value } : item))} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                                            {MILESTONE_TYPES.map((type) => (
                                                                <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
                                                            ))}
                                                        </select>
                                                        <input value={dateInputValue(milestone.date)} onChange={(e) => setMilestones((items) => items.map((item) => item.id === milestone.id ? { ...item, date: e.target.value } : item))} type="date" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <input value={milestone.sortOrder ?? 0} onChange={(e) => setMilestones((items) => items.map((item) => item.id === milestone.id ? { ...item, sortOrder: Number(e.target.value) } : item))} type="number" min={0} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                                        <textarea value={milestone.description ?? ""} onChange={(e) => setMilestones((items) => items.map((item) => item.id === milestone.id ? { ...item, description: e.target.value } : item))} rows={3} placeholder="Description" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2" />
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                                            <input checked={!!milestone.completed} onChange={(e) => setMilestones((items) => items.map((item) => item.id === milestone.id ? { ...item, completed: e.target.checked } : item))} type="checkbox" />
                                                            Completed
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button type="button" disabled={savingMilestone} onClick={() => saveMilestone(milestone)} className="h-10 rounded-xl bg-blue-700 text-sm text-white hover:bg-blue-800">
                                                                <Save className="mr-2 h-4 w-4" />
                                                                Save
                                                            </Button>
                                                            <Button type="button" variant="outline" onClick={() => deleteMilestone(milestone.id)} className="h-10 rounded-xl border-red-200 text-sm text-red-600 hover:bg-red-50">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </CardContent>
                            </FormCard>
                        </section>

                        {/* Story */}
                        <form id="story" onSubmit={story.handleSubmit(saveStory, onInvalidStory)}>
                            <fieldset disabled={!projectId} className={!projectId ? "opacity-60 pointer-events-none" : ""}>
                                <FormCard>
                                    <CardHeader className="pb-3">
                                        <SectionHeader
                                            icon={<Sparkles className="h-5 w-5" />}
                                            title="Story"
                                            subtitle="Give the project a concise summary and a fuller markdown description."
                                        />
                                    </CardHeader>

                                    <CardContent className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="bio" className="text-sm font-semibold text-zinc-800">
                                                Short bio
                                            </Label>
                                            <Input
                                                id="bio"
                                                placeholder="A one-line summary of the project"
                                                className="h-12 rounded-2xl text-base"
                                                {...story.register("bio")}
                                            />
                                            <FieldError message={storyErrors.bio?.message as string | undefined} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">
                                                Long description
                                            </Label>
                                            <div className="rounded-xl border border-zinc-400 bg-white p-2">
                                                <MarkdownEditor
                                                    value={story.watch("longDescription") ?? ""}
                                                    onChange={(v) => story.setValue("longDescription", v, { shouldDirty: true })}
                                                />
                                            </div>
                                            <FieldError message={storyErrors.longDescription?.message as string | undefined} />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-end border-t border-zinc-400 pt-6">
                                        <Button type="submit" disabled={story.formState.isSubmitting} className="rounded-2xl px-5">
                                            Save Story
                                        </Button>
                                    </CardFooter>
                                </FormCard>
                            </fieldset>
                        </form>

                        {/* Contact */}
                        <form id="contact" onSubmit={contact.handleSubmit(saveContact, onInvalidContact)}>
                            <fieldset disabled={!projectId} className={!projectId ? "opacity-60 pointer-events-none" : ""}>
                                <FormCard>
                                    <CardHeader className="pb-3">
                                        <SectionHeader
                                            icon={<MapPinned className="h-5 w-5" />}
                                            title="Address & contact"
                                            subtitle="Add the details people need to reach your business or locate it."
                                        />
                                    </CardHeader>

                                    <CardContent className="grid gap-5 md:grid-cols-2">
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Website</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("website")} placeholder="https://..." />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Contact email</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("contactEmail")} placeholder="name@company.com" />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Contact phone</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("contactPhone")} placeholder="+1 555 123 4567" />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Address line 1</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("addressLine1")} />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Address line 2</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("addressLine2")} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">City</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("city")} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Region / State</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("region")} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Postal code</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("postalCode")} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Country</Label>
                                            <Input className="h-12 rounded-2xl text-base" {...contact.register("country")} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Latitude</Label>
                                            <Input className="h-12 rounded-2xl text-base" type="number" step="any" {...contact.register("locationLat", { valueAsNumber: true })} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-sm font-semibold text-zinc-800">Longitude</Label>
                                            <Input className="h-12 rounded-2xl text-base" type="number" step="any" {...contact.register("locationLng", { valueAsNumber: true })} />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-end border-t border-zinc-100 pt-6">
                                        <Button type="submit" disabled={contact.formState.isSubmitting} className="rounded-2xl px-5">
                                            Save Address & Contact
                                        </Button>
                                    </CardFooter>
                                </FormCard>
                            </fieldset>
                        </form>

                        {/* Existing social links manager */}
                        <section id="links">
                            <fieldset disabled={!projectId} className={!projectId ? "opacity-60 pointer-events-none" : ""}>
                                <ProjectSocialLinks
                                    projectId={projectId}
                                    initialLinks={initial?.socialLinks ?? []}
                                    onChanged={() => { }}
                                />
                            </fieldset>
                        </section>

                        
                    </div>

                    {/* Right rail */}
                    <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                                Writing Tips
                            </div>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                                <li>Keep the project name concise and memorable.</li>
                                <li>Use a clean slug with lowercase letters and hyphens.</li>
                                <li>Save Basic first to unlock all other sections.</li>
                                <li>Use a strong, relevant cover image for better click-through.</li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                                Good Project Profile
                            </div>
                            <div className="mt-4 space-y-3 text-sm text-zinc-600">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                    <span>Clear title and category</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                    <span>Short bio plus a detailed story</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                    <span>Real contact details and links</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                    <span>Published when ready for discovery</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        
    );
}
