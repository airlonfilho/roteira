'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex">
      {/* Sidebar só aparece se não for a landing page */}
      {!isLandingPage && !isLoginPage && <Sidebar />}
      
      <main className={`flex-1 min-h-screen ${!isLandingPage && !isLoginPage ? 'md:ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}