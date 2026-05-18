import type { LucideIcon } from "lucide-react";
import {
    Globe,
    Mail,
    Phone,
    MessageCircle,
    Send,
    Video,
    MonitorPlay,
    Camera,
    Music,
    ShoppingBag,
    PenTool,
    FileText,
    Code2,
    Radio,
    Users,
    Briefcase,
    Calendar,
    Link,
    ContactRound,
    Hash,
    Newspaper,
    Store,
    Palette,
    Podcast,
    BookOpen,
    Building2,
    MapPin,
} from "lucide-react";

export type PlatformCategory =
    | "core"
    | "social"
    | "professional"
    | "video"
    | "creator"
    | "messaging"
    | "developer"
    | "creative"
    | "audio"
    | "community"
    | "commerce"
    | "portfolio"
    | "regional"
    | "contact"
    | "other";

export const SOCIAL_PLATFORMS = [
    // Core
    {
        key: "website",
        label: "Website",
        icon: Globe,
        placeholder: "https://yourwebsite.com",
        category: "core",
    },
    {
        key: "email",
        label: "Email",
        icon: Mail,
        placeholder: "mailto:name@example.com",
        category: "core",
    },
    {
        key: "phone",
        label: "Phone",
        icon: Phone,
        placeholder: "tel:+41791234567",
        category: "core",
    },

    // Social
    {
        key: "facebook",
        label: "Facebook",
        icon: Users,
        placeholder: "https://facebook.com/username",
        category: "social",
    },
    {
        key: "instagram",
        label: "Instagram",
        icon: Camera,
        placeholder: "https://instagram.com/username",
        category: "social",
    },
    {
        key: "threads",
        label: "Threads",
        icon: MessageCircle,
        placeholder: "https://threads.net/@username",
        category: "social",
    },
    {
        key: "twitter",
        label: "Twitter",
        icon: MessageCircle,
        placeholder: "https://twitter.com/username",
        category: "social",
    },
    {
        key: "x",
        label: "X",
        icon: MessageCircle,
        placeholder: "https://x.com/username",
        category: "social",
    },
    {
        key: "snapchat",
        label: "Snapchat",
        icon: Camera,
        placeholder: "https://snapchat.com/add/username",
        category: "social",
    },
    {
        key: "pinterest",
        label: "Pinterest",
        icon: Palette,
        placeholder: "https://pinterest.com/username",
        category: "social",
    },

    // Professional
    {
        key: "linkedin",
        label: "LinkedIn",
        icon: Briefcase,
        placeholder: "https://linkedin.com/in/username",
        category: "professional",
    },
    {
        key: "indeed",
        label: "Indeed",
        icon: Briefcase,
        placeholder: "https://indeed.com/profile/username",
        category: "professional",
    },
    {
        key: "glassdoor",
        label: "Glassdoor",
        icon: Building2,
        placeholder: "https://glassdoor.com/",
        category: "professional",
    },

    // Video
    {
        key: "youtube",
        label: "YouTube",
        icon: MonitorPlay,
        placeholder: "https://youtube.com/@channel",
        category: "video",
    },
    {
        key: "vimeo",
        label: "Vimeo",
        icon: Video,
        placeholder: "https://vimeo.com/username",
        category: "video",
    },
    {
        key: "twitch",
        label: "Twitch",
        icon: MonitorPlay,
        placeholder: "https://twitch.tv/username",
        category: "video",
    },
    {
        key: "kick",
        label: "Kick",
        icon: MonitorPlay,
        placeholder: "https://kick.com/username",
        category: "video",
    },

    // Creator
    {
        key: "tiktok",
        label: "TikTok",
        icon: Video,
        placeholder: "https://tiktok.com/@username",
        category: "creator",
    },
    {
        key: "medium",
        label: "Medium",
        icon: Newspaper,
        placeholder: "https://medium.com/@username",
        category: "creator",
    },
    {
        key: "substack",
        label: "Substack",
        icon: Newspaper,
        placeholder: "https://substack.com/@username",
        category: "creator",
    },

    // Messaging
    {
        key: "whatsapp",
        label: "WhatsApp",
        icon: MessageCircle,
        placeholder: "https://wa.me/41791234567",
        category: "messaging",
    },
    {
        key: "telegram",
        label: "Telegram",
        icon: Send,
        placeholder: "https://t.me/username",
        category: "messaging",
    },
    {
        key: "signal",
        label: "Signal",
        icon: MessageCircle,
        placeholder: "https://signal.me/#p/+41791234567",
        category: "messaging",
    },
    {
        key: "discord",
        label: "Discord",
        icon: MessageCircle,
        placeholder: "https://discord.gg/invite",
        category: "messaging",
    },
    {
        key: "slack",
        label: "Slack",
        icon: MessageCircle,
        placeholder: "https://workspace.slack.com",
        category: "messaging",
    },
    {
        key: "wechat",
        label: "WeChat",
        icon: MessageCircle,
        placeholder: "https://wechat.com/",
        category: "messaging",
    },

    // Developer
    {
        key: "github",
        label: "GitHub",
        icon: Code2,
        placeholder: "https://github.com/username",
        category: "developer",
    },
    {
        key: "gitlab",
        label: "GitLab",
        icon: Code2,
        placeholder: "https://gitlab.com/username",
        category: "developer",
    },
    {
        key: "bitbucket",
        label: "Bitbucket",
        icon: Code2,
        placeholder: "https://bitbucket.org/username",
        category: "developer",
    },
    {
        key: "stackoverflow",
        label: "Stack Overflow",
        icon: Code2,
        placeholder: "https://stackoverflow.com/users/userid",
        category: "developer",
    },
    {
        key: "devto",
        label: "DEV.to",
        icon: Code2,
        placeholder: "https://dev.to/username",
        category: "developer",
    },
    {
        key: "hashnode",
        label: "Hashnode",
        icon: Code2,
        placeholder: "https://hashnode.com/@username",
        category: "developer",
    },

    // Creative
    {
        key: "dribbble",
        label: "Dribbble",
        icon: PenTool,
        placeholder: "https://dribbble.com/username",
        category: "creative",
    },
    {
        key: "behance",
        label: "Behance",
        icon: PenTool,
        placeholder: "https://behance.net/username",
        category: "creative",
    },
    {
        key: "figma",
        label: "Figma",
        icon: PenTool,
        placeholder: "https://figma.com/@username",
        category: "creative",
    },
    {
        key: "artstation",
        label: "ArtStation",
        icon: Palette,
        placeholder: "https://artstation.com/username",
        category: "creative",
    },

    // Audio
    {
        key: "spotify",
        label: "Spotify",
        icon: Music,
        placeholder: "https://open.spotify.com/user/username",
        category: "audio",
    },
    {
        key: "soundcloud",
        label: "SoundCloud",
        icon: Music,
        placeholder: "https://soundcloud.com/username",
        category: "audio",
    },
    {
        key: "applepodcasts",
        label: "Apple Podcasts",
        icon: Podcast,
        placeholder: "https://podcasts.apple.com/",
        category: "audio",
    },

    // Community
    {
        key: "reddit",
        label: "Reddit",
        icon: MessageCircle,
        placeholder: "https://reddit.com/user/username",
        category: "community",
    },
    {
        key: "quora",
        label: "Quora",
        icon: BookOpen,
        placeholder: "https://quora.com/profile/username",
        category: "community",
    },

    // Commerce
    {
        key: "shopify",
        label: "Shopify",
        icon: Store,
        placeholder: "https://yourstore.myshopify.com",
        category: "commerce",
    },
    {
        key: "etsy",
        label: "Etsy",
        icon: ShoppingBag,
        placeholder: "https://etsy.com/shop/shopname",
        category: "commerce",
    },
    {
        key: "amazon",
        label: "Amazon",
        icon: ShoppingBag,
        placeholder: "https://amazon.com/shop/brand",
        category: "commerce",
    },
    {
        key: "ebay",
        label: "eBay",
        icon: ShoppingBag,
        placeholder: "https://ebay.com/usr/username",
        category: "commerce",
    },

    // Portfolio
    {
        key: "linktree",
        label: "Linktree",
        icon: Link,
        placeholder: "https://linktr.ee/username",
        category: "portfolio",
    },
    {
        key: "notion",
        label: "Notion",
        icon: FileText,
        placeholder: "https://notion.site/your-page",
        category: "portfolio",
    },

    // Regional
    {
        key: "line",
        label: "LINE",
        icon: MessageCircle,
        placeholder: "https://line.me/",
        category: "regional",
    },
    {
        key: "kakao",
        label: "KakaoTalk",
        icon: MessageCircle,
        placeholder: "https://kakao.com/",
        category: "regional",
    },
    {
        key: "vk",
        label: "VK",
        icon: Users,
        placeholder: "https://vk.com/username",
        category: "regional",
    },

    // Contact / Utility
    {
        key: "vcard",
        label: "vCard",
        icon: ContactRound,
        placeholder: "https://example.com/contact.vcf",
        category: "contact",
    },
    {
        key: "calendar",
        label: "Calendar / Booking",
        icon: Calendar,
        placeholder: "https://calendly.com/username",
        category: "contact",
    },
    {
        key: "location",
        label: "Location / Maps",
        icon: MapPin,
        placeholder: "https://maps.google.com/...",
        category: "contact",
    },

    // Other
    {
        key: "custom",
        label: "Custom Link",
        icon: Globe,
        placeholder: "https://example.com",
        category: "other",
    },
] as const satisfies readonly {
    key: string;
    label: string;
    icon: LucideIcon;
    placeholder: string;
    category: PlatformCategory;
}[];

export type PlatformKey = typeof SOCIAL_PLATFORMS[number]["key"];

export const PlatformIcon = (id: string) =>
    SOCIAL_PLATFORMS.find((p) => p.key === id.toLowerCase())?.icon ?? Globe;