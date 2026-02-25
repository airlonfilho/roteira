'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DESTINOS_EXPLORAR } from '../../data/destinos-explorar'; // Importe os dados
import { ChevronLeft, Heart, CheckCircle2, Coins, Thermometer, Sparkles, Zap } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetalheLugarPage({ params }: PageProps) {
  const router = useRouter();
  const [cidade, setCidade] = useState<any>(null);
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    // Busca os dados no objeto usando o ID da URL
    const dados = DESTINOS_EXPLORAR[id as keyof typeof DESTINOS_EXPLORAR];

    if (dados) {
      setCidade(dados);
    }
  }, [id]);

  // Tela de erro caso o ID não exista
  if (!cidade) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white">
        <p className="mb-4">Destino não encontrado.</p>
        <button onClick={() => router.back()} className="text-[#F4D03F] font-bold">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#121212] text-white font-sans pb-32 overflow-x-hidden">
      {/* 1. HERO E HEADER */}
      <div className="relative h-[450px] w-full">
        <img src={cidade.imagem} className="w-full h-full object-cover" alt={cidade.nome} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40"></div>
        
        <div className="absolute top-12 w-full px-6 flex justify-between items-center">
          <button onClick={() => router.back()} className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <ChevronLeft size={24} />
          </button>
          <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <Heart size={20} />
          </button>
        </div>

        <div className="absolute bottom-8 px-6">
          <div className="bg-[#F4D03F] text-black text-[10px] font-black px-2 py-1 rounded-lg w-fit mb-2">
            Match IA: {cidade.match}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">{cidade.nome}, {cidade.pais}</h1>
        </div>
      </div>

      {/* 2. BARRA DE INFO RÁPIDA */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-white/5 flex justify-between items-center shadow-2xl">
          <div className="flex flex-col items-center gap-2 flex-1 border-r border-white/5">
            <CheckCircle2 size={20} className="text-[#F4D03F]" />
            <span className="text-[10px] text-gray-500 uppercase font-bold">Visto</span>
            <span className="text-[11px] font-medium text-center leading-tight">{cidade.visto}</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 border-r border-white/5">
            <Coins size={20} className="text-[#F4D03F]" />
            <span className="text-[10px] text-gray-500 uppercase font-bold">Moeda</span>
            <span className="text-[11px] font-medium">{cidade.moeda}</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <Thermometer size={20} className="text-[#F4D03F]" />
            <span className="text-[10px] text-gray-500 uppercase font-bold">Clima</span>
            <span className="text-[11px] font-medium">{cidade.clima}</span>
          </div>
        </div>
      </div>

      {/* 3. SOBRE A CIDADE */}
      <section className="px-6 mt-10">
        <h2 className="text-xl font-bold mb-4">Sobre {cidade.nome}</h2>
        <p className="text-gray-400 text-[14px] leading-relaxed">{cidade.sobre}</p>
      </section>

      {/* 4. O QUE VISITAR */}
      <section className="px-6 mt-10">
        <h2 className="text-xl font-bold mb-6">O que visitar</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {cidade.atracoes.map((atracao: any, i: number) => (
            <div key={i} className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1C1C1C]">
                <img src={atracao.img} className="w-full h-full object-cover" alt={atracao.nome} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 text-center max-w-[80px]">
                {atracao.nome}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SUGESTÃO DA IA */}
      <div className="px-6 mt-8">
        <div className="bg-[#1C1C1C] border border-[#F4D03F]/20 rounded-3xl p-6 relative">
          <div className="flex items-center gap-2 text-[#F4D03F] font-black text-xs uppercase tracking-widest mb-3">
            <Sparkles size={16} fill="currentColor" />
            Sugestão da IA
          </div>
          <p className="text-gray-300 text-sm italic leading-relaxed">"{cidade.sugestaoIA}"</p>
        </div>
      </div>

    </div>
  );
}