'use client';

// 1. Importamos o useState para controlar o que está sendo digitado
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Importei também o 'SearchX' para mostrar quando não acharmos nada
import { Search, SlidersHorizontal, ChevronRight, MapPin, SearchX } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { DESTINOS_EXPLORAR } from '../data/destinos-explorar';
import Header from '../components/Header';

export default function ExplorarPage() {
  const router = useRouter();
  
  // 2. Criamos o estado da busca
  const [busca, setBusca] = useState('');

  const todosDestinos = Object.entries(DESTINOS_EXPLORAR).map(([id, dados]) => ({
    id,
    ...dados
  }));

  // 3. Filtramos a lista inteira baseada no que o usuário digitou (buscando por cidade ou país)
  const destinosFiltrados = todosDestinos.filter(destino => 
    destino.nome.toLowerCase().includes(busca.toLowerCase()) || 
    destino.pais.toLowerCase().includes(busca.toLowerCase())
  );

  // 4. Variável auxiliar para saber se estamos no "Modo de Busca"
  const isBuscando = busca.trim().length > 0;

  const recomendados = todosDestinos.slice(0, 4);
  const emAlta = todosDestinos.slice(4);

  return (
    <div className="min-h-[100dvh] md:h-screen bg-[#121212] text-white font-sans pb-32 md:pb-0 w-full max-w-[100vw] overflow-x-hidden md:overflow-hidden relative flex flex-col">
      
      <Header />

      <main className="pt-24 md:pt-8 w-full max-w-7xl mx-auto flex-1 flex flex-col md:flex-row gap-0 md:gap-8 md:px-6 md:overflow-hidden">
        
        {/* COLUNA ESQUERDA (Ou Tela Cheia durante a busca) */}
        <div className={`flex flex-col min-w-0 md:h-full ${isBuscando ? 'w-full md:flex-1' : 'flex-1'}`}>
          
          {/* BARRA DE PESQUISA */}
          <div className="px-6 md:px-0 mb-8 w-full shrink-0">
            <h2 className="text-3xl font-extrabold mb-6 hidden md:block">Explorar Destinos</h2>
            
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-12 bg-[#1C1C1C] rounded-2xl flex items-center px-4 gap-3 border border-white/5 min-w-0 focus-within:border-[#F4D03F]/50 transition-colors">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input 
                  type="text" 
                  // Conectamos o input ao estado
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar cidades ou países..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-500 min-w-0"
                />
                {/* Botão de limpar busca (X) só aparece se tiver texto */}
                {isBuscando && (
                  <button onClick={() => setBusca('')} className="text-gray-400 hover:text-white shrink-0 p-1">
                    ✕
                  </button>
                )}
              </div>
              {/* <button className="w-12 h-12 shrink-0 bg-[#1C1C1C] rounded-2xl border border-white/5 flex items-center justify-center active:scale-95 transition-transform">
                <SlidersHorizontal size={18} className="text-[#F4D03F]" />
              </button> */}
            </div>
          </div>

          {/* RENDERIZAÇÃO CONDICIONAL */}
          {isBuscando ? (
            /* --- MODO: RESULTADOS DA BUSCA --- */
            <section className="flex-1 flex flex-col min-h-0 w-full px-6 md:px-0">
              <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 shrink-0">
                Resultados para "{busca}"
              </h2>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pb-10 space-y-3">
                {destinosFiltrados.length > 0 ? (
                  destinosFiltrados.map((item) => (
                    <div key={item.id} 
                      onClick={() => router.push(`/explorar/${item.id}`)}
                      className="bg-[#1C1C1C] border border-white/5 rounded-3xl p-3 flex items-center gap-4 cursor-pointer active:scale-95 md:hover:border-[#F4D03F]/30 transition-all">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10">
                        <img src={item.imagem} className="w-full h-full object-cover" alt={item.nome} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[15px] truncate text-[#F4D03F]">{item.nome}</h4>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{item.pais}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-600 shrink-0 mr-2" />
                    </div>
                  ))
                ) : (
                  /* Feedback visual se não encontrar nada */
                  <div className="flex flex-col items-center justify-center pt-10 text-center">
                    <div className="w-16 h-16 bg-[#1C1C1C] rounded-full flex items-center justify-center mb-4 border border-white/5">
                      <SearchX size={24} className="text-gray-500" />
                    </div>
                    <p className="font-bold text-gray-300">Nenhum destino encontrado</p>
                    <p className="text-xs text-gray-500 mt-1">Tente buscar por outro país ou cidade.</p>
                  </div>
                )}
              </div>
            </section>
          ) : (
            /* --- MODO: TELA PADRÃO (Recomendados) --- */
            <section className="mb-10 md:mb-0 w-full flex flex-col min-h-0 md:flex-1">
              <h2 className="px-6 md:px-0 text-xl font-extrabold mb-4 shrink-0">Recomendados para Você</h2>
              
              <div className="md:flex-1 md:overflow-y-auto no-scrollbar md:pb-10">
                <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-x-visible px-6 md:px-0 pb-4 snap-x md:snap-none no-scrollbar w-full">
                  {recomendados.map((item) => (
                    <div key={item.id} 
                      onClick={() => router.push(`/explorar/${item.id}`)}
                      className="relative w-[240px] md:w-auto h-[300px] md:h-[280px] shrink-0 md:shrink rounded-[32px] overflow-hidden group cursor-pointer snap-start md:snap-align-none border border-white/5">
                      <img src={item.imagem} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.nome} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 bg-[#F4D03F] text-black text-[10px] font-black px-2 py-1 rounded-lg">
                        Match IA: {item.match}
                      </div>
                      
                      <div className="absolute bottom-6 left-6 right-4">
                        <h3 className="text-2xl font-bold leading-tight">{item.nome}</h3>
                        <p className="text-gray-300 text-sm flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-[#F4D03F]" /> {item.pais}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* COLUNA DIREITA: Destinos em Alta (Oculta se estiver buscando) */}
        {!isBuscando && (
          <section className="px-6 md:px-0 w-full md:w-80 lg:w-[400px] flex flex-col min-h-0 md:h-full shrink-0">
            <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 shrink-0">Destinos em Alta</h2>
            
            <div className="space-y-3 w-full md:flex-1 md:overflow-y-auto no-scrollbar md:pb-10 md:pr-2">
              {emAlta.map((item) => (
                <div key={item.id} 
                  onClick={() => router.push(`/explorar/${item.id}`)}
                  className="bg-[#1C1C1C] border border-white/5 rounded-3xl p-3 flex items-center gap-4 cursor-pointer active:scale-95 md:hover:border-[#F4D03F]/30 transition-all">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10">
                    <img src={item.imagem} className="w-full h-full object-cover" alt={item.nome} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[15px] truncate">{item.nome}</h4>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{item.pais}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 shrink-0 mr-2 md:group-hover:text-[#F4D03F]" />
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