// apps/web/src/components/ui/Section.tsx
import React from 'react';
import Container from './Container';

export function Section({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
    return (
        <section className={`py-16 md:py-20 ${className}`}>
            <Container>{children}</Container>
        </section>
    );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string; }) {
    return (
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            {eyebrow && (
                <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur px-3 py-1 text-xs text-gray-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    {eyebrow}
                </div>
            )}
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold">{title}</h2>
            {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
        </div>
    );
}
