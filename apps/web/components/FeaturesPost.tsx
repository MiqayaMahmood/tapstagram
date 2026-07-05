'use client';
const logo_url1 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Post_1.jpg`;
const logo_url2 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Post_2.jpg`;
const logo_url3 = `${process.env.NEXT_PUBLIC_API_URL}/media/Tap_Post_3.jpg`;
export default function SampleProfilesSection() {
    

    return (
        <section className="bg-white px-5 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-7xl text-center">
                <div className="inline-flex rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
                    Get Coonected
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                    One touch access to all your Social media profiles
                </h2>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
                    <img src={logo_url1} alt="Tapstagram" className="overflow-hidden rounded-[2rem] border border-blue-100 shadow-sm shadow-blue-950/5" />    
                    <img src={logo_url2} alt="Tapstagram" className="overflow-hidden rounded-[2rem] border border-blue-100 shadow-sm shadow-blue-950/5" />    
                    <img src={logo_url3} alt="Tapstagram" className="overflow-hidden rounded-[2rem] border border-blue-100 shadow-sm shadow-blue-950/5" />    
                    
                </div>
            </div>
        </section>
    );
}
