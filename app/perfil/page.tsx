'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Crown, MapIcon as MapMinus, Award, Globe, 
  Sparkles, User, HelpCircle, LogOut, 
  ChevronRight, Lock 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { createClient } from '../utils/supabase/client';

export default function PerfilPage() {
    const router = useRouter();
    const supabase = createClient();
    
    // ESTADOS: Adicionamos o `isAuthenticated` para controlar a visão
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const [nome, setNome] = useState('Carregando...');
    const [foto, setFoto] = useState('');
    const [estatisticas, setEstatisticas] = useState({ viagens: 0, paises: 0, km: 0, roteiros: 0 });
    const [conquistas, setConquistas] = useState<string[]>([]);
    const [isPremium, setIsPremium] = useState(false);

    const obterIniciais = (nomeCompleto: string) => {
        if (!nomeCompleto || nomeCompleto === 'Carregando...') return 'U';
        const partes = nomeCompleto.trim().split(' ');
        if (partes.length >= 2) {
            return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
        }
        return nomeCompleto.substring(0, 2).toUpperCase();
    };

    const formatarKM = (km: number) => {
        return km >= 1000 ? `${(km / 1000).toFixed(1).replace('.0', '')}k` : km.toString();
    };

    useEffect(() => {
        async function fetchUserData() {
            const { data: { session }, error: authError } = await supabase.auth.getSession();
            
            // SE NÃO TIVER CONTA: Ativa o modo visitante e para por aqui
            if (authError || !session) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // SE TIVER CONTA: Continua o fluxo normal
            setIsAuthenticated(true);
            const user = session.user;
            const nomeGoogle = user.user_metadata?.name || user.user_metadata?.full_name || 'Viajante Roteira';
            const fotoGoogle = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

            setNome(nomeGoogle);
            setFoto(fotoGoogle);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!profileError && profileData) {
                setEstatisticas({
                    viagens: profileData.viagens_realizadas || 0,
                    paises: profileData.paises_visitados || 0,
                    km: profileData.km_percorridos || 0,
                    roteiros: profileData.roteiros_gerados || 0
                });
                setConquistas(profileData.conquistas || []);
                setIsPremium(profileData.is_premium || false);
            }

            setLoading(false);
        }

        fetchUserData();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('ultimoRoteiroId');

        // Em vez de atirar para a tela de login, apenas mudamos o estado para visitante!
        setIsAuthenticated(false);
    };

    return (
        <div className="min-h-[100dvh] md:h-screen md:overflow-hidden bg-[#121212] text-white font-sans relative flex flex-col">
            
            <Header />

            <main className="flex-1 flex flex-col pt-24 pb-24 md:pt-12 px-6 max-w-6xl mx-auto w-full">
                <h2 className="text-3xl font-extrabold mb-8 hidden md:block">Perfil</h2>
                
                {loading ? (
                    // TELA DE LOADING GLOBAL (Pisca rapidamente enquanto decide qual tela mostrar)
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full"></div>
                    </div>
                ) : !isAuthenticated ? (
                    
                    // =========================================================
                    // MODO VISITANTE (GUEST STATE)
                    // =========================================================
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full pt-10 md:pt-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 bg-[#1C1C1C] flex items-center justify-center mb-6 shadow-2xl relative">
                            <Lock size={40} className="text-gray-500" />
                            <div className="absolute -bottom-2 -right-2 bg-[#F4D03F] text-black p-2 rounded-full border-4 border-[#121212]">
                                <Sparkles size={16} />
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Crie seu Perfil</h2>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                            Faça login para guardar os seus roteiros criados com IA, desbloquear conquistas exclusivas e acompanhar os países que já visitou.
                        </p>
                        
                        <button 
                            onClick={() => router.push('/login')} 
                            className="w-full bg-[#F4D03F] text-black font-extrabold py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(244,208,63,0.2)] mb-12"
                        >
                            <User size={20} /> Entrar ou Criar Conta Grátis
                        </button>

                        <div className="w-full text-left opacity-40 pointer-events-none select-none grayscale">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 pl-1">Recursos Bloqueados</h3>
                            <div className="space-y-3">
                                <MenuOption icon={<MapMinus size={20} />} label="Mapa de Países Visitados" />
                                <MenuOption icon={<Award size={20} />} label="Conquistas de Viajante" />
                                <MenuOption icon={<Globe size={20} />} label="Estatísticas Pessoais" />
                            </div>
                        </div>
                    </div>

                ) : (

                    // =========================================================
                    // MODO AUTENTICADO (O SEU PERFIL COMPLETO)
                    // =========================================================
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                        
                        {/* COLUNA ESQUERDA: IDENTIDADE E STATS */}
                        <section className="flex flex-col items-center md:items-start space-y-8 w-full">
                            
                            <div className="flex flex-col items-center md:items-start w-full">
                                <div className="relative">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#F4D03F] p-1 overflow-hidden shadow-[0_0_30px_rgba(244,208,63,0.15)]">
                                        {foto ? (
                                            <img 
                                                src={foto} 
                                                alt={nome} 
                                                className="w-full h-full rounded-full object-cover"
                                                referrerPolicy="no-referrer"
                                                onError={() => setFoto('')} 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#1C1C1C] flex items-center justify-center rounded-full">
                                                <span className="text-4xl md:text-5xl font-black text-[#F4D03F] tracking-tighter">
                                                    {obterIniciais(nome)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* <div className="absolute bottom-1 right-1 bg-[#F4D03F] text-black rounded-full p-1.5 border-4 border-[#121212]">
                                        <CheckCircleIcon size={18} />
                                    </div> */}
                                </div>
                                
                                <div className="text-center md:text-left mt-6">
                                    <h2 className="text-3xl font-black tracking-tight">{nome}</h2>
                                    
                                    {isPremium && (
                                        <div className="mt-3 bg-[#1C1C1C] border border-[#F4D03F]/30 px-5 py-2 rounded-full flex items-center gap-2 w-fit mx-auto md:mx-0">
                                            <Crown size={14} className="text-[#F4D03F]" />
                                            <span className="text-[#F4D03F] text-[10px] font-black uppercase tracking-widest">Membro Premium</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <StatCard number={estatisticas.viagens.toString()} label="Viagens Realizadas" />
                                <StatCard number={estatisticas.paises.toString()} label="Países Visitados" />
                                <StatCard number={formatarKM(estatisticas.km)} label="KM Percorridos" />
                                <StatCard number={estatisticas.roteiros.toString()} label="Roteiros IA" />
                            </div>
                        </section>

                        {/* COLUNA DIREITA: CONQUISTAS E MENU */}
                        <section className="space-y-10 w-full">
                            <div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 pl-1">Conquistas Desbloqueadas</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    <Badge icon={<MapMinus size={20} />} label="Explorador" active={conquistas.includes('Explorador')} />
                                    <Badge icon={<Award size={20} />} label="Gourmet" active={conquistas.includes('Gourmet')} />
                                    <Badge icon={<Globe size={20} />} label="Global" active={conquistas.includes('Global')} />
                                    <Badge icon={<Sparkles size={20} />} label="Frequente" active={conquistas.includes('Frequente')} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 pl-1">Configurações</h3>
                                {/* <MenuOption icon={<User size={20} />} label="Minha Conta" />
                                <MenuOption icon={<Crown size={20} className="text-[#F4D03F]" />} label="Assinatura Premium" /> */}
                                <MenuOption icon={<HelpCircle size={20} />} label="Central de Ajuda" />
                                
                                <button onClick={handleLogout} className="w-full bg-[#1C1C1C] border border-white/5 rounded-[24px] p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-[#252525]">
                                    <div className="flex items-center gap-4">
                                        <div className="text-red-500 transition-colors">
                                            <LogOut size={20} />
                                        </div>
                                        <span className="font-bold text-sm text-red-500">Sair da Conta</span>
                                    </div>
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}

// COMPONENTES AUXILIARES (Mantidos)

function StatCard({ number, label }: { number: string, label: string }) {
    return (
        <div className="bg-[#1C1C1C] border border-white/5 rounded-[28px] p-6 text-center md:text-left hover:border-[#F4D03F]/20 transition-colors">
            <div className="text-3xl font-black text-[#F4D03F] mb-1">{number}</div>
            <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider leading-tight mt-2">
                {label}
            </div>
        </div>
    );
}

function Badge({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${active ? 'bg-[#F4D03F] border-[#F4D03F] text-black shadow-[0_10px_20px_rgba(244,208,63,0.2)] scale-105' : 'bg-[#1C1C1C] border-white/5 text-gray-600 grayscale'}`}>
                {icon}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-tighter text-center ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
        </div>
    );
}

function MenuOption({ icon, label, isLast = false }: { icon: any, label: string, isLast?: boolean }) {
    return (
        <button className="w-full bg-[#1C1C1C] border border-white/5 rounded-[24px] p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-[#252525]">
            <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <span className={`font-bold text-sm ${isLast ? 'text-red-500' : 'text-gray-200'}`}>{label}</span>
            </div>
            {!isLast && <ChevronRight size={18} className="text-gray-600" />}
        </button>
    );
}

function CheckCircleIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
        </svg>
    );
}