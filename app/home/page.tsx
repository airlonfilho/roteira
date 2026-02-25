'use client';

import React, { useState } from 'react';
import {
    Bell, Search, Calendar, Wallet,
    Utensils, Landmark, TreePine, Wine,
    Sparkles, Home, Compass, Map, User,
    Umbrella,
    Mountain,
    ShoppingBag,
    Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import LocationInput from '../components/LocationInput';
import DateRangeModal from '../components/DateRangeModal';
import BudgetSelect from '../components/BudgetSelect';
import LoadingScreen from '../components/LoadingScreen';
import BottomNav from '../components/BottomNav';


export default function HomePage() {
    const router = useRouter();
    // Estados do Formulário
    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [orcamento, setOrcamento] = useState('');
    const [loading, setLoading] = useState(false);

    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [modalDataAberto, setModalDataAberto] = useState(false);

    // Seleção única de Perfil
    const [perfil, setPerfil] = useState('');
    const perfis = ['Solo', 'Casal', 'Família', 'Amigos'];

    // Seleção múltipla de Interesses
    const [interessesSelecionados, setInteressesSelecionados] = useState<string[]>([]);

    const [dicaLoading, setDicaLoading] = useState('');

    const interesses = [
        { id: 'Praias', icon: Umbrella },
        { id: 'Gastronomia', icon: Utensils },
        { id: 'Aventura', icon: Mountain },
        { id: 'Cultura e História', icon: Landmark },
        { id: 'Natureza', icon: TreePine },
        { id: 'Vida Noturna', icon: Wine },
        { id: 'Compras', icon: ShoppingBag },
        { id: 'Romance', icon: Heart },
    ];

    const toggleInteresse = (id: string) => {
        if (interessesSelecionados.includes(id)) {
            setInteressesSelecionados(interessesSelecionados.filter(item => item !== id));
        } else {
            setInteressesSelecionados([...interessesSelecionados, id]);
        }
    };

    const handleGerarRoteiro = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validação Básica
        if (!destino) {
            alert("Por favor, selecione um destino para continuar.");
            return;
        }

        // 2. Tradução de Datas para "Quantidade de Dias"
        let diasCalculados = 3; // Default caso o usuário não preencha
        if (dataInicio && dataFim) {
            // Calcula a diferença em milissegundos e converte para dias
            const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
            diasCalculados = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia de ida
        } else if (dataInicio) {
            diasCalculados = 1; // Bate e volta
        }

        // 3. Montando o Payload exato que a API espera
        const payload = {
            origem: origem,
            destino: destino,
            dias: diasCalculados,
            orcamento: orcamento || 'Moderado', // Fallback se deixar em branco
            perfil: perfil,
            preferencias: interessesSelecionados.join(', ') // Ex: "Museus, Gastronomia"
        };

        // Inicia a tela de carregamento e reseta a dica antiga
        setLoading(true);
        setDicaLoading('');

        // MÁGICA 1: Dispara a busca da dica em paralelo (não usa 'await' para não travar o código!)
        fetch('http://localhost:3010/api/gerar-dica', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destino })
        })
            .then(res => res.json())
            .then(data => setDicaLoading(data.dica))
            .catch(() => setDicaLoading("A viagem está chegando! Preparando os últimos detalhes..."));

        // MÁGICA 2: A requisição pesada original do roteiro
        try {
            const response = await fetch('http://localhost:3010/api/gerar-roteiro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Falha ao comunicar com a IA.');

            const roteiroJSON = await response.json();

            const roteirosExistentes = JSON.parse(localStorage.getItem('meusRoteiros') || '[]');
            const novoRoteiro = {
                id: Date.now(), // ID único baseado no tempo
                dataCriacao: new Date().toLocaleDateString('pt-BR'),
                ...roteiroJSON
            };

            const novaLista = [novoRoteiro, ...roteirosExistentes];

            localStorage.setItem('meusRoteiros', JSON.stringify(novaLista));
            localStorage.setItem('ultimoRoteiroId', novoRoteiro.id.toString());

            router.push(`/roteiro?id=${novoRoteiro.id}`); // Vai pra tela final!

        } catch (error) {
            console.error("Erro:", error);
            alert("Ops! Houve um erro ao gerar seu roteiro. Tente novamente.");
            setLoading(false);
        }
    };

    const formatarRangeDatas = () => {
        if (!dataInicio) return 'Datas';
        const formatar = (d: Date) => `${d.getDate()} ${d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}`;
        if (dataInicio && !dataFim) return formatar(dataInicio);
        return `${formatar(dataInicio)} - ${formatar(dataFim!)}`;
    };

    return (
        // Container principal com padding-bottom para a barra de navegação inferior não sobrepor o conteúdo
        <div className="min-h-[100dvh] bg-[#121212] text-white font-sans pb-24 md:pb-0 overflow-x-hidden">

            {/* SE ESTIVER CARREGANDO, MOSTRA O OVERLAY */}
            {loading && (
                <LoadingScreen
                    destino={destino || 'seu destino'}
                    perfil={perfil}
                    dicaDinamica={dicaLoading} // <-- Passando a dica da IA para a tela
                />
            )}
            <div className={`pb-24 md:pb-0 ${loading ? 'hidden' : 'block'}`}>
                {/* HEADER (Topo) */}
                <header className="flex justify-between items-center p-6 max-w-3xl mx-auto">
                    {/* Ícone da Roteira com fundo estilo "Glow" */}
                    <div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 text-[#F4D03F] border border-[#F4D03F]/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,208,63,0.15)]">
                        <Compass size={24} className="text-roteira-neon sm:w-7 sm:h-7" />
                    </div>
                    {/* Sino de Notificação */}
                    <button className="w-12 h-12 rounded-full bg-[#1C1C1C] text-gray-300 flex items-center justify-center hover:bg-[#252525] transition-colors">
                        <Bell size={20} />
                    </button>
                </header>

                {/* TÍTULO E SUBTÍTULO */}
                <div className="px-6 mb-8 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">
                        Descubra Sua<br />Próxima Aventura
                    </h1>
                    <p className="text-gray-400 text-[15px] md:text-base leading-relaxed">
                        Planeje a viagem dos seus sonhos em segundos com IA
                    </p>
                </div>

                {/* CARD DO FORMULÁRIO */}
                <main className="px-4 max-w-3xl mx-auto">
                    <form onSubmit={handleGerarRoteiro} className="bg-[#1C1C1C] rounded-[32px] p-6 shadow-xl border border-white/5">

                        <LocationInput
                            label="Origem"
                            placeholder="De onde você sai?"
                            value={origem}
                            onChange={setOrigem}
                        />

                        <LocationInput
                            label="Destino"
                            placeholder="Para onde quer ir?"
                            value={destino}
                            onChange={setDestino}
                        />

                        {/* Duas Colunas: Quando / Orçamento */}
                        <div >
                            <div className="grid mb-6">
                                <label className="block text-sm text-gray-400 font-medium mb-2 pl-1">Quando</label>
                                {/* Transformamos a div em um button para abrir o modal */}
                                <button
                                    type="button"
                                    onClick={() => setModalDataAberto(true)}
                                    className="w-full flex items-center bg-[#252525] hover:bg-[#2C2C2C] transition-colors rounded-2xl px-4 py-3.5 text-left border border-transparent focus:border-[#F4D03F]"
                                >
                                    <Calendar size={18} className="text-gray-400 mr-3 shrink-0" />
                                    <span className={`text-[15px] truncate ${dataInicio ? 'text-white-500' : 'text-gray-500'}`}>
                                        {formatarRangeDatas()}
                                    </span>
                                </button>
                            </div>
                            <BudgetSelect
                                value={orcamento}
                                onChange={setOrcamento}
                            />
                        </div>

                        {/* Quem vai? (Perfis) */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 font-medium mb-3 pl-1">Quem vai?</label>
                            <div className="flex flex-wrap gap-2.5">
                                {perfis.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPerfil(p)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${perfil === p
                                            ? 'bg-[#F4D03F] text-black'
                                            : 'bg-[#252525] text-gray-300 hover:bg-[#2C2C2C]'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interesses (Multi-seleção com Ícones) */}
                        <div className="mb-8">
                            <label className="block text-sm text-gray-400 font-medium mb-3 pl-1">Interesses</label>
                            <div className="flex flex-wrap gap-2.5">
                                {interesses.map(({ id, icon: Icon }) => {
                                    const isSelected = interessesSelecionados.includes(id);
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => toggleInteresse(id)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${isSelected
                                                ? 'border-[#F4D03F] text-[#F4D03F] bg-[#F4D03F]/10'
                                                : 'border-transparent bg-[#252525] text-gray-400 hover:bg-[#2C2C2C]'
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {id}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTA Principal */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-black font-extrabold text-[15px] md:text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4
              ${loading
                                    ? 'bg-[#F4D03F]/70 cursor-not-allowed animate-pulse'
                                    : 'bg-[#F4D03F] shadow-[0_0_25px_rgba(244,208,63,0.25)] hover:scale-[1.02]'
                                }
            `}
                        >
                            {loading ? (
                                <>
                                    {/* Um spinner simples com Tailwind */}
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando com IA...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} fill="currentColor" />
                                    Gerar Meu Roteiro Grátis
                                </>
                            )}
                        </button>

                    </form>
                </main>

                {/* BOTTOM NAVIGATION (Mobile) */}
                <BottomNav />

                <DateRangeModal
                    isOpen={modalDataAberto}
                    onClose={() => setModalDataAberto(false)}
                    dataInicioAtual={dataInicio}
                    dataFimAtual={dataFim}
                    onConfirm={(inicio, fim) => {
                        setDataInicio(inicio);
                        setDataFim(fim);
                    }}
                />

            </div>
        </div>
    );

}


