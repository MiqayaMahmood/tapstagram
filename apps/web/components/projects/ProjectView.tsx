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
    message: string;
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

export default function ProjectView({ project }: { project: ProjectViewData}) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [leadOpen, setLeadOpen] = useState<boolean>(false);
    const [sending, setSending] = useState(false);
    const plan = user?.plan || "free";

    const [lead, setLead] = useState<LeadPayload>({
        firstName: "",
        lastName: "",
        contactEmail: "",
        contactPhone: "",
        country: "",
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
    } = project;
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

    const submitLead = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);


        const res = await fetch(`/profiles/${project.profileid}/leads`, {
            method: "POST",
            body: JSON.stringify({
                ...lead,
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
        setSending(false);
    };

  return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
              {/* Back + breadcrumbs */}
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-zinc-400 bg-white px-4 py-2 shadow-sm">
                  <div className="gap-4">
                      <Button onClick={onBack} className="items-center rounded-xl hover:bg-zinc-500">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                  </Button>
                  {(token && project.profileId === user?.profileId) && (
                      <Link className="rounded-xl border align-left border border-zinc-400 ml-4 px-2 py-3 hover:bg-zinc-200"
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
              {/* SOCIAL LINKS */}
              <Card className="mt-4 rounded-2xl border border-zinc-200 shadow-sm">
                  <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
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
              {/* TWO-COLUMN CONTENT AREA */}
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {/* Column A */}
                  <div className="space-y-4">
                      {/* STORY */}
                      <Card className="rounded-2xl border border-zinc-200 shadow-sm">
                          <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
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
                      <Card className="rounded-2xl border border-zinc-200 shadow-sm">
                          <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
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
                  <div className="space-y-4">
                      <Card className="rounded-2xl border border-zinc-200 shadow-sm">
                          <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
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
              <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-400 bg-gradient-to-tr from-zinc-50 to-white p-5 shadow-sm sm:flex-row sm:items-center">
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
                      className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
                  >
                      Contact
                  </button>
              </div>

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


