'use client';

/**
 * Componente ChannelsScreen de Chronos AI Pulse
 * Pantalla que presenta y permite configurar los canales de entrega del bot:
 * Telegram, Discord Webhook, Feed RSS y Correo Electrónico.
 * Incluye un simulador interactivo para que el usuario en su teléfono pueda
 * experimentar cómo se ve y siente una notificación de despacho de 6 horas.
 */

import React, { useState } from 'react';
import { 
  DELIVERY_CHANNELS 
} from '@/lib/mockData';
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  Rss, 
  Mail, 
  Bell, 
  Check, 
  Copy, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { ScreenTab } from './Navbar';

interface ChannelsScreenProps {
  onNavigate: (screen: ScreenTab) => void;
  onOpenSampleModal: () => void;
}

export function ChannelsScreen({
  onNavigate,
  onOpenSampleModal
}: ChannelsScreenProps) {
  const [copiedRss, setCopiedRss] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [simulatedAlertActive, setSimulatedAlertActive] = useState(false);

  const handleCopyRss = () => {
    navigator.clipboard?.writeText('https://chronos-ai-pulse.app/feed/6h.xml');
    setCopiedRss(true);
    setTimeout(() => setCopiedRss(false), 2500);
  };

  const handleSubscribeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setEmailSubscribed(true);
  };

  const handleTriggerSimulatedPush = () => {
    setSimulatedAlertActive(true);
  };

  return (
    <div className="space-y-12 py-6 md:py-10 max-w-5xl mx-auto">
      {/* Encabezado con retorno */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <button
          onClick={() => onNavigate('welcome')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Canales de Entrega y Suscripción
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Elige la plataforma donde prefieres recibir las alertas cada 6 horas. Sin algoritmos de recomendación ni notificaciones invasivas.
        </p>
      </div>

      {/* BANNER INTERACTIVO: Simulador de notificación móvil */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              <Smartphone className="w-4 h-4" />
              <span>Simulador de Experiencia Móvil</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Prueba cómo llega un despacho a tu teléfono
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Pulsa el botón para simular la llegada de un alerta de la ventana de 6 horas en tu dispositivo.
            </p>
          </div>

          <button
            onClick={handleTriggerSimulatedPush}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Simular Alerta de las 6h</span>
          </button>
        </div>

        {/* Notificación simulada interactiva */}
        {simulatedAlertActive && (
          <div className="p-4 rounded-xl bg-slate-950/95 border border-indigo-500/40 text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-white">Chronos AI Pulse</span>
                    <span>·</span>
                    <span>Ahora mismo</span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-200">
                    Despacho 12:00 UTC · 3 avances cruciales de IA
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    Lanzamiento de pesos abiertos para razonamiento multimodular con 65% menos cómputo y avances en silicio óptico.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={onOpenSampleModal}
                  className="px-2.5 py-1 text-[11px] font-medium bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors"
                >
                  Abrir
                </button>
                <button
                  onClick={() => setSimulatedAlertActive(false)}
                  className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white transition-colors text-center"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Canales Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Canal 1: Telegram */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-xs text-sky-300 font-medium">Recomendado para Móvil</span>
            </div>
            <h3 className="text-base font-semibold text-white">Bot Oficial de Telegram</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              El canal más rápido y ligero. Cada 6 horas recibes un mensaje formateado con viñetas, tiempos de lectura y enlaces directos a los repositorios y papers.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir en Telegram (@ChronosAIBot)</span>
            </a>
          </div>
        </div>

        {/* Canal 2: Discord */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs text-indigo-300 font-medium">Para Equipos y Servidores</span>
            </div>
            <h3 className="text-base font-semibold text-white">Webhook para Discord</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Integra los reportes en un canal específico de tu servidor tecnológico. Crea hilos automáticos para que tu equipo discuta cada lanzamiento.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('Para conectar Discord, copia el webhook de tu canal y pégalo en la configuración de Chronos.')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Configurar Canal de Discord</span>
            </button>
          </div>
        </div>

        {/* Canal 3: RSS Feed */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Rss className="w-5 h-5" />
              </div>
              <span className="text-xs text-amber-300 font-medium">Estándar Abierto</span>
            </div>
            <h3 className="text-base font-semibold text-white">Feed RSS / Atom Estructurado</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Úsalo con tu lector de feeds predilecto (Feedly, Inoreader, NetNewsWire o apps de lectura offline). Sin cuentas requeridas.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCopyRss}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              {copiedRss ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">¡URL RSS Copiada al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copiar Enlace del Feed RSS (6 Horas)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Canal 4: Correo Electrónico */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs text-purple-300 font-medium">Bandeja de Entrada</span>
            </div>
            <h3 className="text-base font-semibold text-white">Resumen por Correo</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Recibe los 4 despachos agrupados o en tiempo real directamente en tu correo electrónico. Texto limpio optimizado para lectura en pantallas pequeñas.
            </p>
          </div>

          <div className="pt-2">
            {emailSubscribed ? (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Suscrito con éxito! Recibirás la próxima ventana horaria.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeEmail} className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="tu@correo.com"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
                >
                  Suscribir
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
