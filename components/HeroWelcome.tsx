'use client';

/**
 * Componente HeroWelcome de Chronos AI Pulse
 * Pantalla principal de bienvenida diseñada para presentar el bot de noticias de AI.
 * Explica de forma directa el valor del ciclo de 6 horas, presenta la ventana horaria,
 * muestra métricas verificables y ofrece navegación táctil hacia los despachos y canales.
 */

import React from 'react';
import Image from 'next/image';
import { 
  Clock, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight, 
  Radio, 
  CheckCircle2, 
  Compass,
  FileText,
  Bot,
  Sparkles
} from 'lucide-react';
import { ScreenTab } from './Navbar';
import { DISPATCH_WINDOWS } from '@/lib/mockData';

interface HeroWelcomeProps {
  onNavigate: (screen: ScreenTab) => void;
  onOpenSampleModal: () => void;
  nextDispatchCountdown: string;
}

export function HeroWelcome({
  onNavigate,
  onOpenSampleModal,
  nextDispatchCountdown
}: HeroWelcomeProps) {
  return (
    <div className="space-y-16 py-6 md:py-12">
      {/* SECCIÓN HERO PRINCIPAL */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Columna Izquierda: Mensaje y llamadas a la acción */}
          <div className="lg:col-span-7 space-y-6">
            {/* Metadato unboxed superior (sin píldoras de plástico) */}
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 tracking-wide uppercase">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Servicio de Monitoreo Autónomo</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Ciclos de 6 Horas</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">En Vivo</span>
            </div>

            {/* Titular principal con text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              Noticias de Inteligencia Artificial de Última Hora,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-sky-300">
                Sintetizadas Cada 6 Horas.
              </span>
            </h1>

            {/* Subtítulo descriptivo */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Chronos rastrea más de 250 repositorios en GitHub, servidores de preprints en arXiv,
              laboratorios de vanguardia y discusiones técnicas para entregarte 4 despachos diarios
              sin publicidad, clickbait ni especulaciones.
            </p>

            {/* Módulo de cuenta regresiva para el próximo despacho */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Próximo Despacho Programado</div>
                  <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums flex items-center gap-2">
                    <span>{nextDispatchCountdown}</span>
                    <span className="text-xs font-sans text-emerald-400 font-normal">
                      (Ventana 18:00 UTC)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenSampleModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Leer Despacho Actual</span>
              </button>
            </div>

            {/* Botones de acción directos para el usuario móvil o de escritorio */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('dispatches')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
              >
                <span>Ver Despachos de Hoy</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('chatbot')}
                className="px-6 py-3.5 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 hover:text-white font-medium rounded-xl text-sm border border-indigo-500/40 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Probar Chatbot Muse 1.3</span>
              </button>

              <button
                onClick={() => onNavigate('channels')}
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl text-sm border border-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Canales (Telegram)</span>
              </button>
            </div>

            {/* Banner de integración OpenCode Muse Spark 1.3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white font-medium flex items-center gap-1.5">
                    <span>Integración OpenCode Activa</span>
                    <span className="font-mono text-[10px] text-indigo-300 px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-500/30">
                      muse-spark-1.3-contributor-free
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    1M de tokens de contexto para pruebas de código y consultas de IA.
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('chatbot')}
                className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg font-medium transition-colors shrink-0"
              >
                Abrir Chat
              </button>
            </div>

            {/* Metadatos de rigor y confianza */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>4 Despachos sincronizados cada día</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Fuentes primarias verificadas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Formato ejecutivo en 3 minutos</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Anchor visual focal con imagen generada y marco tecnológico */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl">
              {/* Imagen central de la torre de radar / consola de noticias */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <Image
                  src="/images/hero_ai_radar.jpg"
                  alt="Centro de monitoreo autónomo de noticias de inteligencia artificial"
                  fill
                  className="object-cover object-center"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Overlay de estado en vivo */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>MONITOREO ACTIVO · 250+ FUENTES</span>
                </div>
              </div>

              {/* Panel inferior del visual: Ciclo de las 4 ventanas del día */}
              <div className="p-4 sm:p-5 space-y-3 bg-slate-950/90">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Horarios de Emisión Diaria (UTC)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Sincronizado cada 6 horas</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {DISPATCH_WINDOWS.map((window, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex flex-col justify-between transition-colors ${
                        window.status === 'Último Despacho'
                          ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                          : window.status === 'Próxima Emisión'
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-semibold text-white">{window.time}</span>
                        <span className="text-[10px] uppercase tracking-wider font-medium">
                          {window.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">{window.localHint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE PILARES Y CARACTERÍSTICAS DEL BOT */}
      <section className="space-y-6 pt-6 border-t border-slate-800/60">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            ¿Por qué un bot cada 6 horas?
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            El ritmo óptimo para estar al día sin saturación de información.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Las newsletters diarias llegan 24 horas tarde; los feeds de redes sociales son un torrente incesante de ruido.
            Chronos consolida los hitos en 4 ventanas precisas al día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Tarjeta 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">4 Ventanas Globales al Día</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Despachos emitidos exactamente a las 00:00, 06:00, 12:00 y 18:00 UTC. Captura los anuncios de California,
              Europa y Asia justo cuando ocurren.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Ciclo continuo · 0 demoras artificiales
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Filtrado Anti-Hype y Verificación</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              El motor descarta anuncios publicitarios, bots de spam y reempaquetados comerciales. Cada despacho
              debe incluir código en repositorio, paper en arXiv o demostración ejecutable.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Validación cruzada de fuentes primarias
            </div>
          </div>

          {/* Tarjeta 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Integración Multicanal Directa</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sin depender de algoritmos de engagement ni apps con muros de pago. Recibe el texto Markdown en Telegram,
              en un webhook para tu Discord o mediante un feed RSS abierto.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Formato limpio para leer en el móvil
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PREVIEW DEL ÚLTIMO DESPACHO EMITIDO */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
              <Radio className="w-3.5 h-3.5" />
              <span>Emitido Hace Menos de 1 Hora</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Vista Rápida: Despacho #142 (Ventana 06:00 - 12:00 UTC)
            </h2>
          </div>

          <button
            onClick={() => onNavigate('dispatches')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver historial completo de despachos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Noticia Marquee de la última ventana */}
        <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 space-y-3">
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span className="text-indigo-300 font-medium">Modelos & LLMs</span>
            <span aria-hidden="true">·</span>
            <span>arXiv:2609.11029</span>
            <span aria-hidden="true">·</span>
            <span>3 min de lectura</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Impacto Crítico</span>
          </div>

          <h3 className="text-lg font-semibold text-white leading-snug">
            Nueva arquitectura de razonamiento híbrido supera benchmarks con un 65% menos de cómputo
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            Laboratorios de investigación revelan un método de destilación que permite a modelos compactos resolver problemas de lógica formal igualando a clústeres masivos.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              onClick={onOpenSampleModal}
              className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 rounded-lg font-medium transition-colors"
            >
              Abrir Análisis Completo de la Noticia
            </button>
            <button
              onClick={() => onNavigate('channels')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg font-medium transition-colors"
            >
              Recibir alertas como esta en mi móvil
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
