'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, ChevronRight, Plus } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function ViagensPage() {
  const router = useRouter();
  const [listaRoteiros, setListaRoteiros] = useState<any[]>([]);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('meusRoteiros') || '[]');
    setListaRoteiros(salvos);
  }, []);

  // O primeiro da lista é o "Em Breve" (mais recente)
  const proximaViagem = listaRoteiros[0];
  // O restante vai para "Salvas"
  const viagensPassadas = listaRoteiros.slice(1);

  return (
    <div className="min-h-[100dvh] bg-[#121212] text-white font-sans pb-28">
      <header className="p-6 pt-12 flex justify-between items-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight">Meus Roteiros</h1>
        
      </header>

      <main className="px-6 max-w-2xl mx-auto space-y-8">
        {/* SEÇÃO: PRÓXIMA VIAGEM */}
        <section>
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Próxima Viagem</h2>
          {proximaViagem ? (
            <div 
              onClick={() => router.push(`/roteiro?id=${proximaViagem.id}`)}
              className="group bg-[#1C1C1C] border border-white/5 rounded-[32px] p-4 flex items-center gap-4 cursor-pointer hover:bg-[#222]"
            >
              <div className="w-24 h-24 shrink-0 overflow-hidden rounded-full border-2 border-[#F4D03F]/20">
                <img src={proximaViagem.meta.image_url} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{proximaViagem.meta.destination_name.split(',')[0]}</h3>
                <p className="text-gray-500 text-sm">{proximaViagem.meta.total_days} Dias • Criado em {proximaViagem.dataCriacao}</p>
                <div className="mt-2 text-[#F4D03F] text-sm font-semibold flex items-center gap-1">
                  <Calendar size={14} /> Ver Detalhes
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => router.push('/home')} className="w-full border-2 border-dashed border-[#252525] rounded-[32px] p-10 flex flex-col items-center text-gray-500">
              <Plus size={32} className="mb-2" />
              <p>Crie seu primeiro roteiro</p>
            </button>
          )}
        </section>

        {/* SEÇÃO: HISTÓRICO / SALVAS */}
        {viagensPassadas.length > 0 && (
          <section>
            <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Viagens Salvas</h2>
            <div className="space-y-3">
              {viagensPassadas.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => router.push(`/roteiro?id=${v.id}`)}
                  className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-3 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img src={v.meta.image_url} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm">{v.meta.destination_name.split(',')[0]}</h4>
                      <p className="text-gray-500 text-[10px]">{v.meta.total_days} dias • {v.dataCriacao}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#F4D03F]" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}