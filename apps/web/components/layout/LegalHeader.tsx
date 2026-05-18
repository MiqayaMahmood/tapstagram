'use client';

import Link from "next/link";

export default function LegalHeader() {
    return (
        <header className="sticky top-0 z-40 border rounded-xl border-zinc-400 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-zinc-900 transition hover:text-zinc-700"
                >
                    Tapstagram
                </Link>

                <nav className="flex items-center gap-2">
                    <Link
                        href="/faq"
                        className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        FAQ
                    </Link>
                    <Link
                        href="/privacy"
                        className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        Terms
                    </Link>
                    <Link
                        href="/cookie"
                        className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        Cookie Policy
                    </Link>
                </nav>
            </div>
        </header>
    );
}