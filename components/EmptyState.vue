<template>
  <div
    v-if="!selectedCountry && !isLoading && countryOptions.length > 0"
    class="text-center py-12 sm:py-16"
  >
    <div class="max-w-md mx-auto">
      <UIcon
        name="i-heroicons-globe-alt"
        class="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4"
      />
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Select a Country
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Choose a country from the dropdown above to explore its details
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedCountry: string
  isLoading: boolean
  countryOptions: Array<{ label: string; value: string }>
}

defineProps<Props>()
</script>
