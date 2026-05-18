// apps/web/src/services/project.ts
import { apiFetch } from "@/lib/api";

/* =========================
 * Types & Enums (frontend)
 * ========================= */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type ProjectCategory =
    | "DISTRIBUTIONS"
    | "eCOMMERCE"
    | "EDUCATION"
    | "ELECTRICAL_ELECTRONICS"
    | "FINANCE"
    | "FOOD_BEVREGES"
    | "HEALTHCARE"
    | "HOTEL_RESTAURANT"
    | "IMPORT_EXPORT"
    | "INDUSTRIAL_MACHINARY"
    | "MANUFACTURING"
    | "MARKETING"
    | "REAL_ESTATE"
    | "RETAIL"
    | "SALES"
    | "SERVICES"
    | "SOFTWARE"
    | "TRADING"
    | "OTHER";

export type ProjectSocialLink = {
    id: string;
    projectId: number;
    platform: string;     // keep as string union later if you have SocialPlatform type
    label?: string | null;
    url: string;
    createdAt?: string;
    updatedAt?: string;
};

export type ProjectLite = {
    id: number;
    slug: string;
    title: string;
    category?: string | null;
    coverImageUrl?: string | null;
    bio?: string | null;
    country?: string | null;
    startedOn?: string | null;
    updatedAt?: string | null;
    url?: string | null;
    profileId: number;
};

export type Project = {
    id: number;
    profileId: number;

    title: string;
    slug: string;
    category: ProjectCategory;
    targetIndustry?: string | null;
    bio?: string | null;
    description?: string | null;      // short/legacy
    longDescription?: string | null;  // Markdown as decided

    url: string;                      // primary project URL (legacy kept)
    website?: string | null;

    // Address / Contact
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;

    // Location
    locationLat?: number | null;
    locationLng?: number | null;

    // Ops / display
    startedOn?: string | null;        // ISO string
    isPublished: boolean;
    coverImageUrl?: string | null;

    socialLinks?: ProjectSocialLink[];

    sort_order: number;

    createdAt?: string;
    updatedAt?: string;
    // Back-compat fields (if server still returns snake_case)
    created_at?: string;
    updated_at?: string;
};

/* ============
 * Normalizers
 * ============ */

function normalizeProject(p: any): Project {
    // Accept snake_case or camelCase from API
    return {
        id: p.id,
        profileId: p.profileId ?? p.profile_id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        targetIndustry: p.targetIndustry ?? p.target_industry ?? null,
        bio: p.bio ?? null,
        description: p.description ?? null,
        longDescription: p.longDescription ?? p.long_description ?? null,
        url: p.url,
        website: p.website ?? null,

        addressLine1: p.addressLine1 ?? p.address_line1 ?? null,
        addressLine2: p.addressLine2 ?? p.address_line2 ?? null,
        city: p.city ?? null,
        region: p.region ?? null,
        postalCode: p.postalCode ?? p.postal_code ?? null,
        country: p.country ?? null,
        contactEmail: p.contactEmail ?? p.contact_email ?? null,
        contactPhone: p.contactPhone ?? p.contact_phone ?? null,

        locationLat: p.locationLat ?? p.location_lat ?? null,
        locationLng: p.locationLng ?? p.location_lng ?? null,

        startedOn: p.startedOn ?? p.started_on ?? null,
        isPublished: p.isPublished ?? p.is_published ?? false,
        coverImageUrl: p.coverImageUrl ?? p.cover_image_url ?? null,

        socialLinks: p.socialLinks ?? p.social_links ?? [],

        sort_order: p.sort_order ?? 0,

        createdAt: p.createdAt ?? p.created_at,
        updatedAt: p.updatedAt ?? p.updated_at,

        created_at: p.created_at, // keep for old callers if any
        updated_at: p.updated_at,
    };
}

/* ======================
 * Payloads (create/edit)
 * ====================== */

