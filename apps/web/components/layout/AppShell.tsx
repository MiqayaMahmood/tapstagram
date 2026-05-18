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
        <div className="min-h-screen bg-gray-50">
            <TopNav variant={variant} />
            <main className="mx-auto max-w-7xl px-0 ">{children}</main>
            
            <FooterSection />
        </div>
    );
}
