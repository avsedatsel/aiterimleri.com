"use client";

import { useState } from "react";

// Azure TTS kalibrasyon testi sonucu: ~22 karakter / saniye
const CHARS_PER_SECOND = 22;
// 60 sn için ~1320 karakter + tolerans
const MAX_LENGTH = 1400;

// Karakter sayısına göre renk kodu
function colorFor(count: number): string {
  if (count <= 660) return "text-green-400"; // 0-30 sn
  if (count <= 990) return "text-blue-400"; // 31-45 sn
  if (count <= 1320) return "text-yellow-400"; // 46-60 sn
  return "text-red-400"; // 60+ sn
}

export default function ContentPanel() {
  const [text, setText] = useState("");

  const count = text.length;
  const seconds = Math.round(count / CHARS_PER_SECOND);
  const color = colorFor(count);
  const tooLong = count >= 1321;

  const labelClass = "mb-1.5 block text-sm font-medium text-muted";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="seslendirme" className={labelClass}>
        Seslendirme Metni
      </label>
      <textarea
        id="seslendirme"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={6}
        placeholder="Seslendirme metnini girin... (max ~1320 karakter = 60 saniyelik video)"
        className="w-full resize-y rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-foreground placeholder:text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />

      {/* Canlı karakter sayacı ve video süre tahmini */}
      <div className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm font-medium ${color}`}>
        <span>{count} karakter</span>
        <span>Videonuz yaklaşık {seconds} saniye olacak</span>
      </div>

      {tooLong && (
        <p className="text-sm font-medium text-red-400">
          ⚠ Metin çok uzun, 60 saniyeyi aşacak
        </p>
      )}
    </div>
  );
}
