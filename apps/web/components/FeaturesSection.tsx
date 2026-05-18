'use client';

import { BarChart3, ContactRound, Link2, ShieldCheck, Smartphone, CreditCard } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            title: 'NFC Smart Card',
            description: 'Share your profile instantly with a tap-enabled smart card.',
            icon: CreditCard,
        },
        {
            title: 'Unlimited Links',
            description: 'Add socials, website, portfolio, booking links, and more.',
            icon: Link2,
        },
        {
            title: 'Mobile-Optimized Profiles',
            description: 'A polished experience across phone, tablet, and desktop.',
            icon: Smartphone,
        },
        {
            title: 'Save & Bookmark',
            description: 'Visitors can save profiles and projects to revisit later.',
            icon: ContactRound,
        },
        {
            title: 'Analytics',
            description: 'Track visits, engagement, bookmarks, and premium performance.',
            icon: BarChart3,
        },
        {
            title: 'Professional Identity',
            description: 'A better way to present yourself or your business online.',
            icon: ShieldCheck,
        },
    ];

    return (
        <section id="features" className="bg-zinc-50 px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex rounded-xl border border-zinc-400 bg-white px-3 py-1 text-md font-medium text-zinc-600 shadow-sm">
                        Platform Features
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                        Why professionals choose Tapstagram
                    </h2>
                    <p className="mt-4 text-base leading-8 text-zinc-600">
                        More than a simple profile page — Tapstagram gives you a modern digital identity,
                        discoverability, analytics, and NFC-powered sharing.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <div key={idx} className="rounded-xl border border-zinc-400 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-5 text-xl font-semibold text-zinc-900">{f.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-zinc-600">{f.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}