// components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// adjust to your variants/types
export type Variant = "default" | "outline" | "ghost" | "link" | "destructive";
export type Size = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: Variant;
    size?: Size;
}

export const buttonVariants = ({
    variant = "default",
    size = "default",
    className = "",
}: Partial<ButtonProps> & { className?: string }) =>
    cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-blue-700 text-white shadow-sm shadow-blue-950/15 hover:-translate-y-0.5 hover:bg-blue-800",
        variant === "outline" && "border border-blue-100 bg-white text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        variant === "link" && "text-slate-900 underline-offset-4 hover:underline",
        variant === "destructive" && "bg-red-600 text-white shadow-sm hover:bg-red-700",
        size === "default" && "h-11 px-4 py-2",
        size === "sm" && "h-9 rounded-xl px-3",
        size === "lg" && "h-12 px-5",
        size === "icon" && "h-10 w-10 p-0",
        className
    );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild, ...props }, ref) => {
        const Comp: any = asChild ? Slot : "button";
        return (
            <Comp
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
