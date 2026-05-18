"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/Select";

import {
    ArrowUp,
    ArrowDown,
    Trash2,
    GripVertical,
    ExternalLink,
    Link2,
    CheckCircle2,
    AlertCircle,
    Globe,
} from "lucide-react";

import {SOCIAL_PLATFORMS, type PlatformKey, } from "@/lib/social-platforms";

import { ProjectSocialLinkSchema } from "@/lib/projects";

type SocialLink = z.infer<typeof ProjectSocialLinkSchema>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const platformKeys = SOCIAL_PLATFORMS.map((p) => p.key) as [
    PlatformKey,
    ...PlatformKey[]
];

const SocialLinkInputSchema = z.object({
    platform: z.enum(platformKeys),
    url: z
        .string()
        .min(1, "Please enter a URL or handle")
        .refine((v) => /^@|^https?:\/\//i.test(v), "Start with https://… or @handle"),
})


function findPlatform(key?: string | null) {
    return (
        SOCIAL_PLATFORMS.find((p) => p.key === key) ||
        SOCIAL_PLATFORMS.find(
            (p) => p.label.toLowerCase() === (key ?? "").toLowerCase()
        ) ||
        SOCIAL_PLATFORMS.find((p) => p.key === "custom") ||
        SOCIAL_PLATFORMS[0]
    );
}

function platformLabel(id: string) {
    return findPlatform(id)?.label ?? id;
}

function platformPlaceholder(id: string) {
    return findPlatform(id)?.placeholder ?? "https://";
}

function PlatformIcon(id: string) {
    return findPlatform(id)?.icon ?? Globe;
}

function normalizeHref(raw: string) {
    if (raw.startsWith("@")) return raw;
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
}


function StatusNotice({
    type,
    message,
}: {
    type: "success" | "error" | null;
    message: string;
}) {
    if (!type || !message) return null;

    return (
        <div
            className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
        >
            {type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{message}</span>
        </div>
    );
}

export default function ProjectSocialLinks({
    projectId,
    initialLinks = [],
    onChanged,
    disabled,
}: {
    projectId?: number | null;
    initialLinks?: SocialLink[];
    onChanged?: (links: SocialLink[]) => void;
    disabled?: boolean;
}) {
    const [links, setLinks] = useState<SocialLink[]>(initialLinks);
    

    const [platform, setPlatform] = useState<PlatformKey>("website");
    const [url, setUrl] = useState("");
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    useEffect(() => {
        setLinks(initialLinks);
    }, [initialLinks]);

    const canEdit = !!projectId && !disabled;

    async function persist(next: SocialLink[], success = "Links saved") {
        if (!projectId) {
            setNotice({
                type: "error",
                message: "Save basic project details first to create the project.",
            });
            toast.info("Save Basic first to create the project.");
            return;
        }

        setSaving(true);
        setNotice({ type: null, message: "" });

        try {
            const withOrder = next.map((l, i) => ({ ...l, sort_order: i }));

            const res = await fetch(`${API_BASE}/projects/${projectId}/social-links`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ socialLinks: withOrder }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const msg = err?.message ?? "Could not save links";
                setNotice({ type: "error", message: msg });
                toast.error(msg);
                return;
            }

            setLinks(withOrder);
            onChanged?.(withOrder);
            setNotice({ type: "success", message: success });
            toast.success(success);
        } finally {
            setSaving(false);
        }
    }

    async function handleAdd() {
        const parsed = SocialLinkInputSchema.safeParse({
            platform,
            url: url.trim(),
        });

        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Invalid link";
            setNotice({ type: "error", message: msg });
            toast.error(msg);
            return;
        }

        const next: SocialLink[] = [...links, parsed.data as SocialLink];
        await persist(next, "Link added successfully");
        setUrl("");
    }

    const moveUp = async (i: number) => {
        if (i <= 0) return;
        const next = links.slice();
        [next[i - 1], next[i]] = [next[i], next[i - 1]];
        await persist(next, "Link order updated");
    };

    const moveDown = async (i: number) => {
        if (i >= links.length - 1) return;
        const next = links.slice();
        [next[i], next[i + 1]] = [next[i + 1], next[i]];
        await persist(next, "Link order updated");
    };

    const removeAt = async (i: number) => {
        const next = links.filter((_, idx) => idx !== i);
        await persist(next, "Link removed successfully");
    };

    const dragIndex = useRef<number | null>(null);

    const onDragStart = (i: number) => (e: React.DragEvent) => {
        dragIndex.current = i;
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (_i: number) => (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const onDrop = (i: number) => async (e: React.DragEvent) => {
        e.preventDefault();
        const from = dragIndex.current;
        dragIndex.current = null;
        if (from == null || from === i) return;

        const next = links.slice();
        const [moved] = next.splice(from, 1);
        next.splice(i, 0, moved);

        await persist(next, "Link order updated");
    };

    const PlatformIcon = (id: string) =>
        SOCIAL_PLATFORMS.find((p) => p.key === id.toLowerCase())?.icon ?? Globe;

    return (
        <Card className="rounded-3xl border border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <Link2 className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold text-zinc-900">
                            Project social links
                        </CardTitle>
                        <p className="mt-1 text-sm text-zinc-500">
                            Manage your project’s websites, communities, and social channels.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                <StatusNotice type={notice.type} message={notice.message} />

                {/* Add row */}
                <fieldset
                    disabled={!canEdit || saving}
                    className={!canEdit ? "pointer-events-none opacity-60" : ""}
                >
                    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-zinc-800">
                                Platform <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={platform}
                                onValueChange={(v) => {
                                    setPlatform(v as PlatformKey);
                                    if (notice.type) {
                                        setNotice({ type: null, message: "" });
                                    }
                                }}
                            >
                                <SelectTrigger className="h-12 rounded-2xl bg-white text-base">
                                    <SelectValue placeholder="Platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOCIAL_PLATFORMS.map((p) => (
                                        <SelectItem key={p.key} value={p.key}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-zinc-800">
                                URL or handle <span className="text-red-500">*</span>
                            </label>

                            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr),auto]">
                                <Input
                                    placeholder={platformPlaceholder(platform)}
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        if (notice.type) {
                                            setNotice({ type: null, message: "" });
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAdd();
                                        }
                                    }}
                                    className={`h-12 rounded-2xl bg-white text-base ${notice.type === "error"
                                            ? "border-red-400 focus-visible:ring-red-200"
                                            : ""
                                        }`}
                                />

                                <Button
                                    type="button"
                                    onClick={handleAdd}
                                    disabled={saving}
                                    className="h-12 rounded-2xl px-5"
                                >
                                    {saving ? "Adding…" : "Add"}
                                </Button>
                            </div>
                        </div>

                        <p className="text-sm leading-6 text-zinc-500">
                            Click <span className="font-medium text-zinc-700">Add</span> to
                            save immediately. Drag links to reorder them, use arrows for fine
                            adjustment, or delete a link instantly.
                        </p>
                    </div>
                </fieldset>

                {/* Existing list */}
                <div className="space-y-3">
                    {links.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
                            No links yet. Add your first project social link above.
                        </div>
                    ) : null}

                    {links.map((l, i) => {
                        const Icon = PlatformIcon(l.platform as string);

                        return (
                            <div
                                key={`${l.platform}-${l.url}-${i}`}
                                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
                                draggable={canEdit}
                                onDragStart={onDragStart(i)}
                                onDragOver={onDragOver(i)}
                                onDrop={onDrop(i)}
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span
                                            className="mt-1 cursor-grab text-zinc-400"
                                            title="Drag to reorder"
                                        >
                                            <GripVertical className="h-4 w-4" />
                                        </span>

                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-zinc-900">
                                                {platformLabel(l.platform)}
                                            </div>

                                            {l.url ? (
                                                <a
                                                    href={normalizeHref(l.url)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group mt-1 inline-flex max-w-full items-center gap-1 text-sm text-blue-600 hover:underline"
                                                    title={l.url}
                                                >
                                                    <span className="truncate">{l.url}</span>
                                                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => moveUp(i)}
                                            disabled={!canEdit || i === 0 || saving}
                                            title="Move up"
                                            className="rounded-xl"
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => moveDown(i)}
                                            disabled={!canEdit || i === links.length - 1 || saving}
                                            title="Move down"
                                            className="rounded-xl"
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeAt(i)}
                                            disabled={!canEdit || saving}
                                            title="Delete"
                                            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
