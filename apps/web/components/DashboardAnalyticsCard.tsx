'use client';
import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/services/analytics';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, ExternalLink, FolderKanban, MousePointerClick } from 'lucide-react';

type Summary = {
    views7: number;
    views30: number;
    topSocial: Array<{ id: number; count: number; platform_name?: string; url?: string }>;
    topProjects: Array<{ id: number; count: number; title?: string; url?: string }>;
};

const EMPTY_SUMMARY: Summary = {
    views7: 0,
    views30: 0,
    topSocial: [],
    topProjects: [],
};

export default function DashboardAnalyticsCard() {
    const { token } = useAuth();
    const [data, setData] = useState<Summary>(EMPTY_SUMMARY);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!token) {
                setData(EMPTY_SUMMARY);
                setErr(null);
                return;
            }
            setLoading(true);
            setErr(null);
            try {
                const res = await getDashboardSummary(token);
                if (!cancelled) {
                    setData({
                        views7: res?.views7 ?? 0,
                        views30: res?.views30 ?? 0,
                        topSocial: Array.isArray(res?.topSocial) ? res.topSocial : [],
                        topProjects: Array.isArray(res?.topProjects) ? res.topProjects : [],
                    });
                }
            } catch (e: any) {
                if (!cancelled) {
                    setErr(e?.message || 'Failed to load analytics');
                    setData(EMPTY_SUMMARY);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [token]);

    if (!token) return null;

    if (err) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                Analytics: {err}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-slate-600">
                Loading analytics...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard icon={BarChart3} label="Views (7 days)" value={data.views7} tone="blue" />
                <MetricCard icon={MousePointerClick} label="Views (30 days)" value={data.views30} tone="cyan" />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <RankedList
                    icon={ExternalLink}
                    title="Top Social Links (30d)"
                    empty="No social clicks yet"
                    items={data.topSocial.map((s) => ({
                        id: s.id,
                        label: s.platform_name || s.url || 'Social link',
                        count: s.count,
                    }))}
                />
                <RankedList
                    icon={FolderKanban}
                    title="Top Projects (30d)"
                    empty="No project clicks yet"
                    items={data.topProjects.map((p) => ({
                        id: p.id,
                        label: p.title || p.url || 'Project link',
                        count: p.count,
                    }))}
                />
            </div>
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    tone: 'blue' | 'cyan';
}) {
    const toneClasses = tone === 'cyan' ? 'to-cyan-50/70 text-cyan-700' : 'to-blue-50/70 text-blue-700';
    return (
        <div className={`rounded-2xl border border-blue-100 bg-gradient-to-br from-white ${toneClasses} p-4`}>
            <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
                <Icon className="h-4 w-4" />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
        </div>
    );
}

function RankedList({
    icon: Icon,
    title,
    empty,
    items,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    empty: string;
    items: Array<{ id: number; label: string; count: number }>;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Icon className="h-4 w-4 text-blue-700" />
                {title}
            </div>
            <ul className="space-y-2 text-sm">
                {!items.length ? (
                    <li className="rounded-xl bg-slate-50 px-3 py-2 text-slate-500">{empty}</li>
                ) : null}
                {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                        <span className="truncate text-slate-700">{item.label}</span>
                        <span className="font-semibold text-slate-900">{item.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
