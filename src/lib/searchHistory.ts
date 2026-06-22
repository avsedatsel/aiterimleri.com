// Kullanıcının il/ilçe arama geçmişi — localStorage tabanlı akıllı hatırlama
export const SEARCH_HISTORY_KEY = "sd_search_history";
export const MAX_HISTORY = 20;

export interface SearchEntry {
  il: string;
  ilce: string;
  timestamp: number;
}

// %70 eşiği: en çok kullanılan kombinasyon bu orana ulaşırsa otomatik doldurulur
const DOMINANT_RATIO = 0.7;

// Geçmişi localStorage'dan oku (bozuk veri durumunda boş döner)
export function readHistory(): SearchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is SearchEntry =>
        e && typeof e.il === "string" && typeof e.ilce === "string"
    );
  } catch {
    return [];
  }
}

// Yeni bir arama kaydı ekle; en fazla son MAX_HISTORY kayıt tutulur
export function recordSearch(il: string, ilce: string): void {
  if (typeof window === "undefined") return;
  if (!il || !ilce) return;
  try {
    const next = [...readHistory(), { il, ilce, timestamp: Date.now() }];
    const trimmed = next.slice(-MAX_HISTORY);
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Kota/erişim hatalarını sessizce geç
  }
}

// Açılışta önceden doldurulacak il/ilçe'yi hesapla:
// - Son 20 aramadaki en sık kombinasyon %70+ ise onu kullan
// - Aksi halde en son kullanılan il/ilçe
// - Geçmiş yoksa boş
export function suggestIlIlce(history: SearchEntry[]): { il: string; ilce: string } {
  const last = history.slice(-MAX_HISTORY);
  if (last.length === 0) return { il: "", ilce: "" };

  const counts = new Map<string, number>();
  for (const e of last) {
    const key = `${e.il}|${e.ilce}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let topKey = "";
  let topCount = 0;
  for (const [key, count] of counts) {
    if (count > topCount) {
      topCount = count;
      topKey = key;
    }
  }

  if (topCount / last.length >= DOMINANT_RATIO) {
    const [il, ilce] = topKey.split("|");
    return { il, ilce };
  }

  const recent = last[last.length - 1];
  return { il: recent.il, ilce: recent.ilce };
}
