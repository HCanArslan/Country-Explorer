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

  css: ['~/assets/css/main.css'],

  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Simple head configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: 'Explore countries around the world with detailed information.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Simple Nitro configuration for Vercel
  nitro: {
    preset: 'vercel',
    compressPublicAssets: {
      gzip: false,
      brotli: false,
    },
    minify: false,
    routeRules: {
      '/api/_nuxt_icon/**': {
        headers: {
          'Content-Encoding': 'identity',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },

  // Simple build configuration
  build: {
    transpile: ['@vue-leaflet/vue-leaflet'],
  },

  // Simple Vite configuration
  vite: {
    build: {
      sourcemap: false,
    },
    define: {
      global: 'globalThis',
    },
    ssr: {
      noExternal: ['@vue-leaflet/vue-leaflet'],
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

  // Production settings
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
