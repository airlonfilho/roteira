'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, MapPin, Sparkles, Plane, Building2,
  MessageSquare, ArrowRight, Star, ChevronDown,
  CheckCircle2, Clock
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function RoteiraLandingPage() {
  const [destino, setDestino] = useState('');
  const [faqAberto, setFaqAberto] = useState<number | null>(null);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efeito de "Debounce" para a busca
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (destino.length > 2 && mostrarDropdown) {
        setBuscando(true);
        try {
          // MUDANÇA: Adicionado &addressdetails=1 no final da URL
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destino}&featuretype=city&limit=5&addressdetails=1`);
          const data = await res.json();
          setSugestoes(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        } finally {
          setBuscando(false);
        }
      } else {
        setSugestoes([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [destino, mostrarDropdown]);

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selecionarCidade = (nomeFormatado: string) => {
    setDestino(nomeFormatado);
    setMostrarDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destino) alert(`Iniciando roteiro para: ${destino}`);
  };

  const toggleFaq = (index: number) => {
    setFaqAberto(faqAberto === index ? null : index);
  };

  const destinosCarrossel = [
    { title: "Machu Picchu, Peru", img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop" },
    { title: "Chamonix, França", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop" },
    { title: "Tóquio, Japão", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop" },
    { title: "Roma, Itália", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop" },
    { title: "Bali, Indonésia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
  ];

  const faqs = [
    { pergunta: "O roteiro é realmente feito por IA?", resposta: "Sim! Utilizamos os modelos mais avançados do mercado para cruzar dados de geografia, horários, avaliações e logística para criar um roteiro perfeito." },
    { pergunta: "Como funciona o roteiro gratuito?", resposta: "Ao pesquisar um destino, geramos o Dia 1 do seu roteiro 100% de graça para você testar. Se gostar, você pode desbloquear os dias restantes por uma taxa única." },
    { pergunta: "A Roteira compra as passagens para mim?", resposta: "Não. Nós encontramos as melhores opções e fornecemos os links diretos para você finalizar a compra com segurança no Booking ou Skyscanner." },
    { pergunta: "Posso alterar o roteiro depois de gerado?", resposta: "Sim! Você pode regenerar turnos específicos (ex: 'troque o museu por um parque') ou reordenar os dias conforme a sua vontade." }
  ];

  const depoimentos = [
    { nome: "Mariana Costa", perfil: "Viajante Solo", texto: "Economizei semanas de pesquisa. A IA organizou meu mochilão agrupando os passeios por bairro. Não gastei com Uber nenhuma vez!", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
    { nome: "Carlos & Amanda", perfil: "Casal", texto: "Pedimos um roteiro romântico com orçamento moderado. A Roteira nos indicou restaurantes incríveis. Valeu cada centavo do desbloqueio.", foto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop" },
    { nome: "Roberto Mendes", perfil: "Viagem em Família", texto: "Viajar com duas crianças é um caos logístico. A opção 'Família' colocou parques de manhã e passeios leves à tarde. Salvou nossas férias.", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-roteira-bg text-white font-sans selection:bg-roteira-neon selection:text-black overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-roteira-bg/80 backdrop-blur-md border-b border-roteira-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-extrabold text-xl sm:text-2xl tracking-tight">
            <Compass size={24} className="text-roteira-neon sm:w-7 sm:h-7" />
            <span>Roteira</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-roteira-text">
            {/* <a href="#como-funciona" className="hover:text-white transition">Como Funciona</a>
            <a href="#depoimentos" className="hover:text-white transition">Avaliações</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a> */}
          </div>
          <a href='/login' className="bg-roteira-card border border-roteira-border hover:border-roteira-neon text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all">
            Login
          </a>
        </div>
      </nav>

      {/* 1. HERO SECTION (Pattern + iPhone UI) */}
      <section className="relative pt-28 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-roteira-bg via-transparent to-roteira-bg"></div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-roteira-card text-roteira-neon font-medium text-sm mb-6 border border-roteira-border">
              <Sparkles size={16} /> Inteligência Artificial para Viagens
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-4 sm:mb-6">
              Sua viagem pronta em <span className="text-transparent bg-clip-text bg-gradient-to-r from-roteira-neon to-[#FFF0B3]">1 minuto.</span>
            </h1>
            <p className="text-base sm:text-lg text-roteira-text mb-6 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Diga adeus às dezenas de abas abertas. A Roteira cria um itinerário perfeito, dia a dia, otimizado para o seu bolso e estilo.
            </p>

            <div className="relative max-w-xl mx-auto lg:mx-0" ref={dropdownRef}>
              <form onSubmit={handleSearch} className="relative shadow-[0_0_40px_rgba(244,208,63,0.1)] rounded-full">
                <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none z-20">
                  <MapPin size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="text"
                  value={destino}
                  onChange={(e) => {
                    setDestino(e.target.value);
                    setMostrarDropdown(true);
                  }}
                  onFocus={() => setMostrarDropdown(true)}
                  placeholder="Ex: Paris, França..."
                  className="w-full bg-roteira-card border border-roteira-border text-white text-base sm:text-lg rounded-full py-4 sm:py-5 pl-12 sm:pl-14 pr-32 sm:pr-40 focus:outline-none focus:border-roteira-neon transition-all relative z-10"
                  required
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute inset-y-2 right-2 bg-roteira-neon text-black font-bold px-4 sm:px-6 rounded-full hover:scale-105 transition-transform text-sm sm:text-base z-20"
                >
                  Gerar Roteiro
                </button>
              </form>

              {/* Dropdown de Sugestões */}
              {mostrarDropdown && (sugestoes.length > 0 || buscando) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-roteira-card border border-roteira-border rounded-2xl shadow-2xl overflow-hidden z-50">
                  {buscando ? (
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

            <p className="mt-4 text-sm text-roteira-text flex items-center justify-center lg:justify-start gap-2">
              <CheckCircle2 size={14} className="text-roteira-neon" /> O Dia 1 é grátis!
            </p>
          </div>

          <div className="flex-1 relative w-full flex justify-center mt-8 lg:mt-0">
            <div className="relative w-[260px] sm:w-[300px] h-[540px] sm:h-[620px] bg-roteira-bg rounded-[40px] sm:rounded-[50px] border-[10px] sm:border-[12px] border-[#252525] shadow-2xl overflow-hidden z-20 flex flex-col">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30"></div>
              <div className="relative h-48 w-full shrink-0">
                <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop" alt="Paris" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-roteira-bg to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 font-bold text-2xl text-white">Roteiro de 3 Dias</h3>
              </div>
              <div className="flex-1 bg-roteira-bg p-4 overflow-hidden flex flex-col gap-4">
                <p className="font-bold text-sm text-white mb-[-8px]">Sugestões da IA</p>
                <div className="bg-roteira-card border border-roteira-border p-3 rounded-2xl flex items-center gap-3">
                  <div className="bg-[#2C2C2C] p-2 rounded-full"><Plane size={16} className="text-roteira-neon" /></div>
                  <div>
                    <p className="text-xs font-bold text-white">Air France</p>
                    <p className="text-[10px] text-roteira-text">GRU ➝ CDG</p>
                    <p className="text-xs font-bold text-roteira-neon mt-1">R$ 4.250</p>
                  </div>
                </div>
                <p className="font-bold text-sm text-white mt-2 mb-[-4px]">Dia 1: Chegada</p>
                {/* Manhã */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-full bg-roteira-neon/30 rounded-full"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-roteira-card border border-roteira-border p-2 rounded-xl flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-lg object-cover" alt="Cafe" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-roteira-neon font-bold uppercase">Manhã</p>
                        <p className="text-[11px] font-bold text-white truncate">Café no Montmartre</p>
                      </div>
                    </div>
                    <div className="bg-roteira-card border border-roteira-border p-2 rounded-xl flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-lg object-cover" alt="Sacre Coeur" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">Basílica de Sacré Cœur</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Tarde */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-full bg-orange-500/30 rounded-full"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-roteira-card border border-roteira-border p-2 rounded-xl flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1570097703229-b195d6dd291f?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-lg object-cover" alt="Eiffel" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-orange-400 font-bold uppercase">Tarde</p>
                        <p className="text-[11px] font-bold text-white truncate">Torre Eiffel</p>
                      </div>
                    </div>
                    <div className="bg-roteira-card border border-roteira-border p-2 rounded-xl flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-lg object-cover" alt="Seine" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">Cruzeiro no Sena</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Noite */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-full bg-purple-500/30 rounded-full"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-roteira-card border border-roteira-border p-2 rounded-xl flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-lg object-cover" alt="Restaurant" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-purple-400 font-bold uppercase">Noite</p>
                        <p className="text-[11px] font-bold text-white truncate">Jantar em Le Marais</p>
                      </div>
                    </div>
                    <div className="bg-roteira-card border border-roteira-border p-2 rounded-xl flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-lg object-cover" alt="Champs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">Champs-Élysées</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex absolute top-20 -left-12 bg-roteira-card p-4 rounded-2xl border border-roteira-border shadow-2xl z-30 items-center gap-3 animate-pulse">
              <div className="bg-[#2C2C2C] p-2 rounded-full"><Plane size={18} className="text-roteira-neon" /></div>
              <div>
                <p className="text-xs font-bold text-white">Melhor Opção</p>
                <p className="text-[10px] text-roteira-text">Voo direto 11h 30m</p>
              </div>
            </div>
            <div className="hidden sm:flex absolute bottom-32 -right-16 bg-roteira-card p-4 rounded-2xl border border-roteira-border shadow-2xl z-30 items-center gap-3 hover:scale-105 transition-transform">
              <div className="bg-[#2C2C2C] p-2 rounded-full"><Building2 size={18} className="text-roteira-neon" /></div>
              <div>
                <p className="text-xs font-bold text-white">Hotel Pullman Paris</p>
                <p className="text-xs font-bold text-roteira-neon">R$ 850/noite</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROVA SOCIAL */}
      <section className="py-6 sm:py-8 border-y border-roteira-border bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-20 opacity-40 grayscale">
            <span className="text-base sm:text-xl font-black font-serif">Booking.com</span>
            <span className="text-base sm:text-xl font-black">Skyscanner</span>
            <span className="text-base sm:text-xl font-black tracking-tighter">Expedia</span>
            <span className="text-base sm:text-xl font-bold flex items-center gap-1"><Star fill="currentColor" size={16} /> Trustpilot</span>
          </div>
        </div>
      </section>

      {/* 3. O PROBLEMA VS SOLUÇÃO */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-roteira-neon/5 to-transparent pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-roteira-card text-roteira-text font-medium text-sm mb-6 border border-roteira-border">
          <Sparkles size={14} /> Por que a Roteira?
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Planejar viagens não precisa <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">ser um pesadelo.</span></h2>
        <p className="text-roteira-text text-lg mb-16 max-w-2xl mx-auto">Veja a diferença entre perder horas pesquisando e ter tudo pronto em segundos.</p>

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-gradient-to-br from-red-950/40 to-red-950/10 border border-red-500/20 p-6 sm:p-10 rounded-2xl sm:rounded-[32px] text-left relative overflow-hidden group hover:border-red-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-2xl">😩</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400">O Jeito Antigo</h3>
                <p className="text-sm text-red-400/60">Estresse garantido</p>
              </div>
            </div>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start group/item">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm font-bold">✕</span>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Horas lendo blogs desatualizados</p>
                  <p className="text-sm text-gray-500 mt-1">Informações de 2019 sobre restaurantes que já fecharam.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group/item">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm font-bold">✕</span>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Atrações a 2h de distância uma da outra</p>
                  <p className="text-sm text-gray-500 mt-1">Descobrir isso só no meio da viagem é frustrante.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group/item">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm font-bold">✕</span>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Planilhas gigantescas no Excel</p>
                  <p className="text-sm text-gray-500 mt-1">Que você nem consegue abrir no celular.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-roteira-neon/20 to-roteira-neon/5 border border-roteira-neon/30 p-6 sm:p-10 rounded-2xl sm:rounded-[32px] text-left relative overflow-hidden group hover:border-roteira-neon/50 hover:shadow-[0_0_40px_rgba(244,208,63,0.1)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-roteira-neon/20 blur-[60px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-roteira-neon/20 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-roteira-neon">Com a Roteira</h3>
                <p className="text-sm text-roteira-neon/60">Viagem dos sonhos</p>
              </div>
            </div>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-roteira-neon/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="text-roteira-neon" size={14} />
                </div>
                <div>
                  <p className="text-white font-medium">Roteiros prontos em segundos</p>
                  <p className="text-sm text-gray-400 mt-1">IA gera itinerários completos instantaneamente.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-roteira-neon/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="text-roteira-neon" size={14} />
                </div>
                <div>
                  <p className="text-white font-medium">Atrações agrupadas pelo mapa</p>
                  <p className="text-sm text-gray-400 mt-1">Otimização geográfica para você andar menos.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-roteira-neon/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="text-roteira-neon" size={14} />
                </div>
                <div>
                  <p className="text-white font-medium">Tudo centralizado no celular</p>
                  <p className="text-sm text-gray-400 mt-1">Acesse offline, a qualquer momento.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. INSPIRAÇÃO (Carrossel Swiper) */}
      <section className="py-16 sm:py-24 overflow-visible relative border-t border-roteira-border">
        <div className="text-center mb-8 sm:mb-10 relative z-10 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Inspire-se.</h2>
          <p className="text-roteira-text text-base sm:text-lg max-w-2xl mx-auto">Deixe nossa IA guiar sua próxima aventura pelos destinos mais desejados do mundo.</p>
        </div>

        <div className="w-full max-w-6xl mx-auto pb-10 relative z-10">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            loop={true}
            loopAdditionalSlides={3}
            speed={300}
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            coverflowEffect={{ rotate: 0, stretch: 100, depth: 150, modifier: 1, slideShadows: true }}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="swiper-inspiracao py-10"
            breakpoints={{
              320: { slidesPerView: 1.2 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {[...destinosCarrossel, ...destinosCarrossel, ...destinosCarrossel].map((dest, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden group border border-roteira-border">
                  <img src={dest.img} alt={dest.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{dest.title}</h3>
                    <button className="text-roteira-neon text-sm font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                      Gerar roteiro <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 5. FUNCIONALIDADES */}
      <section id="como-funciona" className="py-16 sm:py-24 bg-[#0A0A0A] border-y border-roteira-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-roteira-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-roteira-border hover:border-roteira-neon/50 transition-colors">
              <Clock size={32} className="text-roteira-neon mb-6" />
              <h3 className="text-xl font-bold mb-4">Logística Perfeita</h3>
              <p className="text-roteira-text leading-relaxed">A IA agrupa atrações geograficamente para você fazer passeios a pé e perder o mínimo de tempo no trânsito.</p>
            </div>
            <div className="bg-roteira-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-roteira-border hover:border-roteira-neon/50 transition-colors">
              <MessageSquare size={32} className="text-roteira-neon mb-6" />
              <h3 className="text-xl font-bold mb-4">100% Personalizado</h3>
              <p className="text-roteira-text leading-relaxed">Mochileiro solo ou família com crianças? O roteiro se adapta instantaneamente às suas preferências e ao seu orçamento.</p>
            </div>
            <div className="bg-roteira-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-roteira-border hover:border-roteira-neon/50 transition-colors">
              <Plane size={32} className="text-roteira-neon mb-6" />
              <h3 className="text-xl font-bold mb-4">Smart Booking</h3>
              <p className="text-roteira-text leading-relaxed">O roteiro sugere as melhores passagens e hotéis usando nossas integrações, resolvendo a sua viagem de ponta a ponta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PREÇO TRANSPARENTE */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-roteira-neon/3 to-transparent pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-roteira-card text-roteira-neon font-medium text-sm mb-6 border border-roteira-border">
          <Sparkles size={14} /> Sem surpresas
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Pague apenas pelo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-roteira-neon to-[#FFF0B3]">amar.</span></h2>
        <p className="text-roteira-text text-base sm:text-lg mb-10 sm:mb-16 max-w-2xl mx-auto">Nós odiamos assinaturas mensais tanto quanto você. A Roteira funciona no modelo de liberação por viagem.</p>

        <div className="max-w-lg mx-auto relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-roteira-neon/20 via-roteira-neon/10 to-roteira-neon/20 rounded-3xl sm:rounded-[44px] blur-xl opacity-60"></div>

          <div className="relative bg-gradient-to-br from-roteira-card to-[#1a1a1a] rounded-2xl sm:rounded-[40px] border border-roteira-neon/30 overflow-hidden">
            <div className="absolute top-6 right-6">
              <div className="bg-roteira-neon text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={12} fill="currentColor" /> Mais Popular
              </div>
            </div>

            <div className="p-6 sm:p-10 pb-6 sm:pb-8 border-b border-roteira-border/50 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-roteira-neon/10 blur-[80px] rounded-full"></div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-roteira-neon/20 to-roteira-neon/5 flex items-center justify-center mx-auto mb-6 border border-roteira-neon/20">
                <Compass size={32} className="text-roteira-neon" />
              </div>

              <h3 className="text-2xl font-bold mb-2">Roteiro Completo</h3>
              <p className="text-sm text-roteira-text mb-6">Tudo que você precisa para a viagem perfeita</p>

              <div className="flex justify-center items-baseline gap-1 mb-2">
                <span className="text-lg text-roteira-text line-through opacity-50">R$ 39,90</span>
              </div>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-roteira-neon to-[#FFF0B3]">R$ 19,90</span>
              </div>
              <p className="text-roteira-text mt-2 text-sm">por viagem • acesso vitalício</p>
            </div>

            <div className="p-6 sm:p-10 pt-6 sm:pt-8 bg-gradient-to-b from-transparent to-roteira-bg/50">
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-4 p-3 rounded-2xl bg-roteira-neon/5 border border-roteira-neon/10">
                  <div className="w-8 h-8 rounded-xl bg-roteira-neon/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-roteira-neon" size={18} />
                  </div>
                  <div>
                    <span className="text-white font-medium">Dia 1 do roteiro</span>
                    <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">GRÁTIS</span>
                  </div>
                </li>
                <li className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-roteira-neon/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-roteira-neon" size={18} />
                  </div>
                  <span className="text-gray-300">Desbloqueio de todos os dias</span>
                </li>
                <li className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-roteira-neon/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-roteira-neon" size={18} />
                  </div>
                  <span className="text-gray-300">Links de reservas integrados</span>
                </li>
                <li className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-roteira-neon/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-roteira-neon" size={18} />
                  </div>
                  <span className="text-gray-300">Regeneração ilimitada de turnos</span>
                </li>
                <li className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-roteira-neon/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-roteira-neon" size={18} />
                  </div>
                  <span className="text-gray-300">Exportar para PDF e offline</span>
                </li>
              </ul>

              <button className="w-full bg-gradient-to-r from-roteira-neon to-[#e6c235] text-black font-bold py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(244,208,63,0.3)] flex items-center justify-center gap-2 group">
                Testar Gratuitamente Agora
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-roteira-text text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-roteira-neon" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-roteira-neon" />
            <span>Garantia de 7 dias</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-roteira-neon" />
            <span>Suporte 24/7</span>
          </div>
        </div>
      </section>

      {/* 7. DEPOIMENTOS */}
      <section id="depoimentos" className="py-16 sm:py-24 bg-[#0A0A0A] border-y border-roteira-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-16">O que os viajantes dizem</h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {depoimentos.map((dep, idx) => (
              <div key={idx} className="bg-roteira-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-roteira-border">
                <div className="flex gap-1 mb-4 text-roteira-neon">
                  <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
                </div>
                <p className="text-gray-300 mb-6 italic">&quot;{dep.texto}&quot;</p>
                <div className="flex items-center gap-4">
                  <img src={dep.foto} alt={dep.nome} className="w-12 h-12 rounded-full object-cover grayscale" />
                  <div>
                    <h4 className="font-bold">{dep.nome}</h4>
                    <p className="text-xs text-roteira-neon">{dep.perfil}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Dúvidas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-roteira-card border border-roteira-border rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-4 sm:p-6 text-left font-bold hover:bg-roteira-border transition-colors text-sm sm:text-base"
              >
                {faq.pergunta}
                <ChevronDown size={20} className={`text-roteira-neon transition-transform ${faqAberto === index ? 'rotate-180' : ''}`} />
              </button>
              {faqAberto === index && (
                <div className="p-6 pt-0 text-roteira-text leading-relaxed border-t border-roteira-border mt-2">
                  {faq.resposta}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="max-w-5xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-roteira-neon/10 via-roteira-neon/5 to-roteira-neon/10 rounded-3xl sm:rounded-[56px] blur-2xl"></div>

          <div className="relative bg-gradient-to-br from-[#1a1a1a] via-roteira-card to-[#1a1a1a] border border-roteira-neon/20 rounded-2xl sm:rounded-[48px] p-8 sm:p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-roteira-neon/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-roteira-neon/5 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Mapa-múndi SVG de fundo */}
            <img
              src="/mapa.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-30"
            />

            <div className="relative z-10">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-roteira-neon/20 to-roteira-neon/5 flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-roteira-neon/30 shadow-[0_0_40px_rgba(244,208,63,0.2)]">
                <Compass size={28} className="text-roteira-neon sm:hidden" />
                <Compass size={40} className="text-roteira-neon hidden sm:block" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-roteira-neon/10 text-roteira-neon font-medium text-sm mb-6 border border-roteira-neon/20">
                <Sparkles size={14} /> Comece sua aventura
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6">
                O mundo no seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-roteira-neon to-[#FFF0B3]">bolso.</span>
              </h2>

              <p className="text-base sm:text-xl text-roteira-text mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Digite seu destino, confira o Dia 1 de graça e veja a mágica acontecer. Sua próxima aventura está a um clique de distância.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button className="w-full sm:w-auto bg-gradient-to-r from-roteira-neon to-[#e6c235] text-black font-extrabold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(244,208,63,0.4)] flex items-center justify-center gap-3 group">
                  Criar Roteiro Agora
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="text-roteira-text hover:text-white font-medium px-6 py-5 rounded-2xl transition-colors flex items-center gap-2 group">
                  <MessageSquare size={18} />
                  Falar com suporte
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-roteira-text">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span>Dia 1 grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span>Pronto em 1 minuto.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#0A0A0A] py-8 sm:py-12 border-t border-roteira-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <div className="flex items-center gap-2 text-white font-bold text-xl justify-center">
            <Compass size={24} className="text-roteira-neon" />
            <span>Roteira</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 Roteira AI Planner. Feito para viajantes.</p>
          <div className="flex gap-6 text-sm text-gray-500 justify-center">
            <a href="#" className="hover:text-white transition">Termos</a>
            <a href="#" className="hover:text-white transition">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
