'use client';

export default function SampleProfilesSection() {
    const cards = [
        { name: "Aarav Shah", role: "Full Stack Developer", city: "Zurich" },
        { name: "Lina Morel", role: "Brand Consultant", city: "Geneva" },
        { name: "Miqaya Studio", role: "Creative Agency", city: "Lausanne" },
    ];

    return (
        <section className="bg-zinc-50 px-6 py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-xl border border-zinc-400 bg-white px-3 py-1 text-md font-medium text-zinc-600 shadow-sm">
                    Example Profiles
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                    Designed to look polished from the start
                </h2>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, idx) => (
                        <div key={idx} className="overflow-hidden rounded-[2rem] border border-zinc-400 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <div className="h-28 bg-gradient-to-tr from-slate-200 via-zinc-200 to-slate-400" />
                            <div className="-mt-10 flex justify-center">
                                <div className="h-20 w-20 rounded-full border-4 border-white bg-zinc-200 shadow-md" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold text-zinc-900">{card.name}</h3>
                                <p className="mt-1 text-sm text-zinc-500">{card.role}</p>
                                <p className="mt-1 text-xs text-zinc-400">{card.city}</p>

                                <div className="mt-5 grid gap-3">
                                    <div className="rounded-2xl border border-zinc-200 p-3 text-sm text-zinc-600">Portfolio</div>
                                    <div className="rounded-2xl border border-zinc-200 p-3 text-sm text-zinc-600">LinkedIn</div>
                                    <div className="rounded-2xl border border-zinc-200 p-3 text-sm text-zinc-600">Projects</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}