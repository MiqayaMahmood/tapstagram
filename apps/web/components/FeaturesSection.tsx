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
        <section id="features" className="bg-gradient-to-b from-white via-blue-50/40 to-slate-50 px-5 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex rounded-2xl border border-blue-100 bg-white/80 px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                        Platform Features
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                        Why professionals choose Tapstagram
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                        More than a simple profile page — Tapstagram gives you a modern digital identity,
                        discoverability, analytics, and NFC-powered sharing.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <div key={idx} className="group rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-blue-100 hover:bg-white hover:shadow-md hover:shadow-blue-950/10 sm:p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:scale-105">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold text-slate-950 sm:text-xl">{f.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{f.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
