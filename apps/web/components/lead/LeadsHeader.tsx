// LeadsHeader.tsx

import {StatCard} from "@/components/lead/StatCard";


export function LeadsHeader({ stats }: any) {
    return (
        <>
            <StatCard label="Total Leads" value={stats?.totalLeads || 0 } />
            <StatCard label="This Week" value={stats?.leadsThisWeek || 0} />
            <StatCard label="Profile Views" value={stats?.profileViews || 0} />
            <StatCard label="Conversion" value={`${stats?.conversionRate || 0}%`} />
        </>
    );
}