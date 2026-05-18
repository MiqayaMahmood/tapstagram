import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from "@/components/layout/AppShell";

export const metadata = {
    
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
          <body>
              <AuthProvider>
                  <AppShell variant="marketing">{children}</AppShell>
              </AuthProvider>
          </body>
    </html>
  );
}