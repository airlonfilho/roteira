'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronRight, Plus, MapPin } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

export default function ViagensPage() {
  const router = useRouter();
  const [listaRoteiros, setListaRoteiros] = useState<any[]>([]);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('meusRoteiros') || '[]');
    setListaRoteiros(salvos);
  }, []);

  const proximaViagem = listaRoteiros[0];
  const viagensPassadas = listaRoteiros.slice(1);

  return (
    <div className="h-screen bg-[#121212] text-white font-sans relative flex flex-col">
      {/* HEADER (Oculto no Desktop conforme padrão) */}
      <Header />

      <main className="flex-1 flex pt-12 flex-col md:flex-row gap-8 p-6 pb-24 md:pt-8 max-w-7xl mx-auto w-full">
        
        {/* COLUNA ESQUERDA: PRÓXIMA VIAGEM (Destaque) */}
        <section className="flex-1 flex flex-col min-h-0">
          <h2 className="text-3xl font-extrabold mb-6 hidden md:block">Minhas viagens</h2>
          
          {proximaViagem ? (
            <div 
              onClick={() => router.push(`/roteiro?id=${proximaViagem.id}`)}
              className="group relative flex-1 bg-[#1C1C1C] border border-white/5 rounded-[40px] overflow-hidden cursor-pointer hover:border-[#F4D03F]/30 transition-all flex flex-col"
            >
              {/* Imagem de Fundo com Overlay */}
              <div className="relative h-1/2 md:h-3/5 w-full">
                <img 
                  src={proximaViagem.meta.image_url} 
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700" 
                  alt={proximaViagem.meta.destination_name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] to-transparent"></div>
                <div className="absolute top-6 right-6 bg-[#F4D03F] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                  PREMIUM
                </div>
              </div>

              {/* Informações do Roteiro */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                    {proximaViagem.meta.destination_name.split(',')[0]}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={16} className="text-[#F4D03F]" />
                    <span>{proximaViagem.meta.destination_name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Duração</p>
                    <div className="flex items-center gap-2 font-bold">
                       <Calendar size={18} className="text-[#F4D03F]" />
                       <span>{proximaViagem.meta.total_days} Dias</span>
                    </div>
                  </div>
                  <button className="bg-[#F4D03F] text-black px-6 py-3 rounded-2xl font-black text-sm shadow-[0_10px_20px_rgba(244,208,63,0.2)] active:scale-95 transition-all">
                    Acessar Roteiro
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Estado Vazio */
            <button 
              onClick={() => router.push('/home')} 
              className="flex-1 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center gap-4 text-gray-500 hover:border-[#F4D03F]/20 hover:text-gray-400 transition-all"
            >
              <div className="w-16 h-16 bg-[#1C1C1C] rounded-full flex items-center justify-center border border-white/5">
                <Plus size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold">Nenhum roteiro ativo</p>
                <p className="text-xs mt-1">Sua próxima aventura começa aqui.</p>
              </div>
            </button>
          )}
        </section>

        {/* COLUNA DIREITA: VIAGENS SALVAS (Lista Lateral) */}
        <section className="w-full md:w-80 lg:w-[450px] flex flex-col min-h-0">
          <h2 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 shrink-0">Histórico</h2>
          
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-10">
            {viagensPassadas.length > 0 ? (
              viagensPassadas.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => router.push(`/roteiro?id=${v.id}`)}
                  className="bg-[#1C1C1C] border border-white/5 rounded-[28px] p-4 flex items-center gap-4 group cursor-pointer hover:border-[#F4D03F]/30 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src={v.meta.image_url} className="w-full h-full object-cover" alt={v.meta.destination_name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{v.meta.destination_name.split(',')[0]}</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5">{v.meta.total_days} dias • {v.dataCriacao}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-[#F4D03F] transition-colors" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[28px] text-gray-600 p-8 text-center">
                 <p className="text-xs font-medium italic">Suas viagens concluídas aparecerão aqui.</p>
              </div>
            )}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}