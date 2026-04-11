/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gaId = env.VITE_GA_MEASUREMENT_ID

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-ga4',
        transformIndexHtml(html) {
          if (!gaId) {
            return html.replace(/\s*<!-- GA4-BEGIN -->[\s\S]*?<!-- GA4-END -->\s*/, '')
          }
          return html.replaceAll('__GA_MEASUREMENT_ID__', gaId)
        },
      },
    ],
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})
