'use client';

/**
 * Componente PipelineScreen de Chronos AI Pulse
 * Pantalla que expone la arquitectura técnica y el ciclo de vida de 6 horas del bot.
 * Explica en profundidad las 4 etapas automatizadas: Rastreo, Filtrado Anti-Ruido,
 * Síntesis Rigurosa y Emisión en las ventanas de tiempo globales.
 */

import React from 'react';
import { 
  CYCLE_STAGES, 
  DISPATCH_WINDOWS 
} from '@/lib/mockData';
import { 
  ArrowLeft, 
  Cpu, 
  Database, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Send 
} from 'lucide-react';
import { ScreenTab } from './Navbar';

interface PipelineScreenProps {
  onNavigate: (screen: ScreenTab) => void;
}

export function PipelineScreen({ onNavigate }: PipelineScreenProps) {
  return (
    <div className="space-y-12 py-6 md:py-10 max-w-5xl mx-auto">
      {/* Encabezado con navegación de regreso */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <button
          onClick={() => onNavigate('welcome')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la bienvenida</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Arquitectura del Ciclo de 6 Horas
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Conoce cómo el bot rastrea, audita y destila de forma ininterrumpida los acontecimientos más determinantes de la inteligencia artificial.
        </p>
      </div>

      {/* Las 4 Etapas del Ciclo */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            El Flujo de Procesamiento en 4 Fases
          </h2>
          <span className="text-xs text-slate-400">Totalmente Autónomo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CYCLE_STAGES.map((stage) => (
            <div
              key={stage.step}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-indigo-400">
                  {stage.step}
                </span>
                {stage.step === '01' && <Database className="w-5 h-5 text-indigo-400" />}
                {stage.step === '02' && <Cpu className="w-5 h-5 text-sky-400" />}
                {stage.step === '03' && <Sparkles className="w-5 h-5 text-amber-400" />}
                {stage.step === '04' && <Send className="w-5 h-5 text-emerald-400" />}
              </div>

              <h3 className="text-base font-semibold text-white">
                {stage.name}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Matriz de Fuentes Monitoreadas */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
        <h2 className="text-lg font-bold text-white">
          Fuentes Primarias Monitoreadas en Cada Ventana
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
            <div className="font-semibold text-slate-200">Investigación Académica</div>
            <div className="text-slate-400">arXiv (cs.AI, cs.LG, cs.CL), OpenReview, Nature Machine Intelligence.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
            <div className="font-semibold text-slate-200">Comunidad Open Source</div>
            <div className="text-slate-400">GitHub Trending (AI/ML), Hugging Face Models & Spaces, vLLM, Ollama.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
            <div className="font-semibold text-slate-200">Laboratorios de Frontera</div>
            <div className="text-slate-400">DeepMind, Anthropic, OpenAI, Meta AI, Mistral, Google Research.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
            <div className="font-semibold text-slate-200">Hardware y Semiconductores</div>
            <div className="text-slate-400">NVIDIA, AMD, Intel Habana, TSMC, IEEE Spectrum, benchmarks MLPerf.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
            <div className="font-semibold text-slate-200">Gobernanza y Regulación</div>
            <div className="text-slate-400">EU AI Office, US NIST, directivas de patentes y acuerdos de estándares.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
            <div className="font-semibold text-slate-200">Discusión Técnica Especializada</div>
            <div className="text-slate-400">Hacker News, LessWrong, foros de desarrolladores y changelogs de librerías.</div>
          </div>
        </div>
      </section>

      {/* Las 4 Ventanas Horarias Explicadas */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">
          Sincronización con los Husos Horarios Globales
        </h2>
        <p className="text-sm text-slate-400">
          Al emitir cada 6 horas, el bot entrega las noticias justo cuando abren los principales núcleos de investigación en Tokio, Londres y San Francisco:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DISPATCH_WINDOWS.map((win, index) => (
            <div key={index} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold text-sm">{win.time}</span>
              </div>
              <div className="text-xs font-medium text-slate-200">{win.localHint}</div>
              <div className="text-[11px] text-slate-400 leading-normal">
                Recopila la actividad acumulada de las 6 horas precedentes y emite el resumen ejecutivo.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botón de acción */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => onNavigate('dispatches')}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
        >
          Ver despachos recientes generados con este flujo →
        </button>

        <button
          onClick={() => onNavigate('channels')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Conectar un Canal
        </button>
      </div>
    </div>
  );
}
