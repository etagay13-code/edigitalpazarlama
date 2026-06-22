"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Check, AlertCircle, X } from "lucide-react";

type ToastKind = "success" | "error";
type ToastItem = { id: number; kind: ToastKind; message: string };

type ToastApi = {
  toast: (opts: { kind?: ToastKind; message: string }) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastCtx = createContext<ToastApi>({
  toast: () => {},
  success: () => {},
  error: () => {},
});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback<ToastApi["toast"]>(
    ({ kind = "success", message }) => {
      const id = Date.now() + Math.random();
      setItems((t) => [...t, { id, kind, message }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove],
  );

  const success = useCallback((m: string) => toast({ kind: "success", message: m }), [toast]);
  const error = useCallback((m: string) => toast({ kind: "error", message: m }), [toast]);

  return (
    <ToastCtx.Provider value={{ toast, success, error }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-in pointer-events-auto flex items-start gap-3 rounded-xl border bg-ink-900/95 px-4 py-3 shadow-card backdrop-blur-md"
            style={{
              borderColor:
                t.kind === "success"
                  ? "rgba(52,211,153,0.3)"
                  : "rgba(244,63,94,0.3)",
            }}
          >
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                t.kind === "success"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {t.kind === "success" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
            </span>
            <p className="flex-1 text-sm leading-snug text-white/90">{t.message}</p>
            <button
              type="button"
              onClick={() => remove(t.id)}
              aria-label="Kapat"
              className="shrink-0 text-white/35 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
