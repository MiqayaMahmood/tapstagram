// src/types/links.ts
export type SocialLinkCreate = {
    profileId: number;       // you can also infer from req.user + profile find if you prefer
    platform_name: string;
    url: string;
    icon?: string | null;
    category?: string | null;
    sort_order?: number;
};
export type SocialLinkUpdate = Partial<SocialLinkCreate>;

export type ProjectCreate = {
    profileId: number;
    title: string;
    slug?: string | null;
    category?: string | null;
    targetIndustry?: string | null;
    bio?: string | null;
    description?: string | null;
    url?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
    locationLat?: number | null;
    locationLng?: number | null;
    isPublished?: number ;
    coverImageUrl?: string | null;
    sort_order?: number;

};
export type ProjectUpdate = Partial<ProjectCreate>;

export type ReorderBody = {
    items: Array<{ id: number; sort_order: number }>;
};
