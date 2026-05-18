'use client';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah M.',
            role: 'Independent Consultant',
            feedback: 'Tapstagram made networking effortless. My profile now feels professional and memorable.',
        },
        {
            name: 'The Design Co.',
            role: 'Creative Studio',
            feedback: 'We rolled it out across the team and it instantly elevated how we present ourselves.',
        },
        {
            name: 'Mark T.',
            role: 'Founder',
            feedback: 'The NFC card and analytics made it much easier to track how real-world conversations become leads.',
        },
    ];

    return (
        <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-xl border border-zinc-400 px-3 py-1 text-md font-medium text-zinc-600">
                    Testimonials
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                    What people say about Tapstagram
                </h2>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <div key={i} className="rounded-xl border border-zinc-400 bg-zinc-50 p-6 text-left shadow-sm">
                            <p className="text-sm italic leading-7 text-zinc-700">“{t.feedback}”</p>
                            <div className="mt-6">
                                <div className="font-semibold text-zinc-900">{t.name}</div>
                                <div className="text-sm text-zinc-500">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}