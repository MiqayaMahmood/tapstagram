'use client';
import Link from "next/link";
const logo_url = "http://localhost:5000/media/Tapstagram_logo.jpg";
export default function NfcCardSection() {
    return (
        <section className="bg-white px-6 py-20">
            <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-400 px-6 py-20">
                    <div className="inline-flex rounded-xl bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600">
                        NFC Smart Card
                    </div>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                        Your Tapstagram profile, now in your pocket
                    </h2>

                    <p className="mt-5 text-base leading-8 text-zinc-600">
                        Replace paper business cards with a premium NFC-enabled Tapstagram card.
                        One tap opens your profile, projects, contact, and links instantly.
                    </p>

                    <ul className="mt-6 space-y-3 text-sm leading-7 text-zinc-600">
                        <li>• One-tap sharing on supported phones</li>
                        <li>• Premium, modern, memorable first impression</li>
                        <li>• Reusable card with updateable digital content</li>
                        <li>• Better than reprinting business cards again and again</li>
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/nfc-card"
                            className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                            Order your NFC card
                        </Link>
                        <Link
                            href="/subscription"
                            className="rounded-xl border border-zinc-400 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                        >
                            View premium plans
                        </Link>
                    </div>
                </div>

                <div className="relative ">
                    <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 shadow-2xl">
                        <div className="aspect-[1.6/1] rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-zinc-600 via-zinc-400 to-slate-500 p-6 text-white">
                            <div className="flex h-full flex-col justify-between">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-300">
                                        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
                                            <img src={logo_url} alt="Tapstagram" className="h-10  " />

                                        </Link>
                                    </div>
                                    <div className="mt-10 text-2xl font-semibold">Tapstagram NFC Premium Card</div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-sm text-zinc-300">Digital identity in one tap</div>
                                    </div>
                                    <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-5 -right-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg">
                        <div className="text-xs text-zinc-500">Instant share</div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900">NFC Enabled</div>
                    </div>
                </div>
            </div>
        </section>
    );
}