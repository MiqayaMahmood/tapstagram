import type { Metadata } from "next";
import type { ReactNode } from "react";
import LegalPageShell from "@/components/layout/LegalPageShell";
import Link from "next/link";
import {
    HelpCircle,
    ShieldCheck,
    UserCircle2,
    ImageIcon,
    Globe,
    CreditCard,
    ExternalLink,
    MessageCircleMore,
} from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ — Tapstagram",
    description: "Frequently asked questions about Tapstagram, profiles, projects, privacy, premium features, and NFC cards.",
};

type FAQItem = {
    q: string;
    a: ReactNode;
};

const faqs: FAQItem[] = [
    {
        q: "What is Tapstagram?",
        a: "Tapstagram is a digital identity platform for individuals, creators, professionals, and businesses. It helps you create a profile, publish projects, share links, connect through NFC cards, and track engagement over time.",
    },
    {
        q: "Who can use Tapstagram?",
        a: "Tapstagram can be used by individuals, professionals, creators, startups, businesses, and organizations that comply with our Terms of Service and applicable law.",
    },
    {
        q: "Do I need an account to use Tapstagram?",
        a: "You can browse some public pages without signing in, but an account is required to create or manage a profile, publish projects, bookmark, follow, use dashboard features, and access personalized tools.",
    },
    {
        q: "Is my profile public?",
        a: "Public visibility depends on how your profile or page is configured. Some content may be visible publicly to help discovery and sharing. You are responsible for deciding what information you publish.",
    },
    {
        q: "Can I update my profile and projects later?",
        a: "Yes. You can edit your profile, projects, social links, media, banners, and related content through your dashboard, subject to moderation and system limitations.",
    },
    {
        q: "Can I upload profile photos, banners, and project media?",
        a: "Yes, where those features are enabled. You should only upload content you own or are allowed to use. You remain responsible for copyright, trademark, privacy, and licensing issues related to your uploads.",
    },
    {
        q: "Who owns the content I upload?",
        a: "You keep ownership of your content. By uploading it to Tapstagram, you give us the limited rights needed to host, display, process, and distribute that content so the service can function properly.",
    },
    {
        q: "What is a Tapstagram NFC card?",
        a: "A Tapstagram NFC card is a physical card that can connect people directly to your digital identity, profile, or business page with a tap on compatible devices.",
    },
    {
        q: "Do I need a premium plan to use Tapstagram?",
        a: "No. Core features may be available without a premium subscription. Premium plans may unlock additional customization, presentation, branding, analytics, or business-focused tools.",
    },
    {
        q: "Can I order an NFC card or upgrade later?",
        a: "Yes. If those services are available in your region, you can order a Tapstagram NFC card or upgrade to premium features later through the platform.",
    },
    {
        q: "Does Tapstagram use cookies?",
        a: (
            <>
                Yes. Tapstagram may use cookies and similar technologies for authentication,
                security, analytics, preferences, and service functionality. See the{" "}
                <Link href="/cookie" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700">
                    Cookie Policy
                </Link>{" "}
                for more information.
            </>
        ),
    },
    {
        q: "How does Tapstagram handle privacy?",
        a: (
            <>
                Tapstagram explains how we collect, use, and protect data in our{" "}
                <Link href="/privacy" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700">
                    Privacy Policy
                </Link>
                . We recommend reviewing it before publishing personal or business information.
            </>
        ),
    },
    {
        q: "Can visitors contact me through my page?",
        a: "If contact or lead features are enabled on your profile or project page, visitors may be able to send you inquiries. You are responsible for responding to those inquiries and handling submitted data appropriately.",
    },
    {
        q: "Can I delete my account or remove content?",
        a: "Yes. You may be able to delete or update your content and request account deletion, subject to legal, security, fraud-prevention, backup, and compliance-related retention requirements.",
    },
    {
        q: "Does Tapstagram guarantee traffic, leads, or business results?",
        a: "No. Tapstagram provides tools to help users present themselves and connect with others, but we do not guarantee traffic, search ranking, leads, sales, visibility, or business outcomes.",
    },
    {
        q: "Where can I get help or contact Tapstagram?",
        a: (
            <>
                You can reach us through the{" "}
                <Link href="/contact" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700">
                    Contact page
                </Link>{" "}
                for support, partnership inquiries, premium requests, or general questions.
            </>
        ),
    },
];

const highlights = [
    {
        icon: HelpCircle,
        title: "Quick answers",
        text: "Essential information about profiles, projects, privacy, premium features, and NFC cards.",
        color: "bg-blue-100 text-blue-700",
    },
    {
        icon: ShieldCheck,
        title: "Clear policies",
        text: "Understand how content, privacy, cookies, and platform responsibilities are handled.",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        icon: MessageCircleMore,
        title: "Need more help?",
        text: "If your question is not covered here, you can reach out to the Tapstagram team directly.",
        color: "bg-violet-100 text-violet-700",
    },
];

export default function FAQPage() {
    return (
        <LegalPageShell>
            <main>
                <div className="mx-auto max-w-7xl py-2">
                    {/* Hero */}
                    <div className="rounded-2xl border border-zinc-300 bg-white p-8 shadow-sm">
                        <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            Support
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                            Frequently Asked Questions
                        </h1>

                        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
                            Common questions about using Tapstagram, creating digital profiles,
                            publishing projects, managing content, privacy, premium features,
                            and NFC cards.
                        </p>

                        <div className="mt-6 grid gap-3 md:grid-cols-3">
                            {highlights.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                                    >
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h2 className="mt-3 text-sm font-semibold text-zinc-900">
                                            {item.title}
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-zinc-600">
                                            {item.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FAQ cards */}
                    <div className="mt-4 space-y-3">
                        {faqs.map((item, idx) => {
                            const icons = [
                                UserCircle2,
                                Globe,
                                ImageIcon,
                                CreditCard,
                                ShieldCheck,
                                ExternalLink,
                            ];
                            const Icon = icons[idx % icons.length];

                            return (
                                <section
                                    key={item.q}
                                    className="rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold text-zinc-900">
                                                {item.q}
                                            </h2>
                                            <div className="mt-3 text-sm leading-7 text-zinc-600">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {/* Bottom help section */}
                    <div className="mt-6 rounded-2xl border border-zinc-300 bg-gradient-to-r from-zinc-50 to-white p-6 shadow-sm">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Still have questions?
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-zinc-600">
                                    Reach out for support, partnerships, premium upgrades, NFC card
                                    inquiries, or product questions.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/contact"
                                    className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
                                >
                                    Contact us
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </LegalPageShell>
    );
}