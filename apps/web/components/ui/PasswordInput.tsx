"use client";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label?: string;
};

export default function PasswordInput({ label = "Password", id, className = "", ...props }: Props) {
    const [show, setShow] = React.useState(false);
    const inputId = id || React.useId();

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    id={inputId}
                    {...props}
                    type={show ? "text" : "password"}
                    className={`w-full border p-2 pr-10 rounded focus:outline-none focus:ring focus:border-blue-500 ${className}`}
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute inset-y-0 right-2 flex items-center"
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    tabIndex={0}
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}
