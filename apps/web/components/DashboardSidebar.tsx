'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Profile', href: '/dashboard/profiles' },
  { label: 'Social Links', href: '/dashboard/links' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Bookmarked', href: '/dashboard/bookmarked' },
    { label: 'Settings', href: '/dashboard/settings' },
    
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r shadow-sm p-4 hidden md:block">
          <Link href="/">
              <div className="text-2xl font-bold text-blue-600 mb-8">Tapstagram</div>
          </Link>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button className="mt-12 text-sm text-gray-500 hover:underline">Logout</button>
    </aside>
  );
}
