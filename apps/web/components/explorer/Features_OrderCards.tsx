// app/components/explore/Features_OrderCards.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/Separator";
import { Crown, ArrowRight, ContactRound, ShieldCheck, X, Sparkles, Check, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// ------------------
// Helpers
// ------------------
function useDismissableCard(id: string) {
    const key = `explore_card_dismissed:${id}`;
    const [dismissed, setDismissed] = useState(false);
    useEffect(() => {
        const v = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
        setDismissed(v === "1");
    }, [key]);
    const dismiss = () => {
        try { window.localStorage.setItem(key, "1"); } catch { }
        setDismissed(true);
    };
    const reset = () => {
        try { window.localStorage.removeItem(key); } catch { }
        setDismissed(false);
    };
    return { dismissed, dismiss, reset } as const;
}

// ------------------
// Premium Upgrade Card
// ------------------
export function PremiumUpgradeCard({
    isPremium,
    onUpgrade,
    onManage,
}: {
    isPremium?: boolean;
    onUpgrade?: () => void;
    onManage?: () => void;
}) {
    const { dismissed, dismiss } = useDismissableCard("premium-upgrade");
    if (dismissed) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="relative overflow-hidden">
                <button
                    aria-label="Dismiss"
                    className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
                    onClick={dismiss}
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-100/60 via-transparent to-violet-100/60" />

                <CardHeader className="">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                            <Crown className="h-5 w-5" />
                        </span>
                        <div>
                            <CardTitle className="text-base">{isPremium ? "You’re on Premium" : "Upgrade Your Profile"}</CardTitle>
                            <CardDescription>
                                {isPremium ? "Enjoy boosted visibility & advanced analytics." : "Boost visibility, unlock analytics & get verified."}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <ul className="grid gap-2 text-sm">
                        {[
                            "Profile Boosting in Explore",
                            "Advanced tap & link analytics",
                            "Verified badge on profile",
                        ].map((t) => (
                            <li key={t} className="flex items-start gap-2">
                                <span className="mt-0.5 rounded-full bg-emerald-500/10 p-1 text-emerald-600">
                                    <Check className="h-3.5 w-3.5" />
                                </span>
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>30‑day money‑back guarantee</span>
                    </div>
                    {isPremium ? (
                        <Button onClick={onManage}  size="sm">
                            Manage subscription
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={onUpgrade} size="sm">
                            Go Premium
                            <Sparkles className="ml-1.5 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}

// ------------------
// NFC Visiting Card Offer
// ------------------
export function NFCCardOffer({ onOrder }: { onOrder?: () => void }) {
    const { dismissed, dismiss } = useDismissableCard("nfc-offer");
    if (dismissed) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="relative overflow-hidden">
                <button
                    aria-label="Dismiss"
                    className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
                    onClick={dismiss}
                >
                    <X className="h-4 w-4" />
                </button>

                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                            <ContactRound className="h-5 w-5" />
                        </span>
                        <div>
                            <CardTitle className="text-base">Tap & Connect Instantly</CardTitle>
                            <CardDescription>Order your NFC-enabled Tapstagram card.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {/* Minimal product mockup */}
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400" />
                        <div className="absolute inset-0 bg-[radial-gradient(100%_60%_at_0%_0%,rgba(255,255,255,0.25),transparent)]" />
                        <div className="absolute bottom-3 left-3 text-white/90">
                            <p className="text-sm font-medium">Tapstagram NFC</p>
                            <p className="text-xs opacity-80">Share your profile with one tap</p>
                        </div>
                        <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                            Contactless
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Personalized card that opens your Tapstagram profile on compatible phones—no app needed.
                    </p>
                </CardContent>
                <CardFooter className="flex items-center justify-end">
                    <Button onClick={onOrder} size="sm">
                        Order Card
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

// ------------------
// Partner Spotlight
// ------------------
export type Partner = { name: string; href: string; logoUrl?: string };

export function PartnerSpotlight({ partners = [] as Partner[] }: { partners?: Partner[] }) {
    const { dismissed, dismiss } = useDismissableCard("partner-spotlight");
    const visible = useMemo(() => partners.slice(0, 6), [partners]);
    if (dismissed || visible.length === 0) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <div className="flex items-center justify-between px-4 pt-4">
                    <div>
                        <h3 className="text-md font-semibold">Our Trusted Partners</h3>
                        <p className="text-md text-muted-foreground">Working with leaders across industries</p>
                    </div>
                    
                </div>
                <CardContent className="pt-3">
                    <div className="grid grid-cols-2 gap-3">
                        {visible.map((p) => (
                            <a
                                key={p.href + p.name}
                                href={p.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center rounded-xl border bg-white/60 p-2 transition hover:shadow-sm"
                                title={p.name}
                            >
                                {p.logoUrl ? (
                                    // Next/Image is optional here; using it improves perf if domains are allowed
                                    <Image
                                        src={p.logoUrl}
                                        alt={p.name}
                                        width={144}
                                        height={48}
                                        className="max-h-48 transition group-hover:opacity-100 group-hover:grayscale-0"
                                    />
                                ) : (
                                    <span className="text-md font-medium transition group-hover:opacity-100">
                                        {p.name}
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        title="Become a partner"
                    >
                        Become a partner
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

// ------------------
// Sidebar Assembler
// ------------------
export default function Features_OrderCards({
    isPremium = false,
    partners = [],
    onUpgrade,
    onManage,
    onOrderCard,
}: {
    isPremium?: boolean;
    partners?: Partner[];
    onUpgrade?: () => void;
    onManage?: () => void;
    onOrderCard?: () => void;
}) {
    return (
        <div className="grid gap-4">
            <PartnerSpotlight partners={partners} />
            <PremiumUpgradeCard isPremium={isPremium} onUpgrade={onUpgrade} onManage={onManage} />
            <NFCCardOffer onOrder={onOrderCard} />
            
        </div>
    );
}
