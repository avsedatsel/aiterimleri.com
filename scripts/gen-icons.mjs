import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

// Drone (quadcopter) logosu — koyu zeminli, marka gradyanlı
function svg({ size, padding }) {
  const s = size;
  const r = Math.round(s * 0.22); // köşe yuvarlaklığı
  // İçerik güvenli alanı (maskable için padding'li)
  const inner = s * (1 - padding * 2);
  const ox = s * padding;
  const oy = s * padding;
  const cx = s / 2;
  const cy = s / 2;
  const armR = inner * 0.34; // pervane merkez mesafesi
  const propR = inner * 0.1; // pervane yarıçapı
  const bodyR = inner * 0.085;
  const stroke = Math.max(2, inner * 0.035);

  const props = [
    [cx - armR, cy - armR],
    [cx + armR, cy - armR],
    [cx - armR, cy + armR],
    [cx + armR, cy + armR],
  ];

  const arms = props
    .map(([px, py]) => `<line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" stroke="white" stroke-width="${stroke}" stroke-linecap="round"/>`)
    .join("");
  const circles = props
    .map(([px, py]) => `<circle cx="${px}" cy="${py}" r="${propR}" fill="none" stroke="white" stroke-width="${stroke}"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f1830"/>
        <stop offset="1" stop-color="#0a0c10"/>
      </linearGradient>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3b82f6"/>
        <stop offset="1" stop-color="#22d3ee"/>
      </linearGradient>
    </defs>
    <rect x="${ox}" y="${oy}" width="${inner}" height="${inner}" rx="${r}" fill="url(#bg)"/>
    <circle cx="${cx}" cy="${cy}" r="${inner * 0.42}" fill="none" stroke="url(#ring)" stroke-width="${stroke * 0.9}" opacity="0.35"/>
    ${arms}
    ${circles}
    <circle cx="${cx}" cy="${cy}" r="${bodyR}" fill="url(#ring)"/>
  </svg>`;
}

async function render(name, size, padding) {
  const buf = Buffer.from(svg({ size, padding }));
  await sharp(buf).png().toFile(join(outDir, name));
  console.log("yazıldı:", name);
}

await render("icon-192.png", 192, 0.0);
await render("icon-512.png", 512, 0.0);
await render("icon-maskable-512.png", 512, 0.14); // maskable güvenli alan
await render("apple-touch-icon.png", 180, 0.0);
console.log("Tüm ikonlar üretildi.");
