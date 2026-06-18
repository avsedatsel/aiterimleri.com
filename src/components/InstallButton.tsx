"use client";

import { useEffect, useState } from "react";

// beforeinstallprompt için minimal tip
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Zaten yüklü mü (standalone modda mı açılmış)?
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferred(null);
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleClick() {
    if (!deferred) {
      // Tarayıcı otomatik istemi vermiyorsa (ör. iOS) kısa yönerge göster
      alert(
        "Uygulamayı ana ekrana eklemek için tarayıcı menüsünden “Ana ekrana ekle” seçeneğini kullanın."
      );
      return;
    }
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  if (installed) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-medium text-foreground hover:bg-surface-2 active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
      </svg>
      <span className="hidden sm:inline">Uygulamayı İndir</span>
    </button>
  );
}
