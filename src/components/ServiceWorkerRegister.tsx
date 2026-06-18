"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Sayfa yüklendikten sonra kaydet (performansı etkilememesi için)
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // Kayıt başarısız olursa sessizce geç
        });
      });
    }
  }, []);

  return null;
}
