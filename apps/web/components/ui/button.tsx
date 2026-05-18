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
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
        variant === "default" && "bg-neutral-900 text-white hover:bg-neutral-800",
        variant === "outline" && "border border-neutral-200 hover:bg-neutral-50",
        variant === "link" && "underline-offset-4 hover:underline",
        size === "default" && "h-12 px-4 py-2",
        size === "icon" && "h-12 w-10 p-0",
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
