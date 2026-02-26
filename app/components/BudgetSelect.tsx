import React from 'react';
import { PiggyBank, Wallet, Gem } from 'lucide-react';

interface BudgetSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BudgetSelect({ value, onChange }: BudgetSelectProps) {
  const niveis = [
    { id: 'Econômico', icon: PiggyBank, desc: 'Transporte público e hostels' },
    { id: 'Moderado', icon: Wallet, desc: 'Hotéis confortáveis e Uber' },
    { id: 'Luxo', icon: Gem, desc: 'Alta gastronomia e 5 estrelas' },
  ];

  return (
    <div className="w-full">
      <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-3 ml-1">
        Estilo de Viagem
      </label>
      <div className="flex flex-col gap-2">
        {niveis.map(({ id, icon: Icon, desc }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border text-left ${
              value === id
                ? 'bg-[#F4D03F]/10 border-[#F4D03F] text-[#F4D03F]'
                : 'bg-[#252525] border-transparent text-gray-400 hover:bg-[#2C2C2C]'
            }`}
          >
            <div className={`p-2 rounded-xl ${value === id ? 'bg-[#F4D03F] text-black' : 'bg-[#1C1C1C]'}`}>
              <Icon size={18} />
            </div>
            <div>
              <div className={`font-bold text-sm ${value === id ? 'text-[#F4D03F]' : 'text-gray-200'}`}>
                {id}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}