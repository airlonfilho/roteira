'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  isOrigin?: boolean; 
}

export default function LocationInput({ label, placeholder, value, onChange, isOrigin }: LocationInputProps) {
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ignorarBusca = useRef(false);

  // Fecha o dropdown se clicar fora do componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de busca na API com Debounce
  useEffect(() => {
    if (ignorarBusca.current) {
      ignorarBusca.current = false;
      return;
    }

    if (value.length < 3) {
      setSugestoes([]);
      setMostrarDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoadingSugestoes(true);
      setMostrarDropdown(true); // Garante que a caixa abre para mostrar o "Buscando..."
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&featuretype=city&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSugestoes(data);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      } finally {
        setLoadingSugestoes(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const selecionarCidade = (nomeLimpo: string) => {

    ignorarBusca.current = true;

    onChange(nomeLimpo);
    setMostrarDropdown(false);
  };

  const obterLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      alert("A geolocalização não é suportada pelo teu navegador.");
      return;
    }

    setLoadingLoc(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const cidade = data.address.city || data.address.town || data.address.village || "";
          const estado = data.address.state || "";
          
          ignorarBusca.current = true;

          if (cidade && estado) {
            onChange(`${cidade}, ${estado}`);
          } else {
            onChange(data.display_name.split(',')[0]); 
          }
          setMostrarDropdown(false);
        } catch (error) {
          console.error("Erro ao converter coordenadas:", error);
          alert("Não foi possível descobrir o nome da tua cidade.");
        } finally {
          setLoadingLoc(false);
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error);
        alert("Por favor, permite o acesso à localização no teu navegador.");
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
    );
  };

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2 ml-1">
        {label}
      </label>
      
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-500">
          <MapPin size={18} />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => {
            ignorarBusca.current = false;
            onChange(e.target.value);
          }}
          // Se o usuário clicar de volta no input e já tiver sugestões, reabre a caixa
          onFocus={() => {
            if (sugestoes.length > 0 || value.length >= 3) setMostrarDropdown(true);
          }}
          placeholder={placeholder}
          className="w-full bg-[#252525] border border-transparent focus:border-[#F4D03F] text-white text-sm rounded-2xl py-3.5 pl-12 pr-12 transition-all outline-none"
        />

        {isOrigin && (
          <button
            type="button"
            onClick={obterLocalizacaoAtual}
            disabled={loadingLoc}
            title="Usar minha localização atual"
            className="absolute right-3 p-1.5 text-gray-400 hover:text-[#F4D03F] bg-[#1C1C1C] rounded-xl border border-white/5 transition-colors disabled:opacity-50 z-10"
          >
            {loadingLoc ? (
              <Loader2 size={16} className="animate-spin text-[#F4D03F]" />
            ) : (
              <LocateFixed size={16} />
            )}
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* O SEU BLOCO DE RENDERIZAÇÃO PERFEITO */}
      {/* ======================================================== */}
      {mostrarDropdown && (sugestoes.length > 0 || loadingSugestoes) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-roteira-bg border border-roteira-border rounded-2xl shadow-2xl overflow-hidden z-50">
          {loadingSugestoes ? (
            <div className="p-4 text-center text-sm text-roteira-text animate-pulse">
              Buscando destinos...
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {sugestoes.map((item, index) => {
                // Lógica de limpeza: Pega só cidade, estado e país
                const cidade = item.name || item.address?.city || item.address?.town;
                const estado = item.address?.state;
                const pais = item.address?.country;

                // Junta os 3, remove os vazios e evita repetições (ex: São Paulo, São Paulo)
                const nomeLimpo = [cidade, estado, pais]
                  .filter(Boolean)
                  .filter((valor, indice, array) => array.indexOf(valor) === indice)
                  .join(', ');

                return (
                  <li
                    key={index}
                    onMouseDown={(e) => {
                      // onMouseDown previne que o input perca o foco antes do clique registrar
                      e.preventDefault();
                      selecionarCidade(nomeLimpo);
                    }}
                    className="px-5 py-3 hover:bg-[#2C2C2C] cursor-pointer flex items-center gap-3 transition-colors border-b border-roteira-border last:border-0"
                  >
                    <MapPin size={16} className="text-roteira-neon shrink-0" />
                    <span className="text-sm text-white truncate">
                      {nomeLimpo}
                    </span>
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