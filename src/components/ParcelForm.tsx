"use client";

import { useEffect, useState } from "react";
import { PROVINCES } from "@/lib/provinces";
import { readHistory, recordSearch, suggestIlIlce } from "@/lib/searchHistory";

interface ParcelInput {
  il: string;
  ilce: string;
  mahalle: string;
  ada: string;
  parsel: string;
}

// İlk açılışta tüm alanlar boş (hidrasyon uyumu için sunucuda da boş)
const EMPTY: ParcelInput = {
  il: "",
  ilce: "",
  mahalle: "",
  ada: "",
  parsel: "",
};

export default function ParcelForm() {
  const [form, setForm] = useState<ParcelInput>(EMPTY);
  const [loading, setLoading] = useState(false);

  // Açılışta geçmişe göre il/ilçe öner; köy/mahalle, ada, parsel her zaman boş
  useEffect(() => {
    const { il, ilce } = suggestIlIlce(readHistory());
    if (il || ilce) {
      setForm((prev) => ({ ...prev, il, ilce }));
    }
  }, []);

  function update<K extends keyof ParcelInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Başarılı parsel sorgulama sonrası il/ilçe'yi geçmişe kaydet
    recordSearch(form.il, form.ilce);
    // Faz 1: TKGM sorgusu henüz bağlı değil — sadece durum gösteriliyor.
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-foreground placeholder:text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-muted";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="il" className={labelClass}>İl</label>
        <select
          id="il"
          value={form.il}
          onChange={(e) => update("il", e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            İl seçin
          </option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ilce" className={labelClass}>İlçe</label>
          <input
            id="ilce"
            value={form.ilce}
            onChange={(e) => update("ilce", e.target.value)}
            placeholder="ör. Gökçeada"
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="mahalle" className={labelClass}>Köy / Mahalle</label>
          <input
            id="mahalle"
            value={form.mahalle}
            onChange={(e) => update("mahalle", e.target.value)}
            placeholder="ör. Çınarlı"
            className={inputClass}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ada" className={labelClass}>Ada No</label>
          <input
            id="ada"
            value={form.ada}
            onChange={(e) => update("ada", e.target.value)}
            placeholder="ör. 193"
            inputMode="numeric"
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="parsel" className={labelClass}>Parsel No</label>
          <input
            id="parsel"
            value={form.parsel}
            onChange={(e) => update("parsel", e.target.value)}
            placeholder="ör. 61"
            inputMode="numeric"
            className={inputClass}
            autoComplete="off"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 text-base font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.99] disabled:opacity-70"
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Sorgulanıyor...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            Sorgula
          </>
        )}
      </button>
    </form>
  );
}
