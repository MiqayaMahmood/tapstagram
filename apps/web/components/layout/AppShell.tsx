// server component
import TopNav from "@/components/nav/TopNav";
import FooterSection from '@/components/FooterSection';
import CTASection from '@/components/CTASection';
export default function AppShell({
    variant,  // "marketing" | "dashboard" | "explore"
    children,
}: {
    variant: "marketing" | "dashboard" | "explore";
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(29,78,216,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_26%),linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#f8fafc_100%)] text-slate-900">
            <TopNav variant={variant} />
            <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">{children}</main>
            
            <FooterSection />
        </div>
    );
}
