// app/components/explore/Features_OrderCards.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, ContactRound, ShieldCheck, X, Sparkles, Check, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ProjectCoverFallback from "@/components/projects/ProjectCoverFallback";

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
                            "Featured profile presentation",
                            "Advanced tap & link analytics",
                            "Premium profile tools",
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
// Featured Businesses
// ------------------
export type Partner = {
    name: string;
    href: string;
    logoUrl?: string;
    coverImageUrl?: string;
    category?: string;
    country?: string;
    description?: string;
    ctaLabel?: string;
    placementLabel?: "Sponsored" | "Featured";
};

export function SponsoredPlacementBadge({ label = "Featured" }: { label?: "Sponsored" | "Featured" }) {
    return (
        <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            {label}
        </span>
    );
}

export function SponsoredBusinessCard({ partner }: { partner: Partner }) {
    const label = partner.placementLabel ?? "Featured";
    return (
        <a
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-w-0 gap-3 rounded-2xl border border-blue-100 bg-white/85 p-3 shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-950/10"
            title={partner.name}
        >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-white">
                {partner.logoUrl || partner.coverImageUrl ? (
                    <img
                        src={partner.logoUrl || partner.coverImageUrl}
                        alt={partner.name}
                        className="h-full w-full object-contain p-1"
                    />
                ) : (
                    <ProjectCoverFallback title={partner.name} category={partner.category} variant="tiny" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 truncate text-sm font-semibold text-slate-950 group-hover:text-blue-700">
                        {partner.name}
                    </div>
                    <SponsoredPlacementBadge label={label} />
                </div>
                <div className="mt-1 flex min-w-0 flex-wrap gap-1.5 text-[11px] text-slate-500">
                    {partner.category ? <span className="truncate">{partner.category}</span> : null}
                    {partner.country ? <span className="truncate">{partner.country}</span> : null}
                </div>
                {partner.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{partner.description}</p>
                ) : null}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                    {partner.ctaLabel ?? "View business"}
                    <ExternalLink className="h-3 w-3" />
                </span>
            </div>
        </a>
    );
}

export function FeaturedBusinessesPanel({ partners = [] as Partner[] }: { partners?: Partner[] }) {
    const { dismissed, dismiss } = useDismissableCard("partner-spotlight");
    const visible = useMemo(() => {
        const seen = new Set<string>();
        return partners
            .filter((partner) => {
                const key = `${partner.href}:${partner.name}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .slice(0, 3);
    }, [partners]);
    if (dismissed || visible.length === 0) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-blue-100 shadow-sm shadow-blue-950/5">
                <div className="h-1 bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-400" />
                <div className="flex items-center justify-between px-4 pt-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-950">Featured Businesses</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Promoted businesses and partners on Tapstagram.</p>
                    </div>
                    
                </div>
                <CardContent className="pt-3">
                    <div className="grid gap-3">
                        {visible.map((p) => (
                            <SponsoredBusinessCard key={p.href + p.name} partner={p} />
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        title="Become a featured business"
                    >
                        Become a featured business
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export const PartnerSpotlight = FeaturedBusinessesPanel;

export function PromotionOfferCard() {
    const packages = [
        ["Featured Business", "Featured business listing", "Sponsored badge", "Explore sidebar placement"],
        ["Business Plus", "Category targeting", "Related-business placement", "Basic impressions and click statistics"],
        ["Premium Promotion", "Main Explore placement", "Business detail-page placement", "Country/category targeting", "Enhanced analytics"],
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-blue-100 bg-white shadow-sm shadow-blue-950/5">
                <div className="h-1 bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-400" />
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-950">Promote your business</CardTitle>
                    <CardDescription>Reach more visitors with featured placement on Tapstagram.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {packages.map(([title, ...items]) => (
                        <div key={title} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3">
                            <div className="text-sm font-semibold text-slate-950">{title}</div>
                            <ul className="mt-2 grid gap-1 text-xs leading-5 text-slate-600">
                                {items.map((item) => (
                                    <li key={item} className="flex gap-1.5">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="grid gap-2">
                    <Button asChild size="sm" className="w-full">
                        <a href="/contact">View promotion options</a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="w-full">
                        <a href="/contact">Become a featured business</a>
                    </Button>
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
            <FeaturedBusinessesPanel partners={partners} />
            <PromotionOfferCard />
            <PremiumUpgradeCard isPremium={isPremium} onUpgrade={onUpgrade} onManage={onManage} />
            <NFCCardOffer onOrder={onOrderCard} />
            
        </div>
    );
}
