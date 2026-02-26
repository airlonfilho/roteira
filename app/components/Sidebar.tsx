'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Zap } from 'lucide-react';
import { NAV_ITEMS } from '../config/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-[#161616] border-r border-[#252525] fixed left-0 top-0 z-50 p-6">
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-[#F4D03F]/20 text-[#F4D03F] border border-[#F4D03F]/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,208,63,0.15)]">
          <Compass size={22} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-black tracking-tighter italic">ROTEIRA</span>
      </div>

      {/* LINKS DE NAVEGAÇÃO */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-[#F4D03F] text-black shadow-[0_10px_20px_rgba(244,208,63,0.2)]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* BANNER PREMIUM (Opcional) */}
      {/* <div className="mt-auto bg-gradient-to-br from-[#1C1C1C] to-black border border-white/5 rounded-3xl p-5">
        <div className="text-[#F4D03F] mb-2"><Zap size={20} fill="currentColor" /></div>
        <p className="text-xs font-bold mb-1">Airlon, seja PRO</p>
        <p className="text-[10px] text-gray-500 leading-tight mb-3">Roteiros ilimitados e dicas secretas da IA.</p>
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
          Upgrade
        </button>
      </div> */}
    </aside>
  );
}