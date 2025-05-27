// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false }, // Disable in production

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/ui',
    // Conditionally load @nuxt/image only in production to avoid Sharp issues
    ...(process.env.NODE_ENV === 'production' ? ['@nuxt/image'] : []),
    '@nuxt/test-utils',
  ],

  css: ['~/assets/css/main.css'],

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
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Production optimizations for Vercel
  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
    compressPublicAssets: true,
    minify: true,
    experimental: {
      wasm: true,
    },
    // Force bundle all dependencies to avoid module resolution issues
    noExternals: true,
    // Additional Vercel-specific configuration
    ...(process.env.NITRO_PRESET === 'vercel' && {
      rollupConfig: {
        external: [],
      },
    }),
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
      // Only transpile sharp in production when @nuxt/image is loaded
      ...(process.env.NODE_ENV === 'production' ? ['sharp'] : []),
    ],
  },

  // Vite optimizations for production - Fixed module resolution
  vite: {
    build: {
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        external: ['@nuxt/kit'],
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['@vueuse/core', '@vue/shared'],
      // Only exclude sharp in development
      exclude: process.env.NODE_ENV === 'development' ? ['sharp'] : [],
    },
    resolve: {
      alias: {
        '@nuxt/kit': '@nuxt/kit/dist/index.mjs',
      },
    },
    define: {
      global: 'globalThis',
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

  // Image optimization - Only enabled in production
  ...(process.env.NODE_ENV === 'production' && {
    image: {
      quality: 80,
      format: ['webp', 'png'],
      screens: {
        xs: 320,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1536,
      },
      provider: 'ipx',
    },
  }),

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
