import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void; // add this
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className = "", onChange, onCheckedChange, checked, ...props }, ref) => (
        <input
            ref={ref}
            type="checkbox"
            className={`h-4 w-4 rounded border-gray-300 text-black focus:ring-black ${className}`}
            checked={checked}
            onChange={(e) => {
                onChange?.(e);
                onCheckedChange?.(e.currentTarget.checked);
            }}
            {...props}
        />
    )
);
Checkbox.displayName = "Checkbox";
