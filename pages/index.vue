<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Skip Navigation Link -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>

    <!-- Header Component -->
    <AppHeader />

    <!-- Main Content -->
    <main id="main-content" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <!-- Search Component -->
      <CountrySearch
        :country-options="countryOptions"
        :selected-country="selectedCountry"
        :is-loading="isLoading"
        :error-message="errorMessage"
        @country-selected="handleCountrySelected"
        @retry="fetchCountries"
        @refresh="refreshCountries"
      />

      <!-- Country Details Component -->
      <CountryDetails
        :selected-country="selectedCountry"
        :country-detail="countryDetail"
        :is-loading-detail="isLoadingDetail"
        :error-message="errorMessage"
        @retry="() => fetchCountryDetail(selectedCountry)"
        @clear-selection="clearSelection"
      />

      <!-- Empty State Component -->
      <EmptyState
        :selected-country="selectedCountry"
        :is-loading="isLoading"
        :country-options="countryOptions"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useCountryStore } from '~/stores/countryStore'

const countryStore = useCountryStore()

// Local state
const selectedCountry = ref<string>('')

// Use store state directly
const countryOptions = computed(() => countryStore.countryList)
const countryDetail = computed(() => countryStore.countryDetail)
const isLoading = computed(() => countryStore.isLoading)
const isLoadingDetail = computed(() => countryStore.isLoadingDetail)
const errorMessage = computed(() => countryStore.errorMessage)

// Methods
function clearSelection() {
  selectedCountry.value = ''
  countryStore.selectedCountry = null
  countryStore.countryDetail = null
}

async function fetchCountries() {
  await countryStore.fetchCountries()
}

async function fetchCountryDetail(code: string) {
  await countryStore.fetchCountryDetail(code)
}

// Add refresh functionality to clear cache and refetch
async function refreshCountries() {
  countryStore.clearCountriesCache()
  await countryStore.fetchCountries()
}

// Event handlers
function handleCountrySelected(countryCode: string) {
  selectedCountry.value = countryCode
}

// Watchers
watch(selectedCountry, async (newCountry) => {
  countryStore.selectedCountry = newCountry
  if (newCountry) {
    await fetchCountryDetail(newCountry)
  }
})

onMounted(async () => {
  await fetchCountries()
})
</script>

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ensure smooth color mode transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced dark mode transitions */
html {
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optimize image loading and transforms */
img {
  will-change: transform;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}

.dark ::-webkit-scrollbar-track {
  background-color: #1f2937;
}

::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
</style>
