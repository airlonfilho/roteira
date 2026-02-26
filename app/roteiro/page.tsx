'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Map as MapIcon, Plane, Bed,
    Sunrise, Sun, Moon, MapPin, Wallet, Sparkles,
    Info
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';

// ============================================================================
// TIPAGEM DOS DADOS (Baseado no JSON da IA)
// ============================================================================
interface Activity {
    title: string;
    description: string;
    estimated_cost: string;
    insider_tip: string;
    preparation: string;
    tag: string;
    google_maps_link: string;
}

interface DayPlan {
    day_number: number;
    day_title: string;
    day_vibe: string;
    plan_b: string;
    morning: Activity[];
    afternoon: Activity[];
    evening: Activity[];
}

interface RoteiroData {
    meta: {
        origin_name: string;
        destination_name: string;
        total_days: number;
        budget_tier: string;
        best_transportation: string;
        best_area_to_stay: string;
        image_url: string;
    };
    itinerary: DayPlan[];
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function RoteiroPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[100dvh] bg-roteira-bg flex flex-col items-center justify-center text-white p-6">
                <div className="w-12 h-12 border-4 border-roteira-neon border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-roteira-text">Carregando sua aventura...</p>
            </div>
        }>
            <RoteiroContent />
        </Suspense>
    );
}

