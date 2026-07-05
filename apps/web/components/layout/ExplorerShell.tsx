'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, CalendarDays, CheckCircle, MapPin, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const EXPLORE_PATH = "/explore";

export default function ExplorerShell({ left, children, right, }: React.PropsWithChildren<{ left?: React.ReactNode; right?: React.ReactNode; }>)
{
    const router = useRouter();

    const onBack = () => {
        // Try browser back; if nothing meaningful, go to profile; else explore
        if (typeof window !== "undefined" && document.referrer && new URL(document.referrer).origin === location.origin) {
            router.back();
        } else {
            //router.push(profileHref(project.profile) || EXPLORE_PATH);
            router.push(EXPLORE_PATH);
        }
    };

    return (

        <div className="mx-auto max-w-7xl min-w-0">
            <div className="mb-2 flex items-center justify-between rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
                
                <Button onClick={onBack} className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

            </div>   
            <div className="grid min-w-0 grid-cols-1 gap-2 md:grid-cols-12 md:gap-2">
                {/* Left */}
                <aside className="hidden space-y-2 md:order-1 md:col-span-3 md:block">{left}</aside>

                {/* Center */}
                <main className="order-1 min-w-0 space-y-2 md:order-2 md:col-span-6">{children}</main>

                {/* Right */}
                <aside className="hidden space-y-2 md:order-3 md:col-span-3 md:block">{right}</aside>
            </div>
        </div>
    );
}
