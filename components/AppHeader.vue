<template>
  <header
    role="banner"
    class="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Brand Section -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- Logo/Icon -->
          <div
            class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            aria-hidden="true"
          >
            <span class="text-xl sm:text-2xl">🌍</span>
          </div>

          <!-- Brand Text -->
          <div class="flex flex-col">
            <h1
              class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-none"
            >
              Country Explorer
            </h1>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Theme Toggle -->
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            size="lg"
            variant="ghost"
            color="neutral"
            class="relative group rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleColorMode"
          >
            <!-- Animated background -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
          </UButton>

          <!-- Optional: Add more action buttons here -->
          <!-- Example: Search, Menu, Profile, etc. -->
        </div>
      </div>
    </div>

    <!-- Enhanced loading indicator -->
    <div
      v-if="isLoading"
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"
      aria-hidden="true"
    />
  </header>
</template>

<script setup lang="ts">
// Props (for future extensibility)
interface Props {
  isLoading?: boolean
  showSearch?: boolean
  showMenu?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  showSearch: false,
  showMenu: false,
})

// Use Nuxt UI's color mode composable
const colorMode = useColorMode()

// Computed properties
const isDark = computed(() => colorMode.value === 'dark')

// Enhanced theme toggle with better UX
function toggleColorMode() {
  const newMode = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = newMode

  // Enhanced client-side handling with smooth transitions
  if (import.meta.client) {
    const html = document.documentElement
    const body = document.body

    // Add transition class for smooth color changes
    html.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    body.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'

    // Remove existing mode classes
    html.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Add new mode class
    html.classList.add(newMode)
    body.classList.add(newMode)

    // Set color scheme for better browser integration
    html.style.colorScheme = newMode

    // Provide haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }

    // Force repaint for immediate visual feedback
    void html.offsetHeight

    // Clean up transition styles after animation
    setTimeout(() => {
      html.style.transition = ''
      body.style.transition = ''
    }, 300)
  }
}

// Enhanced accessibility
onMounted(() => {
  // Add keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
  if (import.meta.client) {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault()
        toggleColorMode()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    // Cleanup
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })
  }
})
</script>

<style scoped>
/* Enhanced animations and micro-interactions */
.group:hover .absolute {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* Smooth focus transitions */
button:focus-visible {
  outline: none;
  transform: scale(1.05);
}

/* Enhanced backdrop blur support */
@supports (backdrop-filter: blur(24px)) {
  header {
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(24px)) {
  header {
    background-color: rgba(255, 255, 255, 0.95);
  }

  .dark header {
    background-color: rgba(17, 24, 39, 0.95);
  }
}

/* Enhanced mobile touch targets */
@media (max-width: 640px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  header {
    border-bottom-width: 2px;
  }

  .bg-gradient-to-br {
    background: #0066cc;
  }
}
</style>
