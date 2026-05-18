"use client";

import Link from "next/link";
import { Sparkles, Crown } from "lucide-react";

export default function PremiumPresentationCard({
    isPremium,
    href,
    title,
    description,
    upgradeHref = "/subscription",
}: {
    isPremium: boolean;
    href: string;
    title: string;
    description: string;
    upgradeHref?: string;
    }) {
    

    return (
        <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                    {isPremium ? <Sparkles className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h3>
                    <p className="mt-2 text-md leading-7 text-zinc-600">{description}</p>

                    <div className="mt-4">
                        {isPremium ? (
                            <Link
                                href={href}
                                className="inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Open Premium Editor
                            </Link>
                        ) : (
                            <Link
                                href={upgradeHref}
                                className="inline-flex rounded-xl border border-zinc-400 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                Upgrade to Premium
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}