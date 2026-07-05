'use client';
import Link from "next/link";

export default function PricingSection() {
    return (
        <section id="pricing" className="bg-gradient-to-b from-blue-50/50 to-white px-5 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-2xl border border-blue-100 bg-white/80 px-4 py-1 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                    Pricing
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                    Simple pricing, clear value
                </h2>

                <div className="mt-12 grid gap-8  lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-blue-100 bg-white p-6 text-left shadow-sm shadow-blue-950/5 sm:p-8">
                        <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">Free Plan</h3>
                        <p className="mt-2 text-sm text-zinc-600">Create and share your Tapstagram profile</p>

                        <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                            <li>• 1 Public Profile</li>
                            <li>• Unlimited Links</li>
                            <li>• Mobile-Optimized Layout</li>
                            <li>• Basic Explore Presence</li>
                        </ul>

                        <div className="mt-8 text-2xl font-bold text-slate-950 sm:text-3xl">Free</div>

                        <Link
                            href="/register"
                            className="mt-6 inline-flex rounded-2xl border border-blue-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50"
                        >
                            Get Started
                        </Link>
                    </div>

                    <div className="rounded-[2rem] border border-blue-900 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.22),transparent_30%),linear-gradient(135deg,#0f172a,#1e3a8a)] p-6 text-left text-white shadow-2xl shadow-blue-950/20 sm:p-8">
                        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-200">
                            Most Popular
                        </div>
                        <h3 className="mt-4 text-xl font-bold sm:text-2xl">Premium + NFC</h3>
                        <p className="mt-2 text-sm text-zinc-300">Custom presentation, analytics, and NFC card support</p>

                        <ul className="mt-6 space-y-3 text-sm text-zinc-200">
                            <li>• All Free Plan Features</li>
                            <li>• Premium Presentation Layer</li>
                            <li>• Better Design & Rich Sections</li>
                            <li>• Analytics & Engagement Insights</li>
                            <li>• NFC Card Ready</li>
                            <li>• Priority Support</li>
                        </ul>

                        <div className="mt-8 text-2xl font-bold sm:text-3xl">CHF 29</div>
                        <div className="mt-1 text-sm text-zinc-300">Launch offer</div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/subscription"
                                className="inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                            >
                                Upgrade to Premium
                            </Link>
                            <Link
                                href="/nfc-card"
                                className="inline-flex rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Order NFC Card
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
