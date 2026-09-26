# Chronos AI Pulse — Sistema Autónomo de Noticias y Auditoría de Inteligencia Artificial

> **Chronos AI Pulse** es una plataforma y sistema autónomo diseñado para rastrear, auditar, verificar y sintetizar las novedades más críticas del ecosistema global de Inteligencia Artificial cada 6 horas exactas (ventanas de 00:00, 06:00, 12:00 y 18:00 UTC), con capacidades de investigación profunda sobre filtraciones (leaks), nuevos lanzamientos y pruebas de hardware.

---

## ⚡ El Flujo Autónomo de GitHub Actions (Ciclo 6h)

El núcleo de recolección pesada opera de manera autónoma mediante un **GitHub Action** programado (`.github/workflows/chronos-pulse-cycle.yml`):

### ⏰ Frecuencia de Ejecución
- **Automático cada 6 horas**: Corre en las 4 ventanas de sincronización UTC (`0 0,6,12,18 * * *`).
- **Activación Manual Instantánea (`workflow_dispatch`)**: Se puede disparar en cualquier momento directamente desde el navegador de un teléfono móvil entrando al repositorio en GitHub (pestaña *Actions* ──► *Chronos AI Pulse — Ciclo de Despacho 6h* ──► *Run workflow*).
- **Regla estricta:** **NUNCA se ejecuta con cada `push`**, evitando consumo innecesario de cuota y ejecuciones no deseadas.

### 🔍 Capacidades del Motor de Rastreo
1. **Rastreo Abierto sin Jaulas de Dominio**: No está limitado a un puñado de sitios web. Rastrea la web abierta, debates técnicos en Reddit (`r/LocalLLaMA`, `r/MachineLearning`, `r/Singularity`), Hugging Face Daily Papers, preprints de arXiv y señales de filtraciones en repositorios.
2. **Ventana Estricta de 6 Horas**: Analiza exclusivamente el material generado en las últimas 6 horas previas a la ejecución para garantizar frescura absoluta.
3. **Descarga de Evidencia Visual e Imágenes**: Extrae automáticamente diagramas de arquitecturas, gráficos de benchmarks y capturas compartidas por la comunidad, guardándolas como archivos locales en la carpeta `images/`.
4. **Gemini 3.8 Flash con Razonamiento Alto (`ThinkingLevel.HIGH`)**:
   - Audita la verosimilitud de filtraciones (parámetros de modelo, compatibilidad de VRAM y viabilidad matemática).
   - Clasifica las noticias en: `[CONFIRMADO CON PESOS/CÓDIGO]`, `[FILTRACIÓN EN INVESTIGACIÓN]` o `[HUMO DESCARTADO]`.
   - Aplica los 4 pilares: Impacto técnico real, Arquitectura/Hardware, Regulaciones vinculantes y Ecosistema Open Source.
5. **Generación de Artefactos Descargables (Artifacts)**:
   - `dispatch-report.md`: Informe técnico completo en Markdown de alta densidad.
   - `dispatch-report.html`: Página web responsiva autónoma con modo oscuro y galería visual optimizada para lectura en móviles.
   - `dispatch-summary.json`: Metadatos estructurados para integración.
   - `images/*`: Carpeta con todas las imágenes y figuras descargadas durante el ciclo.

---

## 📱 Aplicación Web (Next.js 15 App Router)

- **Diseño Ergonómico Multi-Pantalla**: Pantallas independientes (`welcome`, `dispatches`, `chatbot`, `pipeline`, `channels`) que no saturan la interfaz.
- **Navegación Táctil Móvil**: Barra de pestañas inferior (`MobileTabBar`) para navegación ágil con el pulgar.
- **Preparada para Distribución Móvil (APK)**: Diseñada para empaquetado y distribución alternativa en **Uptodown** o repositorios de terceros fuera de Google Play.
- **Seguridad Server-Side**: Las credenciales de API residen exclusivamente en variables de entorno del servidor.

---

## 🛠️ Stack Tecnológico

- **IA y Razonamiento**: Google GenAI SDK (`@google/genai`) con `gemini-3.8-flash` y razonamiento profundo (`ThinkingLevel.HIGH`).
- **Automatización**: GitHub Actions (`schedule` y `workflow_dispatch`).
- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript.
- **Estilos**: Tailwind CSS v4, Lucide React Icons.
- **Animaciones**: Motion (`motion/react`).
- **Rastreo**: Node.js 20+ nativo con endpoints abiertos (Reddit JSON, Hugging Face API, arXiv).

---

## ⚙️ Configuración y Variables de Entorno

### En GitHub Actions (Secrets)
Para que el workflow funcione, añade en **Settings ──► Secrets and variables ──► Actions**:
- `GEMINI_API_KEY`: Tu clave de API de Google AI Studio / Gemini.

### En Desarrollo Local
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variable de entorno
cp .env.example .env.local
# Añade tu GEMINI_API_KEY en .env.local

# 3. Iniciar servidor web de desarrollo
npm run dev

# 4. Probar manualmente el script de rastreo de 6 horas
node .github/scripts/pulse_collector.mjs
```

---

## 📄 Mapa de Documentación del Proyecto

### Documentación para la IA de Desarrollo Web y Bot (Raíz):
- [`AI_CONTEXT.md`](./AI_CONTEXT.md) — Base de conocimiento y reglas de programación para el desarrollador web/bot.
- [`AGENTS.md`](./AGENTS.md) — Los 7 arquetipos del ciclo de construcción de software (Arquitecto, Constructor, etc.).
- [`ROADMAP.md`](./ROADMAP.md) — Hoja de ruta del proyecto y evolución de hitos.
- [`STRUCTURE.md`](./STRUCTURE.md) — Jerarquía completa de directorios y responsabilidades modulares.

### Documentación para la IA del GitHub Action (Pipeline Autónomo):
- [`.github/AI_CONTEXT.md`](./.github/AI_CONTEXT.md) — Protocolo de auditoría de leaks, filtrado de 4 pilares e instrucciones para el agente de razonamiento 6h.
- [`.github/AGENTS.md`](./.github/AGENTS.md) — Roles de la IA dentro del runner de GitHub Actions (Rastreador, Auditor, Curador Visual, etc.).
