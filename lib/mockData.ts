/**
 * Archivo de Datos de Ejemplo y Configuración de Chronos AI Pulse
 * Contiene la estructura de información para los despachos de 6 horas,
 * fuentes monitoreadas, canales de integración y el ciclo horario.
 * Todo el contenido está adaptado en español y diseñado con precisión técnica.
 */

export interface DispatchItem {
  id: string;
  windowLabel: string; // ej: "Ventana 06:00 - 12:00 UTC"
  timeAgo: string;
  readTime: string;
  category: 'Modelos & LLMs' | 'Hardware & Chips' | 'Open Source' | 'Regulación & Negocios';
  title: string;
  summary: string;
  keyPoints: string[];
  sources: string[];
  impactScore: 'Alto' | 'Crítico' | 'Moderado';
  fullArticle: {
    tldr: string;
    deepDive: string;
    takeaways: string[];
    technicalDetails: string;
  };
}

export const SAMPLE_DISPATCHES: DispatchItem[] = [
  {
    id: 'disp-142',
    windowLabel: 'Ventana 06:00 - 12:00 UTC',
    timeAgo: 'Hace 42 min',
    readTime: '3 min de lectura',
    category: 'Modelos & LLMs',
    title: 'Nueva arquitectura de razonamiento híbrido supera benchmarks con un 65% menos de cómputo',
    summary: 'Laboratorios de investigación revelan un método de destilación que permite a modelos compactos resolver problemas de lógica formal igualando a clústeres masivos.',
    keyPoints: [
      'Reducción drástica de tokens de pensamiento interno mediante podado adaptativo.',
      'Compatibilidad de ejecución directa en chips de gama media sin cuantización destructiva.',
      'Código de entrenamiento y pesos de investigación liberados bajo licencia permisiva.'
    ],
    sources: ['arXiv:2609.11029', 'Hugging Face Hub', 'OpenAI Research Forum'],
    impactScore: 'Crítico',
    fullArticle: {
      tldr: 'Se ha publicado un paradigma de inferencia que reemplaza la búsqueda exhaustiva de tokens por una trayectoria latente guiada. Esto disminuye la latencia de inferencia en un 65% mientras mantiene una precisión del 94.2% en razonamiento matemático.',
      deepDive: 'Durante la última ventana de 6 horas, investigadores del consorcio de IA abierta publicaron los detalles del framework "LatentFlow". A diferencia del chain-of-thought tradicional que escribe miles de tokens visibles, el modelo utiliza un espacio latente condensado antes de emitir la respuesta final. Esto transforma la viabilidad económica de agentes autónomos que operan en bucle continuo.',
      takeaways: [
        'Los costos de inferencia en producción podrían reducirse a un tercio en tareas de código y análisis.',
        'Se verificaron implementaciones preliminares en vLLM y Hugging Face TGI.',
        'Pruebas iniciales confirman resiliencia frente a ataques de inyección de prompt por longitud.'
      ],
      technicalDetails: 'Modelo base probado en 8B y 32B parámetros. Rendimiento medido en GSM8k, MATH-500 y HumanEval con hardware estándar de 24GB VRAM.'
    }
  },
  {
    id: 'disp-141',
    windowLabel: 'Ventana 00:00 - 06:00 UTC',
    timeAgo: 'Hace 6 horas',
    readTime: '4 min de lectura',
    category: 'Hardware & Chips',
    title: 'Acelerador de silicio óptico alcanza 120 TeraFLOPS por vatio en pruebas independientes',
    summary: 'Primeros benchmarks de silicio fotónico demuestran transferencias de tensores sin disipación térmica severa, marcando un hito en centros de datos verdes.',
    keyPoints: [
      'Interconexión láser óptica directa entre memorias HBM y matrices de procesamiento.',
      'Eficiencia energética 4x superior a las arquitecturas actuales basadas puramente en cobre.',
      'Disponibilidad comercial anunciada para despliegues empresariales este trimestre.'
    ],
    sources: ['IEEE Spectrum', 'Semiconductor Digest', 'Lab Report MIT'],
    impactScore: 'Alto',
    fullArticle: {
      tldr: 'Pruebas validadas confirman que el silicio fotónico ha superado los desafíos de estabilidad térmica a temperatura ambiente, permitiendo interconexiones casi instantáneas entre nodos de cómputo masivo.',
      deepDive: 'El informe publicado a las 03:15 UTC detalla cómo un equipo conjunto de Cambridge y empresas de semiconductores logró modular la luz para realizar multiplicaciones de matrices directamente en el plano óptico. Esto elimina el cuello de botella tradicional de memoria (Memory Wall).',
      takeaways: [
        'La densidad de cómputo en racks de servidores se cuadruplica sin elevar la factura eléctrica.',
        'Facilita el entrenamiento de modelos de contexto infinito sin degradación de velocidad de bus.',
        'Primeros kits de desarrollo listos para proveedores de nube a finales de año.'
      ],
      technicalDetails: 'Protocolo de modulación óptica en longitud de onda de 1550nm con latencia de interconexión sub-nanosegundo entre chips adyacentes.'
    }
  },
  {
    id: 'disp-140',
    windowLabel: 'Ventana 18:00 - 00:00 UTC (Ayer)',
    timeAgo: 'Hace 12 horas',
    readTime: '3 min de lectura',
    category: 'Open Source',
    title: 'Lanzamiento de motor de contexto de 10 Millones de tokens con compresión vectorial sin pérdidas',
    summary: 'Comunidad open-source libera biblioteca que permite procesar repositorios de software completos y bibliotecas jurídicas en memoria activa sin degradación semántica.',
    keyPoints: [
      'Algoritmo de atención sparse que escala linealmente en O(N) en lugar de O(N²).',
      'Integración nativa con Python, Rust y Node.js sin necesidad de drivers propietarios.',
      'Más de 8,000 estrellas en GitHub en sus primeras 4 horas de publicación.'
    ],
    sources: ['GitHub Trending', 'Hacker News', 'Hugging Face Spaces'],
    impactScore: 'Alto',
    fullArticle: {
      tldr: 'Se ha estandarizado una técnica de atención lineal que comprime el historial de atención mediante índices jerárquicos, permitiendo buscar información en millones de tokens en milisegundos.',
      deepDive: 'El proyecto, liberado a las 20:30 UTC, resuelve la "amnesia del contexto largo" mediante anclajes semánticos. Los desarrolladores pueden ahora cargar sistemas de información enteros en la ventana de contexto sin requerir bases de datos vectoriales externas para tareas de recuperación inmediata.',
      takeaways: [
        'Reduce la complejidad de arquitecturas RAG tradicionales al mantener el documento completo vivo.',
        'Disponible en Docker y listo para despliegues locales y autosuficientes.',
        'Probado exhaustivamente con la base de código del kernel Linux completa.'
      ],
      technicalDetails: 'Escrito en Rust con bindings PyO3. Soporta aceleración CUDA, ROCm y Metal (Apple Silicon).'
    }
  },
  {
    id: 'disp-139',
    windowLabel: 'Ventana 12:00 - 18:00 UTC (Ayer)',
    timeAgo: 'Hace 18 horas',
    readTime: '2 min de lectura',
    category: 'Regulación & Negocios',
    title: 'Alianza global establece estándar de auditoría de agentes de IA y certificación de autonomía',
    summary: 'Consorcio internacional de estándares ratifica las directrices de seguridad para agentes de software autónomos que ejecutan transacciones financieras y llamadas a APIs de infraestructura.',
    keyPoints: [
      'Requisito obligatorio de pistas de auditoría criptográficas para acciones de agentes autónomos.',
      'Protocolos de apagado de emergencia (kill-switch) estandarizados a nivel de socket.',
      'Acuerdo respaldado por los 12 mayores proveedores de infraestructura cloud.'
    ],
    sources: ['Reuters Tech', 'W3C Draft Protocol', 'Financial Conduct Authority'],
    impactScore: 'Moderado',
    fullArticle: {
      tldr: 'Se acordó el marco "AgentGuard", una especificación técnica abierta que define cómo los agentes de software deben autenticarse y firmar cada invocación externa para garantizar trazabilidad legal y técnica.',
      deepDive: 'La resolución elimina la incertidumbre regulatoria para empresas que estaban postergando el despliegue de agentes autónomos para compras corporativas o gestión de sistemas críticos. Al estandarizar los certificados de agente, las plataformas pueden revocar permisos al instante si se detecta comportamiento errático.',
      takeaways: [
        'Seguridad jurídica clara para startups que construyen flujos de trabajo basados en agentes.',
        'Integración prevista en los principales gateways de API para finales del próximo mes.',
        'No impone tarifas ni patentes; la especificación es completamente libre y abierta.'
      ],
      technicalDetails: 'Especificación basada en JSON-LD y firmas Ed25519 con verificación descentralizada en tiempo de petición.'
    }
  }
];

