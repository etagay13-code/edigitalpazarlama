"use client";

import { useState } from "react";
import {
  Mail,
  MailOpen,
  Archive,
  ArchiveRestore,
  Trash2,
  Phone,
  AtSign,
  Briefcase,
  Calendar,
  Inbox,
} from "lucide-react";
import { markRead, archive, deleteMessage } from "./actions";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
};

export function MessageList({ messages }: { messages: Message[] }) {
  const [filter, setFilter] = useState<"inbox" | "archived">("inbox");
  const filtered = messages.filter((m) =>
    filter === "inbox" ? !m.is_archived : m.is_archived,
  );
  const unread = messages.filter((m) => !m.is_read && !m.is_archived).length;

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("inbox")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "inbox"
              ? "bg-white/10 text-white"
              : "text-white/55 hover:text-white"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Gelen
          {unread > 0 && (
            <span className="rounded-full bg-violet-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setFilter("archived")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "archived"
              ? "bg-white/10 text-white"
              : "text-white/55 hover:text-white"
          }`}
        >
          <Archive className="h-4 w-4" />
          Arşiv
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-white/45">
          {filter === "inbox"
            ? "Henüz yeni mesaj yok."
            : "Arşivde mesaj yok."}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(!message.is_read);
  const [processing, setProcessing] = useState(false);

  const handle = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setProcessing(true);
    const result = await fn();
    if (!result.ok) alert(result.error ?? "Hata");
    setProcessing(false);
  };

  const date = new Date(message.created_at);
  const dateStr = date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`card transition ${
        !message.is_read && !message.is_archived
          ? "border-violet-400/30 bg-violet-500/[0.04]"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-4 text-left"
      >
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            message.is_read
              ? "bg-white/[0.04] text-white/45"
              : "bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
          }`}
        >
          {message.is_read ? (
            <MailOpen className="h-4 w-4" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p
              className={`truncate font-medium ${
                message.is_read ? "text-white/85" : "text-white"
              }`}
            >
              {message.name}
            </p>
            <span className="shrink-0 text-xs text-white/40">{dateStr}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-white/55">
            {message.email}
            {message.service ? ` · ${message.service}` : ""}
          </p>
          {!expanded && (
            <p className="mt-2 truncate text-sm text-white/65">
              {message.message}
            </p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <a
              href={`mailto:${message.email}`}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white/75 transition hover:bg-white/[0.07]"
            >
              <AtSign className="h-4 w-4 text-violet-300" />
              {message.email}
            </a>
            {message.phone && (
              <a
                href={`tel:${message.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white/75 transition hover:bg-white/[0.07]"
              >
                <Phone className="h-4 w-4 text-violet-300" />
                {message.phone}
              </a>
            )}
            {message.service && (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white/75 sm:col-span-2">
                <Briefcase className="h-4 w-4 text-violet-300" />
                {message.service}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white/55 sm:col-span-2">
              <Calendar className="h-4 w-4 text-violet-300" />
              {dateStr}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
              {message.message}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.service ?? "Talebiniz"}`}
              className="btn-primary"
            >
              Yanıtla
            </a>
            <button
              type="button"
              onClick={() => handle(() => markRead(message.id, !message.is_read))}
              disabled={processing}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.07] disabled:opacity-50"
            >
              {message.is_read ? (
                <>
                  <Mail className="h-3.5 w-3.5" />
                  Okunmadı işaretle
                </>
              ) : (
                <>
                  <MailOpen className="h-3.5 w-3.5" />
                  Okundu işaretle
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                handle(() => archive(message.id, !message.is_archived))
              }
              disabled={processing}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.07] disabled:opacity-50"
            >
              {message.is_archived ? (
                <>
                  <ArchiveRestore className="h-3.5 w-3.5" />
                  Arşivden çıkar
                </>
              ) : (
                <>
                  <Archive className="h-3.5 w-3.5" />
                  Arşivle
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(`${message.name} kişisinin mesajı silinsin mi?`)
                ) {
                  handle(() => deleteMessage(message.id));
                }
              }}
              disabled={processing}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/65 transition hover:bg-rose-500/15 hover:text-rose-200 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Sil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
