/** Auth for WhatsApp API → FAQ agent proxy (shared secret, never expose Gemini key). */
export function isWhatsappAgentAuthorized(request: Request): boolean {
  const expected =
    process.env.WHATSAPP_AGENT_SECRET
    || process.env.INTEGRATION_API_KEY
    || process.env.FAQ_AGENT_SECRET;

  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const apiKey = request.headers.get("x-api-key") || "";
  return bearer === expected || apiKey === expected;
}

export function resolveGoogleApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
    || process.env.GEMINI_API_KEY
    || process.env.GOOGLE_API_KEY
    || undefined
  );
}
