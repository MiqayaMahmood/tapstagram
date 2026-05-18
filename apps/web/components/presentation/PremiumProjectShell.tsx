import ExplorerShell from "@/components/layout/ExplorerShell";
import MyQuickLinks from "@/components/MyQuickLinks";
import FiltersCard from "@/components/explorer/FiltersCard";
import MarketingCard from "@/components/explorer/MarketingCard";

export default function PremiumProjectShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ExplorerShell
            left={
                <>
                    <MyQuickLinks />
                    <FiltersCard />
                </>
            }
            right={
                <>
                    <MarketingCard />
                </>
            }
        >
            {children}
        </ExplorerShell>
    );
}