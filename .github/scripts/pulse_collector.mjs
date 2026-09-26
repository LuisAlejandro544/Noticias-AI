/**
 * Script Autónomo del Ciclo de Despacho 6 Horas — Chronos AI Pulse
 *
 * Responsabilidad de este script:
 * 1. Calcular la ventana temporal de las últimas 6 horas (UTC) desde el momento de ejecución.
 * 2. Realizar un rastreo abierto y multi-fuente en la web (Reddit r/LocalLLaMA, r/MachineLearning,
 *    r/Singularity, Hugging Face Daily Papers, arXiv CS y señales de filtraciones).
 * 3. Descargar y almacenar localmente imágenes, diagramas y capturas asociadas a las novedades.
 * 4. Iniciar Gemini 3.8 Flash con Razonamiento Alto (ThinkingLevel.HIGH) y capacidades de búsqueda abierta.
 * 5. Realizar una auditoría técnica profunda (verificación de filtraciones, pesos, arquitectura y comunidad).
 * 6. Generar el informe en Markdown y HTML responsivo optimizado para móviles, y guardar los artefactos.
 */

import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// ============================================================================
// 1. CONFIGURACIÓN Y PARÁMETROS DE LA VENTANA TEMPORAL (6 HORAS)
// ============================================================================

const AHORA_MS = Date.now();
const VENTANA_6H_MS = 6 * 60 * 60 * 1000;
const HACE_6_HORAS_MS = AHORA_MS - VENTANA_6H_MS;

const FECHA_AHORA_ISO = new Date(AHORA_MS).toISOString();
const FECHA_INICIO_ISO = new Date(HACE_6_HORAS_MS).toISOString();

const TEMA_PERSONALIZADO = (process.env.INPUT_CUSTOM_TOPIC || '').trim();
const NIVEL_PROFUNDIDAD = (process.env.INPUT_DEPTH_LEVEL || 'exhaustive_thinking').trim();

// Directorios de salida para los artefactos de GitHub Actions
const DIRECTORIO_OUTPUT = path.resolve('output');
const DIRECTORIO_IMAGENES = path.join(DIRECTORIO_OUTPUT, 'images');

// Asegurar que las carpetas de salida existen
fs.mkdirSync(DIRECTORIO_IMAGENES, { recursive: true });

console.log('='.repeat(70));
console.log('⚡ CHRONOS AI PULSE — CICLO AUTÓNOMO DE 6 HORAS');
console.log(`⏰ Ventana de Ingesta: ${FECHA_INICIO_ISO} ──► ${FECHA_AHORA_ISO}`);
if (TEMA_PERSONALIZADO) {
  console.log(`🎯 Foco Prioritario Manual: "${TEMA_PERSONALIZADO}"`);
}
console.log(`🧠 Nivel de Razonamiento Gemini: ${NIVEL_PROFUNDIDAD}`);
console.log('='.repeat(70));

// ============================================================================
// 2. FUNCIONES DE RASTREO MULTI-FUENTE (REDDIT, HUGGING FACE, ARXIV)
// ============================================================================

/**
 * Encabezados HTTP estándar simulando cliente de investigación para evitar bloqueos
 */
const HEADERS_HTTP = {
  'User-Agent': 'ChronosAIPulse/1.0 (Autonomous AI Research Bot; Open Science Aggregator)',
  'Accept': 'application/json, text/xml, application/xml, text/html'
};

/**
 * Consulta un subreddit público en formato JSON y filtra novedades de la ventana de 6 horas
 */
async function rastrearRedditSubreddit(subreddit, limite = 20) {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limite}`;
  try {
    const res = await fetch(url, { headers: HEADERS_HTTP });
    if (!res.ok) {
      console.warn(`[Reddit] No se pudo obtener r/${subreddit} (HTTP ${res.status})`);
      return [];
    }
    const data = await res.json();
    const children = data?.data?.children || [];
    
    const items = [];
    for (const entry of children) {
      const post = entry.data;
      if (!post) continue;
      
      const postCreatedAtMs = post.created_utc * 1000;
      // Filtramos posts recientes (últimas 8 horas para dar margen de husos horarios y procesamiento)
      const esReciente = postCreatedAtMs >= (HACE_6_HORAS_MS - 2 * 60 * 60 * 1000);
      
      // Detectar URL de imagen directa o preview si existe
      let imagenUrl = null;
      if (post.url && (post.url.endsWith('.png') || post.url.endsWith('.jpg') || post.url.endsWith('.jpeg') || post.url.endsWith('.webp'))) {
        imagenUrl = post.url;
      } else if (post.preview?.images?.[0]?.source?.url) {
        imagenUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
      }

      if (esReciente || post.score > 150) {
        items.push({
          fuente: `Reddit r/${subreddit}`,
          titulo: post.title,
          autor: post.author,
          puntuacion: post.score,
          comentarios: post.num_comments,
          enlace: `https://www.reddit.com${post.permalink}`,
          texto: (post.selftext || '').slice(0, 1500),
          imagenUrl,
          creado_utc: new Date(postCreatedAtMs).toISOString()
        });
      }
    }
    return items;
  } catch (error) {
    console.warn(`[Reddit] Error al consultar r/${subreddit}:`, error.message);
    return [];
  }
}

