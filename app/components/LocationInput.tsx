// components/LocationInput.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

export default function LocationInput({ 
  label, 
  placeholder, 
  value, 
  onChange 
}: LocationInputProps) {
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efeito de busca na API (Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (value.length > 2 && mostrarDropdown) {
        setBuscando(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}&featuretype=city&limit=5&addressdetails=1`);
          const data = await res.json();
          setSugestoes(data);
        } catch (error) {
          console.error(`Erro ao buscar ${label.toLowerCase()}:`, error);
        } finally {
          setBuscando(false);
        }
      } else {
        setSugestoes([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, mostrarDropdown, label]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selecionarLocal = (nomeFormatado: string) => {
    onChange(nomeFormatado);
    setMostrarDropdown(false);
  };

  return (
    <div className="mb-5 relative" ref={dropdownRef}>
      <label className="block text-sm text-gray-400 font-medium mb-2 pl-1">{label}</label>
      <div className="relative flex items-center bg-[#252525] rounded-2xl px-4 py-3.5 focus-within:ring-1 focus-within:ring-[#F4D03F] transition-shadow z-10">
        <Search size={18} className="text-gray-400 mr-3 shrink-0" />
        <input 
          type="text" 
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setMostrarDropdown(true);
          }}
          onFocus={() => setMostrarDropdown(true)}
          placeholder={placeholder} 
          className="bg-transparent w-full text-white placeholder:text-gray-500 outline-none text-[15px]"
          autoComplete="off"
        />
      </div>

      {/* Dropdown de Sugestões */}
      {mostrarDropdown && (sugestoes.length > 0 || buscando) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {buscando ? (
            <div className="p-4 text-center text-sm text-gray-400 animate-pulse">
              Buscando locais...
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto custom-scrollbar">
              {sugestoes.map((item, index) => {
                const cidade = item.name || item.address?.city || item.address?.town || item.address?.village;
                const estado = item.address?.state;
                const pais = item.address?.country;
                const nomeLimpo = [cidade, estado, pais]
                  .filter(Boolean)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(', ');

                return (
                  <li 
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      selecionarLocal(nomeLimpo);
                    }}
                    className="px-4 py-3 hover:bg-[#252525] cursor-pointer flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                  >
                    <MapPin size={16} className="text-[#F4D03F] shrink-0" />
                    <span className="text-sm text-white truncate">{nomeLimpo}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}