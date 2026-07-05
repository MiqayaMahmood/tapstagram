'use client';

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FooterSection() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
            {/* Pre-footer CTA */}
            <div className="mx-auto max-w-7xl px-6 pt-12">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-xl shadow-slate-950/20">
                    <div className="relative px-6 py-8 md:px-8 md:py-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(161,161,170,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.12),_transparent_30%)]" />
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Build your digital identity
                                </div>
                                <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                                    Create a profile people actually want to visit.
                                </h3>
                                <p className="mt-3 text-md leading-7 text-zinc-600 md:text-base">
                                    Showcase your profile, projects, links, and professional presence in one clean, modern space.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                >
                                    Get started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>

                                <Link
                                    href="/explore"
                                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                                >
                                    Explore profiles
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight text-white">
                                Tapstagram
                            </h3>
                            <p className="mt-2 max-w-sm text-md leading-6 text-slate-300">
                                Build a modern digital identity with profiles, projects, smart discovery,
                                and professional networking in one place.
                            </p>
                        </div>

                        <div className="inline-flex rounded-2xl bg-white/10 px-3 py-2 text-md font-medium text-slate-100 ring-1 ring-white/10">
                            Your digital identity in one tap
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-md font-semibold uppercase tracking-[0.14em] text-slate-100">
                            Product
                        </h4>
                        <ul className="mt-4 space-y-3 text-md text-slate-300">
                            <li>
                                <Link href="/explore" className="transition hover:text-white">
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="transition hover:text-white">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="transition hover:text-white">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/network" className="transition hover:text-white">
                                    My Network
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-md font-semibold uppercase tracking-[0.14em] text-slate-100">
                            Company
                        </h4>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li>
                                <Link href="/" className="transition hover:text-white">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" rel="noopener noreferrer" className="transition hover:text-white">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" rel="noopener noreferrer" className="transition hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" rel="noopener noreferrer" className="transition hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-md font-semibold uppercase tracking-[0.14em] text-slate-100">
                            Connect
                        </h4>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li>
                                <Link href="/contact" className="transition hover:text-white">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:contact@tapstagram.com" className="transition hover:text-white">
                                    contact@tapstagram.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://x.com/tapstagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition hover:text-white"
                                >
                                    X / Twitter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com/company/tapstagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition hover:text-white"
                                >
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} Tapstagram. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/privacy" className="transition hover:text-zinc-400">
                            Privacy
                        </Link>
                        <Link href="/terms" className="transition hover:text-zinc-400">
                            Terms
                        </Link>
                        <Link href="/contact" className="transition hover:text-zinc-400">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
