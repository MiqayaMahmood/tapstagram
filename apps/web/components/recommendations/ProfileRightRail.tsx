"use client";

import { useEffect, useState } from "react";
import {
    getProfileRecommendations,
    type ProfileRecommendationResponse,
} from "@/services/recommendations";
import SimilarProfilesCard from "./SimilarProfilesCard";
import RelatedProjectsCard from "./RelatedProjectsCard";
import TrendingProjectsCard from "./TrendingProjectsCard";
import PeopleAlsoViewedCard from "./PeopleAlsoViewedCard";

export default function ProfileRightRail({ profileId }: { profileId: number }) {
    const [data, setData] = useState<ProfileRecommendationResponse | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await getProfileRecommendations(profileId);
                if (!cancelled) setData(res);
            } catch { }
        })();
        return () => {
            cancelled = true;
        };
    }, [profileId]);

    if (!data) return null;

    return (
        <div className="space-y-2">
            <SimilarProfilesCard items={data.similarProfiles} />
            <PeopleAlsoViewedCard items={data.peopleAlsoViewed} />
            <RelatedProjectsCard items={data.relatedProjects} />
            <TrendingProjectsCard items={data.trendingProjects} />
        </div>
    );
}