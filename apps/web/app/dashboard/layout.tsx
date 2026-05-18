'use client';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, token, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        
        
        if (loading) return;
        
        if (!user) router.push('/login'); // redirect if not logged in
        
    }, [loading, token, user, router]);

    if (loading) return <div className="p-6">Loading…</div>; // or a spinner
    if (!user) return null; // redirecting
    
    
    return (
        <div className="flex">
                <AuthProvider>{children}</AuthProvider>
        </div>
    );
}