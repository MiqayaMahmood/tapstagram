import LegalHeader from "@/components/layout/LegalHeader";
import FooterSection from "@/components/FooterSection";

export default function LegalPageShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-slate-100">
            <LegalHeader />
            {children}
            
        </div>
    );
}