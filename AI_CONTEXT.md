# AI Context — Chronos AI Pulse (Agente de Desarrollo del Bot y la Web)

> **DESTINATARIO DE ESTE DOCUMENTO:**
> Este contexto rige exclusivamente a la **Inteligencia Artificial encargada de la programación, arquitectura, diseño y desarrollo de la aplicación web, el backend y los componentes de Chronos AI Pulse**.
> Para las instrucciones de la IA autónoma que resume y audita las noticias dentro del GitHub Action de cada 6 horas, consultar [`.github/AI_CONTEXT.md`](./.github/AI_CONTEXT.md).

---

## 🎯 Misión del Proyecto y Contexto del Desarrollador

**Chronos AI Pulse** es una plataforma y sistema autónomo diseñado para combatir la **infoxicación y el ruido publicitario** en el ecosistema global de la Inteligencia Artificial. La aplicación ofrece:
1. **Frontend Web Móvil-First en Next.js 15+**: Con navegación por pestañas táctiles (`MobileTabBar`), vistas independientes y soporte para compilación en APK para distribución alternativa en **Uptodown** o tiendas de terceros.
2. **Motor de Inferencia Server-Side Nativo**: Utiliza la API oficial `@google/genai` con `gemini-3.8-flash` con razonamiento alto (`ThinkingLevel.HIGH`), protegiendo credenciales bajo `process.env.GEMINI_API_KEY`.
3. **Ciclo Autónomo de 6 Horas vía GitHub Actions**: Un flujo programado (`.github/workflows/chronos-pulse-cycle.yml`) que rastrea la web abierta (Reddit, Hugging Face, arXiv, filtraciones), descarga imágenes de evidencia y genera informes técnicos descargables en los Artifacts de GitHub.

---

## 🔄 El Ciclo de 6 Horas y las Ventanas UTC

La plataforma sincroniza su reloj y sus despachos en 4 ventanas fijas por día en tiempo universal coordinado:
1. **00:00 UTC — Asia & Oceanía Pulse**: Tokio, Pekín, Seúl, Sydney.
2. **06:00 UTC — Europa & Medio Oriente**: Normativa UE (AI Act), CERN, startups europeas e israelíes.
3. **12:00 UTC — Costa Este USA & Papers Académicos**: Descargas de arXiv, anuncios universitarios y de laboratorios.
4. **18:00 UTC — Silicon Valley & Costa Oeste**: Grandes tecnológicas (Google, Meta, OpenAI, Anthropic, Nvidia) y trending en GitHub.

---

## 🧭 Criterios de Selección y Curación (Los 4 Pilares)

Todo componente, informe o generador desarrollado debe respetar la matriz de 4 pilares:
- **Impacto Técnico Real**: Pesos abiertos, benchmarks reproducibles, enlaces a repositorios de código. Descartar declaraciones de relaciones públicas sin sustancia.
- **Arquitectura & Hardware**: Requisitos de memoria VRAM, soporte FP8/BF16, optimizaciones de cuantización (GGUF, EXL2, vLLM).
- **Marco Regulatorio y Seguridad**: Disposiciones legales vinculantes o vulnerabilidades reales.
- **Ecosistema Open Source**: Capacidad de ejecución local y modificación comunitaria.

---

## 🏗️ Reglas de Arquitectura para el Código de la Aplicación

1. **Desarrollo Modular**: Cada pantalla (`HeroWelcome`, `DispatchesScreen`, `ChatbotScreen`, `PipelineScreen`, `ChannelsScreen`) debe residir en su propio componente independiente en `components/`.
2. **Ergonomía Táctil y Pantalla no Minimalista Extrema**: Diseños ricos en datos (fichas técnicas, badges de categoría, temporizadores y tarjetas informativas), con zonas táctiles amplias para el pulgar en teléfonos móviles.
3. **Aislamiento de Secretos y API Routes**: Ninguna clave de API debe llegar al cliente del navegador. Usar rutas en `app/api/*`.
4. **Separación con el Action de GitHub**:
   - La web app Next.js sirve para interactuar, consultar despachos, probar el chatbot y ver el estado de los canales.
   - El GitHub Action se encarga de la recolección periódica pesada, el guardado de artefactos con imágenes y la auditoría profunda de las últimas 6 horas.
