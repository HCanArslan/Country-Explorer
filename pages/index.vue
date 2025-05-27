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
    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <!-- Search and Map Section - Side by Side -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Left Column - Search Component -->
        <div>
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-full"
          >
            <div class="p-4 lg:p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Country Search
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Search and explore countries worldwide
                  </p>
                </div>
                <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-blue-500" />
              </div>

              <CountrySearch
                :country-options="countryOptions"
                :selected-country="selectedCountry"
                :is-loading="isLoading"
                :error-message="errorMessage"
                @country-selected="handleCountrySelected"
                @retry="fetchCountries"
                @refresh="refreshCountries"
              />

              <!-- Empty State Content (when no country selected) -->
              <div
                v-if="!selectedCountry && !isLoading && countryOptions.length > 0"
                class="text-center py-8 mt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <UIcon
                  name="i-heroicons-globe-alt"
                  class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3"
                />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Country
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Choose a country from the dropdown above to explore its details
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Interactive Map -->
        <div>
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-full"
          >
            <div class="p-4 lg:p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Interactive World Map
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click on any country to explore
                  </p>
                </div>
                <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-blue-500" />
              </div>

              <!-- Map Component -->
              <div
                class="h-[350px] lg:h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <ClientOnly>
                  <InteractiveMap
                    height="100%"
                    :initial-zoom="2"
                    :initial-center="[20, 0]"
                    @country-selected="handleMapCountrySelected"
                  />
                  <template #fallback>
                    <div
                      class="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700"
                    >
                      <div class="text-center">
                        <div
                          class="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
                        ></div>
                        <p class="text-gray-600 dark:text-gray-400">Loading map...</p>
                      </div>
                    </div>
                  </template>
                </ClientOnly>
              </div>

              <!-- Map Instructions -->
              <div class="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cursor-arrow-rays" class="w-3 h-3 mr-1" />
                  <span>Click countries</span>
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-magnifying-glass-plus" class="w-3 h-3 mr-1" />
                  <span>Zoom</span>
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-hand-raised" class="w-3 h-3 mr-1" />
                  <span>Drag</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Country Details Section - Full Width Below -->
      <div class="mt-8">
        <CountryDetails
          :selected-country="selectedCountry"
          :country-detail="countryDetail"
          :is-loading-detail="isLoadingDetail"
          :error-message="errorMessage"
          @retry="() => fetchCountryDetail(selectedCountry)"
          @clear-selection="clearSelection"
        />
      </div>
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

function handleMapCountrySelected(countryData: {
  name?: { common?: string }
  cca2?: string
  cca3?: string
}) {
  // Extract country code from the map selection
  // The map component provides country data, we need to extract the ISO code
  if (countryData?.cca2) {
    selectedCountry.value = countryData.cca2
  } else if (countryData?.name?.common) {
    // If no ISO code, try to find the country by name in our options
    const foundCountry = countryOptions.value.find(
      (country) => country.label.toLowerCase() === countryData.name?.common?.toLowerCase(),
    )
    if (foundCountry) {
      selectedCountry.value = foundCountry.value
    }
  }
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
