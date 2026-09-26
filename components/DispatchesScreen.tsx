'use client';

/**
 * Componente DispatchesScreen de Chronos AI Pulse
 * Pantalla dedicada a visualizar los despachos generados en cada ventana de 6 horas.
 * Permite filtrar por categorías técnicas, inspeccionar puntos clave, consultar las
 * fuentes primarias y abrir la vista detallada de cualquier informe.
 */

import React, { useState } from 'react';
import { 
  SAMPLE_DISPATCHES, 
  DispatchItem 
} from '@/lib/mockData';
import { 
  Clock, 
  ChevronRight, 
  ExternalLink, 
  Filter, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { ScreenTab } from './Navbar';

interface DispatchesScreenProps {
  onSelectDispatch: (dispatch: DispatchItem) => void;
  onNavigate: (screen: ScreenTab) => void;
}

export function DispatchesScreen({
  onSelectDispatch,
  onNavigate
}: DispatchesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = [
    'Todos',
    'Modelos & LLMs',
    'Hardware & Chips',
    'Open Source',
    'Regulación & Negocios'
  ];

  const filteredDispatches = selectedCategory === 'Todos'
    ? SAMPLE_DISPATCHES
    : SAMPLE_DISPATCHES.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-8 py-6 md:py-10 max-w-5xl mx-auto">
      {/* Encabezado de la pantalla con botón de regreso */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('welcome')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la pantalla de bienvenida</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Despachos de Noticias de 6 Horas
          </h1>
          <p className="text-sm text-slate-400">
            Cada bloque representa un ciclo completo de rastreo, verificación y síntesis automatizada.
          </p>
        </div>

        {/* Indicador de frecuencia */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-2 rounded-xl self-start sm:self-auto">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Cadencia: 4 despachos cada 24 horas</span>
        </div>
      </div>

      {/* Barra de filtros de categoría (Botones interactivos con click handlers) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80 shrink-0">
          <div className="px-2 py-1 text-slate-500 text-xs flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filtrar:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Despachos Recientes */}
      <div className="space-y-5">
        {filteredDispatches.map((dispatch) => (
          <article
            key={dispatch.id}
            className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-4"
          >
            {/* Metadato unboxed limpio con separadores (disciplina zero-pill) */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
              <span className="font-mono text-indigo-400 font-semibold">{dispatch.windowLabel}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium">{dispatch.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{dispatch.timeAgo}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{dispatch.readTime}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={
                dispatch.impactScore === 'Crítico' ? 'text-rose-400' :
                dispatch.impactScore === 'Alto' ? 'text-amber-400' : 'text-sky-400'
              }>
                Impacto {dispatch.impactScore}
              </span>
            </div>

            {/* Titular */}
            <h2 className="text-lg sm:text-xl font-bold text-white hover:text-indigo-200 transition-colors cursor-pointer"
                onClick={() => onSelectDispatch(dispatch)}>
              {dispatch.title}
            </h2>

            {/* Resumen */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {dispatch.summary}
            </p>

            {/* Puntos clave extraídos por el bot */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Puntos Clave Extraídos</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-indigo-400">
                {dispatch.keyPoints.map((point, idx) => (
                  <li key={idx} className="leading-normal">{point}</li>
                ))}
              </ul>
            </div>

            {/* Barra inferior: Fuentes primarias y botón de apertura */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-slate-400">
                <span className="text-slate-500 font-medium">Fuentes verificadas:</span>
                {dispatch.sources.map((src, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-slate-300">
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                    <span>{src}</span>
                    {i < dispatch.sources.length - 1 && <span className="text-slate-700">,</span>}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onSelectDispatch(dispatch)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 self-start sm:self-auto py-1"
              >
                <span>Leer Despacho Completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Llamada a la acción al final del listado */}
      <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-center space-y-3">
        <h3 className="text-base font-semibold text-white">¿Quieres recibir estos despachos automáticamente?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Conecta el bot de Chronos a tu Telegram o Discord para recibir una notificación silenciosa cada 6 horas exactamente al publicarse.
        </p>
        <button
          onClick={() => onNavigate('channels')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Configurar Canales de Suscripción
        </button>
      </div>
    </div>
  );
}
