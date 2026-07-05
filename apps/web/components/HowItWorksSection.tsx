'use client';

export default function HowItWorksSection() {
    const steps = [
        { step: '01', title: 'Create Your Profile', desc: 'Set up your profile or project with links, media, and contact details.' },
        { step: '02', title: 'Customize Your Presence', desc: 'Use premium layout and presentation options to create a richer page.' },
        { step: '03', title: 'Get Your NFC Card', desc: 'Order your Tapstagram NFC card and connect it to your digital identity.' },
        { step: '04', title: 'Tap, Share, and Track', desc: 'Grow connections and measure visits, clicks, and leads over time.' },
    ];
    const post_1 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Step_1.jpg`;
    const post_2 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Step_2.jpg`;
    const post_3 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Step_3.jpg`;
    const post_4 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Step_4.jpg`;
    return (
        <section id="howitworks" className="bg-zinc-100 px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
                        How It Works
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                        From profile to real-world connection
                    </h2>
                </div>

                <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <img src={post_1} alt="Tapstagram" className="max-h-160 overflow-hidden rounded-[2rem] border border-zinc-400" />
                    <img src={post_2} alt="Tapstagram" className="max-h-84 overflow-hidden rounded-[2rem] border border-zinc-400" />
                    <img src={post_3} alt="Tapstagram" className="max-h-250 overflow-hidden rounded-[2rem] border border-zinc-400" />
                    <img src={post_4} alt="Tapstagram" className="max-h-250 overflow-hidden rounded-[2rem] border border-zinc-400" />

                </div>
            </div>
        </section>
    );
}
