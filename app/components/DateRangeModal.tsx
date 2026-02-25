'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inicio: Date | null, fim: Date | null) => void;
  dataInicioAtual: Date | null;
  dataFimAtual: Date | null;
}

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function DateRangeModal({ isOpen, onClose, onConfirm, dataInicioAtual, dataFimAtual }: DateRangeModalProps) {
  const [dataBase, setDataBase] = useState(new Date()); 
  const [inicio, setInicio] = useState<Date | null>(dataInicioAtual);
  const [fim, setFim] = useState<Date | null>(dataFimAtual);

  useEffect(() => {
    setInicio(dataInicioAtual);
    setFim(dataFimAtual);
  }, [dataInicioAtual, dataFimAtual, isOpen]);

  if (!isOpen) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximoMes = () => setDataBase(new Date(dataBase.getFullYear(), dataBase.getMonth() + 1, 1));
  const mesAnterior = () => {
    const novaData = new Date(dataBase.getFullYear(), dataBase.getMonth() - 1, 1);
    if (novaData.getFullYear() > hoje.getFullYear() || (novaData.getFullYear() === hoje.getFullYear() && novaData.getMonth() >= hoje.getMonth())) {
      setDataBase(novaData);
    }
  };

  const getDiasDoMes = () => {
    const ano = dataBase.getFullYear();
    const mes = dataBase.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    
    const dias = [];
    for (let i = 0; i < primeiroDia; i++) dias.push(null);
    for (let i = 1; i <= totalDias; i++) dias.push(new Date(ano, mes, i));
    
    return dias;
  };

  const selecionarData = (data: Date) => {
    if (data < hoje) return; 

    if (!inicio || (inicio && fim) || data < inicio) {
      setInicio(data);
      setFim(null);
    } else {
      setFim(data);
    }
  };

  const isSelecionado = (data: Date) => {
    if (!data) return false;
    const isInicio = inicio && data.getTime() === inicio.getTime();
    const isFim = fim && data.getTime() === fim.getTime();
    return isInicio || isFim;
  };

  const isNoMeio = (data: Date) => {
    if (!data || !inicio || !fim) return false;
    return data > inicio && data < fim;
  };

  return (
    // Overlay de fundo com blur forte para destacar o modal
    <div className="fixed inset-0 z-[100] flex justify-center items-end md:items-center bg-black/80 backdrop-blur-sm transition-opacity">
      
      {/* Container do Modal usando as cores oficias da Roteira */}
      <div className="bg-roteira-card w-full md:w-[400px] rounded-t-[32px] md:rounded-[32px] p-6 shadow-2xl border border-roteira-border animate-slide-up md:animate-fade-in">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Quando você vai?</h3>
            <p className="text-sm text-roteira-text mt-1">Selecione a ida e a volta</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-roteira-bg border border-roteira-border rounded-full flex items-center justify-center text-roteira-text hover:text-white hover:border-roteira-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controles do Mês */}
        <div className="flex justify-between items-center mb-6 px-2">
          <button 
            onClick={mesAnterior} 
            disabled={dataBase.getMonth() === hoje.getMonth() && dataBase.getFullYear() === hoje.getFullYear()}
            className="p-2 text-roteira-text hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-lg text-white tracking-wide">
            {meses[dataBase.getMonth()]} {dataBase.getFullYear()}
          </span>
          <button onClick={proximoMes} className="p-2 text-roteira-text hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7 gap-y-2 mb-8">
          {/* Dias da Semana (Dom, Seg...) */}
          {diasSemana.map(dia => (
            <div key={dia} className="text-center text-[11px] font-bold text-roteira-text uppercase tracking-widest mb-2">
              {dia}
            </div>
          ))}
          
          {/* Dias Numéricos */}
          {getDiasDoMes().map((data, i) => {
            if (!data) return <div key={`empty-${i}`} className="h-10"></div>;
            
            const isPassado = data < hoje;
            const selecionado = isSelecionado(data);
            const noMeio = isNoMeio(data);

            return (
              <div key={i} className="relative flex justify-center items-center h-10 w-full">
                {/* Faixa de fundo que conecta os dias no meio da viagem */}
                {noMeio && (
                  <div className="absolute inset-0 bg-roteira-neon/15" />
                )}
                {/* Conectores visuais para o início e fim */}
                {selecionado && inicio && fim && data.getTime() === inicio.getTime() && (
                  <div className="absolute right-0 w-1/2 h-full bg-roteira-neon/15" />
                )}
                {selecionado && inicio && fim && data.getTime() === fim.getTime() && (
                  <div className="absolute left-0 w-1/2 h-full bg-roteira-neon/15" />
                )}

                <button
                  disabled={isPassado}
                  onClick={() => selecionarData(data)}
                  className={`relative h-10 w-10 flex items-center justify-center text-sm transition-all z-10
                    ${selecionado ? 'bg-roteira-neon text-roteira-bg font-extrabold rounded-full shadow-[0_0_15px_var(--color-roteira-neon)]' : ''}
                    ${!selecionado && isPassado ? 'text-roteira-border cursor-not-allowed' : ''}
                    ${!selecionado && !isPassado && noMeio ? 'text-roteira-neon font-bold' : ''}
                    ${!selecionado && !isPassado && !noMeio ? 'text-white hover:bg-roteira-border rounded-full' : ''}
                  `}
                >
                  {data.getDate()}
                </button>
              </div>
            );
          })}
        </div>

        {/* Botão Confirmar */}
        <button 
          onClick={() => {
            onConfirm(inicio, fim);
            onClose();
          }}
          disabled={!inicio}
          className="w-full bg-roteira-neon text-black font-extrabold py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
        >
          {inicio && fim ? 'Confirmar Datas' : 'Selecione o retorno'}
        </button>

      </div>
    </div>
  );
}