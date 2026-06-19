// Form helper'ları — admin CRUD action'larında ortak yapı.

export function trimOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export function getStr(fd: FormData, key: string): string {
  return ((fd.get(key) as string | null) ?? "").trim();
}

export function getInt(fd: FormData, key: string, fallback = 0): number {
  const v = parseInt(getStr(fd, key), 10);
  return isNaN(v) ? fallback : v;
}

export function getArr(fd: FormData, key: string): string[] {
  const raw = getStr(fd, key);
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getBool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "true" || v === "on" || v === "1";
}
