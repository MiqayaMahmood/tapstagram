//web/app/p/[id]

import type { Metadata } from 'next';
import { API_URL, ABS_ORIGIN } from '@/lib/api';
import ExplorerShell from '@/components/layout/ExplorerShell';
import UserMiniCard from '@/components/explorer/UserMiniCard';
import FiltersCard from '@/components/explorer/FiltersCard';
import MarketingCard from '@/components/explorer/MarketingCard';
import ProfileViewPinger from '@/components/ProfileViewPinger';

import ProfileHero from '@/components/profile/ProfileHero';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileContact from '@/components/profile/ProfileContact';

import ProfileSocials from '@/components/profile/ProfileSocials';
import ProfileProjects from '@/components/profile/ProfileProjects';
import PeopleSimilar from '@/components/profile/PeopleSimilar';

import UsernameEditor from "@/components/profile/UsernameEditor";
import ProfileAvatarUploader from "@/components/profile/ProfileAvatarUploader";
import HeroBannerUploader from "@/components/profile/HeroBannerUploader";
import Features_OrderCards, { Partner } from "@/components/explorer/Features_OrderCards";
import ProfileRightRail from '@/components/recommendations/ProfileRightRail';
import PremiumPresentationCard from '@/components/presentation/PremiumPresentationCard';

import MyQuickLinks from "@/components/MyQuickLinks";

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
}
/** -------- SEO metadata (Next.js App Router) -------- */
export async function generateMetadata(
    { params }: { params: { id: string } }
): Promise<Metadata> {
    const url = `${ABS_ORIGIN}/p/${params.id}`;
    const p = await fetchJSON<any>(`${API_URL}/profiles/${params.id}`);

    const name = p?.name || 'Profile';
    const rawDesc = p?.bio || `${name} on Tapstagram.`;
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + '…' : rawDesc;
    const image = p?.profile_picture_url || ``;

    return {
        title: `${name} — Tapstagram`,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: 'profile',
            url,
            title: `${name} — Tapstagram`,
            description,
            images: [{ url: image }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${name} — Tapstagram`,
            description,
            images: [image],
        },
    };
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
    const pid = Number(params.id);
    

    if (!Number.isFinite(pid)) {
        return <div className="max-w-6xl mx-auto px-4 py-10">Invalid profile.</div>;
    }
    
    const p = await fetchJSON<any>(`${API_URL}/profiles/${pid}`);
    
    return (
        <ExplorerShell
            left={
                <>
                    
                <UserMiniCard profileId={p.id} />

                    <FiltersCard />
                </>
            }
            right={
                <>
                <MarketingCard />
                    <aside className="hidden lg:block sticky top-20 self-start h-fit">
                        <ProfileRightRail profileId={p.id} />
                    </aside>
                </>
                }
        >
            {/* count a view */}
            <ProfileViewPinger profileId={pid} />

            {/* top header */}
            <ProfileHero profile={p} />

            {/* Bio / Contact */}
            <ProfileAbout bio={p.bio} />
            <ProfileContact email={p.email} phone={p.phone} />

            {/* Socials */}
            
            <ProfileSocials profileId={p.id} links={p.socialLinks} />
            
            

            {/* Projects */}
            <div className="border rounded-xl border-zinc-400 p-4 bg-white">
                <h3 className="font-semibold mb-2">Projects</h3>
                <ProfileProjects profileId={p.id} items={p.projectLinks} />
            </div>

            {/* (Future) Recommendations go here */}
            
            <PeopleSimilar profileId={p.id} />
            
        </ExplorerShell>
    );
}
