<template>
  <div>
    <NuxtPage />
    <Analytics />
  </div>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue'

// Set meta tags for better mobile experience

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content:
        'Explore countries around the world with detailed information about capitals, populations, currencies, and languages.',
    },
  ],
  title: 'Country Explorer - Discover Countries Worldwide',
  script: [
    {
      innerHTML: `
        // Mobile map configuration for better performance
        window.__MOBILE_MAP_CONFIG__ = {
          maxZoom: 10,
          tileSize: 256,
          detectRetina: false,
          updateWhenIdle: true,
          keepBuffer: 1,
          // Additional performance settings
          preferCanvas: true,
          zoomSnap: 1,
          wheelDebounceTime: 100,
          inertiaMaxSpeed: 1500
        };
        
        // Detect mobile device for better optimization
        window.__IS_MOBILE__ = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      `,
      type: 'text/javascript',
    },
  ],
})
</script>
