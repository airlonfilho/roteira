// src/config/navigation.ts
import { Home, Compass, Map, User } from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Início', path: '/home', icon: Home },
  { name: 'Explorar', path: '/explorar', icon: Compass },
  { name: 'Viagens', path: '/viagens', icon: Map },
  { name: 'Perfil', path: '/perfil', icon: User },
];