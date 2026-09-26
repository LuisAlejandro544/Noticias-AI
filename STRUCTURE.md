# Estructura del Proyecto — Chronos AI Pulse

Este documento describe la organización de directorios, la jerarquía de archivos y las responsabilidades modulares entre la aplicación web y el motor de GitHub Actions.

---

## 🗂️ Árbol de Directorios del Proyecto

```
/ (raíz)
├── .github/                               # Motor de Automatización e Inferencia Autónoma
│   ├── workflows/
│   │   └── chronos-pulse-cycle.yml        # GitHub Action (cada 6h o manual con workflow_dispatch)
│   ├── scripts/
│   │   └── pulse_collector.mjs            # Script colector, descarga de imágenes y razonamiento Gemini
│   ├── AI_CONTEXT.md                      # Contexto específico para la IA que resume y audita en el Action
│   └── AGENTS.md                          # Roles de los agentes del pipeline autónomo (Auditor, Harvester, etc.)
│
├── app/                                   # Aplicación Web Next.js 15 (App Router)
│   ├── api/                               # Rutas de API y Proxies Server-Side
│   │   └── opencode/chat/route.ts         # [Legado por migrar a Gemini server-side]
│   ├── globals.css                        # Estilos globales y Tailwind CSS v4
│   ├── layout.tsx                         # Layout HTML raíz con metadatos y fuentes
│   └── page.tsx                           # Enrutador principal de pantallas y estados de navegación
│
├── components/                            # Componentes de Interfaz Modulares
│   ├── Navbar.tsx                         # Barra superior de navegación y temporizador 6h
│   ├── MobileTabBar.tsx                   # Barra táctil inferior para pulgar en teléfonos móviles
│   ├── HeroWelcome.tsx                    # Pantalla de bienvenida con pulso activo y accesos directos
│   ├── DispatchesScreen.tsx               # Pantalla del feed de despachos cada 6 horas
│   ├── ChatbotScreen.tsx                  # Pantalla de interacción y laboratorio del modelo
│   ├── PipelineScreen.tsx                 # Pantalla del ciclo paso a paso de recolección y curación
│   ├── ChannelsScreen.tsx                 # Pantalla de configuración de canales (Telegram / Discord)
│   ├── DispatchModal.tsx                  # Modal detallado de inspección de despachos
│   └── Footer.tsx                         # Pie de página institucional
│
├── lib/                                   # Lógica de Negocio y Datos
│   ├── mockData.ts                        # Datos base, ventanas horarias UTC y categorías
│   └── utils.ts                           # Utilidades de estilos y formateo
│
├── public/                                # Activos estáticos, emblemas y recursos visuales
├── .env.example                           # Plantilla de variables de entorno requeridas
├── metadata.json                          # Metadatos del applet de AI Studio
├── package.json                           # Dependencias del proyecto (Next.js, @google/genai, Lucide)
├── README.md                              # Guía principal del proyecto y manual del Action
├── ROADMAP.md                             # Hoja de ruta y fases de desarrollo
├── STRUCTURE.md                           # Este documento (jerarquía completa del proyecto)
├── AI_CONTEXT.md                          # Contexto para la IA que programa el bot y la web
└── AGENTS.md                              # Los 7 agentes del ciclo de construcción de software
```

---

## 🧱 Responsabilidades Modulares

### 1. `.github/` (Pipeline Autónomo y Motor de Inferencia 6h)
- **Aislamiento de Ejecución**: Solo se activa por cron de 6 horas o manualmente vía `workflow_dispatch`. **Nunca se ejecuta con `push`**.
- **Rastreo Abierto**: Consulta Reddit (`r/LocalLLaMA`, `r/MachineLearning`, etc.), Hugging Face Daily Papers y arXiv sin restringirse a dominios únicos.
- **Evidencia Visual**: Descarga y preserva figuras y diagramas de novedades en `output/images/`.
- **Auditoría de Filtraciones**: Ejecuta `gemini-3.8-flash` con `ThinkingLevel.HIGH` aplicando razonamiento matemático sobre requerimientos de memoria y verosimilitud técnica.
- **Empaquetado de Salida**: Almacena en los Artifacts de GitHub el reporte Markdown, el HTML responsive y el resumen JSON.

### 2. `app/` y `components/` (Frontend y Experiencia de Usuario Móvil)
- **Diseño Multi-Pantalla**: Organizado en vistas independientes para no saturar la pantalla del dispositivo móvil.
- **Ergonomía Táctil**: Controlado mediante `MobileTabBar.tsx` con zona de seguridad de navegación para el pulgar.
- **Sincronización Horaria**: Temporizador en tiempo real calculando la cuenta regresiva hasta la siguiente ventana UTC (00:00, 06:00, 12:00, 18:00).

### 3. Delimitación de Archivos de Contexto IA
- **Raíz (`AI_CONTEXT.md` y `AGENTS.md`)**: Dirigidos a la IA que programa, construye y refactoriza la web y el bot.
- **Acción (`.github/AI_CONTEXT.md` y `.github/AGENTS.md`)**: Dirigidos a la IA que analiza datos, audita leaks y redacta el informe en cada ciclo del Action.
