'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Circle, Lightbulb } from 'lucide-react';

interface LoadingScreenProps {
  destino: string;
  perfil: string;
  dicaDinamica: string;
}

export default function LoadingScreen({ destino = 'seu destino', perfil = 'o seu perfil', dicaDinamica }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [dicaAtual, setDicaAtual] = useState('');

  // Simulador inteligente de progresso
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        // Se chegou a 95%, trava e espera a API terminar de verdade
        if (old >= 95) {
          clearInterval(interval);
          return 95;
        }
        // Acelera no começo, desacelera no final
        const increment = old < 50 ? Math.random() * 5 + 2 : Math.random() * 2 + 0.5;
        return Math.min(old + increment, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Lógica para definir qual passo está ativo baseado na porcentagem
  const steps = [
    { title: `Analisando atrações em ${destino.split(',')[0]}`, threshold: 0 },
    { title: 'Otimizando rotas de transporte', threshold: 30 },
    { title: 'Selecionando melhores restaurantes...', threshold: 60 },
    { title: `Personalizando para o perfil ${perfil}`, threshold: 85 },
  ];

  const currentStepIndex = steps.findLastIndex(step => progress >= step.threshold);

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col items-center pt-24 px-6 sm:justify-center sm:pt-0 animate-fade-in">
      
      {/* ÍCONE CENTRAL BRILHANTE */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-10">
        {/* Anéis pulsantes de fundo */}
        <div className="absolute inset-0 rounded-full border border-roteira-neon/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-4 rounded-full border border-roteira-neon/40 animate-pulse"></div>
        <div className="absolute inset-8 rounded-full border border-roteira-neon/60 shadow-[0_0_50px_rgba(244,208,63,0.3)]"></div>
        
        {/* Círculo principal */}
        <div className="relative z-10 w-20 h-20 bg-roteira-neon rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,208,63,0.5)]">
          <Sparkles size={40} className="text-black" fill="currentColor" />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-10 tracking-tight">
        Criando seu roteiro perfeito...
      </h2>

      {/* BARRA DE PROGRESSO */}
      <div className="w-full max-w-md mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-roteira-neon text-xs font-bold tracking-widest uppercase">Processando IA</span>
          <span className="text-white text-xl font-bold">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden">
          <div 
            className="h-full bg-roteira-neon rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(244,208,63,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* LISTA DE PASSOS */}
      <div className="w-full max-w-md space-y-6 mb-12">
        {steps.map((step, index) => {
          const status = index < currentStepIndex 
            ? 'concluido' 
            : index === currentStepIndex 
              ? 'andamento' 
              : 'aguardando';

          return (
            <div key={index} className="flex items-start gap-4 transition-opacity duration-500" style={{ opacity: status === 'aguardando' ? 0.4 : 1 }}>
              <div className="mt-0.5 shrink-0">
                {status === 'concluido' && <CheckCircle2 size={24} className="text-roteira-neon bg-[#252525] rounded-full" />}
                {status === 'andamento' && <Loader2 size={24} className="text-roteira-neon animate-spin" />}
                {status === 'aguardando' && <Circle size={24} className="text-gray-600" />}
              </div>
              <div>
                <h4 className={`text-[15px] font-medium leading-tight mb-1 transition-colors duration-300 ${status === 'aguardando' ? 'text-gray-500' : 'text-white'}`}>
                  {step.title}
                </h4>
                <p className={`text-xs font-medium transition-colors duration-300 ${status === 'concluido' ? 'text-roteira-neon/70' : status === 'andamento' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {status === 'concluido' ? 'Concluído' : status === 'andamento' ? 'Em andamento' : 'Aguardando'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CARD DE DICA */}
      <div className="w-full max-w-md bg-[#1C1C1C] border border-[#2C2C2C] rounded-2xl p-5 flex gap-4 mt-auto sm:mt-0 mb-8 sm:mb-0">
        <div className="shrink-0 w-10 h-10 rounded-full bg-roteira-neon/10 flex items-center justify-center">
          <Lightbulb size={20} className="text-roteira-neon" />
        </div>
        <div>
          <h5 className="text-roteira-neon text-xs font-bold tracking-widest uppercase mb-1">Dica</h5>
          <p className="text-gray-300 text-sm leading-relaxed min-h-[40px]">
            {/* Se a dica dinâmica ainda não chegou, mostramos o texto de loading */}
            {dicaDinamica || "Buscando segredos locais com a IA..."}
          </p>
        </div>
      </div>

    </div>
  );
}