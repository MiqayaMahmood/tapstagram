'use client';

import { useEffect, useMemo, useState } from 'react';
import { Send, Mail, MessageCircleMore, UserCircle2, Tags } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft} from "lucide-react";

type ContactReason =
    | 'Question'
    | 'Inquiry'
    | 'Become a partner'
    | 'Order Premium Card'
    | 'Upgrade to Premium package'
    | 'Other';

const CONTACT_REASONS: ContactReason[] = [
    'Question',
    'Inquiry',
    'Become a partner',
    'Order Premium Card',
    'Upgrade to Premium package',
    'Other',
];

type ContactFormState = {
    name: string;
    email: string;
    phone: string;
    country: string;
    reason: ContactReason;
    message: string;
    profileId: string;
};

function safeLocalStorageGet(key: string) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function detectLeadSource() {
    if (typeof document === 'undefined') return 'web';
    if (document.referrer === '') return 'direct';
    if (document.referrer.includes('tapstagram')) return 'internal';
    return 'web';
}
const EXPLORE_PATH = "/explore";

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState<ContactFormState>({
        name: '',
        email: '',
        phone: '',
        country: '',
        reason: 'Question',
        message: '',
        profileId: '',
    });
    const onBack = () => {
        // Try browser back; if nothing meaningful, go to profile; else explore
        if (typeof window !== "undefined" && document.referrer && new URL(document.referrer).origin === location.origin) {
            router.back();
        } else {
            //router.push(profileHref(project.profile) || EXPLORE_PATH);
            router.push(EXPLORE_PATH);
        }
    };

    useEffect(() => {
        const storedToken = safeLocalStorageGet('token');
        const storedName =
            safeLocalStorageGet('name') ||
            safeLocalStorageGet('userName') ||
            safeLocalStorageGet('fullName');

        const storedEmail =
            safeLocalStorageGet('email') ||
            safeLocalStorageGet('userEmail');

        const storedProfileId =
            safeLocalStorageGet('profileId') ||
            safeLocalStorageGet('profile_id') ||
            safeLocalStorageGet('userProfileId');

        if (storedName || storedEmail || storedProfileId) {
            setForm((prev) => ({
                ...prev,
                name: storedName || prev.name,
                email: storedEmail || prev.email,
                profileId: storedProfileId || prev.profileId,
            }));
        }

        // optional: if token exists but local storage keys differ, you can later decode/fetch user
        void storedToken;
    }, []);

    const canSubmit = useMemo(() => {
        return form.name.trim() && form.email.trim() && form.reason && form.message.trim();
    }, [form]);

    const update = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const submitContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sending || !canSubmit) return;

        setSending(true);
        setSent(false);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    source: detectLeadSource(),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.message || 'Could not send the message. Please try again later.');
            }

            setSent(true);
            setForm((prev) => ({
                ...prev,
                phone: '',
                country: '',
                reason: 'Question',
                message: '',
            }));
        } catch (err: any) {
            alert(err?.message || 'Could not send the message. Please try again later.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-1">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div>
                    <div className="bg-white rounded-xl border-zinc-400 border bg-white p-4 flex mb-2 items-center justify-between">

                        <Button onClick={onBack} className="inline-flex items-center">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                    </div>

                    <div className="rounded-xl border border-zinc-400 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-start gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <Send className="h-5 w-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold text-neutral-900">
                                    Contact Tapstagram
                                </h1>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Send us your question, inquiry, partnership interest, or premium request.
                                </p>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={submitContact}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                        <UserCircle2 className="h-4 w-4 text-blue-600" />
                                        Name
                                    </label>
                                    <input
                                        required
                                        placeholder="Your full name"
                                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        value={form.name}
                                        onChange={(e) => update('name', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                        <Mail className="h-4 w-4 text-pink-600" />
                                        Email
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 text-sm font-medium text-zinc-700">
                                        Phone
                                    </label>
                                    <input
                                        placeholder="+41 77 777 77 77"
                                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        value={form.phone}
                                        onChange={(e) => update('phone', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 text-sm font-medium text-zinc-700">
                                        Country
                                    </label>
                                    <input
                                        placeholder="Country"
                                        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        value={form.country}
                                        onChange={(e) => update('country', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                    <Tags className="h-4 w-4 text-violet-600" />
                                    What are you contacting us about?
                                </label>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {CONTACT_REASONS.map((reason) => {
                                        const active = form.reason === reason;
                                        return (
                                            <button
                                                key={reason}
                                                type="button"
                                                onClick={() => update('reason', reason)}
                                                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                                                    }`}
                                            >
                                                {reason}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                    <MessageCircleMore className="h-4 w-4 text-emerald-600" />
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="Tell us how we can help."
                                    className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.message}
                                    onChange={(e) => update('message', e.target.value)}
                                />
                            </div>

                            <input type="hidden" value={form.profileId} readOnly />

                            <div className="flex items-center justify-between gap-3 pt-2">
                                <div className="text-sm text-zinc-500">
                                    We usually reply as soon as possible.
                                </div>

                                <button
                                    disabled={sending || !canSubmit}
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {sending ? 'Sending…' : 'Send message'}
                                </button>
                            </div>

                            {sent && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    Thanks for contacting Tapstagram. Your message has been sent.
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-xl border border-zinc-400 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-zinc-900">Contact topics</h2>
                        <div className="mt-3 space-y-2 text-sm text-zinc-600">
                            <div>Question</div>
                            <div>Inquiry</div>
                            <div>Become a partner</div>
                            <div>Order Premium Card</div>
                            <div>Upgrade to Premium package</div>
                            <div>Other</div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-400 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-zinc-900">Need business help?</h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            Use this form for partnerships, premium upgrades, or product-related questions.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}