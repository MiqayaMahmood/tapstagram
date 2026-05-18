'use client';
const logo_url1 = "http://localhost:5000/media/Tap_Post_1.jpg";
const logo_url2 = "http://localhost:5000/media/Tap_Post_2.jpg";
const logo_url3 = "http://localhost:5000/media/Tap_Post_3.jpg";
export default function SampleProfilesSection() {
    

    return (
        <section className="bg-zinc-50 px-6 py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-xl border border-zinc-400 bg-white px-3 py-1 text-md font-medium text-zinc-600 shadow-sm">
                    Get Coonected
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                    One touch access to all your Social media profiles
                </h2>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <img src={logo_url1} alt="Tapstagram" className="overflow-hidden rounded-[2rem] border border-zinc-400" />    
                    <img src={logo_url2} alt="Tapstagram" className="overflow-hidden rounded-[2rem] border border-zinc-400" />    
                    <img src={logo_url3} alt="Tapstagram" className="overflow-hidden rounded-[2rem] border border-zinc-400" />    
                    
                </div>
            </div>
        </section>
    );
}