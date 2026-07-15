// ============================================================
//  LECTOR SEGURO DE RECIBOS  —  Cloudflare Worker
//  Guarda tu clave de Anthropic escondida y lee los recibos.
//  La clave NO va aquí: se pone como "Secret" (ANTHROPIC_API_KEY)
//  en la configuración del Worker en Cloudflare.
// ============================================================

const ALLOWED_ORIGIN = "https://dannymillion91-dev.github.io";
const MODEL = "claude-haiku-4-5"; // barato y suficiente para leer recibos

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")
      return json({ error: "Método no permitido" }, 405, cors);

    try {
      const { image, mediaType, kind } = await request.json();
      if (!image) return json({ error: "No llegó ninguna imagen" }, 400, cors);

      const prompt =
        kind === "income"
          ? `Extrae de esta captura o extracto bancario y responde SOLO con JSON válido, sin ningún texto adicional: {"amount": número sin símbolo de moneda, "date": "YYYY-MM-DD", "concept": "descripción breve", "bank": "banco u origen"}. Si algún dato no se ve, usa null.`
          : `Extrae de este recibo de compra y responde SOLO con JSON válido, sin ningún texto adicional: {"amount": número total sin símbolo, "date": "YYYY-MM-DD", "store": "nombre de la tienda", "category": una de ["Mercado","Ropa","Mecatos","Suscripciones","Mantenimiento","Otro"], "concept": "descripción breve"}. Si algún dato no se ve, usa null.`;

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 512,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType || "image/jpeg",
                    data: image,
                  },
                },
                { type: "text", text: prompt },
              ],
            },
          ],
        }),
      });

      const data = await r.json();
      if (!r.ok)
        return json({ error: (data.error && data.error.message) || "Error de la IA" }, 502, cors);

      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      let parsed;
      try {
        const m = text.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(m ? m[0] : text);
      } catch (e) {
        return json({ error: "No se pudo interpretar el recibo. Usa el botón Manual." }, 200, cors);
      }
      return json(parsed, 200, cors);
    } catch (e) {
      return json({ error: String(e) }, 500, cors);
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}
