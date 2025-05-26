<template>
  <header
    class="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            🌍 Country Explorer
          </h1>
          <p class="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Discover countries around the world
          </p>
        </div>

        <!-- Dark Mode Toggle -->
        <UButton
          :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          size="lg"
          class="shrink-0"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
          @click="toggleColorMode"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

// Computed
const isDark = computed(() => colorMode.value === 'dark')

// Methods
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
