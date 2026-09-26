'use client';

/**
 * Componente MobileTabBar de Chronos AI Pulse
 * Barra de navegación inferior fija diseñada específicamente para navegación con el pulgar en teléfonos móviles.
 * Cumple con el límite máximo del 15% de altura en móviles y objetivos táctiles >= 44px.
 * Permite cambiar al instante entre Inicio, Despachos de 6h, Arquitectura y Canales.
 */

import React from 'react';
import { 
  Home, 
  Newspaper, 
  Bot,
  Workflow, 
  Radio 
} from 'lucide-react';
import { ScreenTab } from './Navbar';

interface MobileTabBarProps {
  activeScreen: ScreenTab;
  onSelectScreen: (screen: ScreenTab) => void;
}

export function MobileTabBar({
  activeScreen,
  onSelectScreen
}: MobileTabBarProps) {
  const tabs = [
    { id: 'welcome' as ScreenTab, label: 'Inicio', icon: Home },
    { id: 'dispatches' as ScreenTab, label: 'Despachos', icon: Newspaper },
    { id: 'chatbot' as ScreenTab, label: 'Muse 1.3', icon: Bot },
    { id: 'pipeline' as ScreenTab, label: 'Ciclo 6h', icon: Workflow },
    { id: 'channels' as ScreenTab, label: 'Canales', icon: Radio },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-1.5 py-1 safe-area-pb">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectScreen(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] active:scale-95 ${
                isActive
                  ? 'text-indigo-400 bg-indigo-950/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
