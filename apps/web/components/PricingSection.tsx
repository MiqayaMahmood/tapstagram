'use client';
import Link from "next/link";

export default function PricingSection() {
    return (
        <section id="pricing" className="bg-zinc-50 px-6 py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-xl border border-zinc-400 bg-white px-4 py-1 text-md font-medium text-zinc-900 shadow-sm">
                    Pricing
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                    Simple pricing, clear value
                </h2>

                <div className="mt-12 grid gap-8  lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-zinc-400 bg-white p-8 text-left shadow-sm">
                        <h3 className="text-2xl font-bold text-zinc-900">Free Plan</h3>
                        <p className="mt-2 text-sm text-zinc-600">Create and share your Tapstagram profile</p>

                        <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                            <li>• 1 Public Profile</li>
                            <li>• Unlimited Links</li>
                            <li>• Mobile-Optimized Layout</li>
                            <li>• Basic Explore Presence</li>
                        </ul>

                        <div className="mt-8 text-3xl font-bold text-zinc-900">Free</div>

                        <Link
                            href="/register"
                            className="mt-6 inline-flex rounded-2xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Get Started
                        </Link>
                    </div>

                    <div className="rounded-[2rem] border border-zinc-900 bg-zinc-900 p-8 text-left text-white shadow-2xl">
                        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-200">
                            Most Popular
                        </div>
                        <h3 className="mt-4 text-2xl font-bold">Premium + NFC</h3>
                        <p className="mt-2 text-sm text-zinc-300">Custom presentation, analytics, and NFC card support</p>

                        <ul className="mt-6 space-y-3 text-sm text-zinc-200">
                            <li>• All Free Plan Features</li>
                            <li>• Premium Presentation Layer</li>
                            <li>• Better Design & Rich Sections</li>
                            <li>• Analytics & Engagement Insights</li>
                            <li>• NFC Card Ready</li>
                            <li>• Priority Support</li>
                        </ul>

                        <div className="mt-8 text-3xl font-bold">CHF 29</div>
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