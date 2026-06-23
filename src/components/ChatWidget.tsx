"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Sparkles, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict["chat"];
}) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Karşılama balonu — oturum başına bir kez, birkaç saniye sonra
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("edigital_chat_seen")) return;
    const t = setTimeout(() => setTeaser(true), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const openPanel = () => {
    setOpen(true);
    setTeaser(false);
    if (typeof window !== "undefined") sessionStorage.setItem("edigital_chat_seen", "1");
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, locale }),
      });
      if (!res.ok || !res.body) throw new Error("bad");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: dict.error };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: dict.error };
        return copy;
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const empty = messages.length === 0;

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[90] flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur">
                <Bot className="h-5 w-5 text-white" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">{dict.title}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  {dict.online}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {empty ? (
              <div>
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
                    <Sparkles className="h-4 w-4 text-white" />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/85">
                    {dict.greeting}
                    <span className="mt-1 block text-xs text-white/45">{dict.subtitleAsk}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {dict.suggested.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="group flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-left text-sm text-white/80 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
                    >
                      {q}
                      <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-violet-300" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "items-start gap-2.5"}`}
                >
                  {m.role === "assistant" && (
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
                      <Sparkles className="h-4 w-4 text-white" />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === "user"
                        ? "rounded-tr-sm bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
                        : "rounded-tl-sm border border-white/[0.07] bg-white/[0.04] text-white/85"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1">
                        <Dot /> <Dot /> <Dot />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-white/[0.06] p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.placeholder}
              className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 placeholder:text-white/35"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Gönder"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-glow transition hover:brightness-110 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Karşılama balonu */}
      {teaser && !open && (
        <button
          type="button"
          onClick={openPanel}
          className="fixed bottom-[5.5rem] right-4 z-[90] max-w-[15rem] rounded-2xl rounded-br-sm border border-white/10 bg-ink-900/95 px-4 py-3 text-left text-sm text-white/85 shadow-card backdrop-blur-xl sm:right-6"
        >
          {dict.greeting}
        </button>
      )}

      {/* Yüzen buton */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={dict.title}
        className="fixed bottom-5 right-4 z-[90] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-[0_10px_30px_-8px_rgba(124,92,255,0.7)] transition hover:scale-105 sm:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!open && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-ink-950 bg-emerald-400" />
        )}
      </button>
    </>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-duration:0.8s]" />;
}
