'use client';

export default function CTASection() {
  return (
    <section id="cta" className="py-10 px-6 bg-gray-600 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Start Sharing Smarter</h2>
        <p className="mb-6">Get your Tapstagram profile and NFC card today.</p>
        <a
          href="/register"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
}
