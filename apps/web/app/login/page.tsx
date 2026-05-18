// apps/web/src/app/login/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FooterSection from '@/components/FooterSection';
import DashboardStickyNav from '@/components/DashboardStickyNav';
import CTASection from '@/components/CTASection';
import DashboardHeroSection from '@/components/DashboardHeroSection';
import MediaPreviewToggle from '@/components/MediaPreviewToggle';
import PasswordInput from "@/components/ui/PasswordInput";
import { loginFn} from '@/services/auth';

export default function LoginPage() {
    type LoginResp =
        | { success: true; token: string; user: { id: number; email: string; is_business: boolean; name?: string | null } }
        | { success: false; error: string };

    const { login, logout, user, token, loading, setAuth } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const success = await loginFn(email, password);
            //const success = await loginToApi(email, password);
            {   
                if (success) {
                    setAuth(success.token, success.user); // <-- write LS + update context state    
                    router.push("/explore");
                }
            }
        }
        catch (err: any) {
            setError(err.message || "Invalid email or password");
        }
        finally {
            
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6">Loading…</div>;

    return (
        <>
            <MediaPreviewToggle>
                
            <main className="pt-2">
                <DashboardHeroSection />
                <div className="min-h-[40vh] flex items-center justify-center">
                    <form onSubmit={submit} className="w-full max-w-sm border p-6 rounded space-y-3">
                            <h1 className="text-xl font-semibold ">Sign in</h1>
                            
                            <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <PasswordInput className="w-full border p-2 rounded" label="Password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                        
                                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
                        <div className="text-sm text-gray-600">No account? 
                                        <a className="text-blue-600 underline"  href="/register" > Register Now </a>
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                    </form>
                </div>
        </main>
            </MediaPreviewToggle>
        </>
    );
}
