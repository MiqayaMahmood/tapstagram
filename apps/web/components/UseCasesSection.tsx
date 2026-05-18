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
        <section id="usecases" className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex rounded-xl border border-zinc-400 bg-zinc-100 px-3 py-1 text-md font-medium text-zinc-600">
                        Use Cases
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                        Built for modern professionals and brands
                    </h2>
                    <p className="mt-4 text-base leading-8 text-zinc-600">
                        Whether you’re an individual, creator, consultant, or business, Tapstagram gives you
                        a better way to present and share what you do.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cases.map((uc, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl border border-zinc-400 bg-zinc-50 p-6 shadow-sm transition hover:bg-white hover:shadow-lg"
                        >
                            <div className="text-4xl">{uc.icon}</div>
                            <h3 className="mt-4 text-xl font-semibold text-zinc-900">{uc.label}</h3>
                            <p className="mt-3 text-sm leading-7 text-zinc-600">{uc.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}