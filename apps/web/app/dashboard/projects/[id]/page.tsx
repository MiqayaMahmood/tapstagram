'use client';

import { useEffect, useMemo, useState } from 'react';
import ProjectForm from '@/components/projects/ProjectForm';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

type ProjectDto = {
    id: number;
    profileId: number;
    title: string;
    slug: string;
    url: string;
    category?: string | null;
    targetIndustry?: string | null;
    bio?: string | null;
    description?: string | null;
    longDescription?: string | null;
    website?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
    locationLat?: number | null;
    locationLng?: number | null;
    startedOn?: string | null;
    isPublished?: boolean;
    coverImageUrl?: string | null;
    sort_order?: number | null;
    status?: string | null;
    openFor?: unknown;
    collaborationNote?: string | null;
    packages?: Array<{
        id: number;
        name: string;
        description?: string | null;
        price?: string | null;
        timeline?: string | null;
        deliverablesText?: string | null;
        ctaLabel?: string | null;
        ctaLink?: string | null;
        isFeatured?: boolean;
        sortOrder?: number | null;
    }>;
    scope?: {
        includedText?: string | null;
        excludedText?: string | null;
        toolsText?: string | null;
        timeline?: string | null;
    } | null;
    milestones?: Array<{
        id: number;
        type: string;
        title: string;
        description?: string | null;
        date: string;
        completed?: boolean;
        sortOrder?: number | null;
    }>;
    testimonials?: Array<{
        id: number;
        name: string;
        company?: string | null;
        role?: string | null;
        quote: string;
        logoUrl?: string | null;
        rating?: number | null;
        isFeatured?: boolean;
        sortOrder?: number | null;
    }>;
    metrics?: Array<{
        id: number;
        label: string;
        value: string;
        description?: string | null;
        sortOrder?: number | null;
    }>;
    socialLinks?: Array<{ id: string; platform: string; label?: string | null; url: string; sort_order?: number | null }>;
    plan?: string | null;
};

export default function EditProjectPage({ params }: { params: { id: string } }) {
    const { token } = useAuth();
    const sp = useSearchParams();
    const id = Number(params.id);
    const plan = sp.get("plan") || "";

    
    // one status flag avoids the boolean confusion
    const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'not_found' | 'error'>('idle');
    const [project, setProject] = useState<ProjectDto | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isFinite(id)) {
            setStatus('error');
            setMessage('Invalid project id');
            return;
        }

        const controller = new AbortController();

        setStatus('loading');
        setMessage(null);
        console.log('[EditProject] fetching', { id, hasToken: !!token });

        (async () => {
            try {
                const res = await fetch(`${API_BASE}/projects/projectById/${id}`, {
                    headers: {
                        // Include Authorization header only if we have a token.
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // if your API uses cookie auth, keep this too (must be allowed by CORS)
                    cache: 'no-store',
                    signal: controller.signal,
                });

                console.log('[EditProject] response', res.status);

                if (res.status === 404) {
                    setStatus('not_found');
                    return;
                }
                if (res.status === 401 || res.status === 403) {
                    setStatus('error');
                    setMessage('Not authorized to view this project.');
                    return;
                }
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data: ProjectDto = await res.json();
                setProject(data);

                setStatus('loaded');
            } catch (e: any) {
                if (e?.name === 'AbortError') return;
                console.error('[EditProject] fetch error', e);
                setStatus('error');
                setMessage(e?.message ?? 'Failed to load project');
            }
        })(); // <-- ACTUALLY INVOKE THE IIFE

        return () => controller.abort();
    }, [id, token]); // <-- proper deps so it re-runs when token arrives

    if (status === 'loading' || status === 'idle') {
        return <div className="max-w-7xl mx-auto p-6">Loading…</div>;
    }
    if (status === 'not_found') {
        return <div className="max-w-7xl mx-auto p-6">Can not find the requested Project.</div>;
    }
    if (status === 'error') {
        return <div className="max-w-7xl mx-auto p-6 text-red-600">{message ?? 'Something went wrong.'}</div>;
    }
    if (!project) return null;

    const initial = mapProjectToInitial(project, plan);
    
    return (
        <div className="max-w-7xl mx-auto">
            <ProjectForm mode="edit" initial={initial} />
        </div>
    );
}

// --- helpers ---

const CATEGORY_VALUES = ['MANUFACTURING', 'TRADING', 'SALES', 'SERVICES', 'SOFTWARE', 'OTHER'] as const;
type Category = (typeof CATEGORY_VALUES)[number];

function normalizeCategory(v: unknown): Category | null {
    if (v == null || v === '') return null;
    const up = String(v).toUpperCase() as Category;
    return (CATEGORY_VALUES as readonly string[]).includes(up) ? up : null;
}

function mapProjectToInitial(p: ProjectDto, _plan: string) {
    return {
        id: p.id,
        profileId: p.profileId,

        title: p.title ?? '',
        slug: p.slug ?? '',
        category: normalizeCategory(p.category),
        targetIndustry: p.targetIndustry ?? '',
        bio: p.bio ?? '',
        description: p.description ?? '',
        longDescription: p.longDescription ?? '',

        url: p.url ?? '',
        website: p.website ?? '',
        contactEmail: p.contactEmail ?? '',
        contactPhone: p.contactPhone ?? '',
        addressLine1: p.addressLine1 ?? '',
        addressLine2: p.addressLine2 ?? '',
        city: p.city ?? '',
        region: p.region ?? '',
        postalCode: p.postalCode ?? '',
        country: p.country ?? '',
        locationLat: p.locationLat ?? undefined,
        locationLng: p.locationLng ?? undefined,
        plan: _plan ?? '',
        startedOn: p.startedOn ? new Date(p.startedOn) : undefined,
        isPublished: !!p.isPublished,
        coverImageUrl: p.coverImageUrl ?? '',
        sort_order: (p.sort_order ?? 0) as number,
        status: p.status ?? null,
        openFor: p.openFor ?? [],
        collaborationNote: p.collaborationNote ?? '',
        packages: p.packages ?? [],
        scope: p.scope ?? null,
        milestones: p.milestones ?? [],
        testimonials: p.testimonials ?? [],
        metrics: p.metrics ?? [],

        socialLinks: (p.socialLinks ?? []).map(l => ({
            id: l.id, // cuid string
            platform: l.platform,
            label: l.label ?? undefined,
            url: l.url,
            sort_order: (l.sort_order ?? 0) as number,
        })),
    };
}
