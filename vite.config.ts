import { fileURLToPath } from 'url';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'assets/**/*'],
        manifest: {
          id: '/',
          name: 'Fit Brilliance',
          short_name: 'FitBrilliance',
          description: 'منظومة Fit Brilliance للتحول المؤسسي والمهني والإنتاج السينمائي 4K برعاية كوتش سراج',
          theme_color: '#05080c',
          background_color: '#05080c',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/favicon.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/favicon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Use esbuild for faster, smaller minification
      minify: 'esbuild',
      cssMinify: true,
      // Reduce inline asset threshold (only inline tiny assets < 2KB)
      assetsInlineLimit: 2048,
      rollupOptions: {
        output: {
          // Aggressive manual chunking to minimize initial payload
          manualChunks(id) {
            // React core — loaded first
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            // Icons — separate chunk, loaded on demand
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            // Supabase — only loaded when auth/db is needed
            if (id.includes('node_modules/@supabase')) {
              return 'vendor-supabase';
            }
            // Forms — load on demand
            if (id.includes('ClientAssessmentForm') || id.includes('FreeConsultationForm') || id.includes('TeamApplicationForm')) {
              return 'chunk-forms';
            }
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
  };
});

