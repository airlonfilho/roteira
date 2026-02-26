'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Crown, MapIcon as MapMinus, Award, Globe, 
  Sparkles, User, HelpCircle, LogOut, 
  ChevronRight, Settings 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

export default function PerfilPage() {
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] md:h-screen md:overflow-hidden bg-[#121212] text-white font-sans relative flex flex-col">
            
            {/* HEADER (Oculto no Desktop conforme a regra) */}
            <Header />

            <main className="flex-1 flex flex-col pt-24 pb-24 md:pt-8 px-6 max-w-6xl mx-auto w-full">
                
                {/* GRID PRINCIPAL: 2 Colunas no Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                    
                    {/* COLUNA ESQUERDA: IDENTIDADE E STATS */}
                    <section className="flex flex-col items-center md:items-start space-y-8">
                        {/* HERO: AVATAR E NOME */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#F4D03F] p-1 overflow-hidden shadow-[0_0_30px_rgba(244,208,63,0.15)]">
                                    <img 
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Airlon" 
                                        alt="Airlon Filho" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-[#F4D03F] text-black rounded-full p-1.5 border-4 border-[#121212]">
                                    <CheckCircleIcon size={18} />
                                </div>
                            </div>
                            <div className="text-center md:text-left mt-6">
                                <h2 className="text-3xl font-black tracking-tight">Airlon Filho</h2>
                                <div className="mt-3 bg-[#1C1C1C] border border-[#F4D03F]/30 px-5 py-2 rounded-full flex items-center gap-2 w-fit mx-auto md:mx-0">
                                    <Crown size={14} className="text-[#F4D03F]" />
                                    <span className="text-[#F4D03F] text-[10px] font-black uppercase tracking-widest">Membro Premium</span>
                                </div>
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <StatCard number="12" label="Viagens Realizadas" />
                            <StatCard number="4" label="Países Visitados" />
                            <StatCard number="8k" label="KM Percorridos" />
                            <StatCard number="15" label="Roteiros IA" />
                        </div>
                    </section>

                    {/* COLUNA DIREITA: CONQUISTAS E MENU */}
                    <section className="space-y-10">
                        {/* CONQUISTAS */}
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 pl-1">Conquistas Desbloqueadas</h3>
                            <div className="grid grid-cols-4 gap-2">
                                <Badge icon={<MapMinus size={20} />} label="Explorador" active />
                                <Badge icon={<Award size={20} />} label="Gourmet" active />
                                <Badge icon={<Globe size={20} />} label="Global" />
                                <Badge icon={<Sparkles size={20} />} label="Frequente" />
                            </div>
                        </div>

                        {/* MENU OPTIONS */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 pl-1">Configurações</h3>
                            <MenuOption icon={<User size={20} />} label="Minha Conta" />
                            <MenuOption icon={<Crown size={20} className="text-[#F4D03F]" />} label="Assinatura Premium" />
                            <MenuOption icon={<HelpCircle size={20} />} label="Central de Ajuda" />
                            <MenuOption icon={<LogOut size={20} className="text-red-500" />} label="Sair" isLast />
                        </div>
                    </section>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}

// --- COMPONENTES AUXILIARES (Mantidos conforme seu padrão) ---

function StatCard({ number, label }: { number: string, label: string }) {
    return (
        <div className="bg-[#1C1C1C] border border-white/5 rounded-[28px] p-6 text-center md:text-left hover:border-[#F4D03F]/20 transition-colors">
            <div className="text-3xl font-black text-[#F4D03F] mb-1">{number}</div>
            <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider leading-tight">
                {label}
            </div>
        </div>
    );
}

function Badge({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border transition-all ${active ? 'bg-[#F4D03F] border-[#F4D03F] text-black shadow-[0_10px_20px_rgba(244,208,63,0.2)]' : 'bg-[#1C1C1C] border-white/5 text-gray-600'}`}>
                {icon}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
        </div>
    );
}

function MenuOption({ icon, label, isLast = false }: { icon: any, label: string, isLast?: boolean }) {
    return (
        <button className="w-full bg-[#1C1C1C] border border-white/5 rounded-[24px] p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-[#252525]">
            <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <span className={`font-bold text-sm ${isLast ? 'text-red-500' : 'text-gray-200'}`}>{label}</span>
            </div>
            {!isLast && <ChevronRight size={18} className="text-gray-600" />}
        </button>
    );
}

function CheckCircleIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
        </svg>
    );
}