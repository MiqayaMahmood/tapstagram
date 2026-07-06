// components/projects/ProjectView.tsx
"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { SOCIAL_PLATFORMS, PlatformIcon } from "@/lib/social-platforms"; // your normalized map
import MarketingCard from '@/components/explorer/MarketingCard';

import { ProjectActions } from "@/components/projects/ProjectActions ";
import MarkdownPreviewCard from "@/components/markdown/MarkdownPreviewCard"; // you already use uiw md preview
import ProjectRightRail from '@/components/recommendations/ProjectRightRail';

import ProjectHero from '@/components/projects/ProjectHero';
import ProjectOpenForChips from "@/components/projects/ProjectOpenForChips";
import { normalizeProjectOpenFor } from "@/lib/project-open-for";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Path } from "react-hook-form";
import { useAuth } from '@/context/AuthContext';
import {
    ExternalLink, ArrowLeft, CalendarDays, CheckCircle, MapPin, Mail, Phone,
    BookOpen,
    LayoutGrid,
    MapPinned,
    Globe,
    Share2,
    MessageCircleMore,
    Send,
    Handshake,
    MousePointerClick,
    FileDown,
    FileText,
    PhoneCall,
    MessageSquareText,
    Quote,
    Star,
    BarChart3,
    Package,
    ListChecks,
    Clock,
    BriefcaseBusiness,
    UserRound,
    FolderKanban,
    Rocket,
    FlaskConical,
    Users,
    DollarSign,
    Trophy,
    Building2,
    HandshakeIcon,
    GitBranch,
} from "lucide-react";

type ProjectViewData = any;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const EXPLORE_PATH = "/explore";

type LeadPayload = {
    firstName: string;
    lastName: string;
    contactEmail: string;
    contactPhone: string;
    country: string;
    intent: string;
    message: string;
};

type CollaborationPayload = {
    requestType: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    portfolioUrl: string;
    message: string;
};

const LEAD_INTENTS = [
    "General Inquiry",
    "Partnership",
    "Demo Request",
    "Pricing",
    "Proposal",
    "Collaboration",
    "Other",
] as const;

const COLLABORATION_REQUEST_TYPES = [
    { value: "COLLABORATION", label: "Collaboration" },
    { value: "PARTNERSHIP", label: "Partnership" },
    { value: "DEMO", label: "Demo" },
    { value: "PROPOSAL", label: "Proposal" },
    { value: "INVESTMENT", label: "Investment" },
    { value: "DISTRIBUTION", label: "Distribution" },
    { value: "TECHNICAL_PARTNER", label: "Technical Partner" },
    { value: "OTHER", label: "Other" },
] as const;

type ProjectCtaLike = {
    id?: string | number;
    label?: string | null;
    type?: string | null;
    url?: string | null;
    isPrimary?: boolean | null;
    sortOrder?: number | null;
    sort_order?: number | null;
};

type ProjectBrochureLike = {
    id?: string | number;
    title?: string | null;
    fileName?: string | null;
    filename?: string | null;
    fileUrl?: string | null;
    url?: string | null;
    sortOrder?: number | null;
    sort_order?: number | null;
};

type ProjectTestimonialLike = {
    id?: string | number;
    name?: string | null;
    company?: string | null;
    role?: string | null;
    quote?: string | null;
    logoUrl?: string | null;
    rating?: number | string | null;
    isFeatured?: boolean | null;
    sortOrder?: number | null;
    sort_order?: number | null;
};

type ProjectMetricLike = {
    id?: string | number;
    label?: string | null;
    value?: string | number | null;
    description?: string | null;
    sortOrder?: number | null;
    sort_order?: number | null;
};

type ProjectPackageLike = {
    id?: string | number;
    name?: string | null;
    title?: string | null;
    description?: string | null;
    shortDescription?: string | null;
    price?: string | number | null;
    timeline?: string | null;
    deliverables?: string[] | string | null;
    deliverablesText?: string | null;
    ctaLabel?: string | null;
    ctaLink?: string | null;
    ctaUrl?: string | null;
    isFeatured?: boolean | null;
    isPopular?: boolean | null;
    sortOrder?: number | null;
    sort_order?: number | null;
};

type ProjectScopeLike = {
    included?: string[];
    excluded?: string[];
    tools?: string[];
    timeline?: string | null;
};

type ProjectMilestoneLike = {
    id?: string | number;
    type?: string | null;
    title?: string | null;
    description?: string | null;
    date?: string | Date | null;
    completed?: boolean | null;
    sortOrder?: number | null;
    sort_order?: number | null;
};

function normalizeHref(raw: string) {
    if (!raw) return "#";
    if (raw.startsWith("@")) return raw;               // keep handle for now
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
}

function profileHref(p?: ProjectViewData["profile"]) {
    // Prefer username route if you have one, else userId, else profileId if that’s your route.

    if (p?.id) return `/p/${p.id}`;
    if (p?.username) return `/${p.username}`;
    if (p?.userId) return `/p/${p.userId}`;
    
    return EXPLORE_PATH;
}

function normalizeCtas(project: any): ProjectCtaLike[] {
    const raw = project?.ctas ?? project?.projectCtas ?? project?.ProjectCta ?? project?.cta ?? [];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
        .filter((cta) => cta?.label)
        .sort((a, b) => Number(b?.isPrimary) - Number(a?.isPrimary) || (a?.sortOrder ?? a?.sort_order ?? 0) - (b?.sortOrder ?? b?.sort_order ?? 0));
}

function normalizeBrochures(project: any): ProjectBrochureLike[] {
    const raw = project?.brochures ?? project?.projectBrochures ?? project?.ProjectBrochure ?? project?.brochure ?? [];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
        .filter((item) => item?.fileUrl || item?.url)
        .sort((a, b) => (a?.sortOrder ?? a?.sort_order ?? 0) - (b?.sortOrder ?? b?.sort_order ?? 0));
}

