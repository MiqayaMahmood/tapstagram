'use client';
import Link from 'next/link';

export default function DashboardHeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* animated gradient banner */}
            <div className="hero-animated absolute inset-0 -z-10" />

            {/* soft blurred blob accent */}
            <div className="hero-blob absolute pt-20 -right-24 w-[480px] h-[480px] rounded-full -z-10 opacity-70" />

            <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 text-center text-gray-900">
                <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur px-3 py-1 text-s">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Tap. Share. Grow.
                </div>

                <h1 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight">
                    Your smart NFC profile that actually converts
                </h1>

                <p className="mt-4 md:mt-5 text-base md:text-lg text-gray-700 max-w-4xl mx-auto">
                    One tap to share everything—links, socials, projects, and contact—beautifully branded and analytics‑ready.
                </p>

                

                
            </div>
        </section>
    );
}
//export default function HeroSection() {
//  return (
//    <section id="hero" className="w-full bg-white py-20 px-6 text-center">
//      <div className="max-w-4xl mx-auto">
//        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
//          Your Digital Identity, <br /> One Tap Away
//        </h1>
//        <p className="text-lg sm:text-xl text-gray-600 mb-8">
//          Create your smart NFC business card and share all your profiles, projects, and contact links in one place.
//        </p>
//        <div className="flex justify-center gap-4 flex-wrap">
//          <a
//            href="#"
//            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
//          >
//            Create Your Profile
//          </a>
//          <a
//            href="#"
//            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-semibold transition"
//          >
//            Order NFC Card
//          </a>
//        </div>
//        <div className="mt-12">
//          <img
//            src="/nfc-illustration.png"
//            alt="NFC tap illustration"
//            className="mx-auto max-h-72"
//          />
//        </div>
//      </div>
//    </section>
//  );
//}
