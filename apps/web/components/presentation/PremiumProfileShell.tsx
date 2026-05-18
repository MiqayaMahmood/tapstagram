import ExplorerShell from "@/components/layout/ExplorerShell";
import UserMiniCard from "@/components/explorer/UserMiniCard";
import MyQuickLinks from "@/components/MyQuickLinks";
import FiltersCard from "@/components/explorer/FiltersCard";
import MarketingCard from "@/components/explorer/MarketingCard";
import ProfileRightRail from "@/components/recommendations/ProfileRightRail";

export default function PremiumProfileShell({
    profileId,
    children,
}: {
    profileId: number;
    children: React.ReactNode;
}) {
    return (
        <ExplorerShell
            left={
                <>
                    <UserMiniCard profileId={profileId} />
                    <MyQuickLinks />
                    <FiltersCard />
                </>
            }
            right={
                <>
                    <MarketingCard />
                    <aside className="hidden lg:block sticky top-20 self-start h-fit">
                        <ProfileRightRail profileId={profileId} />
                    </aside>
                </>
            }
        >
            {children}
        </ExplorerShell>
    );
}