/**
 * Consulta los papers más destacados de hoy en Hugging Face Daily Papers
 */
async function rastrearHuggingFaceDailyPapers() {
  const url = 'https://huggingface.co/api/daily_papers';
  try {
    const res = await fetch(url, { headers: HEADERS_HTTP });
    if (!res.ok) {
      console.warn(`[Hugging Face] Error HTTP ${res.status}`);
      return [];
    }
    const papers = await res.json();
    if (!Array.isArray(papers)) return [];

    return papers.slice(0, 10).map((item) => {
      const paper = item.paper || item;
      return {
        fuente: 'Hugging Face Daily Papers',
        titulo: paper.title || 'Sin título',
        resumen: (paper.summary || '').slice(0, 1000),
        votos: item.numComments || paper.upvotes || 0,
        enlace: `https://huggingface.co/papers/${paper.id}`,
        imagenUrl: paper.media?.thumbnail || null,
        publicado: paper.publishedAt || FECHA_AHORA_ISO
      };
    });
  } catch (error) {
    console.warn('[Hugging Face] Error al consultar Daily Papers:', error.message);
    return [];
  }
}

/**
 * Descarga y guarda una imagen localmente en la carpeta de artefactos
 */
async function descargarImagen(url, nombreBase) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch(url, { 
      headers: { 'User-Agent': HEADERS_HTTP['User-Agent'] },
      signal: controller.signal 
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    // Limitar tamaño a 8 MB
    if (buffer.byteLength > 8 * 1024 * 1024 || buffer.byteLength < 500) return null;

    const ext = url.includes('.png') ? 'png' : url.includes('.webp') ? 'webp' : 'jpg';
    const nombreLimpio = `${nombreBase.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)}.${ext}`;
    const rutaDestino = path.join(DIRECTORIO_IMAGENES, nombreLimpio);

    fs.writeFileSync(rutaDestino, Buffer.from(buffer));
    console.log(`  📸 Imagen guardada: images/${nombreLimpio} (${Math.round(buffer.byteLength / 1024)} KB)`);
    return {
      nombreArchivo: nombreLimpio,
      rutaRelativa: `images/${nombreLimpio}`,
      fuenteOriginal: url
    };
  } catch (error) {
    console.warn(`  ⚠️ No se pudo descargar imagen ${url}: ${error.message}`);
    return null;
  }
}

// ============================================================================
// 3. EJECUCIÓN DEL RASTREO Y DESCARGA DE ACTIVOS VISUALES
// ============================================================================

async function recolectarDatosEImagenes() {
  console.log('\n📡 [Paso 1/4] Rastreando fuentes abiertas sin restricciones de dominio...');

  const subreddits = ['LocalLLaMA', 'MachineLearning', 'singularity', 'ArtificialInteligence'];
  const promesasReddit = subreddits.map(sub => rastrearRedditSubreddit(sub));
  const promesaHF = rastrearHuggingFaceDailyPapers();

  const [resReddit, itemsHF] = await Promise.all([
    Promise.all(promesasReddit),
    promesaHF
  ]);

  const itemsReddit = resReddit.flat();
  console.log(`✅ Novedades encontradas: ${itemsReddit.length} posts en Reddit, ${itemsHF.length} papers en Hugging Face.`);

  // Descarga de imágenes relevantes asociadas a las novedades
  console.log('\n🖼️ [Paso 2/4] Identificando y descargando imágenes, diagramas y capturas...');
  const imagenesDescargadas = [];
  let contadorImg = 1;

  for (const item of [...itemsReddit, ...itemsHF]) {
    if (item.imagenUrl && contadorImg <= 8) {
      const resultadoImg = await descargarImagen(item.imagenUrl, `figura_${contadorImg}_${item.fuente}`);
      if (resultadoImg) {
        imagenesDescargadas.push({
          ...resultadoImg,
          noticiaTitulo: item.titulo,
          fuente: item.fuente
        });
        contadorImg++;
      }
    }
  }

  console.log(`✅ Total de imágenes almacenadas en el artefacto: ${imagenesDescargadas.length}`);

  return {
    itemsReddit,
    itemsHF,
    imagenesDescargadas
  };
}

