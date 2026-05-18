'use client';

import { useEffect, useState } from "react";
import { LeadsHeader } from "@/components/lead/LeadsHeader";
import { LeadsFilters } from "@/components/lead/LeadsFilters";
import { LeadsTable } from "@/components/lead/LeadsTable";
import { VisibilityScoreCard } from "@/components/lead/VisibilityScoreCard";
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from "@/lib/api";

type Props = { profileId: number };

export default function ProfileLeads({ profileId }: Props) {
    const { token } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const res = await apiFetch<any>(`/profile/${profileId}/leads`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!cancelled) {
                    setData(res);
                }
            } catch {
                if (!cancelled) setData(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [profileId, token]);

    if (loading) {
        return <div className="text-sm text-zinc-500">Loading leads…</div>;
    }

    return (
        <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <LeadsHeader stats={data?.stats} />
            </div>

            <VisibilityScoreCard data={data?.visibility} />
            <LeadsFilters />
            <LeadsTable leads={data?.leads} />
        </div>
    );
}