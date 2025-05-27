export default defineNuxtPlugin(() => {
  // Mobile detection and optimization
  const isMobile = ref(false)

  function detectMobile() {
    if (import.meta.client) {
      isMobile.value =
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }

  // Mobile-specific optimizations
  function optimizeForMobile() {
    if (!isMobile.value) return

    // Reduce map tile quality on mobile
    const style = document.createElement('style')
    style.textContent = `
      .leaflet-tile {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      /* Reduce animations on mobile for better performance */
      @media (max-width: 768px) {
        * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        
        /* Optimize scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Reduce blur effects on mobile */
        .backdrop-blur-md {
          backdrop-filter: blur(4px) !important;
        }
      }
    `
    document.head.appendChild(style)

    // Preload critical mobile resources
    const preloadTile = document.createElement('link')
    preloadTile.rel = 'preload'
    preloadTile.href = 'https://a.tile.openstreetmap.org/2/1/1.png'
    preloadTile.as = 'image'
    document.head.appendChild(preloadTile)

    // Mobile-specific viewport optimization
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, maximum-scale=1',
      )
    }

    // Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true })
    document.addEventListener('touchmove', () => {}, { passive: true })
  }

  // Performance monitoring for mobile
  function monitorMobilePerformance() {
    if (!isMobile.value || !('PerformanceObserver' in window)) return

    // Monitor LCP specifically for mobile
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`📱 Mobile LCP: ${entry.startTime}ms`)

          // If LCP is too slow on mobile, try to optimize
          if (entry.startTime > 4000) {
            console.warn('🐌 Slow mobile LCP detected, applying emergency optimizations')

            // Disable non-critical animations
            const style = document.createElement('style')
            style.textContent = `
              * {
                animation: none !important;
                transition: none !important;
              }
            `
            document.head.appendChild(style)
          }
        }
      }
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }

  // Initialize mobile optimizations
  onMounted(() => {
    detectMobile()
    optimizeForMobile()
    monitorMobilePerformance()

    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        detectMobile()
        optimizeForMobile()
      }, 100)
    })

    // Listen for resize events
    window.addEventListener('resize', detectMobile)
  })

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('resize', detectMobile)
  })

  // Provide mobile state globally
  return {
    provide: {
      isMobile: readonly(isMobile),
    },
  }
})
