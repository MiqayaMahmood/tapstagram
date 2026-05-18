import { z } from "zod";

const CategoryEnum = z.enum(["DISTRIBUTIONS", "eCOMMERCE", "EDUCATION", "ELECTRICAL_ELECTRONICS",
        "FINANCE", "FOOD_BEVREGES", "HEALTHCARE", "HOTEL_RESTAURANT",
        "IMPORT_EXPORT", "INDUSTRIAL_MACHINARY", "MANUFACTURING", "MARKETING",
        "REAL_ESTATE", "RETAIL", "SALES", "SERVICES",
        "SOFTWARE", "TRADING", "OTHER"]);

const PlatformEnum = z.enum([
  "WEBSITE",
  "FACEBOOK",
  "INSTAGRAM",
  "X",
  "LINKEDIN",
  "YOUTUBE",
  "TIKTOK",
  "GITHUB",
  "TELEGRAM",
  "WHATSAPP",
  "DRIBBLE",
  "BEHANCE",
  "REDDIT",
  "OTHER",
  
]);

export const ProjectSocialLinkSchema = z.object({
    id: z.string().optional(),
    platform: PlatformEnum,
    label: z.string().max(80).optional().nullable(),
    url: z.string().url()
});



export const ProjectUpsertSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
    category: CategoryEnum ,//z.enum(["MANUFACTURING", "TRADING", "SALES", "SERVICES", "SOFTWARE", "OTHER"]),
    targetIndustry: z.string().max(120).optional().nullable(),
    bio: z.string().max(200).optional().nullable(),
    longDescription: z.string().max(20_000).optional().nullable(),
    startedOn: z.string().datetime().optional().nullable(),
    // contact
    contactEmail: z.string().email().optional().nullable(),
    contactPhone: z.string().max(30).optional().nullable(),
    website: z.string().url().optional().nullable(),
    // address
    addressLine1: z.string().max(120).optional().nullable(),
    addressLine2: z.string().max(120).optional().nullable(),
    city: z.string().max(80).optional().nullable(),
    region: z.string().max(80).optional().nullable(),
    postalCode: z.string().max(20).optional().nullable(),
    country: z.string().max(80).optional().nullable(),
    locationLat: z.number().optional().nullable(),
    locationLng: z.number().optional().nullable(),
    isPublished: z.boolean().optional(),
    coverImageUrl: z.string().url().optional().nullable(),

    socialLinks: z.array(ProjectSocialLinkSchema).default([])
});
