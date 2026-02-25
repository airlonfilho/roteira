'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Check } from 'lucide-react';

interface BudgetSelectProps {
  value: string;
  onChange: (val: string) => void;
}

const opcoesOrcamento = [
  'R$ 200,00',
  'R$ 500,00',
  'R$ 1000,00',
  'Ilimitado'
];

export default function BudgetSelect({ value, onChange }: BudgetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se o usuário clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opcao: string) => {
    onChange(opcao);
    setIsOpen(false);
  };

  return (
    <div className="relative grid mb-6" ref={dropdownRef}>
      <label className="block text-sm text-gray-400 font-medium mb-2 pl-1">Orçamento Diário</label>
      
      {/* Botão que simula o Input */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center bg-[#252525] hover:bg-[#2C2C2C] transition-colors rounded-2xl px-4 py-3.5 text-left border ${isOpen ? 'border-roteira-neon' : 'border-transparent'}`}
      >
        <Wallet size={18} className="text-gray-400 mr-3 shrink-0" />
        <span className={`text-[15px] truncate ${value ? 'text-white font-bold' : 'text-gray-500'}`}>
          {value || 'Valor'}
        </span>
      </button>

      {/* Lista Flutuante de Opções */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-roteira-card border border-roteira-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          <ul className="py-2">
            {opcoesOrcamento.map((opcao) => {
              const isSelected = value === opcao;
              return (
                <li 
                  key={opcao}
                  onClick={() => handleSelect(opcao)}
                  className={`px-4 py-3 hover:bg-[#252525] cursor-pointer flex items-center justify-between transition-colors
                    ${isSelected ? 'text-roteira-neon font-bold' : 'text-white'}
                  `}
                >
                  <span className="text-sm">{opcao}</span>
                  {isSelected && <Check size={16} className="text-roteira-neon" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}