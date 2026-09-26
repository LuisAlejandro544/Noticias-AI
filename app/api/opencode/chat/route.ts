/**
 * Ruta de API Proxy Real para OpenCode Inference (/api/opencode/chat)
 * Comunica directamente con el endpoint oficial de OpenCode Zen:
 * https://opencode.ai/zen/v1/chat/completions
 *
 * Modelo: 'muse-spark-1.3-contributor-free'
 *
 * Si la API de OpenCode responde (éxito o error), se entrega la respuesta REAL
 * directamente devuelta por los servidores de OpenCode, sin respuestas estáticas de relleno.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      messages, 
      model = 'muse-spark-1.3-contributor-free', 
      apiKey: customApiKey,
      temperature = 0.3 
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'El campo "messages" es requerido y debe ser un array con al menos un mensaje.' },
        { status: 400 }
      );
    }

    // Obtener la API key proporcionada por el usuario (desde cabeceras, body o variable de entorno)
    const headerKey = req.headers.get('x-opencode-key');
    const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const activeApiKey = (headerKey || customApiKey || authHeader || process.env.OPENCODE_API_KEY || '').trim();

    const endpoint = 'https://opencode.ai/zen/v1/chat/completions';

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (activeApiKey) {
      requestHeaders['Authorization'] = `Bearer ${activeApiKey}`;
    }

    const payload = {
      model: model || 'muse-spark-1.3-contributor-free',
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.3,
      stream: false
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const openCodeRes = await fetch(endpoint, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseStatus = openCodeRes.status;
    const responseText = await openCodeRes.text();

    let responseJson: Record<string, unknown> | null = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = null;
    }

    // 1. Caso de Éxito de OpenCode (200 OK)
    if (openCodeRes.ok && responseJson) {
      const choices = responseJson.choices as Array<{ message?: { content?: string } }> | undefined;
      const content = choices?.[0]?.message?.content;

      if (content) {
        return NextResponse.json({
          success: true,
          model,
          message: content,
          rawUsage: responseJson.usage || null,
          source: 'opencode_live'
        });
      }
    }

    // 2. Caso de Error devuelto por la API de OpenCode
    // Extraer el mensaje exacto de error que devolvió OpenCode
    let errorMessage = `OpenCode devolvió error HTTP ${responseStatus}.`;
    
    if (responseJson && responseJson.error) {
      const errObj = responseJson.error as { message?: string; type?: string };
      if (errObj.message) {
        errorMessage = errObj.message;
      }
    } else if (responseText) {
      errorMessage = responseText.slice(0, 300);
    }

    return NextResponse.json({
      success: false,
      model,
      status: responseStatus,
      rawError: errorMessage,
      needsKey: !activeApiKey || responseStatus === 401 || responseStatus === 500,
      error: errorMessage
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error de conexión con OpenCode';
    return NextResponse.json(
      { 
        success: false,
        error: `Fallo de conexión de red hacia opencode.ai: ${errorMsg}` 
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
