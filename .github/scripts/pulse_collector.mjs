/**
 * Script Autónomo del Ciclo de Despacho 6 Horas — Chronos AI Pulse
 *
 * Responsabilidad de este script:
 * 1. Calcular la ventana temporal de las últimas 6 horas (UTC).
 * 2. Rastrear la web abierta mediante DuckDuckGo HTML (html.duckduckgo.com) sin atarse a
 *    ninguna comunidad o dominio cerrado: captura filtraciones (leaks), anuncios en X/Twitter,
 *    posts de cualquier foro/Reddit, repositorios en GitHub, papers y páginas web globales.
 * 3. Complementar con Hugging Face Daily Papers para papers de alta relevancia de la jornada.
 * 4. Extraer imágenes relevantes (thumbnails, OpenGraph cards y capturas) y guardarlas en output/images/.
 * 5. Iniciar Gemini 3.8 Flash con Razonamiento Alto (ThinkingLevel.HIGH) para auditar con rigor técnico
 *    la verosimilitud de las filtraciones, requerimientos de VRAM y novedades de la ventana.
 * 6. Compilar los artefactos de salida (Markdown, HTML responsive móvil y JSON) para GitHub Actions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// ============================================================================
// 1. PARÁMETROS TEMPORALES Y CONFIGURACIÓN DEL ENTORNO
// ============================================================================

const AHORA_MS = Date.now();
const VENTANA_6H_MS = 6 * 60 * 60 * 1000;
const HACE_6_HORAS_MS = AHORA_MS - VENTANA_6H_MS;

const FECHA_AHORA_ISO = new Date(AHORA_MS).toISOString();
const FECHA_INICIO_ISO = new Date(HACE_6_HORAS_MS).toISOString();

const TEMA_PERSONALIZADO = (process.env.INPUT_CUSTOM_TOPIC || '').trim();
const NIVEL_PROFUNDIDAD = (process.env.INPUT_DEPTH_LEVEL || 'exhaustive_thinking').trim();

// Rutas de carpetas para GitHub Action Artifacts
const DIRECTORIO_OUTPUT = path.resolve('output');
const DIRECTORIO_IMAGENES = path.join(DIRECTORIO_OUTPUT, 'images');

fs.mkdirSync(DIRECTORIO_IMAGENES, { recursive: true });

console.log('='.repeat(70));
console.log('⚡ CHRONOS AI PULSE — RASTREO ABIERTO DUCKDUCKGO & GEMINI 3.8 FLASH');
console.log(`⏰ Ventana Temporal (6 Horas): ${FECHA_INICIO_ISO} ──► ${FECHA_AHORA_ISO}`);
if (TEMA_PERSONALIZADO) {
  console.log(`🎯 Foco Prioritario Solicitado: "${TEMA_PERSONALIZADO}"`);
}
console.log(`🧠 Nivel de Razonamiento: ${NIVEL_PROFUNDIDAD} (ThinkingLevel.HIGH)`);
console.log('='.repeat(70));

// Encabezados HTTP para evitar bloqueos por WAF o centros de datos
const HEADERS_NAVEGADOR = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

// ============================================================================
// 2. UTILIDADES DE LIMPIEZA Y DECODIFICACIÓN HTML
// ============================================================================

/**
 * Limpia etiquetas HTML y resuelve entidades comunes como &quot;, &#x27;, &amp;
 */
