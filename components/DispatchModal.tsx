'use client';

/**
 * Componente DispatchModal de Chronos AI Pulse
 * Modal interactivo que despliega el informe completo y detallado de un despacho de 6 horas.
 * Presenta el resumen ejecutivo (TL;DR), el análisis en profundidad, las conclusiones técnicas
 * y las referencias verificadas. Cumple con los criterios de legibilidad y accesibilidad táctil.
 */

import React, { useState } from 'react';
import { DispatchItem } from '@/lib/mockData';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Share2, 
  Layers 
} from 'lucide-react';

interface DispatchModalProps {
  dispatch: DispatchItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DispatchModal({
  dispatch,
  isOpen,
  onClose
}: DispatchModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !dispatch) return null;

  const handleCopySummary = () => {
    const textToCopy = `[Chronos AI News - ${dispatch.windowLabel}]\n${dispatch.title}\n\nTL;DR: ${dispatch.fullArticle.tldr}\n\nFuentes: ${dispatch.sources.join(', ')}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Cabecera del modal */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4 sticky top-0 z-10">
          <div className="space-y-1">
            {/* Metadatos unboxed (sin píldoras de plástico) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-indigo-400 font-semibold">{dispatch.windowLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">{dispatch.category}</span>
              <span aria-hidden="true">·</span>
              <span>{dispatch.readTime}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {dispatch.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Cerrar ventana de lectura"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto text-sm text-slate-300">
          {/* Bloque Resumen Ejecutivo (TL;DR) */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resumen Ejecutivo (TL;DR)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {dispatch.fullArticle.tldr}
            </p>
          </div>

          {/* Análisis en profundidad */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-xs">
              Análisis del Desarrollo
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {dispatch.fullArticle.deepDive}
            </p>
          </div>

          {/* Conclusiones clave */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-xs">
              Puntos Relevantes para Desarrolladores y Equipos
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pl-4 list-disc marker:text-indigo-400">
              {dispatch.fullArticle.takeaways.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* Datos Técnicos y Benchmarks */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Detalles de Implementación y Benchmarks</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              {dispatch.fullArticle.technicalDetails}
            </p>
          </div>

          {/* Fuentes Primarias Verificadas */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-medium text-slate-400">Fuentes primarias validadas en esta ventana:</div>
            <div className="flex flex-wrap gap-2">
              {dispatch.sources.map((src, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60 text-xs text-indigo-300 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>{src}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie de modal con acciones */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={handleCopySummary}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copiado al portapapeles</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Resumen</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
