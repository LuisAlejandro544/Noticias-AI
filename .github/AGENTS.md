# Agents — Flujo Autónomo del GitHub Action (Chronos Pulse Engine)

Este documento define los **sub-roles especializados** que adopta el motor de inferencia Gemini 3.8 Flash (con Razonamiento Alto) al ejecutarse dentro del GitHub Action de cada 6 horas.

---

## 🗺️ Mapa de Agentes de la Tarea Automatizada (6h Pipeline)

```
[Ingesta de Fuentes 6h]
         │
         ▼
1. El Rastreador Abierto  ──► Ingesta de Reddit, Hugging Face, arXiv y señales web sin jaulas
         │
         ▼
2. El Auditor de Leaks    ──► Verificación técnica de filtraciones, pesos y viabilidad de VRAM
         │
         ▼
3. El Curador Visual      ──► Selección, descarga y asociación de figuras, diagramas y capturas
         │
         ▼
4. El Sintetizador Flash   ──► Redacción del Flash de 30s y resumen ejecutivo para móvil
         │
         ▼
5. El Arquitecto de Datos ──► Compilación del Markdown, HTML responsivo y JSON en Artifacts
```

---

## 01. El Rastreador Abierto (Signal Harvester)
- **Función:** Rastrear sin preconceptos ni limitaciones de dominio las novedades producidas estrictamente dentro del margen de 6 horas anteriores a la ejecución.
- **Fuentes auditadas:** `r/LocalLLaMA`, `r/MachineLearning`, `r/Singularity`, Hugging Face Daily Papers, menciones de papers en arXiv, hilos técnicos de X y repositorios en GitHub.
- **Criterio:** Prioriza volumen de actividad, ratio de upvotes técnicos y señales de código nuevo frente a artículos de opinión.

---

## 02. El Auditor de Leaks y Fact-Checker (Thinking High)
- **Función:** Aplicar el presupuesto de razonamiento profundo (`thinkingLevel: ThinkingLevel.HIGH`) para desmontar mitos y comprobar afirmaciones técnicas.
- **Preguntas de auditoría:**
  - ¿Los parámetros anunciados (ej: 671B MoE con 37B activos) son coherentes con la tasa de compresión y tamaño de checkpoint?
  - ¿Hay commits reales o ramas activas en bibliotecas como `vLLM` o `transformers`?
  - ¿Se trata de un benchmark real con semillas y prompts documentados o es una captura recortada?
- **Resultado:** Clasifica cada noticia en *Confirmado*, *En investigación* o *Humo descartado*.

---

## 03. El Curador Visual (Visual Evidence Curator)
- **Función:** Identificar diagramas de arquitectura de papers, comparativas de benchmarks en barras o capturas de terminal de inferencia local.
- **Acción:** Asegurar que las imágenes asociadas se descarguen en `output/images/` y queden debidamente referenciadas con leyendas explicativas en el informe final.

---

## 04. El Sintetizador Flash (High-Density Writer)
- **Función:** Redactar el contenido en dos velocidades:
  1. *Velocidad móvil rápida*: Flash de 30 segundos con viñetas para quien lee con prisa desde el teléfono.
  2. *Velocidad técnica profunda*: Desglose completo de hiperparámetros, consumo de memoria y compatibilidad para quien va a correr el modelo en local.

---

## 05. El Compilador de Salida (Artifact Producer)
- **Función:** Generar los archivos finales listos para consumo o descarga:
  - `output/dispatch-report.md`: Markdown técnico completo.
  - `output/dispatch-report.html`: Página web autónoma con modo oscuro y diseño ergonómico responsive.
  - `output/dispatch-summary.json`: Metadatos serializados del ciclo.
  - `output/images/*`: Activos visuales empaquetados.
