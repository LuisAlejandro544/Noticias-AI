# Chronos AI Pulse — Roadmap & Hoja de Ruta

Documento de planificación estratégica para el desarrollo y evolución de **Chronos AI Pulse**, integrando el pipeline autónomo de GitHub Actions y la plataforma web.

---

## 📅 Fases del Roadmap

### 📍 Fase 1: Arquitectura del Motor Autónomo de 6 Horas (Completada ✅)
- [x] Creación del workflow de GitHub Actions (`.github/workflows/chronos-pulse-cycle.yml`) con ejecución cada 6 horas (`cron: '0 0,6,12,18 * * *'`) y activación manual (`workflow_dispatch`).
- [x] Regla de aislamiento estricta: No se ejecuta en `push` ni `pull_request` para proteger cuota y recursos.
- [x] Implementación del script colector e investigador (`.github/scripts/pulse_collector.mjs`) con rastreo abierto en la web (Reddit `r/LocalLLaMA`, `r/MachineLearning`, Hugging Face Daily Papers, arXiv).
- [x] Descarga y empaquetado automático de imágenes, diagramas y figuras de evidencia en `output/images/`.
- [x] Integración de **Gemini 3.8 Flash con Razonamiento Alto (`ThinkingLevel.HIGH`)** para auditoría exhaustiva de filtraciones (leaks vs hype) y desglose de requerimientos de VRAM y arquitectura.
- [x] Generación y guardado en GitHub Action Artifacts de `dispatch-report.md`, `dispatch-report.html` y `dispatch-summary.json`.
- [x] Documentación dedicada para el agente del Action en [`.github/AI_CONTEXT.md`](./.github/AI_CONTEXT.md) y [`.github/AGENTS.md`](./.github/AGENTS.md).

---

### 📍 Fase 2: Integración Web y Visualización de Despachos (En Curso 🔄)
- [x] Documentación actualizada en raíz para el agente de desarrollo web y bot ([`AI_CONTEXT.md`](./AI_CONTEXT.md) y [`AGENTS.md`](./AGENTS.md)).
- [ ] Conectar la pantalla `DispatchesScreen.tsx` para permitir cargar o sincronizar los despachos generados por el Action de GitHub.
- [ ] Reemplazar el proxy legado de OpenCode en `ChatbotScreen.tsx` por una llamada server-side directa a `gemini-3.8-flash`.
- [ ] Añadir botón de "Generar Despacho a Demanda" directamente desde la interfaz web móvil.

---

### 📍 Fase 3: Distribución Multicanal & Webhooks
- [ ] Envío automático del despacho generado a canales de **Telegram** (con formato Markdown enriquecido y enlaces directos).
- [ ] Envío a servidores de **Discord** mediante webhooks con embeds y badges de categoría.
- [ ] Generación de feed RSS estático (`/feed.xml`) para lectores de noticias de IA.

---

### 📍 Fase 4: Optimización Móvil y Empaquetado APK (Android)
- [ ] Pruebas ergonómicas en pantallas táctiles de teléfono (sin congelamiento del hilo principal).
- [ ] Preparación y configuración de PWA / empaquetado APK para distribución libre en **Uptodown** y tiendas de terceros de Android.
