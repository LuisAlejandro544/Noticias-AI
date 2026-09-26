'use client';

/**
 * Componente Footer de Chronos AI Pulse
 * Pie de página sobrio que incluye derechos reservados, enlaces directos entre pantallas
 * y especificación de la periodicidad horaria (cada 6 horas).
 * Diseñado con espaciado limpio para no obstaculizar la barra móvil inferior.
 */

import React from 'react';
import { ScreenTab } from './Navbar';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: ScreenTab) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-500 text-xs py-10 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-300">Chronos AI Pulse</span>
          <span>— Monitoreo de IA cada 6 horas</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <button
            onClick={() => onNavigate('welcome')}
            className="hover:text-slate-200 transition-colors"
          >
            Inicio & Radar
          </button>
          <button
            onClick={() => onNavigate('dispatches')}
            className="hover:text-slate-200 transition-colors"
          >
            Despachos 6h
          </button>
          <button
            onClick={() => onNavigate('chatbot')}
            className="hover:text-indigo-300 transition-colors text-indigo-400 font-medium"
          >
            Chatbot Muse 1.3
          </button>
          <button
            onClick={() => onNavigate('pipeline')}
            className="hover:text-slate-200 transition-colors"
          >
            Arquitectura
          </button>
          <button
            onClick={() => onNavigate('channels')}
            className="hover:text-slate-200 transition-colors"
          >
            Canales (Telegram / Discord)
          </button>
        </div>

        <div className="text-center md:text-right text-slate-600">
          © {new Date().getFullYear()} Chronos AI Pulse. Rastreo autónomo de noticias de IA.
        </div>
      </div>
    </footer>
  );
}
