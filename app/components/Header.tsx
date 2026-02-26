'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, Compass } from 'lucide-react';

interface HeaderProps {
    title?: string; // Título opcional para páginas dinâmicas
}

export default function Header({ title }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Lógica para definir o que exibir baseado na rota
    const isHome = pathname === '/home' || pathname === '/';
    const isExplorar = pathname === '/explorar';
    const isViagens = pathname === '/viagens';
    const isPerfil = pathname === '/perfil';
    const isDetalheExplorar = pathname.startsWith('/explorar/');
    const isDetalheViagem = pathname === '/roteiro';

    // Se estiver no Desktop, o header não aparece
    return (
        <header className="fixed top-0 w-full z-50 px-6 pb-4 pt-4 flex justify-between items-center bg-roteira-bg/80 backdrop-blur-md border-b border-white/5 md:hidden">
            
            {/* LADO ESQUERDO */}
            <div className="flex items-center w-12">
                {isHome && (
                    <div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 text-[#F4D03F] border border-[#F4D03F]/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,208,63,0.15)]">
                        <Compass size={24} />
                    </div>
                )}
                {(isPerfil || isDetalheExplorar || isDetalheViagem) && (
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-[#1C1C1C] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                )}
            </div>

            {/* CENTRO (Títulos) */}
            <div className="flex-1 flex justify-center">
                {isExplorar && <h1 className="text-lg font-bold">Explorar</h1>}
                {isViagens && <h1 className="text-lg font-bold">Minhas Viagens</h1>}
                {isPerfil && <h1 className="text-lg font-bold">Meu perfil</h1>}
                {isDetalheExplorar && <h1 className="text-lg font-bold truncate max-w-[150px]">{title || 'Destino'}</h1>}
                {isDetalheViagem && <h1 className="text-lg font-bold">Roteiro</h1>}
            </div>

            {/* LADO DIREITO */}
            <div className="flex items-center justify-end w-12">
                {isHome && (
                    <button 
                        onClick={() => router.push('/perfil')}
                        className="w-10 h-10 rounded-full border-2 border-[#F4D03F]/50 p-0.5 overflow-hidden"
                    >
                        <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Airlon" 
                            alt="Airlon Filho" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </button>
                )}
            </div>
        </header>
    );
}