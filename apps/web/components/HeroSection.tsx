'use client';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative isolate overflow-hidden rounded-b-[2rem] bg-slate-950 text-white sm:rounded-b-[3rem]">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.45),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(6,182,212,0.28),transparent_28%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_48%,#0f172a_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />
                <div className="absolute left-8 top-20 h-32 w-32 rounded-full border border-white/10 bg-white/5 blur-sm" />
                <div className="absolute -right-24 top-16 h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-3xl" />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:py-20">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-blue-50 backdrop-blur">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Tap. Share. Grow.
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                        Your smart NFC profile that actually converts
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-50/80 md:text-base md:leading-8">
                        Share your profile, projects, contact, and links in one polished experience —
                        built for mobile, branded for you, and ready for real networking.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/register"
                            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
                        >
                            Get started free
                        </Link>
                        <Link
                            href="/subscription"
                            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                        >
                            Go Premium
                        </Link>
                    </div>

                    <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-sm text-blue-50/75 md:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-white">Unlimited</div>
                            <div className="mt-1">links</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-white">Custom</div>
                            <div className="mt-1">themes</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-white">Real-time</div>
                            <div className="mt-1">analytics</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
                            <div className="font-semibold text-white">NFC</div>
                            <div className="mt-1">ready</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl shadow-slate-950/30 backdrop-blur">
                        <div className="aspect-[4/5] w-full bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                            <div className="flex h-full items-center justify-center">
                                <div className="w-[82%] rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/10">
                                    <div className="h-36 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-700 to-cyan-400" />
                                    <div className="-mt-14 flex justify-center">
                                        <div className="h-28 w-28 rounded-full border-4 border-white bg-zinc-200 shadow-md" />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="text-base font-semibold text-slate-950 sm:text-lg">Mahmood Rahman</div>
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

                    <div className="absolute -bottom-6 -left-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/10 sm:-left-6">
                        <div className="text-xs text-slate-500">Profile views</div>
                        <div className="mt-1 text-xl font-semibold text-slate-950 sm:text-2xl">1,284</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
