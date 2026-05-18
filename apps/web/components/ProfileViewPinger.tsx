"use client";
import { useEffect } from "react";
import { recordProfileView } from '@/services/analytics';

const API = process.env.NEXT_PUBLIC_API_URL!;

function getSessionId() {
    if (typeof sessionStorage === 'undefined') return null;
    let id = sessionStorage.getItem('tap_session_id');
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('tap_session_id', id);
    }
    return id;
}

function getUTM() {
    if (typeof window === 'undefined') return {};
    const u = new URL(window.location.href);
    return {
        utm_source: u.searchParams.get('utm_source') || undefined,
        utm_medium: u.searchParams.get('utm_medium') || undefined,
        utm_campaign: u.searchParams.get('utm_campaign') || undefined,
        utm_term: u.searchParams.get('utm_term') || undefined,
        utm_content: u.searchParams.get('utm_content') || undefined,
        referrer: document.referrer || undefined,
    };
}

function getCookie(name: string) {
    return document.cookie
        .split("; ")
        .find(r => r.startsWith(name + "="))
        ?.split("=")[1];
}

export function getCookieClient(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;

    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}


export default function ProfileViewPinger({ profileId }: { profileId: number }) {
    useEffect(() => {
        
        if (!profileId) return;
        if (typeof window === 'undefined') return;

        
        const key = `visited:${profileId}`;
        if (sessionStorage.getItem(key)) return;

        const sessionId = getSessionId();
        const payload = { sessionId, ...getUTM() };

        recordProfileView(profileId, payload).finally(() => {
            // even if it fails, avoid spamming during this session
            sessionStorage.setItem(key, '1');
        });
    
        const url = new URL(window.location.href);
        const body = {
            profileId,
            utm_source: url.searchParams.get("utm_source") || url.searchParams.get("src") || url.searchParams.get("ref"),
            utm_medium: url.searchParams.get("utm_medium"),
            utm_campaign: url.searchParams.get("utm_campaign"),
        };

        let tsid = sessionStorage.getItem('tap_session_id');

        const res = fetch(`${API}/analyticsVisit/visit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-tsid": tsid ?? "",
            },
            body: JSON.stringify(body)
        });

        if (!res) {
            throw new Error(`HTTP ${res}`);
        }
        
            res.finally(() => sessionStorage.setItem(key, "1"));
    }, [profileId]);

    return null;
}
