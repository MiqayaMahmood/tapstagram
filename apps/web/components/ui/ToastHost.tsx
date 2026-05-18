// apps/web/src/components/ui/ToastHost.tsx
"use client";
import { Toaster, toast } from "sonner";

export function ToastHost() {
    return <Toaster richColors position="top-right" />;
}

export const useToast = () => toast;
