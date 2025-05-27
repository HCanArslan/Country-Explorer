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
      // Import Leaflet CSS first
      await import('leaflet/dist/leaflet.css')

      // Import Leaflet library
      const L = await import('leaflet')

      // Ensure L is properly available
      if (!L || !L.default) {
        throw new Error('Leaflet failed to load properly')
      }

      // Use the default export if available
      const LeafletLib = L.default || L

      // Fix for default marker icons in Leaflet - with proper error handling
      try {
        // Import marker images
        const iconRetinaUrl = await import('leaflet/dist/images/marker-icon-2x.png')
        const iconUrl = await import('leaflet/dist/images/marker-icon.png')
        const shadowUrl = await import('leaflet/dist/images/marker-shadow.png')

        // Check if Icon and Default exist before trying to configure
        if (LeafletLib?.Icon?.Default) {
          LeafletLib.Icon.Default.mergeOptions({
            iconRetinaUrl: iconRetinaUrl.default,
            iconUrl: iconUrl.default,
            shadowUrl: shadowUrl.default,
          })
        }
      } catch {
        // Continue without icons - this is not critical
      }

      // Make Leaflet globally available for compatibility
      if (typeof window !== 'undefined') {
        window.L = LeafletLib
      }

      // Return the Leaflet instance for use in other parts of the app
      return {
        provide: {
          leaflet: LeafletLib,
        },
      }
    } catch {
      // Don't throw here to prevent app from breaking
      return {
        provide: {
          leaflet: null,
        },
      }
    }
  }
})
