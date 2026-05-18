export const dynamic = "force-dynamic";


export default function ExploreLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="lg:block z-30 sticky  top-0 bg-white border-b">
                <div className="bg-white rounded-xl border-zinc-400 border bg-white p-4 flex mb-2 items-center justify-between">
                    <a href="/" className="text-lg font-semibold">Tapstagram</a>
                    {/* Right side nav is rendered by the page (needs client for auth) */}
                </div>
            </header>
            <main className="mx-auto max-w-7xl  ">
                {children}
            </main>
            
        </div>
    );
}
