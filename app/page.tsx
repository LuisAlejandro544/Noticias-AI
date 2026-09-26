'use client';

/**
 * Página Principal de Chronos AI Pulse
 * Punto de entrada de la aplicación que organiza la pantalla de bienvenida del bot de noticias de AI.
 * Maneja el estado de la pantalla activa ('welcome', 'dispatches', 'pipeline', 'channels'),
 * el temporizador en tiempo real sincronizado con las ventanas de 6 horas (00:00, 06:00, 12:00, 18:00 UTC),
 * y el modal de lectura interactivo del despacho.
 * Optimizado para teléfonos móviles (diseño táctil de alta densidad, barra inferior de pulgar)
 * y pantallas de escritorio.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, ScreenTab } from '@/components/Navbar';
import { HeroWelcome } from '@/components/HeroWelcome';
import { DispatchesScreen } from '@/components/DispatchesScreen';
import { PipelineScreen } from '@/components/PipelineScreen';
import { ChannelsScreen } from '@/components/ChannelsScreen';
import { ChatbotScreen } from '@/components/ChatbotScreen';
import { DispatchModal } from '@/components/DispatchModal';
import { MobileTabBar } from '@/components/MobileTabBar';
import { Footer } from '@/components/Footer';
import { SAMPLE_DISPATCHES, DispatchItem } from '@/lib/mockData';

export default function HomePage() {
  const [activeScreen, setActiveScreen] = useState<ScreenTab>('welcome');
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdownString, setCountdownString] = useState('02h 45m 18s');

  // Cálculo del tiempo restante exacto hasta la próxima ventana de 6 horas (UTC)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getUTCHours();
      const currentMin = now.getUTCMinutes();
      const currentSec = now.getUTCSeconds();

      // Las ventanas son a las 00, 06, 12, 18 UTC
      let nextTargetHour = 0;
      if (currentHour < 6) nextTargetHour = 6;
      else if (currentHour < 12) nextTargetHour = 12;
      else if (currentHour < 18) nextTargetHour = 18;
      else nextTargetHour = 24;

      const totalTargetSeconds = nextTargetHour * 3600;
      const totalCurrentSeconds = currentHour * 3600 + currentMin * 60 + currentSec;
      let diffSeconds = totalTargetSeconds - totalCurrentSeconds;

      if (diffSeconds < 0) diffSeconds = 6 * 3600;

      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      setCountdownString(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenSampleModal = () => {
    setSelectedDispatch(SAMPLE_DISPATCHES[0]);
    setIsModalOpen(true);
  };

  const handleSelectDispatch = (dispatch: DispatchItem) => {
    setSelectedDispatch(dispatch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Barra de navegación superior con contrato 3-zonas */}
      <Navbar
        activeScreen={activeScreen}
        onSelectScreen={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSampleModal={handleOpenSampleModal}
        nextDispatchCountdown={countdownString}
      />

      {/* Contenedor principal con animaciones suaves de transición de pantalla */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {activeScreen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <HeroWelcome
                onNavigate={(screen) => {
                  setActiveScreen(screen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenSampleModal={handleOpenSampleModal}
                nextDispatchCountdown={countdownString}
              />
            </motion.div>
          )}

          {activeScreen === 'dispatches' && (
            <motion.div
              key="dispatches"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <DispatchesScreen
                onSelectDispatch={handleSelectDispatch}
                onNavigate={(screen) => {
                  setActiveScreen(screen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeScreen === 'chatbot' && (
            <motion.div
              key="chatbot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <ChatbotScreen
                onNavigate={(screen) => {
                  setActiveScreen(screen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeScreen === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <PipelineScreen
                onNavigate={(screen) => {
                  setActiveScreen(screen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeScreen === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <ChannelsScreen
                onNavigate={(screen) => {
                  setActiveScreen(screen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenSampleModal={handleOpenSampleModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Pie de página discreto */}
      <Footer
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Barra de navegación inferior móvil para pulgar */}
      <MobileTabBar
        activeScreen={activeScreen}
        onSelectScreen={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal de lectura del despacho seleccionado */}
      <DispatchModal
        dispatch={selectedDispatch}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