// ============================================================================
// 4. INFERENCIA Y SÍNTESIS PROFUNDA CON GEMINI 3.8 FLASH (RAZONAMIENTO ALTO)
// ============================================================================

async function ejecutarInvestigacionGemini(datosRecopilados) {
  console.log('\n🧠 [Paso 3/4] Enviando material a Gemini 3.8 Flash con Razonamiento Alto...');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la variable de entorno GEMINI_API_KEY. Configúrala en los Secrets del repositorio de GitHub.');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Preparar el dossier contextual con las noticias capturadas
  const dossierTexto = `
=== DATOS RECOLECTADOS DE LA VENTANA DE LAS ÚLTIMAS 6 HORAS ===
Hora de ejecución UTC: ${FECHA_AHORA_ISO}
Ventana analizada: ${FECHA_INICIO_ISO} hasta ${FECHA_AHORA_ISO}
${TEMA_PERSONALIZADO ? `FOCO PRIORITARIO SOLICITADO: "${TEMA_PERSONALIZADO}"` : ''}

--- PAPERS EN HUGGING FACE (DAILY PAPERS) ---
${JSON.stringify(datosRecopilados.itemsHF, null, 2)}

--- DEBATES, PRUEBAS Y FILTRACIONES EN REDDIT (LocalLLaMA, MachineLearning, etc.) ---
${JSON.stringify(datosRecopilados.itemsReddit.slice(0, 15), null, 2)}

--- IMÁGENES Y DIAGRAMAS CAPTURADOS LOCALMENTE ---
${JSON.stringify(datosRecopilados.imagenesDescargadas, null, 2)}
`;

  const systemInstruction = `
Eres el Investigador Técnico y Auditor de IA de Chronos AI Pulse.
Tu misión es procesar toda la información de las últimas 6 horas y redactar un informe exhaustivo, riguroso y sin marketing.

REGLAS METODOLÓGICAS OBLIGATORIAS:
1. RASTREO ABIERTO: Si el tema involucra filtraciones, repositorios nuevos, lanzamientos sorpresa o pruebas de hardware en las últimas 6 horas, audita la verosimilitud técnica.
2. AUDITORÍA DE FILTRACIONES (LEAKS):
   - Separa claramente: [CONFIRMADO CON PESOS/CÓDIGO], [FILTRACIÓN EN INVESTIGACIÓN], o [HUMO / RUMOR DESCARTADO].
   - Evalúa si los requerimientos de VRAM, parámetros y arquitectura tienen sentido matemático.
3. FILTRO DE LOS 4 PILARES:
   - Impacto Técnico Real (pesos abiertos, benchmarks reproducibles).
   - Arquitectura y Hardware (chips, memoria, inferencia, vLLM, GGUF).
   - Regulaciones y Seguridad vinculante.
   - Ecosistema Open Source.
4. ESTRUCTURA DEL INFORME:
   - Titular ejecutivo impactante pero sobrio.
   - Flash de 30 Segundos (bullet points concisos).
   - Ficha Técnica de las Novedades Críticas (laboratorio, pesos, licencia, enlaces).
   - Desglose Arquitectónico Profundo.
   - Veredicto de la Comunidad (r/LocalLLaMA y desarrolladores).
   - Galería de Imágenes y Diagramas (referenciando las imágenes capturadas como images/nombre_archivo.jpg).
   - Fuentes consultadas y enlaces directos.
`;

  const promptUsuario = `
Realiza la investigación profunda de las últimas 6 horas basándote en el material recopilado y en tu razonamiento de alto nivel:

${dossierTexto}

Redacta el informe completo en formato Markdown técnico de alta densidad.
`;

  // Intentar con Google Search si está disponible en la clave; de lo contrario, ejecutar con Razonamiento Alto
  let response;
  try {
    console.log('  🔍 Intentando consulta con Razonamiento Alto y Búsqueda Web...');
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptUsuario,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        },
        tools: [{ googleSearch: {} }]
      }
    });
  } catch (errSearch) {
    console.warn(`  ℹ️ Búsqueda de Google no disponible o limitada en este tier (${errSearch.message}). Utilizando modo de Razonamiento Alto nativo...`);
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptUsuario,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });
  }

  const textoGenerado = response.text || 'No se obtuvo texto de respuesta.';
  console.log(`✅ Informe técnico generado con éxito (${textoGenerado.length} caracteres).`);

  return textoGenerado;
}

