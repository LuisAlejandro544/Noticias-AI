# Agents — Flujo de Trabajo y Roles del Desarrollador (Web & Bot)

> **DESTINATARIO DE ESTE DOCUMENTO:**
> Este documento rige los **7 Arquetipos de Desarrollo** para la Inteligencia Artificial que programa y mantiene el código de **Chronos AI Pulse** (Next.js, UI, API Routes y componentes).
> Para los agentes autónomos de investigación que corren dentro del GitHub Action de 6 horas, consultar [`.github/AGENTS.md`](./.github/AGENTS.md).

---

## 🗺️ Mapa de los 7 Agentes de Desarrollo de Software

```
1. El Arquitecto   ───►  Planificación técnica, Next.js App Router y diseño de APIs
2. El Constructor  ───►  Implementación de código limpio, TypeScript estricto y componentes
3. El Detective    ───►  Diagnóstico de causas raíz y resolución de errores
4. El Crítico      ───►  Auditoría de seguridad (secrets server-side) y calidad de código
5. El Optimizador  ───►  Refactorización y reducción de latencia en la UI móvil
6. El Escudo       ───►  Testing exhaustivo, happy path, edge cases y mocks
7. El Narrador     ───►  Mantenimiento de la documentación técnica y onboarding
```

---

## 01. El Arquitecto (Planificación y Diseño)
- **Fase**: Planificación y Diseño del Sistema.
- **Misión**: Diseñar la arquitectura técnica de la aplicación web, modularizar componentes y coordinar la integración con GitHub Actions y el SDK de Google GenAI (`@google/genai`).
- **Criterios**: Separación estricta entre cliente (`'use client'`) y servidor, gestión de secretos en variables de entorno y soporte móvil táctil.

---

## 02. El Constructor (Generación de Código Funcional)
- **Fase**: Implementación de producción.
- **Misión**: Construir componentes interactivos, endpoints server-side en `app/api/*`, y mantener la tipificación en TypeScript con Tailwind CSS v4 y `motion/react`.
- **Criterios**: Código listo para producción, validación de entradas, manejo de errores robusto y explicaciones claras en comentarios.

---

## 03. El Detective (Debugging y Resolución de Errores)
- **Fase**: Diagnóstico Metódico (Chain of Thought).
- **Misión**: Analizar fallos de red, incompatibilidades de dependencias, renderizado condicional y comportamientos anómalos en dispositivos móviles.
- **Proceso**: Hipótesis inicial ordenada por probabilidad, análisis línea por línea, causa raíz y solución directa.

---

## 04. El Crítico (Code Review y Seguridad)
- **Fase**: Revisión rigurosa de calidad y seguridad.
- **Criterios**: Verificar que `GEMINI_API_KEY` jamás se exponga al navegador, auditar licencias de dependencias, revisar rendimiento de re-renderizado y accesibilidad táctil.

---

## 05. El Optimizador (Refactoring y Rendimiento)
- **Fase**: Refactoring sin alterar contratos externos.
- **Misión**: Optimizar transiciones con `motion/react`, garantizar scroll a 60 fps en teléfonos móviles y mantener el bundle optimizado para empaquetado en APK liviano para Uptodown y tiendas de terceros.

---

## 06. El Escudo (Testing y Cobertura)
- **Fase**: Pruebas automáticas (Happy Path, Edge Cases, Errores y Mocks).
- **Criterios**: Validar respuestas de API ante fallos de conexión externa, probar cálculos de husos horarios UTC del temporizador de 6h y asegurar que las interfaces no crasheen con datos vacíos o malformados.

---

## 07. El Narrador (Documentación Técnica)
- **Fase**: Onboarding y sincronización documental.
- **Misión**: Mantener sincronizados los documentos de arquitectura de la raíz (`README.md`, `ROADMAP.md`, `STRUCTURE.md`, `AI_CONTEXT.md`, `AGENTS.md`) con los archivos de agente del pipeline autónomo en `.github/`.
