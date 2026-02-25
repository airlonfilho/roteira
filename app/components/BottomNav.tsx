'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Map, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Início', path: '/home', icon: Home },
    { name: 'Explorar', path: '/explorar', icon: Compass },
    { name: 'Viagens', path: '/viagens', icon: Map },
    { name: 'Perfil', path: '/perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-[#161616] border-t border-[#252525] px-6 py-4 flex justify-between items-center z-50 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (pathname === '/' && item.path === '/home');

        return (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-[#F4D03F]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {/* O ícone agora só muda a cor da linha (stroke), sem preencher por dentro! */}
            <Icon size={24} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}