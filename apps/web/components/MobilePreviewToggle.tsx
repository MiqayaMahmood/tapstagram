'use client';

import { useState } from 'react';

export default function MobilePreviewToggle({ children }: { children: React.ReactNode }) {
  const [isMobileView, setIsMobileView] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className="bg-gray-900 text-white px-4 py-1 text-sm rounded shadow"
        >
          {isMobileView ? 'Desktop Mode' : 'Mobile Mode'}
        </button>
      </div>

      <div
        className={`mx-auto transition-all duration-300 ease-in-out ${
          isMobileView ? 'max-w-[400px] border border-gray-300 shadow-xl' : 'max-w-full'
        }`}
      >
        {children}
      </div>
    </>
  );
}
