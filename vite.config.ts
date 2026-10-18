import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => {
  // Sesuai deployment GitHub Pages pada URL:
  // https://esron-pasaribu.github.io/7kaihsmartai/
  // - Saat 'npm run build', base disetel ke '/7kaihsmartai/' agar seluruh berkas JS/CSS/gambar
  //   di dist/index.html merujuk ke path GitHub Pages yang benar (mencegah layar putih 404).
  // - Saat development dev server ('serve'), gunakan '/' agar dev server AI Studio berjalan normal.
  const isDev = command === 'serve';
  const base = process.env.VITE_BASE || (isDev ? '/' : '/7kaihsmartai/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
