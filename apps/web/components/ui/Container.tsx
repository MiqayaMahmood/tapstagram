// apps/web/src/components/ui/Container.tsx
import React from 'react';
export default function Container({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
    return <div className={`mx-auto max-w-6xl px-4 ${className}`}>{children}</div>;
}
