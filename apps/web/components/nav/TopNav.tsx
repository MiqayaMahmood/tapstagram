"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    Menu,
    X,
    Compass,
    LayoutDashboard,
    UserCircle2,
    Network,
    LogOut,
    LogIn,
    UserPlus,
} from "lucide-react";
import Image from "next/image";

type Variant = "marketing" | "dashboard" | "explore";

type StoredUser = {
    id: number;
    email: string;
    name?: string | null;
    is_business?: boolean;
    profileId?: number | null;
    username?: string | null;
};

const logo_url = `${process.env.NEXT_PUBLIC_API_URL}/media/Tapstagram_logo.jpg`;

type NavItem = {
    label: string;
    href: string;
    icon?: any;
    show?: boolean;
    primary?: boolean;
};

function NavLink({
    href,
    children,
    active,
    primary = false,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    primary?: boolean;
    onClick?: () => void;
}) {
    if (primary) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
                    ? "bg-blue-50 text-blue-700"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
        >
            {children}
        </Link>
    );
}

export default function TopNav({ variant }: { variant: Variant }) {
    const { token, logout } = useAuth();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<StoredUser | null>(null);

    const isAuthed = !!token;
    const hasProfile = !!user?.profileId;

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const raw = localStorage.getItem("tapstagram_user");
            setUser(raw ? JSON.parse(raw) : null);
        } catch {
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        const onStorage = () => {
            try {
                const raw = localStorage.getItem("tapstagram_user");
                setUser(raw ? JSON.parse(raw) : null);
            } catch {
                setUser(null);
            }
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const navLeft = useMemo<NavItem[]>(() => {
        return [
            { label: "Explore", href: "/explore", icon: Compass, show: true },
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                show: isAuthed && variant !== "dashboard",
            },
        ];
    }, [isAuthed, variant]);

    const navRight = useMemo<NavItem[]>(() => {
        if (!isAuthed) {
            return [
                { label: "Login", href: "/login", icon: LogIn },
                { label: "Register", href: "/register", icon: UserPlus, primary: true },
            ];
        }

        return [
            ...(hasProfile
                ? [
                    {
                        label: "My Profile",
                        href: `/p/${user!.profileId}`,
                        icon: UserCircle2,
                    },
                ]
                : []),
            { label: "My Network", href: "/myNetwork", icon: Network },
        ];
    }, [isAuthed, hasProfile, user]);

    const dashboardNav = useMemo<NavItem[]>(
        () =>
            variant === "dashboard"
                ? [
                    { label: "Profiles", href: "/dashboard/profiles", icon: UserCircle2 },
                    { label: "Analytics", href: "/analytics", icon: LayoutDashboard },
                ]
                : [],
        [variant]
    );

    async function handleLogout() {
        setUser(null);
        setOpen(false);
        await logout();
    }

    function isActive(href: string) {
        if (!pathname) return false;
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    }

    return (
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Left */}
                <div className="flex min-w-0 items-center gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                            <Image
                                src={logo_url}
                                alt="Tapstagram"
                                width={120}
                                height={48}
                                className="h-11 w-auto object-contain"
                                unoptimized
                            />
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navLeft
                            .filter((i) => i.show !== false)
                            .map((i) => {
                                const Icon = i.icon;
                                return (
                                    <NavLink key={i.href} href={i.href} active={isActive(i.href)}>
                                        <span className="inline-flex items-center gap-2">
                                            {Icon ? <Icon className="h-4 w-4" /> : null}
                                            {i.label}
                                        </span>
                                    </NavLink>
                                );
                            })}

                        {dashboardNav.map((i) => {
                            const Icon = i.icon;
                            return (
                                <NavLink key={i.href} href={i.href} active={isActive(i.href)}>
                                    <span className="inline-flex items-center gap-2">
                                        {Icon ? <Icon className="h-4 w-4" /> : null}
                                        {i.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Right desktop */}
                <div className="hidden items-center gap-2 md:flex">
                    {isAuthed ? (
                        <div className="mr-2 hidden rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 lg:block">
                            <div className="max-w-[180px] truncate text-sm font-medium text-zinc-900">
                                {user?.name || user?.email || "Signed in"}
                            </div>
                            <div className="text-xs text-zinc-500">
                                {hasProfile ? "Profile ready" : "Account ready"}
                            </div>
                        </div>
                    ) : null}

                    {navRight.map((i) => {
                        const Icon = i.icon;
                        return (
                            <NavLink
                                key={i.href}
                                href={i.href}
                                active={isActive(i.href)}
                                primary={i.primary}
                            >
                                <span className="inline-flex items-center gap-2">
                                    {Icon ? <Icon className="h-4 w-4" /> : null}
                                    {i.label}
                                </span>
                            </NavLink>
                        );
                    })}

                    {isAuthed ? (
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    ) : null}
                </div>

                {/* Mobile menu button */}
                <button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50 md:hidden"
                    aria-label="Open menu"
                    onClick={() => setOpen((s) => !s)}
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Mobile panel */}
            {open ? (
                <div className="border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-4">
                        {isAuthed ? (
                            <div className="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                                <div className="text-sm font-medium text-zinc-900">
                                    {user?.name || user?.email || "Signed in"}
                                </div>
                                <div className="text-xs text-zinc-500">
                                    {hasProfile ? "Profile ready" : "Account ready"}
                                </div>
                            </div>
                        ) : null}

                        <div className="space-y-1">
                            {[...navLeft.filter((i) => i.show !== false), ...dashboardNav].map((i) => {
                                const Icon = i.icon;
                                return (
                                    <Link
                                        key={i.href}
                                        href={i.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive(i.href)
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-zinc-700 hover:bg-zinc-50"
                                            }`}
                                    >
                                        {Icon ? <Icon className="h-4 w-4" /> : null}
                                        {i.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="my-3 h-px bg-zinc-200" />

                        <div className="space-y-1">
                            {navRight.map((i) => {
                                const Icon = i.icon;
                                return (
                                    <Link
                                        key={i.href}
                                        href={i.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${i.primary
                                                ? "bg-zinc-900 text-white hover:bg-zinc-700"
                                                : isActive(i.href)
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-zinc-700 hover:bg-zinc-50"
                                            }`}
                                    >
                                        {Icon ? <Icon className="h-4 w-4" /> : null}
                                        {i.label}
                                    </Link>
                                );
                            })}

                            {isAuthed ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    );
}