function RoteiroContent() {
    const router = useRouter();
    const [roteiro, setRoteiro] = useState<RoteiroData | null>(null);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        const todosRoteiros = JSON.parse(localStorage.getItem('meusRoteiros') || '[]');

        // Se houver um ID na URL, busca ele. Se não, pega o último gerado.
        const roteiroEncontrado = id
            ? todosRoteiros.find((r: any) => r.id.toString() === id)
            : todosRoteiros[0];

        if (roteiroEncontrado) {
            setRoteiro(roteiroEncontrado);
        }
    }, [id]);

    if (!roteiro) {
        return (
            <div className="min-h-[100dvh] bg-roteira-bg flex flex-col items-center justify-center text-white p-6">
                <div className="w-12 h-12 border-4 border-roteira-neon border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-roteira-text">Carregando sua aventura...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-roteira-bg text-white font-sans pb-12 md:pb-8 overflow-x-hidden relative">

            {/* HEADER FIXO (Topo) */}
            {/* 1. HERO E HEADER */}
      <div className="relative h-[450px] w-full">
        <img src={roteiro.meta.image_url} className="w-full h-full object-cover" alt={roteiro.meta.destination_name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40"></div>
        
        <div className="absolute top-12 w-full px-6 flex justify-left items-center">
          <button onClick={() => router.back()} className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-8 px-6">
          <h1 className="text-4xl font-extrabold tracking-tight">{roteiro.meta.destination_name.split(',')[0]}, {roteiro.meta.destination_name.split(',')[1]}</h1>
        </div>
      </div>

            <div className="max-w-3xl mx-auto px-4">
                {/* SEÇÃO: SUGESTÕES DA IA */}
                <div className="mt-8 mb-10">
                    <h3 className="text-xl font-bold mb-4">Sugestões da IA</h3>

                    {/* Card de Transporte */}
                    <div className="bg-roteira-card rounded-2xl p-4 flex gap-4 border border-roteira-border mb-3 items-start">
                        <div className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center shrink-0">
                            <Plane size={24} className="text-roteira-neon" />
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-base">Transporte Recomendado</h4>
                                <span className="bg-roteira-neon text-black text-[10px] font-extrabold px-2 py-1 rounded-md ml-2 shrink-0">
                                    MELHOR OPÇÃO
                                </span>
                            </div>
                            <p className="text-sm text-roteira-text leading-relaxed">
                                {roteiro.meta.best_transportation}
                            </p>
                        </div>
                    </div>

                    {/* Card de Hospedagem */}
                    <div className="bg-roteira-card rounded-2xl p-4 flex gap-4 border border-roteira-border items-start">
                        <div className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center shrink-0">
                            <Bed size={24} className="text-roteira-neon" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base mb-1">Onde Ficar</h4>
                            <p className="text-sm text-roteira-text leading-relaxed mb-2">
                                {roteiro.meta.best_area_to_stay}
                            </p>
                            <span className="bg-[#252525] border border-roteira-border text-roteira-neon text-[11px] font-medium px-2 py-1 rounded-md">
                                Baseado no seu perfil
                            </span>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO: DIAS DO ROTEIRO */}
                {roteiro.itinerary.map((dia) => (
                    <div key={dia.day_number} className="mb-10">
                        <div className="mb-5">
                            <h2 className="text-2xl font-extrabold mb-1">Dia {dia.day_number}: {dia.day_title}</h2>
                            <p className="text-roteira-text text-sm">{dia.day_vibe}</p>
                        </div>

                        {/* Renderiza os Turnos usando o componente Helper */}
                        {dia.morning.map((act, i) => (
                            <ActivityCard key={`m-${i}`} activity={act} shift="MANHÃ" Icon={Sunrise} />
                        ))}

                        {dia.afternoon.map((act, i) => (
                            <ActivityCard key={`a-${i}`} activity={act} shift="TARDE" Icon={Sun} />
                        ))}

                        {dia.evening.map((act, i) => (
                            <ActivityCard key={`e-${i}`} activity={act} shift="NOITE" Icon={Moon} />
                        ))}

                        {/* Aviso de Plano B (Chuva) */}
                        {dia.plan_b && (
                            <div className="mt-4 bg-[#252525]/50 border border-white/5 rounded-2xl p-4 flex gap-3 items-center">
                                <Info size={20} className="text-gray-400 shrink-0" />
                                <p className="text-xs text-gray-400 italic">
                                    <span className="font-bold text-gray-300">Plano B: </span>{dia.plan_b}
                                </p>
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
}

// ============================================================================
// COMPONENTE HELPER: ACTIVITY CARD
// Aqui mesclamos o visual limpo do protótipo com os dados ricos da IA
// ============================================================================
function ActivityCard({ activity, shift, Icon }: { activity: Activity, shift: string, Icon: any }) {
    return (
        <div className="bg-roteira-card rounded-[24px] p-4 border border-roteira-border mb-4 shadow-lg flex gap-4">
            {/* Círculo do Ícone à esquerda (Igual ao protótipo) */}
            <div className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center shrink-0 mt-1">
                <Icon className="text-roteira-text" size={20} />
            </div>

            {/* Conteúdo da Direita */}
            <div className="flex-1">
                {/* Etiqueta do Turno */}
                <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="text-roteira-neon" size={14} />
                    <span className="text-roteira-neon text-[11px] font-bold uppercase tracking-widest">{shift}</span>
                </div>

                {/* Título e Descrição */}
                <h3 className="text-white font-bold text-lg leading-tight mb-2">{activity.title}</h3>
                <p className="text-roteira-text text-[14px] leading-relaxed mb-4">
                    {activity.description}
                </p>

                {/* Botões/Badges (Preço e Mapa) */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {activity.estimated_cost && activity.estimated_cost !== "N/A" && (
                        <span className="bg-[#252525] text-gray-300 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Wallet size={14} className="text-gray-400" />
                            {activity.estimated_cost}
                        </span>
                    )}
                    <a
                        href={activity.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-roteira-neon/10 border border-roteira-neon/30 hover:bg-roteira-neon/20 transition-colors text-roteira-neon text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                        <MapPin size={14} /> Abrir no Mapa
                    </a>
                </div>

                {/* Dica de Ouro (Caixa de destaque) */}
                {activity.insider_tip && (
                    <div className="bg-roteira-neon/5 border border-roteira-neon/20 rounded-xl p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-roteira-neon"></div>
                        <div className="flex items-center gap-1.5 mb-1 text-roteira-neon font-bold text-xs uppercase tracking-wide">
                            <Sparkles size={14} /> Dica de Ouro
                        </div>
                        <p className="text-gray-300 text-[13px] leading-relaxed">
                            {activity.insider_tip}
                        </p>
                    </div>
                )}

                {/* Preparação (O que levar/vestir) */}
                {activity.preparation && (
                    <p className="text-[11px] text-gray-500 mt-3 flex items-center gap-1">
                        <span className="font-semibold text-gray-400">Preparação:</span> {activity.preparation}
                    </p>
                )}
            </div>
        </div>
    );
}