export type CreateProjectPayload = {
    profileId: number;
    title: string;
    slug: string;
    category: ProjectCategory;
    url: string;

    targetIndustry?: string | null;
    bio?: string | null;
    description?: string | null;
    longDescription?: string | null;

    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;

    website?: string | null;
    locationLat?: number | null;
    locationLng?: number | null;

    startedOn?: string | null;        // ISO
    isPublished?: boolean;
    coverImageUrl?: string | null;

    socialLinks?: Array<Pick<ProjectSocialLink, "platform" | "label" | "url">>;
    sort_order?: number;
};

export type UpdateProjectPayload = Partial<
    Omit<CreateProjectPayload, "profileId" | "slug" | "category" | "url">
> & {
    // Allow updating these too if your API permits
    slug?: string;
    category?: ProjectCategory;
    url?: string;
    sort_order?: number;
};

/* ===============
 * API wrappers
 * =============== */

// Authenticated – list my projects (by profile)
export async function listMineProject(token: string, profileId: number) {
    const res = await apiFetch<any[]>(`/projects/listMyProject/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.map(normalizeProject);
}

export async function getProjectByProjectId(token: string, projectId: number) {
    const res = await apiFetch<any[]>(`/projects/projectById/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res //.map(normalizeProject);
}

// Public – list a profile’s public projects
export async function listPublicProject(profileId: number) {
    const res = await apiFetch<any[]>(`/projects/${profileId}`);
    return res.map(normalizeProject);
}

// Optional: fetch by slug (public)
export async function getPublicProjectBySlug(slug: string) {
    const res = await apiFetch<any>(`/projects/slug/${encodeURIComponent(slug)}`);
    return normalizeProject(res);
}

// Create
export async function createProject(token: string, payload: CreateProjectPayload) {
    const res = await apiFetch<any>("/projects", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    return normalizeProject(res);
}

// Update
export async function updateProject(
    token: string,
    id: number,
    payload: UpdateProjectPayload
) {
    const res = await apiFetch<any>(`/projects/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    return normalizeProject(res);
}

// Delete
export async function deleteProject(token: string, id: number) {
    return apiFetch(`/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Reorder (drag & drop)
export async function reorder(
    token: string,
    items: { id: number; sort_order: number }[]
) {
    const res = await apiFetch<any[]>("/projects/reorder", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
    });
    return res.map(normalizeProject);
}

/* ===========================
 * Social Links (per project)
 * =========================== */

// Replace a project’s social links set
export async function replaceProjectSocialLinks(
    token: string,
    projectId: number,
    links: Array<Pick<ProjectSocialLink, "platform" | "label" | "url">>
) {
    const res = await apiFetch<ProjectSocialLink[]>(
        `/projects/${projectId}/social-links`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(links),
        }
    );
    return res;
}

// Convenience: toggle publish
export async function setProjectPublished(
    token: string,
    id: number,
    isPublished: boolean
) {
    const res = await apiFetch<any>(`/projects/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished }),
    });
    return normalizeProject(res);
}

export async function searchProjects(params: {
    q?: string;
    category?: string;
    country?: string;
    sort?: "recent" | "a-z" | "z-a" | "started" | "popular";
    page?: number;
    perPage?: number;
}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.category) qs.set("category", params.category);
    if (params.country) qs.set("country", params.country);
    if (params.sort) qs.set("sort", params.sort);
    qs.set("page", String(params.page ?? 1));
    qs.set("perPage", String(params.perPage ?? 18));

    const res = await fetch(`${API_BASE}/projects/explore?${qs.toString()}`, { cache: "no-store" });

    //const res = await apiFetch<any[]>(`/projects/explore/${qs.toString() }`, { cache: "no-store" });

    if (!res.ok) throw new Error(`searchProjects ${res.status}`);
    return res.json() as Promise<{ total: number; page: number; perPage: number; items: ProjectLite[] }>;
}