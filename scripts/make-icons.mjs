// Erzeugt die App-Icons (PNG) ohne externe Abhängigkeiten.
// Motiv: weißes "Karten"-Quadrat mit drei aufsteigenden Balken (= LevelUp / Entwicklung)
// auf brand-blauem Hintergrund.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const BRAND = [37, 99, 235]; // #2563eb
const WHITE = [255, 255, 255];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // raw scanlines with filter byte 0 prefix
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < size; x++) {
      const p = (y * size + x) * 4;
      const o = rowStart + 1 + x * 4;
      raw[o] = pixels[p];
      raw[o + 1] = pixels[p + 1];
      raw[o + 2] = pixels[p + 2];
      raw[o + 3] = pixels[p + 3];
    }
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function render(size) {
  const px = Buffer.alloc(size * size * 4);
  const set = (x, y, [r, g, b], a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const o = (y * size + x) * 4;
    px[o] = r;
    px[o + 1] = g;
    px[o + 2] = b;
    px[o + 3] = a;
  };

  // Hintergrund: brand blau
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) set(x, y, BRAND);

  // Weiße Karte (abgerundetes Quadrat)
  const m = Math.round(size * 0.2);
  const r = Math.round(size * 0.09);
  const x0 = m, y0 = m, x1 = size - m, y1 = size - m;
  const inRounded = (x, y) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
    const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inRounded(x, y)) set(x, y, WHITE);

  // Drei aufsteigende Balken
  const innerW = x1 - x0;
  const baseY = y1 - Math.round(size * 0.07);
  const barW = Math.round(innerW * 0.16);
  const gap = Math.round(innerW * 0.1);
  const startX = x0 + Math.round(innerW * 0.13);
  const heights = [0.18, 0.3, 0.42].map((h) => Math.round(size * h));
  heights.forEach((h, i) => {
    const bx = startX + i * (barW + gap);
    for (let y = baseY - h; y <= baseY; y++)
      for (let x = bx; x <= bx + barW; x++) set(x, y, BRAND);
  });

  return encodePng(size, px);
}

mkdirSync("public", { recursive: true });
const targets = [
  ["public/icon-512.png", 512],
  ["public/icon-192.png", 192],
  ["public/apple-touch-icon.png", 180],
];
for (const [file, size] of targets) {
  writeFileSync(file, render(size));
  console.log("erzeugt:", file, `${size}x${size}`);
}
