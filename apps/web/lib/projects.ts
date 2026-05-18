// lib/projects.ts
import { z } from "zod";

export const ProjectCategoryEnum = z.enum(["DISTRIBUTIONS", "eCOMMERCE", "EDUCATION", "ELECTRICAL_ELECTRONICS",
        "FINANCE", "FOOD_BEVREGES", "HEALTHCARE", "HOTEL_RESTAURANT",
        "IMPORT_EXPORT", "INDUSTRIAL_MACHINARY", "MANUFACTURING", "MARKETING",
        "REAL_ESTATE", "RETAIL", "SALES", "SERVICES",
        "SOFTWARE", "TRADING", "OTHER"]);

export const ProjectSocialLinkSchema = z.object({
    id: z.string().cuid().optional(),  //z.number().optional(),
    platform: z.string().min(1), // or enum if you have one
    label: z.string().max(80).optional().nullable(),
    url: z.string().url(),
    sort_order: z.number().int().optional(),
});

export const ProjectUpsertSchema = z.object({
    // ---- basic
    profileId: z.number(),
    title: z.string().min(2).max(100),
    slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
    category: ProjectCategoryEnum.nullable().optional(),
    targetIndustry: z.string().max(120).optional().nullable(),
    bio: z.string().max(200).optional().nullable(),
    description: z.string().optional().nullable(),         // short/markdown
    longDescription: z.string().optional().nullable(),     // markdown (long)

    // contact/address
    url: z.string().url().optional().nullable(),
    website: z.string().url().optional().nullable(),
    contactEmail: z.string().email().optional().nullable(),
    contactPhone: z.string().max(40).optional().nullable(),
    addressLine1: z.string().max(120).optional().nullable(),
    addressLine2: z.string().max(120).optional().nullable(),
    city: z.string().max(80).optional().nullable(),
    region: z.string().max(80).optional().nullable(),
    postalCode: z.string().max(20).optional().nullable(),
    country: z.string().max(80).optional().nullable(),
    locationLat: z.coerce.number().optional().nullable(),
    locationLng: z.coerce.number().optional().nullable(),

    // ops
    startedOn: z.coerce.date().optional().nullable(),
    isPublished: z.coerce.boolean().optional().default(false),
    coverImageUrl: z.string().url().optional().nullable(),
    sort_order: z.number().int().optional().default(0),

    // project-scoped links
    socialLinks: z.array(ProjectSocialLinkSchema).default([]),
    plan: z.string().max(10).optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof ProjectUpsertSchema>;

