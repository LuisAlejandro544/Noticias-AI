'use client';

/**
 * Componente Navbar de Chronos AI Pulse
 * Implementa el contrato estricto de barra superior (Top Bar Contract):
 * Zona 1: Título de marca limpio de un solo elemento de texto.
 * Zona 2: Enlaces de navegación directos para alternar entre las pantallas de la aplicación.
 * Zona 3: Botón de acción principal ("Probar Despacho") y badge funcional.
 * Optimizado para pantallas táctiles y teléfonos móviles con menú responsivo.
 */

import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

export type ScreenTab = 'welcome' | 'dispatches' | 'chatbot' | 'pipeline' | 'channels';

interface NavbarProps {
  activeScreen: ScreenTab;
  onSelectScreen: (screen: ScreenTab) => void;
  onOpenSampleModal: () => void;
  nextDispatchCountdown: string;
}

export function Navbar({
  activeScreen,
  onSelectScreen,
  onOpenSampleModal,
  nextDispatchCountdown
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (screen: ScreenTab) => {
    onSelectScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zona 1: Marca principal como elemento de texto único */}
        <button
          onClick={() => handleNav('welcome')}
          className="text-left group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-1"
          aria-label="Chronos AI Pulse Inicio"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:border-indigo-400 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            Chronos AI Pulse
          </span>
        </button>

        {/* Zona 2: Enlaces de navegación entre pantallas para desktop/tablets */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleNav('welcome')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'welcome'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inicio & Radar
          </button>
          <button
            onClick={() => handleNav('dispatches')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'dispatches'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Despachos 6h
          </button>
          <button
            onClick={() => handleNav('chatbot')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeScreen === 'chatbot'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-indigo-400 hover:text-indigo-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Chatbot Muse 1.3</span>
          </button>
          <button
            onClick={() => handleNav('pipeline')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'pipeline'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cómo Funciona
          </button>
          <button
            onClick={() => handleNav('channels')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeScreen === 'channels'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Canales de Entrega
          </button>
        </nav>

        {/* Zona 3: Acciones principales */}
        <div className="flex items-center gap-2.5">
          {/* Indicador de próximo ciclo */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border border-slate-800/80 bg-slate-900/40 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Próximo ciclo en</span>
            <span className="font-mono text-slate-200 font-medium tabular-nums">{nextDispatchCountdown}</span>
          </div>

          {/* Botón de acción principal */}
          <button
            onClick={onOpenSampleModal}
            className="px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 whitespace-nowrap"
          >
            <span>Ver Despacho Muestra</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Botón de menú móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl animate-in slide-in-from-top duration-150">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60 mb-2">
            <span>Próximo despacho de noticias en:</span>
            <span className="font-mono text-indigo-300 font-semibold">{nextDispatchCountdown}</span>
          </div>
          <button
            onClick={() => handleNav('welcome')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeScreen === 'welcome' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Inicio & Radar de Bienvenida
          </button>
          <button
            onClick={() => handleNav('dispatches')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeScreen === 'dispatches' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Últimos Despachos de 6 Horas
          </button>
          <button
            onClick={() => handleNav('chatbot')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
              activeScreen === 'chatbot' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>Chatbot Muse Spark 1.3</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-500/30">
              OpenCode
            </span>
          </button>
          <button
            onClick={() => handleNav('pipeline')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeScreen === 'pipeline' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Arquitectura y Ciclo Automatizado
          </button>
          <button
            onClick={() => handleNav('channels')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeScreen === 'channels' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Canales de Suscripción (Telegram, Discord, RSS)
          </button>
        </div>
      )}
    </header>
  );
}
