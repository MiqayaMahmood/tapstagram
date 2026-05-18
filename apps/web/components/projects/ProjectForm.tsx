"use client";

import ProjectSocialLinks from "@/components/projects/ProjectSocialLinks";
import HeroBannerCropper from "@/components/profile/HeroBannerCropper";
import { ArrowLeft, CheckCircle2, CircleDot, ExternalLink, Link2, MapPinned, PenSquare, Sparkles } from "lucide-react";
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ---------- helpers ---------- */

const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

/* ---------- section schemas ---------- */

const BasicSchema = ProjectUpsertSchema.pick({
    profileId: true,
    title: true,
    slug: true,
    category: true,
    targetIndustry: true,
    startedOn: true,
    isPublished: true,
    url: false,
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
    initial?: Partial<ProjectFormValues> & { id?: number };
};

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
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200">
                {icon}
            </div>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h2>
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
        <Card className={`rounded-xl border border-zinc-400 bg-white shadow-sm ${className}`}>
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

/* ---------- component ---------- */

export default function ProjectForm({ mode, initial }: Props) {
    const router = useRouter();
    const { token } = useAuth();
    const [projectId, setProjectId] = useState<number | undefined>(initial?.id);

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

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 rounded-xl border border-zinc-400 mb-2">
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

                    <div className="flex items-center gap-3">
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

                <div className="grid gap-2 lg:grid-cols-[270px,minmax(0,1fr),310px]">
                    {/* Left rail */}
                    <aside className="hidden lg:block sticky top-20 self-start h-fit space-y-4">
                        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
                            <div className="text-lg font-bold text-zinc-800">
                                Editor Navigation
                            </div>

                            <nav className="mt-4 flex flex-col gap-1">
                                <RailLink href="#media" label="Media" />
                                <RailLink href="#basic" label="Basics" />
                                <RailLink href="#story" label="Story" />
                                <RailLink href="#contact" label="Address & Contact" />
                                <RailLink href="#links" label="Social Links" />
                                <RailLink href="#add-links" label="Add Social Link" />
                            </nav>
                        </div>

                        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
                            <div className="text-lg font-bold text-zinc-800">
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
                                            className="h-full rounded-full bg-zinc-900 transition-all"
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

                        <div className="rounded-xl border border-zinc-400 bg-white p-2 shadow-sm">
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