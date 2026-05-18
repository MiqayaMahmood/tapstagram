// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + conditional classes.
 * Example: cn("p-2", isActive && "bg-primary")
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