export const CYCLE_STAGES = [
  {
    step: '01',
    name: 'Rastreo Masivo 24/7',
    description: 'Monitoreo constante de más de 250 repositorios en GitHub, servidores de preprints en arXiv, Hugging Face, patentes y canales de investigación.'
  },
  {
    step: '02',
    name: 'Filtrado y Deduplicación',
    description: 'Eliminación del 92% del ruido publicitario, notas de prensa refritas y clickbait para retener únicamente avances técnicos verificables.'
  },
  {
    step: '03',
    name: 'Síntesis Rigurosa',
    description: 'Generación de resúmenes ejecutivos, análisis de impacto en la industria y extracción de puntos clave accionables para profesionales.'
  },
  {
    step: '04',
    name: 'Despacho Cada 6 Horas',
    description: 'Emisión puntual de 4 reportes diarios sincronizados con las ventanas horarias globales (00:00, 06:00, 12:00 y 18:00 UTC).'
  }
];

export const DISPATCH_WINDOWS = [
  { time: '00:00 UTC', localHint: 'Madrugada / Apertura Asia', status: 'Completado' },
  { time: '06:00 UTC', localHint: 'Apertura Europa / Mañana', status: 'Completado' },
  { time: '12:00 UTC', localHint: 'Mediodía Europa / Madrugada América', status: 'Último Despacho' },
  { time: '18:00 UTC', localHint: 'Cierre Mercados / Tarde América', status: 'Próxima Emisión' }
];

