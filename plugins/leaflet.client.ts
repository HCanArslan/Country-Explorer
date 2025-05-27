import { defineNuxtPlugin } from '#app'

// Extend Window interface to include Leaflet
declare global {
  interface Window {
    L: typeof import('leaflet')
  }
}

export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (import.meta.client) {
    try {
      console.log('🍃 Initializing Leaflet plugin...')

      // Import Leaflet CSS first
      await import('leaflet/dist/leaflet.css')

      // Import Leaflet library
      const L = await import('leaflet')

      // Fix for default marker icons in Leaflet
      try {
        const iconRetinaUrl = await import('leaflet/dist/images/marker-icon-2x.png')
        const iconUrl = await import('leaflet/dist/images/marker-icon.png')
        const shadowUrl = await import('leaflet/dist/images/marker-shadow.png')

        // Configure default icon if available
        if (L?.Icon?.Default) {
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: iconRetinaUrl.default,
            iconUrl: iconUrl.default,
            shadowUrl: shadowUrl.default,
          })
        }
      } catch (iconError) {
        console.warn('⚠️ Could not load Leaflet icons:', iconError)
      }

      // Make Leaflet globally available for compatibility
      if (typeof window !== 'undefined') {
        window.L = L
      }

      console.log('✅ Leaflet plugin initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Leaflet plugin:', error)
    }
  }
})
