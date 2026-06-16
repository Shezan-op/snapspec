import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getHtmlEntries() {
  const pages = {
    main: resolve(__dirname, 'index.html'),
  };
  
  // Find top-level HTML files
  const files = fs.readdirSync(__dirname);
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = file.replace(/\.html$/, '');
      pages[name] = resolve(__dirname, file);
    }
  }
  
  // Find preview.html files in demo subdirectories
  const demoDir = resolve(__dirname, 'demo');
  if (fs.existsSync(demoDir)) {
    const demos = fs.readdirSync(demoDir);
    for (const demo of demos) {
      const previewPath = resolve(demoDir, demo, 'preview.html');
      if (fs.existsSync(previewPath)) {
        pages[`demo/${demo}/preview`] = previewPath;
      }
    }
  }
  
  return pages;
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'PromptForge',
        short_name: 'PromptForge',
        description: 'Design to AI Prompt Generator',
        theme_color: '#F7F6F3',
        background_color: '#F7F6F3',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries()
    }
  },
  server: {
    proxy: {
      '/api/ollama-cloud': {
        target: 'https://ollama.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama-cloud/, '')
      }
    }
  }
});
