'use client';
import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/services/analytics';
import { useAuth } from '@/context/AuthContext';

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
                    // defensively coerce missing arrays
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
            <div className="border p-4 rounded text-sm text-red-600">
                Analytics: {err}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="border p-4 rounded text-sm">
                Loading analytics…
            </div>
        );
    }

    return (
        <div className="space-y-3">


            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                    <div className="text-xs text-gray-600">Views (7 days)</div>
                    <div className="text-2xl font-bold">{data.views7}</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="text-xs text-gray-600">Views (30 days)</div>
                    <div className="text-2xl font-bold">{data.views30}</div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="text-sm font-medium mb-2">Top Social Links (30d)</div>
                    <ul className="space-y-1 text-sm">
                        {!data?.topSocial?.length && <li className="text-gray-500">No clicks yet</li>}
                        {data?.topSocial?.map((s) => (
                            <li key={s.id} className="flex justify-between gap-3">
                                <span className="truncate">{s.platform_name || s.url || 'Social link'}</span>
                                <span className="text-gray-600">{s.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="text-sm font-medium mb-2">Top Projects (30d)</div>
                    <ul className="space-y-1 text-sm">
                        {!data?.topProjects?.length && <li className="text-gray-500">No clicks yet</li>}
                        {data?.topProjects?.map((p) => (
                            <li key={p.id} className="flex justify-between gap-3">
                                <span className="truncate">{p.title || p.url || 'Project link'}</span>
                                <span className="text-gray-600">{p.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
