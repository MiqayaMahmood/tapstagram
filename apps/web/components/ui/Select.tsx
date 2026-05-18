"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

type Ctx = {
    open: boolean;
    setOpen: (v: boolean) => void;
    value?: string;
    setValue: (v: string, label?: string) => void;
    onValueChange?: (v: string) => void;
    label?: string;
    setLabel: (t?: string) => void;
    triggerRef: React.RefObject<HTMLButtonElement>;
    contentRef: React.RefObject<HTMLDivElement>;
    anchorRect: { top: number; left: number; width: number };
};

const SelectCtx = createContext<Ctx | null>(null);
const useSelectCtx = () => {
    const ctx = useContext(SelectCtx);
    if (!ctx) throw new Error("Select.* must be used inside <Select>");
    return ctx;
};

export function Select({
    value: controlledValue,
    onValueChange,
    children,
}: {
    value?: string;
    onValueChange?: (v: string) => void;
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [value, _setValue] = useState<string | undefined>(controlledValue);
    const [label, setLabel] = useState<string | undefined>();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [anchorRect, setAnchorRect] = useState({ top: 0, left: 0, width: 0 });

    // keep internal value in sync with controlled prop
    useEffect(() => {
        if (controlledValue !== undefined) _setValue(controlledValue);
    }, [controlledValue]);

    const setValue = (v: string, lbl?: string) => {
        if (controlledValue === undefined) _setValue(v);
        if (lbl) setLabel(lbl);
        onValueChange?.(v);
        setOpen(false);
        // return focus to trigger
        triggerRef.current?.focus();
    };

    // position the list under the trigger
    useLayoutEffect(() => {
        if (!open) return;
        const t = triggerRef.current;
        if (!t) return;
        const r = t.getBoundingClientRect();
        setAnchorRect({
            top: r.bottom + window.scrollY + 4,
            left: r.left + window.scrollX,
            width: r.width,
        });
    }, [open]);

    // close on outside click / Escape
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const root = triggerRef.current?.parentElement;
            if (!root) return;
            if (!root.contains(e.target as Node) && !contentRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const ctx = useMemo<Ctx>(
        () => ({
            open,
            setOpen,
            value,
            setValue,
            onValueChange,
            label,
            setLabel,
            triggerRef,
            contentRef,
            anchorRect,
        }),
        [open, value, label, onValueChange, anchorRect]
    );

    return <SelectCtx.Provider value={ctx}>{children}</SelectCtx.Provider>;
}

export function SelectTrigger({
    className = "",
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { open, setOpen, triggerRef } = useSelectCtx();

    // keyboard open from trigger
    const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
        }
    };

    return (
        <div className={`relative ${className}`} {...props}>
            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                onKeyDown={onKeyDown}
                className="flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm shadow-sm ring-0 outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-black/10"
            >
                <div className="min-w-0 flex-1">{children}</div>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                >
                    <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
    const { label } = useSelectCtx();
    const isEmpty = !label;
    return (
        <span className={isEmpty ? "text-gray-500 truncate" : "truncate"}>
            {label ?? placeholder}
        </span>
    );
}

export function SelectContent({
    className = "",
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { open, contentRef, anchorRect } = useSelectCtx();

    if (typeof document === "undefined") return null; // SSR guard
    if (!open) return null;

    return createPortal(
        <div
            ref={contentRef}
            role="listbox"
            tabIndex={-1}
            className={`z-50 max-h-72 w-[--select-width] overflow-auto rounded-xl border bg-white p-1 text-sm shadow-lg ${className}`}
            style={
                {
                    position: "absolute",
                    top: `${anchorRect.top}px`,
                    left: `${anchorRect.left}px`,
                    ["--select-width" as any]: `${anchorRect.width}px`,
                } as React.CSSProperties
            }
            {...props}
        >
            {children}
        </div>,
        document.body
    );
}

export function SelectItem({
    value,
    children,
    onSelect,
}: {
    value: string;
    children: ReactNode;
    onSelect?: (v: string) => void;
}) {
    const { value: selected, setValue } = useSelectCtx();

    // derive a label string from children for SelectValue()
    const textLabel =
        typeof children === "string"
            ? children
            : React.Children.toArray(children).join(" ");

    const isActive = selected === value;

    const handleClick = () => {
        onSelect?.(value);
        setValue(value, textLabel);
    };

    return (
        <button
            type="button"
            role="option"
            aria-selected={isActive}
            onClick={handleClick}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${isActive ? "bg-gray-100 font-medium" : ""
                }`}
        >
            {children}
        </button>
    );
}
