'use client';

// 1. Adicionado 'Suspense' no import do React
import React, { useEffect, useState, Suspense } from 'react';
import {
    Bell, Search, Calendar, Wallet,
    Utensils, Landmark, TreePine, Wine,
    Sparkles, Home, Compass, Map, User,
    Umbrella,
    Mountain,
    ShoppingBag,
    Heart,
    MapIcon
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import LocationInput from '../components/LocationInput';
import DateRangeModal from '../components/DateRangeModal';
import BudgetSelect from '../components/BudgetSelect';
import LoadingScreen from '../components/LoadingScreen';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';


// 2. Renomeado o antigo HomePage para HomeContent
function HomeContent() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const destinoDaURL = searchParams.get('destino');

    // Estados do Formulário
    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [orcamento, setOrcamento] = useState('Moderado');
    const [loading, setLoading] = useState(false);

    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [modalDataAberto, setModalDataAberto] = useState(false);

    // Seleção única de Perfil
    const [perfil, setPerfil] = useState('Casal');
    const perfis = ['Solo', 'Casal', 'Família', 'Amigos'];

    // Seleção múltipla de Interesses
    const [interessesSelecionados, setInteressesSelecionados] = useState<string[]>(['Gastronomia', 'Cultura e História']);

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

    useEffect(() => {
        // Se a URL trouxe um destino, preenche o estado automaticamente!
        if (destinoDaURL) {
            setDestino(destinoDaURL);
        }
    }, [destinoDaURL]);

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
        fetch('/api/gerar-dica', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destino })
        })
            .then(res => res.json())
            .then(data => setDicaLoading(data.dica))
            .catch(() => setDicaLoading("A viagem está chegando! Preparando os últimos detalhes..."));

        // MÁGICA 2: A requisição pesada original do roteiro
        try {
            const response = await fetch('/api/gerar-roteiro', {
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
        <div className="min-h-[100dvh] md:h-screen md:overflow-hidden bg-[#121212] text-white font-sans relative flex flex-col">
            {loading && <LoadingScreen destino={destino} perfil={perfil} dicaDinamica={dicaLoading} />}

            <div className={`flex flex-col h-full ${loading ? 'hidden' : 'flex'}`}>
                <Header />

                <main className="flex-1 flex flex-col px-4 md:px-8 md:pt-8 py-24 max-w-6xl mx-auto w-full">
                    {/* TÍTULO COMPACTO NO DESKTOP */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
                            Descubra Sua <span className="text-[#F4D03F]">Próxima Aventura</span>
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm mt-2">Planeje sua viagem com IA em segundos.</p>
                    </div>

                    <form onSubmit={handleGerarRoteiro} className="bg-[#1C1C1C] rounded-[32px] p-6 md:p-8 shadow-xl border border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* COLUNA ESQUERDA: LOGÍSTICA */}
                            <div className="space-y-4">
                                <LocationInput
                                    label="Origem"
                                    placeholder="De onde sai?"
                                    value={origem}
                                    onChange={setOrigem}
                                    isOrigin={true} // <-- Ativa o botão de GPS
                                />

                                <LocationInput
                                    label="Destino"
                                    placeholder="Para onde quer ir?"
                                    value={destino}
                                    onChange={setDestino}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2 ml-1">Quando</label>
                                        <button type="button" onClick={() => setModalDataAberto(true)} className="w-full flex items-center bg-[#252525] rounded-2xl px-4 py-3.5 border border-transparent focus:border-[#F4D03F]">
                                            <Calendar size={18} className="text-gray-400 mr-2 shrink-0" />
                                            <span className="text-sm truncate">{formatarRangeDatas()}</span>
                                        </button>
                                    </div>
                                    <BudgetSelect value={orcamento} onChange={setOrcamento} />
                                </div>
                            </div>

                            {/* COLUNA DIREITA: PREFERÊNCIAS */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-3 ml-1">Quem vai?</label>
                                    <div className="flex flex-wrap gap-2">
                                        {perfis.map((p) => (
                                            <button key={p} type="button" onClick={() => setPerfil(p)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${perfil === p ? 'bg-[#F4D03F] text-black scale-105' : 'bg-[#252525] text-gray-400 hover:bg-[#2C2C2C]'}`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-3 ml-1">Interesses</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {interesses.map(({ id, icon: Icon }) => (
                                            <button key={id} type="button" onClick={() => toggleInteresse(id)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${interessesSelecionados.includes(id) ? 'border-[#F4D03F] text-[#F4D03F] bg-[#F4D03F]/5' : 'border-transparent bg-[#252525] text-gray-500'}`}>
                                                <Icon size={14} /> {id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTÃO LARGO NO FINAL */}
                        <button type="submit" disabled={loading}
                            className={`w-full mt-8 text-black font-black text-sm md:text-base py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${loading ? 'bg-[#F4D03F]/70' : 'bg-[#F4D03F] hover:shadow-[0_0_30px_rgba(244,208,63,0.3)] hover:scale-[1.01]'}`}>
                            <Sparkles size={20} fill="currentColor" />
                            {loading ? 'Processando com IA...' : 'Gerar Meu Roteiro Grátis'}
                        </button>
                    </form>
                </main>

                <BottomNav />
            </div>

            <DateRangeModal isOpen={modalDataAberto} onClose={() => setModalDataAberto(false)} dataInicioAtual={dataInicio} dataFimAtual={dataFim} onConfirm={(inicio, fim) => { setDataInicio(inicio); setDataFim(fim); }} />
        </div>
    );
}

// 3. Este é o novo componente principal que o Next.js vai enxergar
export default function HomePage() {
    return (
        // O Suspense segura o carregamento da URL silenciosamente sem quebrar o build
        <Suspense fallback={
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full"></div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}