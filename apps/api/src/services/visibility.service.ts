// src/services/visibility.service.ts
import { visibilityScore } from "./visibilityScore";


export async function getVisibility(profileId: number, prisma: any) {
    const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
            socialLinks: true,

        },
    });

    const [views, socialClicks
        , projectClicks
        , mediaLikes, leadsCount] =
        await Promise.all([
            prisma.profileView.count({ where: { profileId } }),
            prisma.socialLinkClick.count({ where: { profileId } }),
            prisma.projectClick.count({ where: { profileId } }),
            prisma.mediaLike.count({ where: { profileId } }),
            prisma.lead.count({ where: { profileId } }),
        ]);

    return visibilityScore({
        profile: { ...profile, leadsCount },
        metrics: {
            views,
            socialClicks,
            projectClicks,
            mediaLikes,
        },
    });
}
