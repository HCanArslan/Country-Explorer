// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css', '~/assets/css/mobile-performance.css'],

  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Optimized head configuration for mobile performance
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        {
          name: 'description',
          content: 'Explore countries around the world with detailed information.',
        },
        // Performance hints
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Preconnect to external domains for faster loading
        { rel: 'preconnect', href: 'https://restcountries.com' },
        { rel: 'preconnect', href: 'https://a.tile.openstreetmap.org' },
        { rel: 'preconnect', href: 'https://b.tile.openstreetmap.org' },
        { rel: 'preconnect', href: 'https://c.tile.openstreetmap.org' },
        { rel: 'dns-prefetch', href: 'https://tile.openstreetmap.org' },
      ],
    },
  },

  // Optimized Nitro configuration for mobile performance
  nitro: {
    preset: 'vercel',
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    minify: true,
    routeRules: {
      // Static assets with long cache
      '/favicon.ico': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      // API routes with shorter cache
      '/api/**': {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=3600',
          'Content-Encoding': 'identity',
        },
      },
      // Icon API specific handling
      '/api/_nuxt_icon/**': {
        headers: {
          'Content-Encoding': 'identity',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
      // Main pages with ISR
      '/': { isr: 3600 },
      '/country/**': { isr: 3600 },
    },
  },

  // Optimized build configuration for mobile performance
  build: {
    transpile: ['@vue-leaflet/vue-leaflet'],
  },

  // Optimized Vite configuration for mobile performance
  vite: {
    build: {
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            leaflet: ['leaflet', '@vue-leaflet/vue-leaflet'],
            vendor: ['vue', 'vue-router', '@vueuse/core'],
          },
        },
      },
    },
    define: {
      global: 'globalThis',
    },
    ssr: {
      noExternal: ['@vue-leaflet/vue-leaflet'],
    },
    optimizeDeps: {
      include: ['leaflet', '@vue-leaflet/vue-leaflet'],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'https://restcountries.com/v3.1',
    },
  },

  // Color mode configuration
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  // Production settings optimized for mobile
  ssr: true,
  experimental: {
    payloadExtraction: false,
  },

  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false,
  },
})
