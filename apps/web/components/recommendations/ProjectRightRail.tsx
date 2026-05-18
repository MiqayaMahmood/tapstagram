"use client";

import { useEffect, useState } from "react";
import {
    getProjectRecommendations,
    type ProjectRecommendationResponse,
} from "@/services/recommendations";
import SimilarProfilesCard from "./SimilarProfilesCard";
import RelatedProjectsCard from "./RelatedProjectsCard";
import TrendingProjectsCard from "./TrendingProjectsCard";

export default function ProjectRightRail({ projectId }: { projectId: number }) {
    const [data, setData] = useState<ProjectRecommendationResponse | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await getProjectRecommendations(projectId);
                if (!cancelled) setData(res);
            } catch { }
        })();
        return () => {
            cancelled = true;
        };
    }, [projectId]);

    if (!data) return null;

    return (
        <div className="space-y-2">
            <RelatedProjectsCard items={data.relatedProjects} />
            <SimilarProfilesCard items={data.similarProfiles} title="Relevant Profiles" />
            <TrendingProjectsCard items={data.trendingProjects} />
        </div>
    );
}