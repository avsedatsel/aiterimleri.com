"use client";

import { useEffect } from "react";

/**
 * Video düzenleme onay modalı (bağımsız, kontrollü bileşen).
 *
 * VideoEditor içinde örnek kullanım:
 *
 *   const [editOpen, setEditOpen] = useState(false);
 *   const [editLoading, setEditLoading] = useState(false);
 *   const [noCredit, setNoCredit] = useState(false);
 *
 *   // "Videoyu Düzenle" butonu → setEditOpen(true)
 *
 *   <EditConfirmModal
 *     open={editOpen}
 *     mode={noCredit ? "insufficient" : "confirm"}
 *     loading={editLoading}
 *     onConfirm={async () => {
 *       setEditLoading(true);
 *       // orabura.com.tr/api/video-token/use'a mevcut token mantığıyla istek at
 *       const ok = await requestNewToken();
 *       setEditLoading(false);
 *       if (!ok) { setNoCredit(true); return; }   // yetersiz kredi → modal "insufficient" olur
 *       setEditOpen(false);
 *       regenerateVideo();                          // form sıfırlanmadan yeniden üret
 *     }}
 *     onCancel={() => { setEditOpen(false); setNoCredit(false); }}
 *   />
 */

const CREDIT_COST = 10;
const DASHBOARD_URL = "https://orabura.com.tr/dashboard";

interface EditConfirmModalProps {
  open: boolean;
  /** "confirm" → onay sorusu, "insufficient" → yetersiz kredi mesajı */
  mode?: "confirm" | "insufficient";
  /** Token isteği sürerken butonları kilitler */
  loading?: boolean;
  /** Tüketilecek kredi (varsayılan 10) */
  creditCost?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EditConfirmModal({
  open,
  mode = "confirm",
  loading = false,
  creditCost = CREDIT_COST,
  onConfirm,
  onCancel,
}: EditConfirmModalProps) {
  // Escape ile kapat (yükleme sırasında değil)
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const insufficient = mode === "insufficient";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      {/* Arka plan örtüsü */}
      <button
        type="button"
        aria-label="Kapat"
        onClick={() => !loading && onCancel()}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />

      {/* İçerik */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl">
        {insufficient ? (
          <>
            <h3 id="edit-modal-title" className="text-lg font-semibold text-foreground">
              Yeterli krediniz yok
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Yeterli krediniz yok. orabura.com.tr&apos;den kredi satın
              alabilirsiniz.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={DASHBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Kredi Satın Al
              </a>
              <button
                type="button"
                onClick={onCancel}
                className="flex h-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-sm font-medium text-foreground transition hover:opacity-90"
              >
                Kapat
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 id="edit-modal-title" className="text-lg font-semibold text-foreground">
              Yeni Video Oluşturulacak
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Düzenleme yapmak yeni bir video oluşturacak ve {creditCost} kredi
              tüketecektir. Devam etmek istiyor musunuz?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    İşleniyor...
                  </>
                ) : (
                  "Evet, Devam Et"
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-surface-2 text-sm font-medium text-foreground transition hover:opacity-90 disabled:opacity-70"
              >
                Hayır, İptal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
