// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false }, // Disable in production

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/ui',
    // '@nuxt/image', // Temporarily disabled due to IPX initialization error
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

  // HTML head configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Explore countries around the world with detailed information and beautiful dark/light mode interface.',
        },
        { name: 'keywords', content: 'countries, explorer, geography, world, travel, information' },
        { name: 'author', content: 'Country Explorer App' },
        { property: 'og:title', content: 'Country Explorer' },
        { property: 'og:description', content: 'Discover countries around the world' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: 'https://majority.imgix.net/web-assets/favicons/favicon96.png?fit=crop&auto=format%2Ccompress&lossless=true&fm=png&q=50&w=16',
          sizes: '16x16',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: 'https://majority.imgix.net/web-assets/favicons/favicon96.png?fit=crop&auto=format%2Ccompress&lossless=true&fm=png&q=50&w=32',
          sizes: '32x32',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: 'https://majority.imgix.net/web-assets/favicons/favicon96.png?fit=crop&auto=format%2Ccompress&lossless=true&fm=png&q=50&w=96',
          sizes: '96x96',
        },
        // Fallback for older browsers
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: 'https://majority.imgix.net/web-assets/favicons/favicon96.png?fit=crop&auto=format%2Ccompress&lossless=true&fm=png&q=50&w=32',
        },
      ],
    },
  },

  // Production optimizations for Vercel
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
    minify: true,
  },

  // Build optimizations - Fixed for @nuxt/ui compatibility
  build: {
    transpile: [
      '@iconify/utils',
      '@vueuse/core',
      '@vue/shared',
      '@nuxt/ui',
      'consola',
      'defu',
      'h3',
      'ufo',
      'ofetch',
      'nitropack',
      '@vue-leaflet/vue-leaflet',
      // 'sharp', // Removed since @nuxt/image is disabled
    ],
  },

  // Vite optimizations for production - Simplified for better compatibility
  vite: {
    build: {
      sourcemap: false,
      minify: 'terser',
    },
    optimizeDeps: {
      include: ['@vueuse/core', '@vue/shared'],
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
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Production settings
  ssr: true,
  experimental: {
    payloadExtraction: false,
  },

  // Image optimization - Temporarily disabled due to IPX error
  // image: {
  //   quality: 80,
  //   format: ['webp', 'png'],
  //   screens: {
  //     xs: 320,
  //     sm: 640,
  //     md: 768,
  //     lg: 1024,
  //     xl: 1280,
  //     xxl: 1536,
  //   },
  //   // Disable IPX to fix the "Cannot access 'Fj' before initialization" error
  //   provider: 'none',
  //   // Alternative: use static provider for better compatibility
  //   // provider: 'static',
  // },

  // Fix for @nuxt/ui module import issues
  imports: {
    autoImport: true,
  },

  // Compatibility fixes
  typescript: {
    strict: false,
    typeCheck: false,
  },
})
