import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledge } from "@/lib/chat/knowledge";
import { asLocale, type Locale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Maliyet: varsayılan Opus 4.8. Ucuzlatmak için CHAT_MODEL=claude-haiku-4-5
const MODEL = process.env.CHAT_MODEL || "claude-opus-4-8";
const MAX_MESSAGES = 16;
const MAX_CHARS = 1500;

const LANG_NAME: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
};

function systemPrompt(locale: Locale, knowledge: string) {
  const lang = LANG_NAME[locale];
  return [
    {
      type: "text" as const,
      text:
        `You are the friendly virtual assistant for the digital marketing agency "True EDigital Marketing".\n` +
        `Always reply in ${lang}. Be warm, concise and helpful — short paragraphs, no preamble like "Sure" or "Of course".\n` +
        `Answer ONLY using the AGENCY KNOWLEDGE below. If the answer is not there, say you don't have that detail and suggest contacting the team (the contact page or the email in the knowledge). Never invent prices, guarantees, or facts.\n` +
        `Encourage booking a free discovery call when relevant. Keep answers under ~120 words unless the user asks for detail.`,
    },
    {
      type: "text" as const,
      text: `AGENCY KNOWLEDGE:\n${knowledge}`,
      cache_control: { type: "ephemeral" as const },
    },
  ];
}

type InMsg = { role?: string; content?: unknown };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("AI not configured", { status: 503 });
  }

  let body: { messages?: InMsg[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const locale = asLocale(body.locale);
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: (m.content as string).slice(0, MAX_CHARS),
    }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response("No user message", { status: 400 });
  }

  const knowledge = await buildKnowledge(locale);
  const client = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const ms = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: systemPrompt(locale, knowledge),
          messages,
        });
        for await (const event of ms) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("chat error", err);
        controller.enqueue(encoder.encode(" "));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
