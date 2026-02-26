'use client';

import React, { useState } from 'react';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  // Nova prop opcional para saber se é o campo de origem
  isOrigin?: boolean; 
}

export default function LocationInput({ label, placeholder, value, onChange, isOrigin }: LocationInputProps) {
  const [loadingLoc, setLoadingLoc] = useState(false);

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
          // Chamada à API gratuita do OpenStreetMap para Reverse Geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          // O OSM pode retornar city, town ou village dependendo do tamanho do local
          const cidade = data.address.city || data.address.town || data.address.village || "";
          const estado = data.address.state || "";
          
          if (cidade && estado) {
            onChange(`${cidade}, ${estado}`);
          } else {
            onChange(data.display_name.split(',')[0]); // Fallback seguro
          }
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
      // Opções para maior precisão
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
    );
  };

  return (
    <div className="mb-4 relative">
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#252525] border border-transparent focus:border-[#F4D03F] text-white text-sm rounded-2xl py-3.5 pl-12 pr-12 transition-all outline-none"
        />

        {/* Botão de Localização Automática (Apenas para a Origem) */}
        {isOrigin && (
          <button
            type="button"
            onClick={obterLocalizacaoAtual}
            disabled={loadingLoc}
            title="Usar minha localização atual"
            className="absolute right-3 p-1.5 text-gray-400 hover:text-[#F4D03F] bg-[#1C1C1C] rounded-xl border border-white/5 transition-colors disabled:opacity-50"
          >
            {loadingLoc ? (
              <Loader2 size={16} className="animate-spin text-[#F4D03F]" />
            ) : (
              <LocateFixed size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}