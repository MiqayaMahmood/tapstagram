'use client';
import Link from 'next/link';

const links = [
  
  { label: 'Features', id: 'features' },
  { label: 'Use Cases', id: 'usecases' },
  { label: 'How It Works', id: 'howitworks' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Get Started', id: 'cta' },
];

export default function StickyNav() {
    
    return (
      <div className="mx-auto px-4 py-8 bg-white solid shadow">
      <nav className="mx-auto max-w-6xl fixed top-0 left-0 right-0  z-50 px-6 py-4 flex justify-between items-center">
          
                    <Link className="font-bold text-xl text-blue-600" href="/" >Tapstagram</Link>
              
          
          <div className="hidden sm:flex gap-4 text-sm text-gray-700">
                <Link href="/" className="hover:text-blue-600 transition">
                    Home
                </Link>

                {links.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="hover:text-blue-600 transition"
                  >
                    {link.label}
                  </a>
                ))}
           </div>
              <Link href="/explore" className="text-sm font-medium px-3 py-1.5 rounded border hover:bg-gray-50">Explore</Link>
              <Link href="/login" className="text-sm font-medium px-3 py-1.5 rounded border hover:bg-gray-50">Log in</Link>
              <Link href="/register" className="text-sm font-medium px-3 py-1.5 rounded border hover:bg-gray-50">Get Started</Link>
            </nav>
        </div>
  );
}
