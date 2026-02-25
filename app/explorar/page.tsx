'use client';

import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Map as MapIcon,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';


export default function ExplorarPage() {
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] bg-roteira-bg text-white font-sans pb-24 md:pb-8 overflow-x-hidden relative">

            {/* HEADER FIXO (Topo) */}
            <header className="fixed top-0 w-full z-50 px-4 py-4 flex justify-between items-center bg-roteira-bg/80 backdrop-blur-md border-b border-white/5">
                <header className="fixed top-0 w-full z-50 px-4 py-4 flex justify-center items-center bg-roteira-bg/80 backdrop-blur-md border-b border-white/5">
               
                <h1 className="text-lg font-bold truncate px-4 max-w-[200px] md:max-w-md text-center">
                    Explorar Destinos
                </h1>
               
            </header>
            </header>


            {/* BOTTOM NAVIGATION (Mobile) */}
            <BottomNav />

        </div>
    );
}
