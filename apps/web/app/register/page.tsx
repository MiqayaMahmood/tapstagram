'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FooterSection from '@/components/FooterSection';
import DashboardStickyNav from '@/components/DashboardStickyNav';
import CTASection from '@/components/CTASection';
import DashboardHeroSection from '@/components/DashboardHeroSection';
import PasswordInput from "@/components/ui/PasswordInput";
import { apiFetch } from "@/lib/api";
import { registerFn } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    type RegisterResp =
        | { success: true; token: string; user: { id: number; email: string; is_business: boolean; name?: string | null } }
        | { success: false; error: string };
    const { login, logout, user, token, loading, setAuth } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', isBusiness:0 });
    const [error, setError] = useState('');
    const [isBusiness, setIsBusiness] = useState(false);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await registerFn({ email: form.email, password: form.password, name: form.name, is_business: form.isBusiness });
        
            
            if (data.success === true) {
                setAuth(data.token, data.user); // <-- write LS + update context state
                //localStorage.setItem('token', data.token);
                //localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err: any) {
          setError(err.message); // "Email already in use"
        }

    };

    return (
         <>
            
            
            <main className="pt-2">
                <DashboardHeroSection />
                <div className="min-h-[40vh] flex items-center justify-center">
                    
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-sm border p-6 rounded space-y-3">
                        <h1 className="text-xl font-semibold">Register</h1>
                <input
                    name="name"
                    placeholder="Name"
                    className="w-full border px-4 py-2 rounded"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    className="w-full border px-4 py-2 rounded"
                    value={form.email}
                    onChange={handleChange}
                        />
                        <PasswordInput name="password" className="w-full border p-2 rounded" label="Password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                
                
                <label className="flex items-center gap-2 text-sm select-none">
                            <input id="isBusiness" type="checkbox" className="h-4 w-4" value={form.isBusiness} checked={isBusiness} onChange={e => setIsBusiness(e.target.checked)} />
                    <span>This is a business account</span>
                </label>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Register
                </button>
                <p className="mt-4 text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-blue-600 underline">Log in</a>
                </p>
                {error && <p className="text-red-600 mb-2">{error}</p>}
            </form>
            
                </div>
                
            </main>
        </>
    );
}
