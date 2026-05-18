'use client';

import TrackedLink from '@/components/TrackedLink';
import type { IconType } from 'react-icons';
import {
    FaXTwitter,
    FaLinkedin,
    FaGithub,
    FaGitlab,
    FaYoutube,
    FaInstagram,
    FaFacebook,
    FaTiktok,
    FaReddit,
    FaDiscord,
    FaSlack,
    FaMedium,
    FaDev,
    FaStackOverflow,
    FaDribbble,
    FaBehance,
    FaTwitch,
    FaTelegram,
    FaWhatsapp,
    FaGlobe,
    FaEnvelope,
    FaPhone,
    FaPinterest,
    FaSnapchat,
    FaSpotify,
    FaFigma,
    FaDocker,
} from 'react-icons/fa6';
import {
    SiHashnode,
    SiLeetcode,
    SiNpm,
    SiKaggle,
    SiCodepen,
    SiBuymeacoffee,
} from 'react-icons/si';
import { FiLink } from 'react-icons/fi';

type SocialLink = {
    id: number;
    platform_name: string;
    url: string;
};

type PlatformMeta = {
    icon: IconType;
    label: string;
    bg: string;
    iconColor: string;
};

function getPlatformMeta(platform?: string | null, url?: string): PlatformMeta {
    const p = (platform || '').toLowerCase().trim();
    const u = (url || '').toLowerCase();

    if (p.includes('twitter') || p === 'x' || p.includes('x.com') || u.includes('x.com')) {
        return { icon: FaXTwitter, label: 'X', bg: 'bg-zinc-100', iconColor: 'text-black' };
    }
    if (p.includes('linkedin') || u.includes('linkedin.com')) {
        return { icon: FaLinkedin, label: 'LinkedIn', bg: 'bg-blue-50', iconColor: 'text-blue-700' };
    }
    if (p.includes('github') || u.includes('github.com')) {
        return { icon: FaGithub, label: 'GitHub', bg: 'bg-zinc-100', iconColor: 'text-zinc-900' };
    }
    if (p.includes('gitlab') || u.includes('gitlab.com')) {
        return { icon: FaGitlab, label: 'GitLab', bg: 'bg-orange-50', iconColor: 'text-orange-600' };
    }
    if (p.includes('youtube') || u.includes('youtube.com') || u.includes('youtu.be')) {
        return { icon: FaYoutube, label: 'YouTube', bg: 'bg-red-50', iconColor: 'text-red-600' };
    }
    if (p.includes('instagram') || u.includes('instagram.com')) {
        return { icon: FaInstagram, label: 'Instagram', bg: 'bg-pink-50', iconColor: 'text-pink-600' };
    }
    if (p.includes('facebook') || u.includes('facebook.com')) {
        return { icon: FaFacebook, label: 'Facebook', bg: 'bg-blue-50', iconColor: 'text-blue-600' };
    }
    if (p.includes('tiktok') || u.includes('tiktok.com')) {
        return { icon: FaTiktok, label: 'TikTok', bg: 'bg-zinc-100', iconColor: 'text-zinc-900' };
    }
    if (p.includes('reddit') || u.includes('reddit.com')) {
        return { icon: FaReddit, label: 'Reddit', bg: 'bg-orange-50', iconColor: 'text-orange-500' };
    }
    if (p.includes('discord') || u.includes('discord.gg') || u.includes('discord.com')) {
        return { icon: FaDiscord, label: 'Discord', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' };
    }
    if (p.includes('slack') || u.includes('slack.com')) {
        return { icon: FaSlack, label: 'Slack', bg: 'bg-purple-50', iconColor: 'text-purple-600' };
    }
    if (p.includes('medium') || u.includes('medium.com')) {
        return { icon: FaMedium, label: 'Medium', bg: 'bg-zinc-100', iconColor: 'text-zinc-900' };
    }
    if (p.includes('dev.to') || p === 'devto' || u.includes('dev.to')) {
        return { icon: FaDev, label: 'Dev.to', bg: 'bg-zinc-100', iconColor: 'text-zinc-900' };
    }
    if (p.includes('hashnode') || u.includes('hashnode.com')) {
        return { icon: SiHashnode, label: 'Hashnode', bg: 'bg-blue-50', iconColor: 'text-blue-600' };
    }
    if (p.includes('stack overflow') || p.includes('stackoverflow') || u.includes('stackoverflow.com')) {
        return { icon: FaStackOverflow, label: 'Stack Overflow', bg: 'bg-orange-50', iconColor: 'text-orange-600' };
    }
    if (p.includes('dribbble') || u.includes('dribbble.com')) {
        return { icon: FaDribbble, label: 'Dribbble', bg: 'bg-pink-50', iconColor: 'text-pink-500' };
    }
    if (p.includes('behance') || u.includes('behance.net')) {
        return { icon: FaBehance, label: 'Behance', bg: 'bg-blue-50', iconColor: 'text-blue-700' };
    }
    if (p.includes('figma') || u.includes('figma.com')) {
        return { icon: FaFigma, label: 'Figma', bg: 'bg-rose-50', iconColor: 'text-rose-500' };
    }
    if (p.includes('twitch') || u.includes('twitch.tv')) {
        return { icon: FaTwitch, label: 'Twitch', bg: 'bg-purple-50', iconColor: 'text-purple-600' };
    }
    if (p.includes('telegram') || u.includes('t.me') || u.includes('telegram.me')) {
        return { icon: FaTelegram, label: 'Telegram', bg: 'bg-sky-50', iconColor: 'text-sky-600' };
    }
    if (p.includes('whatsapp') || u.includes('wa.me') || u.includes('whatsapp.com')) {
        return { icon: FaWhatsapp, label: 'WhatsApp', bg: 'bg-green-50', iconColor: 'text-green-600' };
    }
    if (p.includes('pinterest') || u.includes('pinterest.com')) {
        return { icon: FaPinterest, label: 'Pinterest', bg: 'bg-red-50', iconColor: 'text-red-600' };
    }
    if (p.includes('snapchat') || u.includes('snapchat.com')) {
        return { icon: FaSnapchat, label: 'Snapchat', bg: 'bg-yellow-50', iconColor: 'text-yellow-500' };
    }
    if (p.includes('spotify') || u.includes('spotify.com')) {
        return { icon: FaSpotify, label: 'Spotify', bg: 'bg-green-50', iconColor: 'text-green-600' };
    }
    if (p.includes('leetcode') || u.includes('leetcode.com')) {
        return { icon: SiLeetcode, label: 'LeetCode', bg: 'bg-amber-50', iconColor: 'text-amber-600' };
    }
    if (p.includes('npm') || u.includes('npmjs.com')) {
        return { icon: SiNpm, label: 'npm', bg: 'bg-red-50', iconColor: 'text-red-600' };
    }
    if (p.includes('docker') || u.includes('docker.com')) {
        return { icon: FaDocker, label: 'Docker', bg: 'bg-sky-50', iconColor: 'text-sky-600' };
    }
    if (p.includes('kaggle') || u.includes('kaggle.com')) {
        return { icon: SiKaggle, label: 'Kaggle', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' };
    }
    if (p.includes('codepen') || u.includes('codepen.io')) {
        return { icon: SiCodepen, label: 'CodePen', bg: 'bg-zinc-100', iconColor: 'text-zinc-900' };
    }
    if (p.includes('buy me a coffee') || u.includes('buymeacoffee.com')) {
        return { icon: SiBuymeacoffee, label: 'Buy Me a Coffee', bg: 'bg-yellow-50', iconColor: 'text-yellow-600' };
    }
    if (p.includes('email') || u.startsWith('mailto:')) {
        return { icon: FaEnvelope, label: 'Email', bg: 'bg-zinc-100', iconColor: 'text-zinc-700' };
    }
    if (p.includes('phone') || u.startsWith('tel:')) {
        return { icon: FaPhone, label: 'Phone', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' };
    }
    if (
        p.includes('website') ||
        p.includes('portfolio') ||
        p.includes('blog') ||
        u.startsWith('http')
    ) {
        return { icon: FaGlobe, label: 'Website', bg: 'bg-sky-50', iconColor: 'text-sky-700' };
    }

    return { icon: FiLink, label: platform || 'Link', bg: 'bg-zinc-100', iconColor: 'text-zinc-700' };
}

export default function ProfileSocials({
    profileId,
    links,
}: {
    profileId: number;
    links: SocialLink[];
}) {
    if (!links?.length) {
        return (
            <div className="rounded-xl border border-zinc-300 bg-white p-4 text-sm text-zinc-500">
                No social links.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-zinc-400 bg-white p-4 shadow-sm">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-zinc-900">Connect</h3>
                <p className="text-md text-zinc-900">Socials, websites, and developer platforms</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {links.map((link) => {
                    const meta = getPlatformMeta(link.platform_name, link.url);
                    const Icon = meta.icon;

                    return (
                        <TrackedLink
                            key={link.id}
                            kind="social"
                            linkId={link.id}
                            profileId={profileId}
                            href={link.url}
                            className="group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-400 bg-white px-4 py-3 transition hover:-translate-y-0.5  hover:shadow-lg"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}
                            >
                                <Icon className={`text-2xl ${meta.iconColor}`} />
                            </div>

                            <div className="min-w-0">
                                <div className="truncate text-md font-semibold text-zinc-900">
                                    {meta.label}
                                </div>
                                <div className="truncate text-sm text-zinc-800">
                                    {link.url.replace('www.', '').replace('https://', '')}
                                </div>
                            </div>
                        </TrackedLink>
                    );
                })}
            </div>
        </div>
    );
}

//'use client';
//import TrackedLink from '@/components/TrackedLink';

//const iconFor = (platform?: string | null) => {
//    const p = (platform || '').toLowerCase();
//    if (p.includes('twitter') || p.includes('x')) return '𝕏';
//    if (p.includes('linkedin')) return 'in';
//    if (p.includes('github')) return '{ }';
//    if (p.includes('youtube')) return '▶';
//    if (p.includes('instagram')) return '◎';
//    if (p.includes('facebook')) return 'f';
//    return '🔗';
//};

//export default function ProfileSocials({ profileId, links }: {
//    profileId: number;
//    links: { id: number; platform_name: string; url: string }[];
//}) {
//    if (!links?.length) {
//        return <div className="border border-zinc-400 rounded-xl p-4 bg-white text-md text-gray-900">No social links.</div>;
//    }
//    return (
//        <div className="border rounded-xl border-zinc-400 p-3 bg-white">
//            <div className="flex flex-wrap gap-2">
//                {links.map(l => (
//                    <TrackedLink key={l.id} kind="social" linkId={l.id} profileId={profileId} href={l.url}
//                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-sm hover:bg-gray-50">
//                        <span className="font-mono text-xs">{iconFor(l.platform_name)}</span>
//                        <span className="truncate max-w-[180px]"> @ {l.platform_name}</span>
//                    </TrackedLink>
//                ))}
//            </div>
//        </div>
//    );
//}
