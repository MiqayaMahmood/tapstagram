'use client';

export default function UseCasesSection() {
    const cases = [
        { label: 'Freelancers', icon: '🧑‍💻', text: 'Showcase skills, links, and projects in one place.' },
        { label: 'Businesses', icon: '🏢', text: 'Present services, products, team, and contact info.' },
        { label: 'Influencers', icon: '📱', text: 'Share social channels and collaborations beautifully.' },
        { label: 'Developers', icon: '💻', text: 'Display GitHub, portfolio, stack, and side projects.' },
        { label: 'Consultants', icon: '📊', text: 'Build trust with a premium profile and analytics.' },
        { label: 'Agencies', icon: '🏷️', text: 'Turn every introduction into a polished landing page.' },
    ];

    return (
        <section id="usecases" className="bg-white px-5 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-1 text-sm font-semibold text-blue-700">
                        Use Cases
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                        Built for modern professionals and brands
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                        Whether you’re an individual, creator, consultant, or business, Tapstagram gives you
                        a better way to present and share what you do.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
                    {cases.map((uc, idx) => (
                        <div
                            key={idx}
                            className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/45 p-5 shadow-sm shadow-blue-950/5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md hover:shadow-blue-950/10 sm:p-6"
                        >
                            <div className="text-3xl sm:text-4xl">{uc.icon}</div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-950 sm:text-xl">{uc.label}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{uc.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
