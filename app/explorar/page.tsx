'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, SlidersHorizontal, Umbrella, 
  Mountain, Building2, Landmark, Compass, 
  ChevronRight, Star, MapPin 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { DESTINOS_EXPLORAR } from '../data/destinos-explorar';

export default function ExplorarPage() {
  const router = useRouter();

  const todosDestinos = Object.entries(DESTINOS_EXPLORAR).map(([id, dados]) => ({
    id,
    ...dados
  }));

  const recomendados = todosDestinos.slice(0, 3);
  const emAlta = todosDestinos.slice(7);

  return (
    <div className="min-h-[100dvh] bg-[#121212] text-white font-sans pb-28">
      
      {/* HEADER FIXO (Topo) */}
            <header className="top-0 w-full z-50 px-4 py-4 flex justify-center items-center bg-roteira-bg/80 backdrop-blur-md border-b border-white/5">
               
                <h1 className="text-lg font-bold truncate px-4 max-w-[200px] md:max-w-md text-center">
                    Explorar
                </h1>
               
            </header>

      {/* 1. BARRA DE PESQUISA */}
      <div className="p-6 flex gap-3 items-center pt-12">
        <div className="flex-1 bg-[#1C1C1C] rounded-2xl flex items-center px-4 py-3 gap-3 border border-white/5">
          <Search size={20} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Pesquisar destinos..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
          />
        </div>
        <button className="bg-[#1C1C1C] p-3 rounded-2xl border border-white/5">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* 2. RECOMENDADOS (Horizontal Scroll) */}
      <section className="mt-4">
        <h2 className="px-6 text-xl font-extrabold mb-4">Recomendados para Você</h2>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
          {recomendados.map((item) => (
            <div key={item.id} 
            onClick={() => router.push(`/explorar/${item.id}`)}
            className="relative w-64 h-80 shrink-0 rounded-[32px] overflow-hidden group cursor-pointer">
              <img src={item.imagem} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.nome} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-[#F4D03F]/90 text-black text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-sm">
                Match IA: {item.match}
              </div>
              
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold">{item.nome}</h3>
                <p className="text-gray-300 text-sm flex items-center gap-1">
                  <MapPin size={12} className="text-[#F4D03F]" /> {item.pais}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORIAS */}
      {/* <section className="mt-8">
        <h2 className="px-6 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Categorias</h2>
        <div className="flex justify-between px-6">
          {CATEGORIAS.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-[#1C1C1C] rounded-full flex items-center justify-center border border-white/5 hover:border-[#F4D03F]/50 transition-colors cursor-pointer">
                <cat.icon size={22} className="text-gray-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{cat.id}</span>
            </div>
          ))}
        </div>
      </section> */}

      {/* 4. DESTINOS EM ALTA (Lista Vertical) */}
      <section className="mt-10 px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Destinos em Alta</h2>
          {/* <button className="text-[#F4D03F] text-xs font-bold">Ver todos</button> */}
        </div>

        <div className="space-y-4">
          {emAlta.map((item) => (
            <div key={item.id} 
            onClick={() => router.push(`/explorar/${item.id}`)}
            className="bg-[#1C1C1C] border border-white/5 rounded-3xl p-3 flex items-center gap-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                <img src={item.imagem} className="w-full h-full object-cover" alt={item.nome} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[15px]">{item.nome}</h4>
                </div>
                <p className="text-gray-500 text-xs mb-1">{item.pais}</p>
                {/* <p className="text-[#F4D03F] font-bold text-sm">A partir de R$ {item.preco}</p> */}
              </div>
              
              <ChevronRight size={20} className="text-gray-600 mr-2" />
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}