function normalizeTestimonials(project: any): ProjectTestimonialLike[] {
    const raw = project?.testimonials ?? project?.projectTestimonials ?? project?.ProjectTestimonial ?? project?.testimonial ?? [];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
        .filter((item) => item?.quote && item?.name)
        .sort((a, b) => Number(b?.isFeatured) - Number(a?.isFeatured) || (a?.sortOrder ?? a?.sort_order ?? 0) - (b?.sortOrder ?? b?.sort_order ?? 0));
}

function normalizeMetrics(project: any): ProjectMetricLike[] {
    const raw = project?.metrics ?? project?.projectMetrics ?? project?.ProjectMetric ?? project?.metric ?? [];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
        .filter((item) => item?.label && item?.value !== undefined && item?.value !== null && item?.value !== "")
        .sort((a, b) => (a?.sortOrder ?? a?.sort_order ?? 0) - (b?.sortOrder ?? b?.sort_order ?? 0));
}

function normalizeList(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    if (typeof value === "string") {
        return value
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function normalizePackages(project: any): ProjectPackageLike[] {
    const raw = project?.packages ?? project?.servicePackages ?? project?.projectPackages ?? project?.ProjectPackage ?? project?.servicePackage ?? [];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
        .filter((item) => item?.name || item?.title)
        .sort((a, b) => Number(b?.isFeatured || b?.isPopular) - Number(a?.isFeatured || a?.isPopular) || (a?.sortOrder ?? a?.sort_order ?? 0) - (b?.sortOrder ?? b?.sort_order ?? 0));
}

function normalizeScope(project: any): ProjectScopeLike {
    const raw = project?.scope ?? project?.projectScope ?? project?.ProjectScope ?? {};
    return {
        included: normalizeList(raw?.included ?? raw?.includedItems ?? raw?.whatsIncluded ?? raw?.includedText ?? project?.includedItems),
        excluded: normalizeList(raw?.excluded ?? raw?.excludedItems ?? raw?.whatsNotIncluded ?? raw?.excludedText ?? project?.excludedItems),
        tools: normalizeList(raw?.tools ?? raw?.toolsUsed ?? raw?.toolsText ?? project?.toolsUsed),
        timeline: raw?.timeline ?? project?.timeline ?? null,
    };
}

function initials(name?: string | null) {
    return (name || "T")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "T";
}

function otherProjectsFor(project: any) {
    const raw = project?.otherProjects ?? project?.profile?.project ?? project?.profile?.projects ?? [];
    const list = Array.isArray(raw) ? raw : [];
    return list.filter((item) => item?.id && item.id !== project?.id).slice(0, 4);
}

function normalizeMilestones(project: any): ProjectMilestoneLike[] {
    const raw = project?.milestones ?? project?.projectMilestones ?? project?.ProjectMilestone ?? [];
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list
        .filter((item) => item?.title && item?.date)
        .sort((a, b) => new Date(a.date as any).getTime() - new Date(b.date as any).getTime() || (a?.sortOrder ?? a?.sort_order ?? 0) - (b?.sortOrder ?? b?.sort_order ?? 0));
}

function milestoneMeta(type?: string | null) {
    const map: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
        FOUNDED: { label: "Founded", Icon: Building2 },
        PROTOTYPE: { label: "Prototype", Icon: FlaskConical },
        MVP: { label: "MVP", Icon: Rocket },
        BETA: { label: "Beta", Icon: FlaskConical },
        LAUNCHED: { label: "Launched", Icon: Rocket },
        FIRST_CLIENT: { label: "First Client", Icon: Users },
        "100_USERS": { label: "100 Users", Icon: Users },
        "1000_USERS": { label: "1000 Users", Icon: Users },
        FUNDING: { label: "Funding", Icon: DollarSign },
        PARTNERSHIP: { label: "Partnership", Icon: HandshakeIcon },
        EXPANSION: { label: "Expansion", Icon: GitBranch },
        VERSION_RELEASE: { label: "Version Release", Icon: Rocket },
        AWARD: { label: "Award", Icon: Trophy },
        OTHER: { label: "Milestone", Icon: CalendarDays },
    };
    return map[type ?? "OTHER"] ?? map.OTHER;
}

export default function ProjectView({ project }: { project: ProjectViewData}) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [leadOpen, setLeadOpen] = useState<boolean>(false);
    const [collaborationOpen, setCollaborationOpen] = useState<boolean>(false);
    const [sending, setSending] = useState(false);
    const [collaborationSending, setCollaborationSending] = useState(false);
    const plan = user?.plan || "free";

    const [lead, setLead] = useState<LeadPayload>({
        firstName: "",
        lastName: "",
        contactEmail: "",
        contactPhone: "",
        country: "",
        intent: "General Inquiry",
        message: "",
    });

    const [collaboration, setCollaboration] = useState<CollaborationPayload>({
        requestType: "COLLABORATION",
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        portfolioUrl: "",
        message: "",
    });


    const siteLink = useMemo(() => {
        // A: server redirector for tracking (best reliability)
        if (API_BASE) return `${API_BASE}/projects/r/${project.id}/site`;
        // B: fallback: direct to URL (no server redirect)
        return normalizeHref(project.url);
    }, [project.id, project.url]);

    const onBack = () => {
        // Try browser back; if nothing meaningful, go to profile; else explore
        if (typeof window !== "undefined" && document.referrer && new URL(document.referrer).origin === location.origin) {
            router.back();
        } else {
            //router.push(profileHref(project.profile) || EXPLORE_PATH);
            router.push(EXPLORE_PATH);
        }
    };

    // --- top: back + breadcrumbs
    const crumbs = [
        { label: "Explore", href: EXPLORE_PATH },
        { label: "Profile", href: profileHref(project.profile) },
        { label: project.title },
    ];

    const {
    title,
    category,
    targetIndustry,
    bio,
    longDescription,
    description,
    url,
    website,
    contactEmail,
    contactPhone,
    addressLine1, addressLine2, city, region, postalCode, country,
    startedOn,
    isPublished,
    coverImageUrl,
    socialLinks = [],
    tags = [],
    openFor,
    collaborationNote,
    } = project;
const openForValues = normalizeProjectOpenFor(openFor);
const projectCtas = normalizeCtas(project);
const brochures = normalizeBrochures(project);
const testimonials = normalizeTestimonials(project);
const metrics = normalizeMetrics(project);
const milestones = normalizeMilestones(project);
const packages = normalizePackages(project);
const scope = normalizeScope(project);
const hasScope = scope.included.length > 0 || scope.excluded.length > 0 || scope.tools.length > 0 || !!scope.timeline;
const creator = project?.profile;
const creatorName = creator?.name ?? creator?.username ?? "Creator";
const creatorProjects = otherProjectsFor(project);
const collaborationStatus = String(project?.status ?? "").toLowerCase();
const canRequestCollaboration =
    openForValues.length > 0 ||
    ["active", "beta", "launched", "in_development"].includes(collaborationStatus) ||
    !!(contactEmail || contactPhone || website);
const [stats, setStats] = useState<{ visits: number; siteClicks: number; social: { platform: string; count: number }[] } | null>(null);

useEffect(() => {
    (async () => {
        const r = await fetch(`${API_BASE}/projects/${project.id}/stats`, { credentials: "include" });
        if (r.ok) setStats(await r.json());
    })();
}, [project.id]);

useEffect(() => {
    if (!project?.id) return;
    const url = `${API_BASE}/projects/${project.id}/visit`;
    const payload = JSON.stringify({ referrer: document.referrer || null, path: location.pathname, profileId: project.profileId });

    // Prefer beacon; fall back to fetch on older browsers
    const ok = navigator.sendBeacon?.(url, new Blob([payload], { type: "application/json" }));
    if (!ok) {
        fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
    }
}, [project?.id]);

useEffect(() => {
    if (typeof window === "undefined") return;
    let storedUser: any = null;
    try {
        const raw = localStorage.getItem("tapstagram_user");
        storedUser = raw ? JSON.parse(raw) : null;
    } catch {
        storedUser = null;
    }

    const source = user ?? storedUser;
    if (!source) return;
    const displayName = source.name ?? [source.firstName, source.lastName].filter(Boolean).join(" ");
    const email = source.email ?? source.contactEmail ?? "";

    setCollaboration((prev) => ({
        ...prev,
        name: prev.name || displayName || "",
        email: prev.email || email || "",
    }));
}, [user]);
    
/* ===== CONTACT ===== */

    function focusFirstError<T extends Record<string, unknown>>(
        errs: Record<string, any>,                 // FieldErrors<T>, kept loose for simplicity
        setFocus: (name: Path<T>) => void
    ) {
        const first = Object.keys(errs)[0] as Path<T> | undefined;
        if (first) setFocus(first);
    }


    function detectLeadSource() {
        if (document.referrer === "") return "nfc";
        if (document.referrer.includes("tapstagram")) return "internal";
        return "web";
    }

    function getRequestTypeLabel(value: string) {
        return COLLABORATION_REQUEST_TYPES.find((item) => item.value === value)?.label ?? value;
    }

    function leadProfileId() {
        return project.profileid ?? project.profileId;
    }

    const submitLead = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        const { intent, ...leadFields } = lead;
        const messageWithIntent = intent
            ? `Intent: ${intent}${lead.message ? `\n\n${lead.message}` : ""}`
            : lead.message;

        const res = await fetch(`/profiles/${leadProfileId()}/leads`, {
            method: "POST",
            body: JSON.stringify({
                ...leadFields,
                message: messageWithIntent,
                source: detectLeadSource(), // NFC vs Web
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not send the message, please try again later.");
            return;
        }

        toast.success("Thanks for your message. The Project/Business is informed, you will be contacted soon.");
        setLeadOpen(false);
        setLead((prev) => ({ ...prev, intent: "General Inquiry", message: "" }));
        setSending(false);
    };

    function openLeadWithIntent(intent: LeadPayload["intent"]) {
        setLead((prev) => ({ ...prev, intent }));
        setLeadOpen(true);
    }

    function openCollaborationRequest(requestType: CollaborationPayload["requestType"] = "COLLABORATION") {
        setCollaboration((prev) => ({ ...prev, requestType }));
        setCollaborationOpen(true);
    }

    const submitCollaborationRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (collaborationSending) return;
        if (!collaboration.name.trim() || !collaboration.email.trim() || !collaboration.message.trim()) {
            toast.error("Please add your name, email, and message.");
            return;
        }

        setCollaborationSending(true);
        const [firstName, ...lastParts] = collaboration.name.trim().split(/\s+/);
        const requestTypeLabel = getRequestTypeLabel(collaboration.requestType);
        const messageParts = [
            `Request Type: ${requestTypeLabel}`,
            collaboration.company ? `Company: ${collaboration.company}` : null,
            collaboration.role ? `Role: ${collaboration.role}` : null,
            collaboration.portfolioUrl ? `Portfolio: ${collaboration.portfolioUrl}` : null,
            "",
            collaboration.message,
        ].filter((item) => item !== null);

        const res = await fetch(`/profiles/${leadProfileId()}/leads`, {
            method: "POST",
            body: JSON.stringify({
                firstName,
                lastName: lastParts.join(" "),
                contactEmail: collaboration.email,
                contactPhone: collaboration.phone,
                country: "",
                message: messageParts.join("\n"),
                source: detectLeadSource(),
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            toast.error(err?.message ?? "Could not send the request, please try again later.");
            setCollaborationSending(false);
            return;
        }

        toast.success("Request sent. The project owner will contact you soon.");
        setCollaborationOpen(false);
        setCollaboration((prev) => ({
            ...prev,
            requestType: "COLLABORATION",
            phone: "",
            company: "",
            role: "",
            portfolioUrl: "",
            message: "",
        }));
        setCollaborationSending(false);
    };

  return (
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
              {/* Back + breadcrumbs */}
              <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-blue-100 bg-white/90 px-4 py-3 shadow-sm shadow-blue-950/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                  <div className="gap-4">
                      <Button onClick={onBack} className="items-center rounded-xl hover:bg-zinc-500">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                  </Button>
                  {(token && project.profileId === user?.profileId) && (
                      <Link className="ml-2 inline-flex rounded-2xl border border-blue-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50"
                          key={project.id}
                          href={`/dashboard/projects/${project.id}?profileId=${project.profileId}&plan=${plan}`}
                          
                      >
                          Edit Project
                      </Link>
                  )}
                  </div>

                  <nav className="text-sm text-neutral-500">
                      <ol className="flex flex-wrap items-center gap-2">
                          {crumbs.map((c, i) =>
                              c.href ? (
                                  <li key={i} className="flex items-center gap-2">
                                      <Link className="transition hover:text-neutral-800 hover:underline" href={c.href}>
                                          {c.label}
                                      </Link>
                                      {i < crumbs.length - 1 && <span className="text-neutral-400">›</span>}
                                  </li>
                              ) : (
                                  <li key={i} className="max-w-[40ch] truncate font-medium text-neutral-700">
                                      {c.label}
                                  </li>
                              )
                          )}
                      </ol>
                  </nav>
              </div>

              {/* top header */}
              <ProjectHero project={project} />
              <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                  <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                              <MousePointerClick className="h-5 w-5" />
                          </div>
                          Take Action
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {projectCtas.map((cta, index) => {
                              const href = cta.url ? normalizeHref(cta.url) : "#";
                              return (
                                  <a
                                      key={cta.id ?? `${cta.label}-${index}`}
                                      href={href}
                                      target={href.startsWith("http") ? "_blank" : undefined}
                                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                                      className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition sm:h-11 ${
                                          cta.isPrimary
                                              ? "bg-blue-700 text-white shadow-sm shadow-blue-950/15 hover:bg-blue-800"
                                              : "border border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
                                      }`}
                                  >
                                      <ExternalLink className="h-4 w-4 shrink-0" />
                                      <span className="truncate">{cta.label}</span>
                                  </a>
                              );
                          })}

                          {website ? (
                              <a
                                  href={normalizeHref(website)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:h-11"
                              >
                                  <Globe className="h-4 w-4 shrink-0" />
                                  <span className="truncate">Visit Website</span>
                              </a>
                          ) : null}

                          <button
                              type="button"
                              onClick={() => openLeadWithIntent("General Inquiry")}
                              className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 sm:h-11"
                          >
                              <MessageCircleMore className="h-4 w-4 shrink-0" />
                              <span className="truncate">Contact</span>
                          </button>

                          {canRequestCollaboration ? (
                              <button
                                  type="button"
                                  onClick={() => openCollaborationRequest("COLLABORATION")}
                                  className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 sm:h-11"
                              >
                                  <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                                  <span className="truncate">Request Collaboration</span>
                              </button>
                          ) : null}

                          <button
                              type="button"
                              onClick={() => openLeadWithIntent("Proposal")}
                              className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 sm:h-11"
                          >
                              <FileText className="h-4 w-4 shrink-0" />
                              <span className="truncate">Request Proposal</span>
                          </button>

                          <button
                              type="button"
                              onClick={() => openLeadWithIntent("Demo Request")}
                              className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 sm:h-11"
                          >
                              <MessageSquareText className="h-4 w-4 shrink-0" />
                              <span className="truncate">Request Demo</span>
                          </button>

                          {brochures[0] ? (
                              <a
                                  href={brochures[0].fileUrl ?? brochures[0].url ?? "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  download
                                  className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:h-11"
                              >
                                  <FileDown className="h-4 w-4 shrink-0" />
                                  <span className="truncate">Download Brochure</span>
                              </a>
                          ) : null}

                          {contactPhone ? (
                              <a
                                  href={`tel:${contactPhone}`}
                                  className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 sm:h-11"
                              >
                                  <PhoneCall className="h-4 w-4 shrink-0" />
                                  <span className="truncate">Call</span>
                              </a>
                          ) : null}

                          {contactEmail ? (
                              <a
                                  href={`mailto:${contactEmail}`}
                                  className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 sm:h-11"
                              >
                                  <Mail className="h-4 w-4 shrink-0" />
                                  <span className="truncate">Email</span>
                              </a>
                          ) : null}
                      </div>
                  </CardContent>
              </Card>

              {brochures.length > 0 ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                                  <FileText className="h-5 w-5" />
                              </div>
                              Brochure / Catalog
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <ul className="grid gap-3">
                              {brochures.map((item, index) => {
                                  const fileUrl = item.fileUrl ?? item.url ?? "#";
                                  const fileName = item.fileName ?? item.filename ?? "PDF brochure";
                                  return (
                                      <li
                                          key={item.id ?? `${fileUrl}-${index}`}
                                          className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                                      >
                                          <div className="min-w-0">
                                              <div className="truncate text-sm font-semibold text-slate-950">
                                                  {item.title || "Brochure / Catalog"}
                                              </div>
                                              <div className="truncate text-xs text-slate-500">{fileName}</div>
                                          </div>
                                          <a
                                              href={fileUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              download
                                              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
                                          >
                                              <FileDown className="h-4 w-4" />
                                              Download
                                          </a>
                                      </li>
                                  );
                              })}
                          </ul>
                      </CardContent>
                  </Card>
              ) : null}
              {metrics.length > 0 ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                  <BarChart3 className="h-5 w-5" />
                              </div>
                              Impact
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {metrics.map((metric, index) => (
                                  <div
                                      key={metric.id ?? `${metric.label}-${index}`}
                                      className="min-w-0 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-4"
                                  >
                                      <div className="break-words text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                                          {metric.value}
                                      </div>
                                      <div className="mt-1 text-sm font-semibold text-slate-700">{metric.label}</div>
                                      {metric.description ? (
                                          <p className="mt-2 text-sm leading-6 text-slate-500">{metric.description}</p>
                                      ) : null}
                                  </div>
                              ))}
                          </div>
                      </CardContent>
                  </Card>
              ) : null}

              {testimonials.length > 0 ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                  <Quote className="h-5 w-5" />
                              </div>
                              What people say
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="grid gap-3 md:grid-cols-2">
                              {testimonials.map((item, index) => {
                                  const rating = Number(item.rating ?? 0);
                                  return (
                                      <figure
                                          key={item.id ?? `${item.name}-${index}`}
                                          className="min-w-0 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5"
                                      >
                                          <div className="flex items-start gap-3">
                                              {item.logoUrl ? (
                                                  <img
                                                      src={item.logoUrl}
                                                      alt=""
                                                      className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover"
                                                  />
                                              ) : (
                                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                      <Quote className="h-4 w-4" />
                                                  </div>
                                              )}
                                              <div className="min-w-0">
                                                  <figcaption className="text-sm font-semibold text-slate-950">
                                                      {item.name}
                                                  </figcaption>
                                                  {(item.role || item.company) ? (
                                                      <p className="truncate text-xs text-slate-500">
                                                          {[item.role, item.company].filter(Boolean).join(" at ")}
                                                      </p>
                                                  ) : null}
                                              </div>
                                          </div>
                                          {rating > 0 ? (
                                              <div className="mt-3 flex items-center gap-1 text-amber-500">
                                                  {Array.from({ length: Math.min(5, Math.max(1, Math.round(rating))) }).map((_, starIndex) => (
                                                      <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                                                  ))}
                                              </div>
                                          ) : null}
                                          <blockquote className="mt-3 break-words text-sm leading-6 text-slate-600">
                                              "{item.quote}"
                                          </blockquote>
                                      </figure>
                                  );
                              })}
                          </div>
                      </CardContent>
                  </Card>
              ) : null}
              {packages.length > 0 ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <Package className="h-5 w-5" />
                              </div>
                              Service Packages
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {packages.map((packageItem, index) => {
                                  const deliverables = normalizeList(packageItem.deliverables ?? packageItem.deliverablesText);
                                  const ctaHref = packageItem.ctaLink ?? packageItem.ctaUrl;
                                  const featured = packageItem.isFeatured || packageItem.isPopular;
                                  return (
                                      <div
                                          key={packageItem.id ?? `${packageItem.name ?? packageItem.title}-${index}`}
                                          className={`flex min-w-0 flex-col rounded-2xl border p-4 ${
                                              featured
                                                  ? "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-sm shadow-blue-950/10"
                                                  : "border-blue-100 bg-white"
                                          }`}
                                      >
                                          <div className="flex items-start justify-between gap-3">
                                              <div className="min-w-0">
                                                  <h3 className="break-words text-base font-semibold text-slate-950">
                                                      {packageItem.name ?? packageItem.title}
                                                  </h3>
                                                  {(packageItem.description || packageItem.shortDescription) ? (
                                                      <p className="mt-2 text-sm leading-6 text-slate-600">
                                                          {packageItem.description ?? packageItem.shortDescription}
                                                      </p>
                                                  ) : null}
                                              </div>
                                              {featured ? (
                                                  <span className="shrink-0 rounded-full bg-blue-700 px-2.5 py-1 text-xs font-semibold text-white">
                                                      Popular
                                                  </span>
                                              ) : null}
                                          </div>

                                          {(packageItem.price || packageItem.timeline) ? (
                                              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                                  {packageItem.price ? (
                                                      <div className="rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-950">
                                                          {packageItem.price}
                                                      </div>
                                                  ) : null}
                                                  {packageItem.timeline ? (
                                                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                                                          <Clock className="h-4 w-4 text-blue-700" />
                                                          {packageItem.timeline}
                                                      </div>
                                                  ) : null}
                                              </div>
                                          ) : null}

                                          {deliverables.length > 0 ? (
                                              <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                                                  {deliverables.map((item) => (
                                                      <li key={item} className="flex min-w-0 items-start gap-2">
                                                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                          <span className="break-words">{item}</span>
                                                      </li>
                                                  ))}
                                              </ul>
                                          ) : null}

                                          {ctaHref ? (
                                              <a
                                                  href={normalizeHref(ctaHref)}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                                              >
                                                  {packageItem.ctaLabel || "Get Started"}
                                              </a>
                                          ) : null}
                                      </div>
                                  );
                              })}
                          </div>
                      </CardContent>
                  </Card>
              ) : null}

              {hasScope ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                                  <ListChecks className="h-5 w-5" />
                              </div>
                              Scope & Deliverables
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="grid gap-3 md:grid-cols-2">
                              {scope.included.length > 0 ? (
                                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                                      <h3 className="text-sm font-semibold text-slate-950">What's included</h3>
                                      <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                                          {scope.included.map((item) => (
                                              <li key={item} className="flex min-w-0 items-start gap-2">
                                                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                  <span className="break-words">{item}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              ) : null}

                              {scope.excluded.length > 0 ? (
                                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                      <h3 className="text-sm font-semibold text-slate-950">What's not included</h3>
                                      <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                                          {scope.excluded.map((item) => (
                                              <li key={item} className="break-words">{item}</li>
                                          ))}
                                      </ul>
                                  </div>
                              ) : null}

                              {(scope.tools.length > 0 || scope.timeline) ? (
                                  <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 md:col-span-2">
                                      <h3 className="text-sm font-semibold text-slate-950">Tools & timeline</h3>
                                      {scope.tools.length > 0 ? (
                                          <div className="mt-3 flex flex-wrap gap-2">
                                              {scope.tools.map((tool) => (
                                                  <span key={tool} className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                                                      {tool}
                                                  </span>
                                              ))}
                                          </div>
                                      ) : null}
                                      {scope.timeline ? (
                                          <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                                              <Clock className="h-4 w-4 text-blue-700" />
                                              {scope.timeline}
                                          </p>
                                      ) : null}
                                  </div>
                              ) : null}
                          </div>
                      </CardContent>
                  </Card>
              ) : null}
              {/* SOCIAL LINKS */}
              <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                  <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700">
                              <Share2 className="h-5 w-5" />
                          </div>
                          Find us online
                      </CardTitle>
                  </CardHeader>

                  <CardContent>
                      {socialLinks.length === 0 ? (
                          <p className="text-neutral-500">No social links added yet.</p>
                      ) : (
                          <ul className="flex flex-wrap gap-3">
                              {socialLinks.map((l) => {
                                  const Icon = PlatformIcon(l.platform);
                                  const label = SOCIAL_PLATFORMS.find((p) => p.key === l.platform)?.label ?? l.platform;

                                  return (
                                      <li key={l.id}>
                                          <a
                                              href={`${l.url}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-sm"
                                              title={label}
                                          >
                                              <Icon className="h-4 w-4 text-fuchsia-600" />
                                              <span className="max-w-[16ch] truncate">{l.label || label}</span>
                                          </a>
                                      </li>
                                  );
                              })}
                          </ul>
                      )}
                  </CardContent>
              </Card>
              {(openForValues.length > 0 || collaborationNote) ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <Handshake className="h-5 w-5" />
                              </div>
                              Open For
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {openForValues.length > 0 ? (
                              <ProjectOpenForChips openFor={openForValues} />
                          ) : null}
                          {collaborationNote ? (
                              <p className="text-sm leading-6 text-slate-600">{collaborationNote}</p>
                          ) : null}
                      </CardContent>
                  </Card>
              ) : null}
              {canRequestCollaboration ? (
                  <Card className="mt-4 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white shadow-sm shadow-blue-950/10">
                      <CardContent className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                  <BriefcaseBusiness className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                  <h2 className="text-base font-semibold sm:text-lg">Work with this project</h2>
                                  <p className="mt-1 text-sm leading-6 text-blue-100">
                                      Send a focused collaboration, partnership, demo, proposal, or technical request.
                                  </p>
                              </div>
                          </div>
                          <div className="grid w-full gap-2 sm:grid-cols-2 md:w-auto">
                              <button
                                  type="button"
                                  onClick={() => openCollaborationRequest("PARTNERSHIP")}
                                  className="h-10 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
                              >
                                  Request Partnership
                              </button>
                              <button
                                  type="button"
                                  onClick={() => openCollaborationRequest("PROPOSAL")}
                                  className="h-10 rounded-2xl border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                              >
                                  Get Proposal
                              </button>
                          </div>
                      </CardContent>
                  </Card>
              ) : null}
              {creator ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 bg-white/95 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <UserRound className="h-5 w-5" />
                              </div>
                              About the Creator
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex min-w-0 items-start gap-4">
                                  {creator.profile_picture_url ? (
                                      <img
                                          src={creator.profile_picture_url}
                                          alt=""
                                          className="h-14 w-14 shrink-0 rounded-2xl border border-blue-100 object-cover"
                                      />
                                  ) : (
                                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-500 text-base font-semibold text-white">
                                          {initials(creatorName)}
                                      </div>
                                  )}
                                  <div className="min-w-0">
                                      <h2 className="break-words text-base font-semibold text-slate-950 sm:text-lg">
                                          {creatorName}
                                      </h2>
                                      {creator.title ? (
                                          <p className="mt-1 text-sm font-medium text-blue-700">{creator.title}</p>
                                      ) : null}
                                      {creator.location ? (
                                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                              <MapPin className="h-3.5 w-3.5" />
                                              {creator.location}
                                          </p>
                                      ) : null}
                                      {creator.bio ? (
                                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                                              {creator.bio}
                                          </p>
                                      ) : null}
                                  </div>
                              </div>
                              <Link
                                  href={profileHref(creator)}
                                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-100 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                              >
                                  View profile
                              </Link>
                          </div>
                      </CardContent>
                  </Card>
              ) : null}

              {creatorProjects.length > 0 ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 bg-white/95 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                                  <FolderKanban className="h-5 w-5" />
                              </div>
                              Other Projects by {creatorName}
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="grid gap-3 sm:grid-cols-2">
                              {creatorProjects.map((item) => (
                                  <Link
                                      key={item.id}
                                      href={`/projects/${item.id}`}
                                      className="group flex min-w-0 gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm hover:shadow-blue-950/10"
                                  >
                                      {item.coverImageUrl ? (
                                          <img
                                              src={item.coverImageUrl}
                                              alt=""
                                              className="h-16 w-20 shrink-0 rounded-xl object-cover"
                                          />
                                      ) : (
                                          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                              <FolderKanban className="h-5 w-5" />
                                          </div>
                                      )}
                                      <div className="min-w-0">
                                          <h3 className="truncate text-sm font-semibold text-slate-950 group-hover:text-blue-700">
                                              {item.title}
                                          </h3>
                                          {item.category ? (
                                              <p className="mt-1 truncate text-xs font-medium text-slate-500">{item.category}</p>
                                          ) : null}
                                          {item.bio ? (
                                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{item.bio}</p>
                                          ) : null}
                                      </div>
                                  </Link>
                              ))}
                          </div>
                      </CardContent>
                  </Card>
              ) : null}
              {milestones.length > 0 ? (
                  <Card className="mt-4 rounded-3xl border border-blue-100 bg-white/95 shadow-sm shadow-blue-950/5">
                      <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <CalendarDays className="h-5 w-5" />
                              </div>
                              Project Journey
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="relative space-y-4">
                              <div className="absolute left-5 top-4 hidden h-[calc(100%-2rem)] w-px bg-blue-100 sm:block" />
                              {milestones.map((milestone, index) => {
                                  const meta = milestoneMeta(milestone.type);
                                  const Icon = meta.Icon;
                                  const date = new Date(milestone.date as any);
                                  return (
                                      <div key={milestone.id ?? `${milestone.title}-${index}`} className="relative grid gap-3 sm:grid-cols-[48px_minmax(0,1fr)]">
                                          <div className="hidden justify-center sm:flex">
                                              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700">
                                                  <Icon className="h-4 w-4" />
                                              </div>
                                          </div>
                                          <div className="min-w-0 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 p-4">
                                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                  <div className="flex min-w-0 items-start gap-3">
                                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 sm:hidden">
                                                          <Icon className="h-4 w-4" />
                                                      </div>
                                                      <div className="min-w-0">
                                                          <h3 className="break-words text-sm font-semibold text-slate-950 sm:text-base">
                                                              {milestone.title}
                                                          </h3>
                                                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                                                              {Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                                          </p>
                                                      </div>
                                                  </div>
                                                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                      milestone.completed
                                                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                                                  }`}>
                                                      {milestone.completed ? "Completed" : "Planned"}
                                                  </span>
                                              </div>
                                              {milestone.description ? (
                                                  <p className="mt-3 text-sm leading-6 text-slate-600">{milestone.description}</p>
                                              ) : null}
                                              <div className="mt-3 text-xs font-semibold text-blue-700">{meta.label}</div>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </CardContent>
                  </Card>
              ) : null}
              {/* TWO-COLUMN CONTENT AREA */}
              <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
                  {/* Column A */}
                  <div className="min-w-0 space-y-4">
                      {/* STORY */}
                      <Card className="rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                          <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                      <BookOpen className="h-5 w-5" />
                                  </div>
                                  Story
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="prose max-w-none prose-neutral">
                              {longDescription ? (
                                  <MarkdownPreviewCard
                                      md={longDescription}
                                      maxChars={160}
                                      className="border-none shadow-none"
                                  />
                              ) : (
                                  <p className="text-neutral-500">No story yet.</p>
                              )}
                          </CardContent>
                      </Card>

                      {/* OVERVIEW */}
                      <Card className="rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                          <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                      <LayoutGrid className="h-5 w-5" />
                                  </div>
                                  Overview
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              {description ? (
                                  <p className="leading-7 text-neutral-700">{description}</p>
                              ) : (
                                  <p className="text-neutral-500">No overview provided.</p>
                              )}

                              {tags?.length ? (
                                  <div className="flex flex-wrap gap-2">
                                      {tags.map((t) => (
                                          <span
                                              key={t}
                                              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                                          >
                                              {t}
                                          </span>
                                      ))}
                                  </div>
                              ) : null}
                          </CardContent>
                      </Card>
                  </div>

                  {/* Column B */}
                  <div className="min-w-0 space-y-4">
                      <Card className="rounded-3xl border border-blue-100 shadow-sm shadow-blue-950/5">
                          <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                      <MapPin className="h-5 w-5" />
                                  </div>
                                  Contact & Address
                              </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-4">
                              {website ? (
                                  <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-3">
                                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                          <Globe className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                              Website
                                          </div>
                                          <a
                                              className="block truncate text-blue-600 hover:underline"
                                              href={normalizeHref(website)}
                                              target="_blank"
                                              rel="noreferrer"
                                          >
                                              {website}
                                          </a>
                                      </div>
                                  </div>
                              ) : null}

                              {contactEmail ? (
                                  <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-3">
                                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-700">
                                          <Mail className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                              Email
                                          </div>
                                          <a className="text-blue-600 hover:underline" href={`mailto:${contactEmail}`}>
                                              {contactEmail}
                                          </a>
                                      </div>
                                  </div>
                              ) : null}

                              {contactPhone ? (
                                  <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-3">
                                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                          <Phone className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                              Phone
                                          </div>
                                          <a className="text-blue-600 hover:underline" href={`tel:${contactPhone}`}>
                                              {contactPhone}
                                          </a>
                                      </div>
                                  </div>
                              ) : null}

                              {(addressLine1 || city || country) ? (
                                  <div className="rounded-xl bg-zinc-50 p-4 text-sm text-neutral-700">
                                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800">
                                          <MapPinned className="h-4 w-4 text-emerald-600" />
                                          Address
                                      </div>

                                      {[addressLine1, addressLine2].filter(Boolean).map((x, i) => (
                                          <div key={i}>{x}</div>
                                      ))}
                                      <div>{[city, region, postalCode].filter(Boolean).join(" ")}</div>
                                      <div>{country}</div>
                                  </div>
                              ) : (
                                  <p className="text-neutral-500">No address provided.</p>
                              )}
                          </CardContent>
                      </Card>
                  </div>
              </div>

              

              

              {/* CONTACT CTA */}
              <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-100 bg-gradient-to-tr from-blue-50 via-white to-cyan-50/40 p-5 shadow-sm shadow-blue-950/5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <MessageCircleMore className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="font-medium text-neutral-900">
                              Have a question or business inquiry?
                          </p>
                          <p className="mt-1 text-sm text-neutral-500">
                              Reach out directly about this project or business.
                          </p>
                      </div>
                  </div>

                  <button
                      onClick={() => setLeadOpen(true)}
                      className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 sm:h-11 sm:px-6"
                  >
                      Contact
                  </button>
              </div>

              {collaborationOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4">
                      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6">
                          <div className="mb-4 flex items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <BriefcaseBusiness className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                  <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
                                      Request collaboration
                                  </h3>
                                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                                      Tell the project owner what kind of business conversation you want to start.
                                  </p>
                              </div>
                          </div>

                          <form className="mt-4 space-y-4" onSubmit={submitCollaborationRequest}>
                              <div>
                                  <Label>Request type</Label>
                                  <select
                                      required
                                      className="mt-1 h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      value={collaboration.requestType}
                                      onChange={(e) => setCollaboration({ ...collaboration, requestType: e.target.value })}
                                  >
                                      {COLLABORATION_REQUEST_TYPES.map((type) => (
                                          <option key={type.value} value={type.value}>
                                              {type.label}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                  <div>
                                      <Label>Name</Label>
                                      <input
                                          required
                                          placeholder="Your name"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={collaboration.name}
                                          onChange={(e) => setCollaboration({ ...collaboration, name: e.target.value })}
                                      />
                                  </div>
                                  <div>
                                      <Label>Email</Label>
                                      <input
                                          required
                                          type="email"
                                          placeholder="name@company.com"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={collaboration.email}
                                          onChange={(e) => setCollaboration({ ...collaboration, email: e.target.value })}
                                      />
                                  </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                  <div>
                                      <Label>Phone</Label>
                                      <input
                                          type="tel"
                                          placeholder="+1 555 123 4567"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={collaboration.phone}
                                          onChange={(e) => setCollaboration({ ...collaboration, phone: e.target.value })}
                                      />
                                  </div>
                                  <div>
                                      <Label>Company</Label>
                                      <input
                                          placeholder="Company or organization"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={collaboration.company}
                                          onChange={(e) => setCollaboration({ ...collaboration, company: e.target.value })}
                                      />
                                  </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                  <div>
                                      <Label>Role</Label>
                                      <input
                                          placeholder="Founder, buyer, investor..."
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={collaboration.role}
                                          onChange={(e) => setCollaboration({ ...collaboration, role: e.target.value })}
                                      />
                                  </div>
                                  <div>
                                      <Label>Portfolio / website</Label>
                                      <input
                                          type="url"
                                          placeholder="https://..."
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={collaboration.portfolioUrl}
                                          onChange={(e) => setCollaboration({ ...collaboration, portfolioUrl: e.target.value })}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <Label>Message</Label>
                                  <textarea
                                      required
                                      placeholder="Describe the opportunity, scope, timing, or question."
                                      rows={4}
                                      className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      value={collaboration.message}
                                      onChange={(e) => setCollaboration({ ...collaboration, message: e.target.value })}
                                  />
                              </div>

                              <div className="grid gap-2 pt-2 sm:grid-cols-2">
                                  <button
                                      type="button"
                                      onClick={() => setCollaborationOpen(false)}
                                      className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      disabled={collaborationSending}
                                      type="submit"
                                      className="h-10 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                      {collaborationSending ? "Sending..." : "Send request"}
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}

              {/* MODAL */}
              {leadOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
                          <div className="mb-4 flex items-start gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <Send className="h-5 w-5" />
                              </div>
                              <div>
                                  <h3 className="text-lg font-semibold text-neutral-900">
                                      Contact {project.name}
                                  </h3>
                                  <p className="mt-1 text-sm text-neutral-500">
                                      Leave your details and a message.
                                  </p>
                              </div>
                          </div>

                          <form className="mt-4 space-y-4" onSubmit={submitLead}>
                              <div className="grid gap-4 sm:grid-cols-2">
                                  <div>
                                      <Label>First Name</Label>
                                      <input
                                          required
                                          placeholder="First Name"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={lead.firstName}
                                          onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
                                      />
                                  </div>

                                  <div>
                                      <Label>Last Name</Label>
                                      <input
                                          required
                                          placeholder="Last Name"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={lead.lastName}
                                          onChange={(e) => setLead({ ...lead, lastName: e.target.value })}
                                      />
                                  </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                  <div>
                                      <Label>Email</Label>
                                      <input
                                          required
                                          type="email"
                                          placeholder="name@company.com"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={lead.contactEmail}
                                          onChange={(e) => setLead({ ...lead, contactEmail: e.target.value })}
                                      />
                                  </div>

                                  <div>
                                      <Label>Phone</Label>
                                      <input
                                          required
                                          type="tel"
                                          placeholder="+41 77 777 77 77"
                                          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          value={lead.contactPhone}
                                          onChange={(e) => setLead({ ...lead, contactPhone: e.target.value })}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <Label>Country</Label>
                                  <input
                                      required
                                      placeholder="Country"
                                      className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      value={lead.country}
                                      onChange={(e) => setLead({ ...lead, country: e.target.value })}
                                  />
                              </div>

                              <div>
                                  <Label>Intent</Label>
                                  <select
                                      className="mt-1 h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      value={lead.intent}
                                      onChange={(e) => setLead({ ...lead, intent: e.target.value })}
                                  >
                                      {LEAD_INTENTS.map((intent) => (
                                          <option key={intent} value={intent}>
                                              {intent}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div>
                                  <Label>Message</Label>
                                  <textarea
                                      placeholder="How can I help?"
                                      rows={4}
                                      className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      value={lead.message}
                                      onChange={(e) => setLead({ ...lead, message: e.target.value })}
                                  />
                              </div>

                              <div className="flex justify-end gap-3 pt-2">
                                  <button
                                      type="button"
                                      onClick={() => setLeadOpen(false)}
                                      className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      disabled={sending}
                                      type="submit"
                                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                      {sending ? "Sending…" : "Send"}
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      

      {/* Marketing Aside (unchanged content area) */}
      <aside className="sticky top-15 h-fit ">
        {/* Replace these blocks with your existing marketing widgets */}
              {!token && (
                <MarketingCard />
              )}
              <aside className="hidden lg:block sticky top-20 self-start h-fit">
                  <ProjectRightRail projectId={project.id} />
              </aside>
              
    </aside>
    
    </div>
  );
}
