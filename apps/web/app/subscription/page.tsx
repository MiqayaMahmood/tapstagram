import Link from "next/link";

export default function SubscriptionPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-slate-100 px-6 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-[2rem] border border-zinc-400 bg-white p-8 shadow-sm">
                    <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                        Premium Subscription
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">
                        Upgrade to Tapstagram Premium
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600">
                        Unlock richer presentation pages, enhanced design controls, analytics, stronger discovery,
                        and premium tools to present yourself or your business more professionally.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-zinc-400 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-zinc-900">What’s included</h2>
                        <ul className="mt-6 space-y-3 text-md text-zinc-900">
                            <li className="text-2xl font-semibold text-zinc-900"> Tapstagram NFC Premium Card</li>
                            <li>• Premium profile presentation </li>
                            <li>• Premium project/business presentation</li>
                            <li>• Additional sections, layouts, and themes</li>
                            <li>• Better branding and conversion-oriented pages</li>
                            <li>• Analytics and engagement insights</li>
                            <li>• Premium support and future advanced features</li>
                        </ul>
                    </div>

                    <div className="rounded-[2rem] border border-zinc-900 bg-zinc-900 p-8 text-white shadow-2xl">
                        <h2 className="text-2xl font-semibold">Premium Plan</h2>
                        <div className="mt-6 text-5xl font-bold">CHF 29</div>
                        <div className="mt-2 text-sm text-zinc-300">Launch pricing</div>

                        <div className="mt-8 space-y-3">
                            <Link
                                href="/contact"
                                className="block w-full rounded-2xl bg-white text-center px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300"
                            >
                                Subscribe Now
                            </Link>

                            <Link
                                href="/nfc-card"
                                className="block w-full rounded-2xl border border-white/20 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Order additional Tapstagram NFC Premium Card
                            </Link>
                        </div>

                        <p className="mt-6 text-xs leading-6 text-zinc-400">
                            Hook this button to your payment provider or subscription checkout flow.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}