// visibilityScore.ts
export function completenessScore(profile: any) {
    let score = 0;
    if (profile.profile_picture_url) score += 8;
    if (profile.title) score += 6;
    if (profile.bio) score += 6;
    if (profile.location) score += 4;
    if (profile.socialLinks.length >= 3) score += 8;
    if (profile.projectLinks.length >= 1) score += 8;
    return score;
}

export function engagementScore(m: any) {
    const cap = (v: number, max: number) =>
        Math.min(max, Math.log10(v + 1) * max);

    return Math.round(
        cap(m.views, 10) +
        cap(m.socialClicks, 10) +
        cap(m.projectClicks, 8) +
        cap(m.mediaLikes, 7)
    );
}

export function activityScore(profile: any) {
    let score = 0;
    const days =
        (Date.now() - new Date(profile.updatedAt).getTime()) / 86400000;

    if (days <= 7) score += 10;
    else if (days <= 30) score += 6;

    if (profile.projectLinks.length > 0) score += 8;
    if (profile.leadsCount > 0) score += 7;

    return score;
}

export function visibilityScore(data: any) {
    const completeness = completenessScore(data.profile);
    const engagement = engagementScore(data.metrics);
    const activity = activityScore(data.profile);

    const score = Math.min(100, completeness + engagement + activity);

    return {
        score,
        breakdown: { completeness, engagement, activity },
        suggestions: suggestionsEngine({ completeness, engagement, activity }),
    };
}

export function suggestionsEngine(b: any) {
    const s: string[] = [];
    if (b.completeness < 30) s.push("Complete your profile");
    if (b.engagement < 20) s.push("Share your profile to boost engagement");
    if (b.activity < 15) s.push("Update your profile or add new content");
    return s;
}
