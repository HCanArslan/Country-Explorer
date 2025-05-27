// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false }, // Disable in production

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

  // HTML head configuration with performance optimizations
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
        },
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
        // Performance hints
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
        // Mobile-specific meta tags
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        // Cache busting
        { name: 'app-version', content: `v${Date.now()}` },
      ],
      link: [
        // DNS prefetch for external resources
        { rel: 'dns-prefetch', href: '//restcountries.com' },
        { rel: 'dns-prefetch', href: '//tile.openstreetmap.org' },
        { rel: 'dns-prefetch', href: '//majority.imgix.net' },
        // Preconnect for critical resources
        { rel: 'preconnect', href: 'https://restcountries.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://tile.openstreetmap.org', crossorigin: 'anonymous' },
        // Optimized favicons
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
        // Mobile-critical resources
        { rel: 'dns-prefetch', href: 'https://tile.openstreetmap.org' },
        { rel: 'dns-prefetch', href: 'https://restcountries.com' },
        // Mobile font optimization
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  // Enhanced Nitro configuration for performance
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
    minify: true,
    // Temporarily disable prerendering due to file URL issues
    // prerender: {
    //   routes: ['/'],
    //   crawlLinks: false,
    // },
  },

  // Enhanced build optimizations
  build: {
    transpile: [
      '@iconify/utils',
      '@vueuse/core',
      '@vue/shared',
      'consola',
      'defu',
      'h3',
      'ufo',
      'ofetch',
      'nitropack',
      '@vue-leaflet/vue-leaflet',
      'leaflet',
    ],
  },

  // Enhanced Vite optimizations
  vite: {
    build: {
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 1,
          unsafe_arrows: false,
          unsafe_methods: false,
          keep_fnames: true,
          keep_classnames: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Critical mobile chunks
            if (id.includes('leaflet') || id.includes('@vue-leaflet')) {
              return 'map-vendor'
            }

            // Defer non-critical chunks on mobile
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('nuxt')) {
                return 'vendor-core'
              }
              if (id.includes('@nuxt/ui') || id.includes('tailwindcss')) {
                return 'vendor-ui'
              }
              return 'vendor-utils'
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['@vueuse/core', '@vue/shared'],
    },
    define: {
      global: 'globalThis',
      __VUE_PROD_DEVTOOLS__: false,
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

  // Enhanced production settings
  ssr: true,
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
  },

  // Route rules for performance optimization - Temporarily disabled
  // routeRules: {
  //   // Homepage pre-rendered at build time
  //   '/': { prerender: true },
  //   // Country pages cached for 1 hour
  //   '/country/**': {
  //     headers: { 'Cache-Control': 's-maxage=3600' },
  //     prerender: false,
  //   },
  //   // API routes cached with CORS
  //   '/api/**': {
  //     cors: true,
  //     headers: {
  //       'Cache-Control': 's-maxage=60',
  //       'cache-control': 'max-age=300, stale-while-revalidate=60',
  //     },
  //   },
  //   // Aggressive caching for static assets
  //   '/_nuxt/**': {
  //     headers: {
  //       'cache-control': 'max-age=31536000, immutable',
  //       vary: 'Accept-Encoding',
  //     },
  //   },
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
