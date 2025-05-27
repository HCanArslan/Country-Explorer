export default defineNuxtPlugin(() => {
  // Ensure dark mode is properly applied on client side
  const colorMode = useColorMode()

  // Function to inject CSS styles directly
  const injectDarkModeStyles = () => {
    if (import.meta.client) {
      // Remove existing style tag if it exists
      const existingStyle = document.getElementById('force-dark-mode')
      if (existingStyle) {
        existingStyle.remove()
      }

      // Create new style tag with forced dark mode styles
      const style = document.createElement('style')
      style.id = 'force-dark-mode'
      style.textContent = `
        html.dark, html.dark body {
          background-color: #111827 !important;
          color: #f3f4f6 !important;
        }
        html.light, html.light body {
          background-color: #f9fafb !important;
          color: #111827 !important;
        }
        html.dark .min-h-screen {
          background-color: #111827 !important;
        }
        html.light .min-h-screen {
          background-color: #f9fafb !important;
        }
        html.dark header {
          background-color: rgba(31, 41, 55, 0.8) !important;
          border-color: #374151 !important;
        }
        html.light header {
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-color: #e5e7eb !important;
        }
        html.dark h1, html.dark h2, html.dark h3, html.dark p {
          color: #f3f4f6 !important;
        }
        html.light h1, html.light h2, html.light h3, html.light p {
          color: #111827 !important;
        }
        
        /* Country Details specific styles */
        html.dark .bg-white {
          background-color: #1f2937 !important;
        }
        html.light .bg-gray-800 {
          background-color: #ffffff !important;
        }
        
        /* Card backgrounds */
        html.dark [class*="bg-white"] {
          background-color: #1f2937 !important;
        }
        html.dark [class*="border-gray-200"] {
          border-color: #374151 !important;
        }
        html.light [class*="border-gray-700"] {
          border-color: #e5e7eb !important;
        }
        
        /* Gradient backgrounds for dark mode */
        html.dark [class*="from-blue-50"] {
          background: linear-gradient(to bottom right, rgba(30, 58, 138, 0.2), rgba(30, 64, 175, 0.2)) !important;
        }
        html.dark [class*="from-green-50"] {
          background: linear-gradient(to bottom right, rgba(20, 83, 45, 0.2), rgba(22, 101, 52, 0.2)) !important;
        }
        html.dark [class*="from-yellow-50"] {
          background: linear-gradient(to bottom right, rgba(146, 64, 14, 0.2), rgba(161, 98, 7, 0.2)) !important;
        }
        html.dark [class*="from-purple-50"] {
          background: linear-gradient(to bottom right, rgba(88, 28, 135, 0.2), rgba(107, 33, 168, 0.2)) !important;
        }
        
        /* Text colors in cards */
        html.dark [class*="text-blue-700"] {
          color: #93c5fd !important;
        }
        html.dark [class*="text-green-700"] {
          color: #86efac !important;
        }
        html.dark [class*="text-yellow-700"] {
          color: #fde047 !important;
        }
        html.dark [class*="text-purple-700"] {
          color: #c4b5fd !important;
        }
        
        /* Force all text elements with text-gray-900 to be white in dark mode */
        html.dark [class*="text-gray-900"] {
          color: #f3f4f6 !important;
        }
        html.dark .text-gray-900 {
          color: #f3f4f6 !important;
        }
        
        /* Force all span elements in country details to be white in dark mode */
        html.dark span.block,
        html.dark span.inline-block {
          color: #f3f4f6 !important;
        }
        
        /* Force all text in country detail cards */
        html.dark .bg-gradient-to-br span,
        html.dark .bg-gradient-to-br p {
          color: #f3f4f6 !important;
        }
        
        /* Specific targeting for currency and language text */
        html.dark [class*="from-yellow-50"] span,
        html.dark [class*="from-purple-50"] span {
          color: #f3f4f6 !important;
        }
        
        /* Border colors for cards */
        html.dark [class*="border-blue-200"] {
          border-color: rgba(59, 130, 246, 0.5) !important;
        }
        html.dark [class*="border-green-200"] {
          border-color: rgba(34, 197, 94, 0.5) !important;
        }
        html.dark [class*="border-yellow-200"] {
          border-color: rgba(234, 179, 8, 0.5) !important;
        }
        html.dark [class*="border-purple-200"] {
          border-color: rgba(168, 85, 247, 0.5) !important;
        }
        
        /* Ring colors for flag */
        html.dark [class*="ring-gray-200"] {
          --tw-ring-color: #4b5563 !important;
        }
        
        /* Loading skeleton backgrounds */
        html.dark [class*="bg-gray-200"] {
          background-color: #374151 !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  // Function to apply color mode classes
  const applyColorMode = (mode: string) => {
    if (import.meta.client) {
      const html = document.documentElement
      const body = document.body

      // Remove existing mode classes
      html.classList.remove('light', 'dark')
      body.classList.remove('light', 'dark')

      // Add the current mode class
      html.classList.add(mode)
      body.classList.add(mode)

      // Force a style recalculation
      html.style.colorScheme = mode

      // Inject CSS styles
      injectDarkModeStyles()

      // Force repaint
      void html.offsetHeight
    }
  }

  // Watch for color mode changes and apply to document
  watch(
    () => colorMode.value,
    (newMode) => {
      applyColorMode(newMode)
    },
    { immediate: true },
  )

  // Initial setup on mount
  if (import.meta.client) {
    // Apply immediately
    applyColorMode(colorMode.value)

    // Also apply after next tick to ensure DOM is ready
    nextTick(() => {
      applyColorMode(colorMode.value)
    })

    // Apply after a short delay to ensure everything is loaded
    setTimeout(() => {
      applyColorMode(colorMode.value)
    }, 100)

    // Apply after a longer delay to override any conflicting styles
    setTimeout(() => {
      applyColorMode(colorMode.value)
    }, 500)
  }
})
