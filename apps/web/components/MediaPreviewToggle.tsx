'use client';

import { useState } from 'react';

const presets = {
  desktop: 'max-w-full',
  tablet: 'max-w-[768px] border',
  mobile: 'max-w-[400px] border',
};

export default function MediaPreviewToggle({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <>
      <div className="fixed top-14 right-4 z-50 flex gap-2 bg-white p-2 rounded shadow">
        {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={`px-3 py-1 text-sm rounded ${
              view === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className={`mx-auto transition-all duration-300 ease-in-out ${presets[view]}`}>
        {children}
      </div>
    </>
  );
}
