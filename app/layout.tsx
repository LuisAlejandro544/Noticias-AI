/**
 * Root Layout de la aplicación Chronos AI Pulse
 * Proporciona la estructura base HTML, metadatos SEO/OpenGraph y estilos globales.
 * Diseñado con soporte responsivo para móviles y temas modernos de alta legibilidad.
 */
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chronos AI Pulse | Bot de Noticias de AI Cada 6 Horas',
  description: 'Bot autónomo de noticias de inteligencia artificial con rastreo global y despachos de última hora cada 6 horas.',
  openGraph: {
    title: 'Chronos AI Pulse | Bot de Noticias de AI Cada 6 Horas',
    description: 'Bot autónomo de inteligencia artificial que filtra y entrega las noticias más cruciales de AI cada 6 horas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronos AI Pulse | Bot de Noticias de AI Cada 6 Horas',
    description: 'Bot autónomo de noticias de inteligencia artificial con ciclos de rastreo cada 6 horas.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

