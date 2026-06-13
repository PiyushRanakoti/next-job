import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';
import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()];

  if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import('@replit/vite-plugin-cartographer');
    plugins.push(cartographer());
  }

  return {
    plugins,
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      allowedHosts: true,
      port: 5000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    base: process.env.BASE_PATH ?? '/',
    build: {
      outDir: 'dist/public',
      emptyOutDir: true,
    },
  };
});
