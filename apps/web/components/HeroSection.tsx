'use client';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative isolate overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="hero-animated absolute inset-0" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue to-transparent" />
                <div className="hero-blob absolute -right-24 top-16 h-[420px] w-[420px] rounded-full opacity-60" />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-20">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm text-zinc-700 backdrop-blur">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Tap. Share. Grow.
                    </div>

                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-6xl">
                        Your smart NFC profile that actually converts
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 md:text-lg">
                        Share your profile, projects, contact, and links in one polished experience —
                        built for mobile, branded for you, and ready for real networking.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/register"
                            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                            Get started free
                        </Link>
                        <Link
                            href="/subscription"
                            className="rounded-xl border border-zinc-400 bg-white/80 px-6 py-3 text-sm font-medium text-zinc-700 backdrop-blur transition hover:bg-white"
                        >
                            Go Premium
                        </Link>
                    </div>

                    <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 text-sm text-zinc-600 md:grid-cols-4">
                        <div className="rounded-2xl border border-zinc-400 bg-white/70 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-zinc-900">Unlimited</div>
                            <div className="mt-1">links</div>
                        </div>
                        <div className="rounded-2xl border border-zinc-400 bg-white/70 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-zinc-900">Custom</div>
                            <div className="mt-1">themes</div>
                        </div>
                        <div className="rounded-2xl border border-zinc-400 bg-white/70 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-zinc-900">Real-time</div>
                            <div className="mt-1">analytics</div>
                        </div>
                        <div className="rounded-2xl border border-zinc-400 bg-white/70 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-zinc-900">NFC</div>
                            <div className="mt-1">ready</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl">
                        <div className="aspect-[4/5] w-full bg-gradient-to-br from-zinc-100 via-slate-100 to-zinc-200">
                            <div className="flex h-full items-center justify-center">
                                <div className="w-[82%] rounded-[2rem] border border-zinc-300 bg-white p-5 shadow-xl">
                                    <div className="h-36 rounded-3xl bg-gradient-to-tr from-blue-50 via-blue-200 to-blue-400" />
                                    <div className="-mt-14 flex justify-center">
                                        <div className="h-28 w-28 rounded-full border-4 border-white bg-zinc-200 shadow-md" />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="text-lg font-semibold text-zinc-900">Mahmood Rahman</div>
                                        <div className="mt-1 text-sm text-zinc-500">Growth Consultant</div>
                                        <div className="mt-2 text-xs text-zinc-400">Zurich · Tapstagram Premium</div>
                                    </div>
                                    <div className="mt-5 grid gap-3">
                                        <div className="rounded-2xl border border-zinc-200 p-3 text-sm text-zinc-600">
                                            <Link
                                                href="/p/10">
                                                Tapstagram
                                            </Link>
                                        </div>
                                        <div className="rounded-2xl border border-zinc-200 p-3 text-sm text-zinc-600">@ Portfolio</div>
                                        <div className="rounded-2xl border border-zinc-200 p-3 text-sm text-zinc-600">@ Projects</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -left-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
                        <div className="text-xs text-zinc-500">Profile views</div>
                        <div className="mt-1 text-2xl font-semibold text-zinc-900">1,284</div>
                    </div>
                </div>
            </div>
        </section>
    );
}