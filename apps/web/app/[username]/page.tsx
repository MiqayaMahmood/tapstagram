// apps/web/app/[username]/page.tsx
import { notFound, redirect } from "next/navigation";
import { getPublicProfile } from "../../services/profile";
import TrackedLink from '@/components/TrackedLink';
import ProfileViewPinger from '@/components/ProfileViewPinger';
import ExplorerShell from '@/components/layout/ExplorerShell';
import UserMiniCard from '@/components/explorer/UserMiniCard';
import FiltersCard from '@/components/explorer/FiltersCard';
import MarketingCard from '@/components/explorer/MarketingCard';

import ProfileHero from '@/components/profile/ProfileHero';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileContact from '@/components/profile/ProfileContact';

import ProfileSocials from '@/components/profile/ProfileSocials';
import ProfileProjects from '@/components/profile/ProfileProjects';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
}

async function getProfile(username: string) {
    const res = await fetch(`${API_URL}/profiles/by-username/${username}`, {
    // Force server-side fetch; tweak caching if you like:
    next: { revalidate: 60 }
    });
    console.log("profiles/by-username: " + username)
    console.log("profiles/by-username - response: " + res.json)
  if (!res.ok) return null;
    const data = await res.json();
    
    //return data?.profile ?? null;
    return data ?? null;
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
    const profile = await getProfile(params.username);
    //const social = await fetchJSON<any[]>(`${API_URL}/social-links/public/${profile.id}`);
    //const projects = await fetchJSON<any[]>(`${API_URL}/project-links/public/${profile.id}`);
    
    //const profile = await getPublicProfile(params.username);
    
    if (!profile) {
        
        notFound();
    }

    return (
        <ExplorerShell
            left={
                <>
                    <UserMiniCard profileId={profile.userId} />
                    <FiltersCard />
                </>
            }
            right={<MarketingCard />}
        >
            {/* count a view */}
            <ProfileViewPinger profileId={profile.id} />

            {/* top header */}
            <ProfileHero profile={profile} />

            {/* Bio / Contact */}
            <ProfileAbout bio={profile.bio} />
            <ProfileContact email={profile.email} phone={profile.phone} />

            {/* Socials */}
            <ProfileSocials profileId={profile.id} links={profile.socialLinks} />

            {/* Projects */}
            <div>
                <h3 className="font-semibold mb-2">Projects</h3>
                <ProfileProjects profileId={profile.id} items={profile.projectLinks} />
            </div>

            {/* (Future) Recommendations go here */}
        </ExplorerShell>
    );

    
}