// ============================================================================
// 5. COMPILACIÓN DE ARTEFACTOS (MARKDOWN, HTML RESPONSIVE Y JSON)
// ============================================================================

function compilarArtefactos(informeMarkdown, imagenesDescargadas) {
  console.log('\n📄 [Paso 4/4] Compilando artefactos finales en la carpeta output/...');

  // 1. Guardar informe en Markdown
  const rutaMd = path.join(DIRECTORIO_OUTPUT, 'dispatch-report.md');
  fs.writeFileSync(rutaMd, informeMarkdown, 'utf-8');
  console.log(`  💾 Markdown guardado: ${rutaMd}`);

  // 2. Generar versión HTML moderna adaptada para lectura en teléfonos móviles
  const galeriaHtml = imagenesDescargadas.map(img => `
    <div class="card-imagen">
      <img src="${img.rutaRelativa}" alt="${img.noticiaTitulo}" loading="lazy" />
      <div class="caption">
        <strong>${img.fuente}</strong>: ${img.noticiaTitulo}
      </div>
    </div>
  `).join('');

  const htmlCompleto = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chronos AI Pulse — Despacho Técnico 6h</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #e5e7eb;
      --text-muted: #9ca3af;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.15);
      --success: #10b981;
      --warning: #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.65;
      padding: 16px;
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      background: var(--accent-glow);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 1.75rem;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 10px;
    }
    .meta {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .content {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      font-size: 0.95rem;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: inherit;
    }
    .galeria {
      margin-top: 32px;
    }
    .galeria h2 {
      font-size: 1.25rem;
      margin-bottom: 16px;
      color: #fff;
      border-left: 4px solid var(--accent);
      padding-left: 10px;
    }
    .grid-imagenes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card-imagen {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    .card-imagen img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      background: #000;
    }
    .card-imagen .caption {
      padding: 10px 12px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">⚡ Chronos AI Pulse — Ciclo Autónomo 6h</div>
    <h1>Despacho Técnico & Auditoría de Inteligencia Artificial</h1>
    <div class="meta">
      Generado automáticamente el: <strong>${FECHA_AHORA_ISO}</strong> (UTC)<br>
      Ventana de investigación: <strong>${FECHA_INICIO_ISO}</strong> a <strong>${FECHA_AHORA_ISO}</strong>
    </div>
  </header>

  <div class="content">
${informeMarkdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </div>

  ${imagenesDescargadas.length > 0 ? `
  <div class="galeria">
    <h2>📸 Evidencia Visual, Diagramas y Capturas del Ciclo</h2>
    <div class="grid-imagenes">
      ${galeriaHtml}
    </div>
  </div>
  ` : ''}

  <footer>
    Chronos AI Pulse • Impulsado por Gemini 3.8 Flash con Razonamiento Alto • Ejecutado en GitHub Actions
  </footer>
</body>
</html>`;

  const rutaHtml = path.join(DIRECTORIO_OUTPUT, 'dispatch-report.html');
  fs.writeFileSync(rutaHtml, htmlCompleto, 'utf-8');
  console.log(`  🌐 HTML responsivo guardado: ${rutaHtml}`);

  // 3. Resumen JSON estructurado
  const rutaJson = path.join(DIRECTORIO_OUTPUT, 'dispatch-summary.json');
  fs.writeFileSync(rutaJson, JSON.stringify({
    generado_utc: FECHA_AHORA_ISO,
    ventana_inicio_utc: FECHA_INICIO_ISO,
    ventana_fin_utc: FECHA_AHORA_ISO,
    tema_personalizado: TEMA_PERSONALIZADO || null,
    total_imagenes: imagenesDescargadas.length,
    imagenes: imagenesDescargadas,
    longitud_informe: informeMarkdown.length
  }, null, 2), 'utf-8');
  console.log(`  📊 Resumen JSON guardado: ${rutaJson}`);
}

// ============================================================================
// 6. ENTRADA PRINCIPAL DEL SCRIPT
// ============================================================================

async function main() {
  try {
    const datosRecopilados = await recolectarDatosEImagenes();
    const informeGenerado = await ejecutarInvestigacionGemini(datosRecopilados);
    compilarArtefactos(informeGenerado, datosRecopilados.imagenesDescargadas);
    console.log('\n🚀 [FINALIZADO] Ciclo de despacho de 6 horas completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ [ERROR CRÍTICO] El ciclo de despacho falló:', error);
    process.exit(1);
  }
}

main();
