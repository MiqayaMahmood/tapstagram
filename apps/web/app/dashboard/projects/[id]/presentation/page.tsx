"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import PresentationRenderer, { PresentationDocument } from "@/components/presentation/PresentationRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PresentationDesignPanel from '@/components/presentation/editor/PresentationDesignPanel';
import ImageField from "@/components/presentation/editor/ImageField";
import ThemeEditor from "@/components/presentation/editor/ThemeEditor";
import BlocksManager from "@/components/presentation/editor/BlocksManager";
import ImageTextEditor from "@/components/presentation/editor/ImageTextEditor";
import { createId, updateBlockById } from "@/components/presentation/editor/utils";
import { CatalogEditor } from "@/components/presentation/editor/CatalogEditor";

function makeDefaultProjectDoc(project: any): PresentationDocument {
    return {
        version: 1,
        theme: {
            bgColor: "#ffffff",
            textColor: "#18181b",
            accentColor: "#3f3f46",
            fontFamily: "inter",
            headingSize: "lg",
            radius: "2xl",
            maxWidth: "6xl",
        },
        blocks: [
            {
                id: "hero-1",
                type: "hero",
                data: {
                    headline: project?.title || "Project Title",
                    subheadline: project?.bio || "A richer project presentation.",
                    align: "left",
                    imageUrl: project?.coverImageUrl || "",
                    ctaText: project?.website ? "Visit website" : "Contact",
                    ctaLink: project?.website || "#contact",
                },
            },
            {
                id: "rich-1",
                type: "richText",
                data: {
                    title: "Overview",
                    html: `<p>${project?.longDescription || project?.bio || "Describe your project here."}</p>`,
                },
            },
            {
                id: "catalog-1",
                type: "catalog",
                data: {
                    title: "Products & Services",
                    items: [],
                },
            },
            {
                id: "cta-1",
                type: "cta",
                data: {
                    headline: "Interested in this project?",
                    text: "Reach out to learn more or start a conversation.",
                    buttonText: "Contact",
                    buttonLink: "#contact",
                },
            },
        ],
    };
}

export default function ProjectPresentationEditorPage({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { token, user } = useAuth();
    const projectId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<any>(null);
    const [enabled, setEnabled] = useState(false);
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [template, setTemplate] = useState("business");
    const [doc, setDoc] = useState<PresentationDocument | null>(null);

    const isPremium = (user?.plan || "").toLowerCase() === "premium";

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);

                const [projectRes, presentationRes] = await Promise.all([
                    apiFetch<any>(`/projects/projectById/${projectId}`, {}, token),
                    apiFetch<any>(`/projects/${projectId}/presentation`, {}, token).catch(() => null),
                ]);

                const pres = presentationRes?.presentation;

                if (!cancelled) {
                    setProject(projectRes);
                    setEnabled(!!pres?.enabled);
                    setStatus((pres?.status as "draft" | "published") || "draft");
                    setTemplate(pres?.template || "business");
                    setDoc((pres?.contentJson as PresentationDocument) || makeDefaultProjectDoc(projectRes));
                }
            } catch {
                if (!cancelled) {
                    setProject(null);
                    setDoc(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [token, projectId]);
    const onBack = () => {
        router.back();
    };
    async function save() {
        if (!token || !doc) return;

        try {
            await apiFetch(`/projects/${projectId}/presentation`, {
                method: "PATCH",
                body: JSON.stringify({
                    enabled,
                    status,
                    template,
                    contentJson: doc,
                    themeJson: doc.theme,
                }),
            }, token);

            toast.success("Premium project presentation saved");
        } catch (e: any) {
            toast.error(e?.message || "Could not save presentation");
        }
    }

    const hero = doc?.blocks.find((b: any) => b.type === "hero") as any;
    const rich = doc?.blocks.find((b: any) => b.type === "richText") as any;
    const cta = doc?.blocks.find((b: any) => b.type === "cta") as any;
    const catalog = doc?.blocks.find((b: any) => b.type === "catalog") as any;

    function addImageTextBlock() {
        setDoc((prev: any) => ({
            ...prev,
            blocks: [
                ...prev.blocks,
                {
                    id: createId("imageText"),
                    type: "imageText",
                    data: {
                        title: "New Section",
                        text: "",
                        imageUrl: "",
                        imageSide: "left",
                        ctaText: "",
                        ctaLink: "",
                    },
                },
            ],
        }));
    }

    function addCatalogBlock() {
        setDoc((prev: any) => ({
            ...prev,
            blocks: [
                ...prev.blocks,
                {
                    id: createId("catalog"),
                    type: "catalog",
                    data: {
                        title: "Products & Services",
                        items: [],
                    },
                },
            ],
        }));
    }

    if (loading) {
        return <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500">Loading premium editor…</div>;
    }

    if (!isPremium) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-10">
                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Premium required</h1>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">
                        Upgrade your account to Premium to create a richer project presentation page.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/billing/upgrade"
                            className="inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                            Upgrade to Premium
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6 rounded-xl border border-zinc-400 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Premium Project Presentation</h1>
                    <p className="mt-2 text-sm text-zinc-500">
                        Create a richer project or business page with hero, overview, catalog, and CTA sections.
                    </p>

                    <div className="pt-5">
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="rounded-xl border-zinc-400 px-5 hover:text-white hover:bg-zinc-400">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={save} className=" rounded-xl ml-4">
                            Save Premium Project
                        </Button>
                        
                    </div>

                </div>

                <div className="grid gap-6 lg:grid-cols-[360px,minmax(0,1fr)] xl:grid-cols-[380px,minmax(0,1fr)]">
                    <div className="self-start lg:sticky lg:top-6">
                        {doc ? (
                            <PresentationDesignPanel
                                doc={doc}
                                setDoc={setDoc}
                                enabled={enabled}
                                setEnabled={setEnabled}
                                status={status}
                                setStatus={setStatus}
                                template={template}
                                setTemplate={setTemplate}
                            />
                        ) : null}
                    </div>

                    <div className="min-w-0 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-sm font-semibold text-zinc-700">Live Preview</div>
                            <div className="text-xs text-zinc-500">Updates instantly as you edit</div>
                        </div>
                        {doc ? <PresentationRenderer document={doc} entity={project} /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}