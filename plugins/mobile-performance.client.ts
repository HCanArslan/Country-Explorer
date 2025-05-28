export default defineNuxtPlugin(() => {
  // Only run on client side
  if (import.meta.server) return

  // Mobile performance optimizations
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )

  if (isMobile) {
    // Reduce animation duration for mobile
    document.documentElement.style.setProperty('--animation-duration', '200ms')
    
    // Optimize scroll behavior
    document.documentElement.style.scrollBehavior = 'auto'
    
    // Disable hover effects on mobile
    document.documentElement.classList.add('mobile-device')
    
    // Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true })
    document.addEventListener('touchmove', () => {}, { passive: true })
    
    // Preload critical resources
    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.href = 'https://restcountries.com/v3.1/all'
    preloadLink.as = 'fetch'
    preloadLink.crossOrigin = 'anonymous'
    document.head.appendChild(preloadLink)
    
    // Optimize images loading
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      img.loading = 'lazy'
      img.decoding = 'async'
    })
    
    // Reduce map quality on mobile
    window.__MOBILE_MAP_CONFIG__ = {
      tileSize: 256,
      zoomOffset: 0,
      detectRetina: false,
      maxZoom: 10,
    }
  }
  
  // Performance monitoring
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Monitor LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      // Log LCP for debugging (remove in production)
      if (import.meta.dev) {
        console.log('LCP:', lastEntry.startTime)
      }
    })
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // Fallback for browsers that don't support LCP
    }
    
    // Monitor CLS
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      
      // Log CLS for debugging (remove in production)
      if (import.meta.dev) {
        console.log('CLS:', clsValue)
      }
    })
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // Fallback for browsers that don't support CLS
    }
  }
})
