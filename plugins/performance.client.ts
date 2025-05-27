export default defineNuxtPlugin(() => {
  // Preload critical resources
  if (import.meta.client) {
    // Preload map tiles for faster LCP
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = 'https://tile.openstreetmap.org/2/1/1.png'
    link.as = 'image'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)

    // Preload countries API data
    const apiLink = document.createElement('link')
    apiLink.rel = 'preload'
    apiLink.href = 'https://restcountries.com/v3.1/all?fields=name,cca2'
    apiLink.as = 'fetch'
    apiLink.crossOrigin = 'anonymous'
    document.head.appendChild(apiLink)

    // Optimize font loading
    const fontLink = document.createElement('link') as HTMLLinkElement
    fontLink.rel = 'preload'
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    fontLink.as = 'style'
    fontLink.addEventListener('load', function () {
      fontLink.rel = 'stylesheet'
    })
    document.head.appendChild(fontLink)

    // Performance observer for monitoring (silent)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            // LCP monitoring without console output
          }
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            // CLS monitoring without console output
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] })
    }

    // Intersection Observer for lazy loading optimization
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[data-src]').forEach((img) => {
          imageObserver.observe(img)
        })
      })
    }
  }
})
