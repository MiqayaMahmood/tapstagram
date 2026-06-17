import Link from "next/link";
const logo_url = `${process.env.NEXT_PUBLIC_API_URL}/media/Tapstagram_logo.jpg`;

export default function NfcCardPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-slate-100 px-6 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-zinc-400 bg-white p-8 shadow-sm">
                        <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            Tapstagram NFC Premium Card
                        </div>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">
                            Order your NFC-enabled Tapstagram card
                        </h1>
                        <p className="mt-4 text-base leading-8 text-zinc-600">
                            Share your Tapstagram profile instantly with one tap. A smarter, reusable alternative
                            to printed business cards.
                        </p>

                        <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                            <li>• Premium card design</li>
                            <li>• NFC-enabled instant profile opening</li>
                            <li>• Works with your existing Tapstagram account</li>
                            <li>• Better first impression and easier sharing</li>
                        </ul>

                        <div className="mt-8">
                            <Link
                                href="/subscription"
                                className="rounded-2xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                View Premium Plan
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-zinc-400 bg-white p-8 shadow-sm">
                        <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-300 bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 shadow-2xl">
                            <div className="aspect-[1.6/1] rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-zinc-600 via-zinc-400 to-slate-500 p-6 text-white">
                                <div className="flex h-full flex-col justify-between">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-300">
                                            <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
                                                <img src={logo_url} alt="Tapstagram" className="h-10  " />

                                            </Link>
                                        </div>
                                        <div className="mt-10 text-2xl font-semibold">Tapstagram NFC Premium Card</div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-sm text-zinc-300">Digital identity in one tap</div>
                                        <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                            <div className="text-sm text-zinc-500">Price</div>
                            <div className="mt-1 text-3xl font-bold text-zinc-900">CHF 19</div>
                            <Link href="/contact" className="transition hover:text-zinc-700">
                            <button className="mt-6 w-full rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white ">
                                
                                    Order Card
                                
                                
                            </button>
                            </Link>
                            <p className="mt-4 text-xs leading-6 text-zinc-500">
                                Connect this button to your checkout, order form, or Stripe payment page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}