function limpiarTextoHtml(htmlStr) {
  if (!htmlStr) return '';
  return htmlStr
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Decodifica la URL de redirección interna de DuckDuckGo (parámetro uddg)
 */
function extraerUrlRealDuckDuckGo(hrefRaw) {
  if (!hrefRaw) return '';
  try {
    if (hrefRaw.includes('uddg=')) {
      const match = hrefRaw.match(/uddg=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }
    if (hrefRaw.startsWith('//')) {
      return `https:${hrefRaw}`;
    }
    return hrefRaw;
  } catch {
    return hrefRaw;
  }
}

// ============================================================================
// 3. RASTREADOR ABIERTO DUCKDUCKGO HTML (SIN JAULAS NI ATADURAS)
// ============================================================================

/**
 * Realiza una búsqueda abierta en DuckDuckGo HTML (sin JavaScript ni CAPTCHAs)
 * Parámetro df=d: Filtra resultados de las últimas 24 horas/recientes
 */
async function buscarDuckDuckGoHtml(consulta, filtroTiempo = 'd') {
  const urlEndpoint = 'https://html.duckduckgo.com/html/';
  console.log(`  🌐 Consultando DuckDuckGo: "${consulta}" (filtro tiempo: ${filtroTiempo})...`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const bodyParams = new URLSearchParams();
    bodyParams.append('q', consulta);
    if (filtroTiempo) {
      bodyParams.append('df', filtroTiempo);
    }
    bodyParams.append('b', '');

    const res = await fetch(urlEndpoint, {
      method: 'POST',
      headers: {
        ...HEADERS_NAVEGADOR,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString(),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`  ⚠️ DuckDuckGo devolvió estado HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const resultados = [];

    // Expresión regular para capturar cada resultado en la página estática de DuckDuckGo
    // Estructura: <a class="result__snippet" ...> o bloque <h2 class="result__title">
    const bloqueRegex = /<div class="result results_links results_links_deep[^"]*"[\s\S]*?<\/div>\s*<\/div>/g;
    const bloques = html.match(bloqueRegex) || [];

    for (const bloque of bloques.slice(0, 8)) {
      // 1. Extraer enlace y título
      const linkMatch = bloque.match(/<a class="result__url"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i) ||
                        bloque.match(/<a class="result__snippet"[^>]*href="([^"]+)"/i) ||
                        bloque.match(/<h2 class="result__title">[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

      if (!linkMatch) continue;

      const urlOriginal = extraerUrlRealDuckDuckGo(linkMatch[1]);
      let titulo = limpiarTextoHtml(linkMatch[2] || '');

      // Si el título quedó vacío, buscar en el bloque del título h2
      if (!titulo) {
        const titleFallback = bloque.match(/<h2 class="result__title">([\s\S]*?)<\/h2>/i);
        if (titleFallback) titulo = limpiarTextoHtml(titleFallback[1]);
      }

      // 2. Extraer fragmento (snippet) de contenido
      const snippetMatch = bloque.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
      const snippet = snippetMatch ? limpiarTextoHtml(snippetMatch[1]) : '';

      if (urlOriginal && (titulo || snippet)) {
        resultados.push({
          fuente: 'DuckDuckGo Web Abierta',
          titulo: titulo || 'Noticia de IA detectada',
          enlace: urlOriginal,
          texto: snippet,
          consultaOrigen: consulta
        });
      }
    }

    console.log(`    ↳ ${resultados.length} resultados extraídos para "${consulta}".`);
    return resultados;
  } catch (error) {
    console.warn(`  ⚠️ Error en DuckDuckGo para "${consulta}":`, error.message);
    return [];
  }
}

/**
 * Consulta los papers más destacados de hoy en Hugging Face Daily Papers
 */
async function rastrearHuggingFaceDailyPapers() {
  const url = 'https://huggingface.co/api/daily_papers';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': HEADERS_NAVEGADOR['User-Agent'] } });
    if (!res.ok) return [];
    const papers = await res.json();
    if (!Array.isArray(papers)) return [];

    return papers.slice(0, 8).map((item) => {
      const paper = item.paper || item;
      return {
        fuente: 'Hugging Face Daily Papers',
        titulo: paper.title || 'Paper relevante',
        texto: (paper.summary || '').slice(0, 1000),
        votos: item.numComments || paper.upvotes || 0,
        enlace: `https://huggingface.co/papers/${paper.id}`,
        imagenUrl: paper.media?.thumbnail || null
      };
    });
  } catch (error) {
    console.warn('  ⚠️ No se pudo consultar Hugging Face Papers:', error.message);
    return [];
  }
}

// ============================================================================
// 4. DESCARGA DE IMÁGENES Y METADATOS VISUALES (OPENGRAPH & PAPERS)
// ============================================================================

/**
 * Intenta extraer la imagen OpenGraph (og:image) o Twitter card de una URL web
 */
async function extraerOgImageDeUrl(url) {
  if (!url || !url.startsWith('http')) return null;
  // Omitir dominios que bloquean scrapers con captchas conocidos
  if (url.includes('twitter.com') || url.includes('x.com')) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { 
      headers: HEADERS_NAVEGADOR,
      signal: controller.signal 
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();

    const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
                    html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    if (ogMatch && ogMatch[1]) {
      let imgUrl = ogMatch[1];
      if (imgUrl.startsWith('//')) imgUrl = `https:${imgUrl}`;
      else if (imgUrl.startsWith('/')) {
        const parsed = new URL(url);
        imgUrl = `${parsed.origin}${imgUrl}`;
      }
      return imgUrl;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Descarga una imagen remota y la almacena localmente en output/images/
 */
async function descargarImagen(url, nombreBase) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { headers: HEADERS_NAVEGADOR, signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();

    if (buffer.byteLength < 800 || buffer.byteLength > 8 * 1024 * 1024) return null;

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
    return null;
  }
}

// ============================================================================
// 5. BATERÍA DE RASTREO MULTI-ANGULAR DE LA WEB ABIERTA
// ============================================================================

async function ejecutarRastreoWebAbierto() {
  console.log('\n📡 [Paso 1/4] Ejecutando batería de consultas abiertas en DuckDuckGo HTML...');

  // Construir consultas abiertas (sin atarse a una sola comunidad)
  const consultas = [];

  if (TEMA_PERSONALIZADO) {
    consultas.push(TEMA_PERSONALIZADO);
    consultas.push(`"${TEMA_PERSONALIZADO}" leak OR release OR weights OR benchmark`);
  }

  consultas.push('AI model leak OR "open weights" OR release 2026');
  consultas.push('site:x.com "new AI model" OR "released" OR "weights"');
  consultas.push('site:reddit.com AI model leak OR release OR weights OR benchmark');
  consultas.push('new AI research paper "weights" OR "architecture" benchmark');

  const promesasBusqueda = consultas.map(q => buscarDuckDuckGoHtml(q, 'd'));
  const promesaHuggingFace = rastrearHuggingFaceDailyPapers();

  const [resDuck, itemsHF] = await Promise.all([
    Promise.all(promesasBusqueda),
    promesaHuggingFace
  ]);

  // Unificar y deduplicar resultados por URL
  const mapaUrls = new Map();
  for (const lista of resDuck) {
    for (const item of lista) {
      if (item.enlace && !mapaUrls.has(item.enlace)) {
        mapaUrls.set(item.enlace, item);
      }
    }
  }

  const itemsWeb = Array.from(mapaUrls.values());
  console.log(`✅ Resultados únicos recolectados de la web abierta: ${itemsWeb.length}`);
  console.log(`✅ Papers de Hugging Face recolectados: ${itemsHF.length}`);

  // Extracción y descarga de imágenes
  console.log('\n🖼️ [Paso 2/4] Buscando y descargando imágenes asociadas a las novedades...');
  const imagenesDescargadas = [];
  let contadorImg = 1;

  // 1. Imágenes directas de Hugging Face
  for (const hf of itemsHF) {
    if (hf.imagenUrl && contadorImg <= 6) {
      const guardada = await descargarImagen(hf.imagenUrl, `figura_${contadorImg}_paper`);
      if (guardada) {
        imagenesDescargadas.push({ ...guardada, titulo: hf.titulo, fuente: hf.fuente });
        contadorImg++;
      }
    }
  }

  // 2. OpenGraph images de las páginas web encontradas
  for (const webItem of itemsWeb.slice(0, 10)) {
    if (contadorImg > 8) break;
    const ogImgUrl = await extraerOgImageDeUrl(webItem.enlace);
    if (ogImgUrl) {
      const guardada = await descargarImagen(ogImgUrl, `figura_${contadorImg}_web`);
      if (guardada) {
        imagenesDescargadas.push({ ...guardada, titulo: webItem.titulo, fuente: webItem.enlace });
        contadorImg++;
      }
    }
  }

  console.log(`✅ Total de figuras y diagramas almacenados: ${imagenesDescargadas.length}`);

  return {
    itemsWeb,
    itemsHF,
    imagenesDescargadas
  };
}

// ============================================================================
// 6. INFERENCIA CON GEMINI 3.8 FLASH (RAZONAMIENTO ALTO)
// ============================================================================

async function razonarYGenerarInforme(datos) {
  console.log('\n🧠 [Paso 3/4] Enviando señales a Gemini 3.8 Flash con Razonamiento Alto...');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Falta la variable de entorno GEMINI_API_KEY. Configúrala en los Secrets del repositorio.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const dossier = `
=== SEÑALES Y NOTICIAS RECOLECTADAS DE LA WEB ABIERTA (ÚLTIMAS 6 HORAS) ===
Hora UTC: ${FECHA_AHORA_ISO}
Ventana: ${FECHA_INICIO_ISO} ──► ${FECHA_AHORA_ISO}
${TEMA_PERSONALIZADO ? `FOCO PRIORITARIO: "${TEMA_PERSONALIZADO}"` : ''}

--- NOVEDADES Y FILTRACIONES RASTREADAS EN LA WEB (DUCKDUCKGO: X, REDDIT, BLOGS, REPOSITORIOS) ---
${JSON.stringify(datos.itemsWeb, null, 2)}

--- PAPERS DESTACADOS EN HUGGING FACE DAILY PAPERS ---
${JSON.stringify(datos.itemsHF, null, 2)}

--- EVIDENCIA VISUAL CAPTURADA LOCALMENTE ---
${JSON.stringify(datos.imagenesDescargadas, null, 2)}
`;

  const systemInstruction = `
Eres el Investigador Técnico y Auditor de IA de Chronos AI Pulse.
Tu misión es analizar todas las señales recolectadas en la web abierta durante las últimas 6 horas y redactar un informe exhaustivo, riguroso y sin marketing.

REGLAS DE AUDITORÍA Y RAZONAMIENTO:
1. RASTREO ABIERTO: Analiza posts de X, foros, Reddit, páginas de noticias y repositorios.
2. AUDITORÍA DE FILTRACIONES (LEAKS):
   - Separa con rigor: [CONFIRMADO CON PESOS/CÓDIGO], [FILTRACIÓN EN INVESTIGACIÓN], o [HUMO / RUMOR DESCARTADO].
   - Razona sobre requerimientos de VRAM, parámetros (ej. FP8, MoE, arquitectura latente) y factibilidad matemática.
3. FILTRO DE LOS 4 PILARES:
   - Impacto Técnico Real (pesos abiertos, benchmarks reproducibles).
   - Arquitectura & Hardware (VRAM, cuantizaciones GGUF/vLLM, chips).
   - Regulaciones vinculantes y Seguridad.
   - Ecosistema Open Source.
4. ESTRUCTURA DEL INFORME:
   - Titular ejecutivo y fecha UTC.
   - Flash de 30 Segundos (3-5 viñetas concisas para móvil).
   - Filtraciones y Lanzamientos Sorpresa (con badge de certeza).
   - Análisis Arquitectónico y Requerimientos de Hardware (VRAM en local vs datacenter).
   - Debate Comunitario en la Web y X.
   - Galería de Evidencia Visual (referenciando images/figura_X_... y explicando qué muestra).
   - Fuentes consultadas con sus enlaces web reales.
`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Realiza la investigación profunda con razonamiento de alto nivel sobre este material:\n${dossier}`,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
  } catch (error) {
    console.error('Error con Gemini 3.8 Flash:', error);
    throw error;
  }

  const texto = response.text || 'Sin texto generado.';
  console.log(`✅ Informe de investigación completado con éxito (${texto.length} caracteres).`);
  return texto;
}

// ============================================================================
// 7. COMPILACIÓN DE ARTEFACTOS (MARKDOWN, HTML RESPONSIVE Y JSON)
// ============================================================================

function guardarArtefactos(informeMarkdown, imagenes) {
  console.log('\n📄 [Paso 4/4] Guardando artefactos en output/...');

  // 1. Markdown
  const rutaMd = path.join(DIRECTORIO_OUTPUT, 'dispatch-report.md');
  fs.writeFileSync(rutaMd, informeMarkdown, 'utf-8');

  // 2. HTML responsivo adaptado para teléfonos móviles
  const galeriaHtml = imagenes.map(img => `
    <div class="card-imagen">
      <img src="${img.rutaRelativa}" alt="${img.titulo}" loading="lazy" />
      <div class="caption">
        <strong>${img.fuente}</strong><br>${img.titulo}
      </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
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
    h1 { font-size: 1.75rem; color: #fff; line-height: 1.25; margin-bottom: 10px; }
    .meta { font-size: 0.85rem; color: var(--text-muted); }
    .content {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      font-size: 0.95rem;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .galeria { margin-top: 32px; }
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
    <div class="badge">⚡ Chronos AI Pulse — Ciclo 6h Web Abierta</div>
    <h1>Despacho Técnico & Auditoría de Inteligencia Artificial</h1>
    <div class="meta">
      Generado automáticamente el: <strong>${FECHA_AHORA_ISO}</strong> (UTC)<br>
      Ventana de investigación: <strong>${FECHA_INICIO_ISO}</strong> a <strong>${FECHA_AHORA_ISO}</strong>
    </div>
  </header>

  <div class="content">${informeMarkdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

  ${imagenes.length > 0 ? `
  <div class="galeria">
    <h2>📸 Evidencia Visual, Diagramas y Capturas del Ciclo</h2>
    <div class="grid-imagenes">${galeriaHtml}</div>
  </div>
  ` : ''}

  <footer>
    Chronos AI Pulse • Rastreo DuckDuckGo Abierto + Gemini 3.8 Flash (Thinking High) • GitHub Actions
  </footer>
</body>
</html>`;

  const rutaHtml = path.join(DIRECTORIO_OUTPUT, 'dispatch-report.html');
  fs.writeFileSync(rutaHtml, html, 'utf-8');

  // 3. JSON resumido
  const rutaJson = path.join(DIRECTORIO_OUTPUT, 'dispatch-summary.json');
  fs.writeFileSync(rutaJson, JSON.stringify({
    generado_utc: FECHA_AHORA_ISO,
    ventana_inicio_utc: FECHA_INICIO_ISO,
    ventana_fin_utc: FECHA_AHORA_ISO,
    total_imagenes: imagenes.length,
    imagenes
  }, null, 2), 'utf-8');

  console.log(`  💾 Artefactos listos: dispatch-report.md, dispatch-report.html, dispatch-summary.json`);
}

// ============================================================================
// 8. EJECUCIÓN PRINCIPAL
// ============================================================================

async function main() {
  try {
    const datos = await ejecutarRastreoWebAbierto();
    const informe = await razonarYGenerarInforme(datos);
    guardarArtefactos(informe, datos.imagenesDescargadas);
    console.log('\n🚀 [FINALIZADO] Despacho de 6 horas completado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ [ERROR CRÍTICO]:', error);
    process.exit(1);
  }
}

main();