export const DELIVERY_CHANNELS = [
  {
    id: 'telegram',
    title: 'Bot de Telegram Oficial',
    description: 'Recibe una alerta silenciosa o prioritaria cada 6 horas con el formato Markdown compacto y enlaces directos a las fuentes.',
    badge: 'Más Popular',
    actionText: 'Conectar Telegram',
    iconName: 'Send'
  },
  {
    id: 'discord',
    title: 'Webhook de Discord',
    description: 'Envía los despachos directamente a un canal dedicado en tu servidor de Discord o comunidad tecnológica sin configurar bots pesados.',
    badge: 'Para Equipos',
    actionText: 'Configurar Webhook',
    iconName: 'MessageSquare'
  },
  {
    id: 'rss',
    title: 'Feed RSS / Atom Estructurado',
    description: 'Compatible con Feedly, Inoreader, NetNewsWire o lectores móviles para quienes prefieren su propio centro de lectura independiente.',
    badge: 'Estándar Abierto',
    actionText: 'Copiar Enlace RSS',
    iconName: 'Rss'
  },
  {
    id: 'email',
    title: 'Digest por Correo Electrónico',
    description: 'Un resumen limpio y legible en texto enriquecido sin publicidad ni rastreadores para tu bandeja de entrada cada 6 o 24 horas.',
    badge: 'Sin Distracciones',
    actionText: 'Suscribir Correo',
    iconName: 'Mail'
  }
];
