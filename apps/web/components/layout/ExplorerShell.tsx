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

        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl border-zinc-400 border bg-white p-4 flex mb-2 items-center justify-between">
                
                <Button onClick={onBack} className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

            </div>   
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-2">
                {/* Left */}
                <aside className="md:col-span-3 space-y-2">{left}</aside>

                {/* Center */}
                <main className="md:col-span-6 space-y-2">{children}</main>

                {/* Right */}
                <aside className="md:col-span-3 space-y-2">{right}</aside>
            </div>
        </div>
    );
}
