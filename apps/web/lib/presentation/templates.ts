import type { PresentationDocument } from "./types";

export function makeDefaultProfilePresentation(profile: {
    name?: string | null;
    title?: string | null;
    bio?: string | null;
    profile_picture_url?: string | null;
    hero_banner_url?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
}): PresentationDocument {
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
                    headline: profile.name || "Your Name",
                    subheadline: profile.title || profile.bio || "Professional profile",
                    align: "center",
                    imageUrl: profile.hero_banner_url || profile.profile_picture_url || undefined,
                },
            },
            {
                id: "rich-1",
                type: "richText",
                data: {
                    title: "About",
                    html: `<p>${profile.bio || "Tell your story here."}</p>`,
                },
            },
            {
                id: "contact-1",
                type: "contact",
                data: {
                    title: "Contact",
                    showEmail: true,
                    showPhone: true,
                    showLocation: true,
                },
            },
            {
                id: "cta-1",
                type: "cta",
                data: {
                    headline: "Let’s connect",
                    text: "Reach out to discuss opportunities, projects, and collaborations.",
                    buttonText: "Get in touch",
                    buttonLink: "#contact",
                },
            },
        ],
    };
}

export function makeDefaultProjectPresentation(project: {
    title?: string | null;
    bio?: string | null;
    longDescription?: string | null;
    coverImageUrl?: string | null;
    website?: string | null;
}): PresentationDocument {
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
                    headline: project.title || "Project Title",
                    subheadline: project.bio || "A better way to present your business or project.",
                    align: "left",
                    imageUrl: project.coverImageUrl || undefined,
                    ctaText: project.website ? "Visit website" : undefined,
                    ctaLink: project.website || undefined,
                },
            },
            {
                id: "rich-1",
                type: "richText",
                data: {
                    title: "Overview",
                    html: `<p>${project.longDescription || project.bio || "Describe your project here."}</p>`,
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
                    text: "Reach out to learn more, request details, or start a conversation.",
                    buttonText: "Contact",
                    buttonLink: "#contact",
                },
            },
        ],
    };
}