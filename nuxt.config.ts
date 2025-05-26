// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils', '@nuxt/ui', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  // Optimize development experience
  nitro: {
    logLevel: 1, // Reduce nitro logging
  },

  // Suppress common warnings
  build: {
    transpile: ['@iconify/utils'],
  },

  // Optimize Vite for smoother development
  vite: {
    logLevel: 'warn', // Reduce vite logging
    build: {
      sourcemap: false, // Disable sourcemaps for faster builds
    },
    server: {
      hmr: {
        overlay: false, // Disable error overlay for cleaner experience
      },
    },
  },

  // Suppress Node.js deprecation warnings in development
  runtimeConfig: {
    public: {
      suppressWarnings: true,
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Optimize for interview demo
  ssr: true, // Enable SSR for better SEO
  experimental: {
    payloadExtraction: false, // Faster development builds
  },
})
