'use client';

/**
 * Componente ChatbotScreen de Chronos AI Pulse
 * Interfaz interactiva de prueba y chat para el modelo 'muse-spark-1.3-contributor-free' de OpenCode.
 *
 * Características:
 * - Área de configuración de API Key con persistencia temporal (sessionStorage) o local (localStorage).
 * - Historial de conversación con envío en tiempo real a través del proxy server-side (/api/opencode/chat).
 * - Chips de consultas rápidas para testing técnico (arquitectura, código, debugging).
 * - Notificaciones de privacidad sobre el tier 'Contributor Free' de Meta / OpenCode.
 * - Diseño ergonómico adaptado tanto para teléfonos móviles como ordenadores.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Key, 
  Trash2, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  ArrowLeft,
  Sliders,
  Cpu,
  Eye,
  EyeOff
} from 'lucide-react';
import { ScreenTab } from './Navbar';

let msgCounter = 0;
function createMsgId(prefix: string): string {
  msgCounter += 1;
  return `${prefix}-${msgCounter}`;
}

function getFormattedTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

interface ChatbotScreenProps {
  onNavigate: (screen: ScreenTab) => void;
}

export function ChatbotScreen({ onNavigate }: ChatbotScreenProps) {
  // Estado de la API Key con inicializadores perezosos para evitar efectos en cascada
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return sessionStorage.getItem('opencode_temp_api_key') || localStorage.getItem('opencode_local_api_key') || '';
    } catch {
      return '';
    }
  });

  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const [storageType, setStorageType] = useState<'session' | 'local'>(() => {
    if (typeof window === 'undefined') return 'session';
    try {
      if (sessionStorage.getItem('opencode_temp_api_key')) return 'session';
      if (localStorage.getItem('opencode_local_api_key')) return 'local';
    } catch {
      // fallback
    }
    return 'session';
  });

  const [keySavedStatus, setKeySavedStatus] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      if (sessionStorage.getItem('opencode_temp_api_key')) return 'Clave cargada desde sessionStorage';
      if (localStorage.getItem('opencode_local_api_key')) return 'Clave cargada desde localStorage';
    } catch {
      // fallback
    }
    return '';
  });

  // Estado del chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: '¡Hola! Soy Muse Spark 1.3 (vía OpenCode Zen). Estoy configurado con el identificador `muse-spark-1.3-contributor-free`, ventana de contexto de 1M de tokens y optimizado para desarrollo agéntico, código y razonamiento. ¿Qué deseas construir o probar hoy?',
      timestamp: 'Ahora mismo',
      source: 'opencode_system'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Manejar guardado de la API Key en el almacenamiento correspondiente
  const handleSaveApiKey = () => {
    try {
      if (!apiKey.trim()) {
        sessionStorage.removeItem('opencode_temp_api_key');
        localStorage.removeItem('opencode_local_api_key');
        setKeySavedStatus('Clave eliminada del almacenamiento');
        return;
      }

      if (storageType === 'session') {
        sessionStorage.setItem('opencode_temp_api_key', apiKey.trim());
        localStorage.removeItem('opencode_local_api_key');
        setKeySavedStatus('Guardada temporalmente en sessionStorage (se borra al cerrar pestaña)');
      } else {
        localStorage.setItem('opencode_local_api_key', apiKey.trim());
        sessionStorage.removeItem('opencode_temp_api_key');
        setKeySavedStatus('Guardada en localStorage');
      }

      setTimeout(() => setKeySavedStatus(''), 4000);
    } catch {
      setKeySavedStatus('No se pudo acceder al almacenamiento del navegador');
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    try {
      sessionStorage.removeItem('opencode_temp_api_key');
      localStorage.removeItem('opencode_local_api_key');
    } catch {
      // ignore
    }
    setKeySavedStatus('Clave eliminada');
    setTimeout(() => setKeySavedStatus(''), 3000);
  };

  // Enviar mensaje al proxy server-side de OpenCode
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: createMsgId('usr'),
      role: 'user',
      content: textToSend.trim(),
      timestamp: getFormattedTimestamp()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      // Preparar payload de historial para OpenCode
      const conversationPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/opencode/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey.trim() ? { 'x-opencode-key': apiKey.trim() } : {})
        },
        body: JSON.stringify({
          model: 'muse-spark-1.3-contributor-free',
          messages: conversationPayload,
          apiKey: apiKey.trim() || undefined
        })
      });

      // Parsear de forma segura la respuesta evitando que páginas HTML de error de Cloudflare rompan el JSON
      const rawText = await res.text();
      let data: {
        success?: boolean;
        message?: string;
        source?: string;
        error?: string;
        rawError?: string;
        needsKey?: boolean;
        status?: number;
      };

      try {
        data = JSON.parse(rawText);
      } catch {
        // Si el servidor o proxy devolvió una página HTML en vez de JSON
        const isHtml = rawText.includes('<html') || rawText.includes('<!DOCTYPE');
        data = {
          success: false,
          error: isHtml
            ? 'El servidor de OpenCode / Cloudflare devolvió una página de error en lugar de JSON. Verifica la conexión o tu clave de acceso.'
            : rawText.slice(0, 300)
        };
      }

      if (data.success && data.message) {
        const assistantMessage: Message = {
          id: createMsgId('asst'),
          role: 'assistant',
          content: data.message,
          timestamp: getFormattedTimestamp(),
          source: data.source || 'opencode_live'
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Mostrar el mensaje real devuelto por la API de OpenCode sin respuestas simuladas
        const serverError = data.rawError || data.error || 'OpenCode no devolvió una respuesta.';
        const hint = data.needsKey 
          ? '\n\n💡 Nota sobre OpenCode: El endpoint oficial de OpenCode (opencode.ai/zen) requiere un Token de API / Service Account Key válido en la cabecera Authorization. Puedes introducir tu clave en el botón "Configurar API Key" de arriba.'
          : '';
        const errorMessage: Message = {
          id: createMsgId('err'),
          role: 'assistant',
          content: `⚠️ Respuesta del Servidor de OpenCode:\n\n"${serverError}"${hint}`,
          timestamp: getFormattedTimestamp()
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error desconocido de red';
      setMessages((prev) => [
        ...prev,
        {
          id: createMsgId('err'),
          role: 'assistant',
          content: `Error al conectar con la API de OpenCode: ${errMsg}`,
          timestamp: getFormattedTimestamp()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Escribe un script en TypeScript para scrapear y filtrar noticias de IA cada 6 horas',
    'Explica cómo usar la ventana de 1M de tokens de Muse Spark para un proyecto grande',
    'Crea un test unitario con Vitest para validar una función de cálculo de diferencia horaria',
    'Actúa como El Arquitecto y recomienda un stack minimalista para un bot móvil'
  ];

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Encabezado con navegación de regreso y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('welcome')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Chatbot Muse Spark 1.3
            </h1>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
              OpenCode Contributor Free
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Valida la integración del modelo insignia de Meta vía OpenCode con ventana de 1M de tokens.
          </p>
        </div>

        {/* Acciones de cabecera */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              showConfigPanel || apiKey
                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'API Key Configurada' : 'Configurar API Key'}</span>
            <Sliders className="w-3 h-3 opacity-60" />
          </button>

          <button
            onClick={() => {
              if (confirm('¿Deseas reiniciar la conversación?')) {
                setMessages([
                  {
                    id: 'welcome-msg',
                    role: 'assistant',
                    content: 'Conversación reiniciada. ¿Qué consulta o prueba de código deseas realizar con Muse Spark 1.3?',
                    timestamp: 'Ahora mismo'
                  }
                ]);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Limpiar chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PANEL DESPLEGABLE: Configuración de API Key (Temporal / Local) */}
      {showConfigPanel && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Configuración de Acceso OpenCode</span>
            </div>
            <button
              onClick={() => setShowConfigPanel(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cerrar panel
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Pega tu OpenCode API Key o Token de Servicio (Opcional)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={storageType}
                  onChange={(e) => setStorageType(e.target.value as 'session' | 'local')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="session">Temporal (sessionStorage)</option>
                  <option value="local">Persistente (localStorage)</option>
                </select>

                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
                >
                  Guardar
                </button>

                {apiKey && (
                  <button
                    onClick={handleClearKey}
                    className="p-2.5 text-rose-400 hover:bg-rose-950/40 rounded-xl border border-rose-900/40 transition-colors"
                    title="Borrar clave"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {keySavedStatus && (
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{keySavedStatus}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400 space-y-1 leading-relaxed">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Contributor Free y Privacidad</span>
              </div>
              <p>
                El modelo <span className="font-mono text-indigo-300">muse-spark-1.3-contributor-free</span> se ofrece en OpenCode con acceso comunitario gratuito. Si cuentas con un token de servicio de tu cuenta de OpenCode puedes añadirlo aquí para mayor prioridad. Por seguridad, la clave se guarda exclusivamente en tu navegador (en <span className="text-slate-200">sessionStorage</span> por defecto).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE CONVERSACIÓN / MENSAJES */}
      <div className="flex-1 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 sm:p-5 overflow-y-auto space-y-4 min-h-[380px] max-h-[550px] flex flex-col">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500">
              {msg.role === 'assistant' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-300">Muse Spark 1.3</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-400">Tú</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`relative max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between gap-3 pt-2 mt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                  <span className="font-mono text-slate-500">
                    {msg.source ? `vía ${msg.source}` : 'OpenCode Inference'}
                  </span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar respuesta</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500">
              <Bot className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Muse Spark 1.3 procesando en OpenCode...</span>
            </div>
            <div className="p-4 rounded-2xl rounded-bl-none bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 text-xs text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Razonando y compilando respuesta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGERENCIAS RÁPIDAS DE PROMPT */}
      <div className="space-y-1.5">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Pruebas rápidas recomendadas:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="text-[11px] text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* CAMPO DE ENTRADA Y ENVÍO */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Pregunta algo sobre código, arquitectura o noticias de IA..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl transition-all disabled:opacity-50 active:scale-95 shrink-0 shadow-md shadow-indigo-600/20"
            aria-label="Enviar mensaje a Muse Spark 1.3"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-1">
          <span className="flex items-center gap-1 font-mono">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>Modelo: muse-spark-1.3-contributor-free</span>
          </span>
          <span>1M Contexto · OpenCode Zen API</span>
        </div>
      </div>
    </div>
  );
}
