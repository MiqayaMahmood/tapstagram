'use client';

export default function SampleProfilesSection() {
    const cards = [
        { name: "Aarav Shah", role: "Full Stack Developer", city: "Zurich" },
        { name: "Lina Morel", role: "Brand Consultant", city: "Geneva" },
        { name: "Miqaya Studio", role: "Creative Agency", city: "Lausanne" },
    ];

    return (
        <section className="bg-gradient-to-b from-slate-50 to-blue-50/50 px-5 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-2xl border border-blue-100 bg-white/80 px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                    Example Profiles
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                    Designed to look polished from the start
                </h2>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, idx) => (
                        <div key={idx} className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm shadow-blue-950/5 transition hover:-translate-y-1 hover:shadow-md hover:shadow-blue-950/10">
                            <div className="h-28 bg-gradient-to-tr from-slate-900 via-blue-700 to-cyan-400" />
                            <div className="-mt-10 flex justify-center">
                                <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md ring-1 ring-blue-100" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">{card.name}</h3>
                                <p className="mt-1 text-sm text-slate-500">{card.role}</p>
                                <p className="mt-1 text-xs text-slate-400">{card.city}</p>

                                <div className="mt-5 grid gap-3">
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3 text-sm text-slate-600">Portfolio</div>
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3 text-sm text-slate-600">LinkedIn</div>
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3 text-sm text-slate-600">Projects</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
