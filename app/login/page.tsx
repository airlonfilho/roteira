'use client';

import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Ícones Customizados (Para manter o padrão Premium) ---

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {

  const router = useRouter();
  return (
    <div className="h-[100dvh] bg-roteira-bg flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* SEÇÃO 1: A Imagem (Mobile = Topo, Web = Metade Esquerda) */}
      <div className="relative w-full h-[35vh] md:h-screen md:w-[45%] lg:w-1/2 shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1200&auto=format&fit=crop" 
          alt="Paisagem inspiradora" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradiente Mágico: 
            No mobile ele desce para o fundo escuro. 
            No desktop ele vai da esquerda para a direita para mesclar com o formulário. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-roteira-bg/20 to-roteira-bg md:bg-gradient-to-r md:from-transparent md:via-roteira-bg/50 md:to-roteira-bg"></div>

        {/* Ícone flutuante sobre a imagem (Apenas visível no mobile, pois no Web colocamos acima do texto) */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden">
          <div className="w-20 h-20 rounded-full bg-roteira-neon/10 border border-roteira-neon/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(244,208,63,0.2)]">
            <Compass size={24} className="text-roteira-neon sm:w-7 sm:h-7" />
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: O Formulário de Login */}
      {/* Usamos z-10 e -mt-20 no mobile para o form subir em cima do gradiente da imagem */}
      <div className="flex-1 relative z-10 -mt-20 md:mt-0 flex flex-col justify-center px-6 pb-12 pt-0 md:p-12 lg:p-20">
        
        <div className="max-w-md w-full mx-auto">
          
          {/* Ícone no Desktop (fica acima do texto em telas grandes) */}
          <div className="hidden md:flex justify-center mb-10">
            <div className="w-24 h-24 rounded-full bg-roteira-neon/5 border border-roteira-neon/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(244,208,63,0.1)]">
              <Compass size={24} className="text-roteira-neon sm:w-7 sm:h-7" />
            </div>
          </div>

          {/* Cabeçalho */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Sua próxima<br />jornada começa<br />aqui
            </h1>
            <p className="text-roteira-text text-[15px] leading-relaxed max-w-sm mx-auto">
              Crie roteiros inteligentes em segundos com o poder da nossa IA.
            </p>
          </div>

          {/* Botões Sociais Primários */}
          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-full py-3.5 px-6 font-bold hover:bg-gray-100 transition-colors">
              <GoogleIcon />
              Continuar com Google
            </button>
          </div>

          {/* Divisor "ou entre com e-mail" */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-roteira-border"></div>
            <span className="text-sm text-[#6B6B6B] font-medium">ou entre com e-mail</span>
            <div className="flex-1 h-px bg-roteira-border"></div>
          </div>

          {/* Botão de E-mail Secundário */}
          <button onClick={() => router.push('/home')} className="w-full flex items-center justify-center bg-transparent border border-roteira-border text-white rounded-full py-4 px-6 font-bold hover:border-white transition-colors">
            Entrar com E-mail
          </button>

          {/* Footer (Termos e Privacidade) */}
          <p className="text-center text-[10px] text-[#6B6B6B] uppercase tracking-widest mt-12 leading-relaxed">
            Ao continuar, você concorda com<br />nossos{' '}
            <Link href="#" className="underline hover:text-white transition-colors">
              Termos de Uso
            </Link> 
            {' '}e{' '}
            <Link href="#" className="underline hover:text-white transition-colors">
              Privacidade
            </Link>
          </p>
          
        </div>
      </div>

    </div>
  );
}