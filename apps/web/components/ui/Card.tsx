import * as React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`rounded-2xl border border-blue-100 bg-white/95 shadow-sm shadow-blue-950/5 ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`border-b border-blue-50 p-4 sm:p-5 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={`text-base font-semibold tracking-tight text-slate-950 ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={`text-sm leading-6 text-slate-500 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`p-4 sm:p-5 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`border-t border-blue-50 p-4 sm:p-5 ${className}`} {...props} />;
}
