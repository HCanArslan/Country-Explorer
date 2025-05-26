<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header with Dark Mode Toggle -->
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

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <!-- Search Section -->
      <div class="mb-12 lg:mb-16">
        <div class="max-w-2xl mx-auto">
          <!-- Modern Search Input -->
          <div class="relative">
            <!-- Search Input Container -->
            <div v-if="!isLoading && !errorMessage" class="relative">
              <!-- Search Input Field -->
              <div class="relative group">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div
                  class="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl focus-within:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm"
                >
                  <!-- Search Icon -->
                  <div class="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                    <UIcon
                      name="i-heroicons-magnifying-glass"
                      class="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-200"
                    />
                  </div>

                  <!-- Input Field -->
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search for a country..."
                    class="w-full pl-14 pr-14 py-5 text-base sm:text-lg font-medium bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
                    @focus="showDropdown = true"
                    @blur="handleBlur"
                    @input="handleInput"
                  />

                  <!-- Clear Button -->
                  <button
                    v-if="searchQuery"
                    class="absolute right-12 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    @click="clearSearch"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-gray-400" />
                  </button>

                  <!-- Dropdown Arrow -->
                  <button
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    @click="toggleDropdown"
                  >
                    <UIcon
                      name="i-heroicons-chevron-down"
                      :class="[
                        'w-5 h-5 text-gray-400 dark:text-gray-500 transition-all duration-200',
                        showDropdown ? 'rotate-180 text-blue-500' : '',
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 transform scale-95 translate-y-2"
                enter-to-class="opacity-100 transform scale-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 transform scale-100 translate-y-0"
                leave-to-class="opacity-0 transform scale-95 translate-y-2"
              >
                <div
                  v-if="showDropdown && filteredCountries.length > 0"
                  class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm z-50 max-h-80 overflow-hidden"
                >
                  <!-- Dropdown Header -->
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ filteredCountries.length }} countries found
                    </p>
                  </div>

                  <!-- Countries List -->
                  <div class="max-h-64 overflow-y-auto custom-scrollbar">
                    <button
                      v-for="country in filteredCountries"
                      :key="country.value"
                      class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 flex items-center space-x-3 group"
                      @click="selectCountry(country)"
                    >
                      <div
                        class="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      ></div>
                      <span class="text-gray-900 dark:text-white font-medium">{{
                        country.label
                      }}</span>
                      <span class="text-gray-400 dark:text-gray-500 text-sm ml-auto">{{
                        country.value
                      }}</span>
                    </button>
                  </div>

                  <!-- No Results -->
                  <div
                    v-if="searchQuery && filteredCountries.length === 0"
                    class="px-4 py-8 text-center"
                  >
                    <UIcon
                      name="i-heroicons-magnifying-glass"
                      class="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2"
                    />
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      No countries found for "{{ searchQuery }}"
                    </p>
                  </div>
                </div>
              </Transition>

              <!-- Search Hint -->
              <div class="mt-3 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Type to search or click the arrow to browse all countries
                </p>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4">
              <div
                class="h-[60px] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl animate-pulse shadow-lg"
              ></div>
              <div class="flex items-center justify-center space-x-3 py-4">
                <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-blue-500" />
                <span class="text-gray-600 dark:text-gray-400 font-medium"
                  >Loading countries...</span
                >
              </div>
            </div>

            <!-- Error State -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 transform translate-y-2"
              enter-to-class="opacity-100 transform translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 transform translate-y-0"
              leave-to-class="opacity-0 transform translate-y-2"
            >
              <UAlert
                v-if="errorMessage && !isLoading"
                icon="i-heroicons-exclamation-triangle"
                color="red"
                variant="soft"
                :title="'Failed to load countries'"
                :description="errorMessage"
                :actions="[
                  {
                    variant: 'solid',
                    color: 'red',
                    label: 'Retry',
                    click: fetchCountries,
                  },
                ]"
                class="mt-4 rounded-xl"
              />
            </Transition>
          </div>

          <!-- Status -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2"
          >
            <div v-if="countryOptions.length > 0" class="mt-4 text-center space-y-3">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              >
                <UIcon name="i-heroicons-globe-alt" class="w-3 h-3 mr-1" />
                {{ countryOptions.length }} countries available
              </span>

              <!-- Debug Info -->
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Selected: {{ selectedCountry || 'None' }} | Cached:
                {{ countryOptions.length > 0 ? 'Yes' : 'No' }}
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-2 flex-wrap gap-2">
                <UButton size="xs" color="blue" variant="soft" @click="selectedCountry = 'US'">
                  Test: Select USA
                </UButton>
                <UButton size="xs" color="green" variant="soft" @click="selectedCountry = 'FR'">
                  Test: Select France
                </UButton>
                <UButton
                  size="xs"
                  color="gray"
                  variant="outline"
                  icon="i-heroicons-arrow-path"
                  @click="refreshCountries"
                >
                  Refresh Countries
                </UButton>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Country Details -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 transform translate-y-8 scale-95"
        enter-to-class="opacity-100 transform translate-y-0 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 transform translate-y-0 scale-100"
        leave-to-class="opacity-0 transform translate-y-8 scale-95"
      >
        <div v-if="selectedCountry" class="max-w-4xl mx-auto">
          <UCard
            class="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            <!-- Loading State -->
            <div v-if="isLoadingDetail" class="p-6 sm:p-8">
              <div class="flex items-center justify-center space-x-3 mb-8">
                <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-blue-500" />
                <span class="text-lg font-medium text-gray-600 dark:text-gray-400"
                  >Loading details...</span
                >
              </div>
              <div class="space-y-4">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-1/2"></div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="errorMessage && !isLoadingDetail" class="p-6 sm:p-8">
              <UAlert
                icon="i-heroicons-exclamation-triangle"
                color="red"
                variant="soft"
                :title="'Failed to load country details'"
                :description="errorMessage"
                :actions="[
                  {
                    variant: 'solid',
                    color: 'red',
                    label: 'Retry',
                    click: () => fetchCountryDetail(selectedCountry),
                  },
                ]"
                class="rounded-xl"
              />
            </div>

            <!-- Country Details Content -->
            <Transition
              enter-active-class="transition-all duration-400 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div v-if="countryDetail && !isLoadingDetail" class="p-6 sm:p-8">
                <!-- Header -->
                <div class="text-center mb-8 sm:mb-10">
                  <h2
                    class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6"
                  >
                    {{ countryDetail.name }}
                  </h2>
                  <div class="flex justify-center">
                    <div class="relative group">
                      <NuxtImg
                        :src="countryDetail.flag"
                        :alt="`${countryDetail.name} flag`"
                        class="w-20 h-14 sm:w-28 sm:h-20 lg:w-32 lg:h-24 object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                        loading="lazy"
                      />
                      <div
                        class="absolute inset-0 rounded-xl ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-400 dark:group-hover:ring-blue-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Details Grid -->
                <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                  <!-- Capital -->
                  <div
                    class="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-200 dark:border-blue-700/50"
                  >
                    <div class="flex items-center space-x-3 mb-3">
                      <div
                        class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      >
                        <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-white" />
                      </div>
                      <h3
                        class="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide"
                      >
                        Capital
                      </h3>
                    </div>
                    <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {{
                        countryDetail.capital.length > 0 ? countryDetail.capital.join(', ') : 'N/A'
                      }}
                    </p>
                  </div>

                  <!-- Population -->
                  <div
                    class="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-green-200 dark:border-green-700/50"
                  >
                    <div class="flex items-center space-x-3 mb-3">
                      <div
                        class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      >
                        <UIcon name="i-heroicons-users" class="w-5 h-5 text-white" />
                      </div>
                      <h3
                        class="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide"
                      >
                        Population
                      </h3>
                    </div>
                    <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {{ countryDetail.population.toLocaleString() }}
                    </p>
                  </div>

                  <!-- Currencies -->
                  <div
                    v-if="Object.keys(countryDetail.currencies).length > 0"
                    class="group bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-yellow-200 dark:border-yellow-700/50"
                  >
                    <div class="flex items-center space-x-3 mb-3">
                      <div
                        class="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      >
                        <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-white" />
                      </div>
                      <h3
                        class="text-sm font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide"
                      >
                        Currency
                      </h3>
                    </div>
                    <div class="space-y-1">
                      <span
                        v-for="(currency, code) in countryDetail.currencies"
                        :key="code"
                        class="block text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
                      >
                        {{ currency.name }} ({{ currency.symbol }})
                      </span>
                    </div>
                  </div>

                  <!-- Languages -->
                  <div
                    v-if="Object.keys(countryDetail.languages).length > 0"
                    class="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-purple-200 dark:border-purple-700/50"
                  >
                    <div class="flex items-center space-x-3 mb-3">
                      <div
                        class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      >
                        <UIcon name="i-heroicons-language" class="w-5 h-5 text-white" />
                      </div>
                      <h3
                        class="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide"
                      >
                        Languages
                      </h3>
                    </div>
                    <div class="space-y-1">
                      <span
                        v-for="(language, code) in countryDetail.languages"
                        :key="code"
                        class="inline-block text-lg sm:text-xl font-bold text-gray-900 dark:text-white mr-3"
                      >
                        {{ language }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Clear Selection Button -->
                <div class="mt-8 text-center">
                  <UButton
                    color="gray"
                    variant="soft"
                    size="lg"
                    icon="i-heroicons-x-mark"
                    class="rounded-xl"
                    @click="clearSelection"
                  >
                    Clear Selection
                  </UButton>
                </div>
              </div>
            </Transition>
          </UCard>
        </div>
      </Transition>

      <!-- Empty State -->
      <div
        v-if="!selectedCountry && !isLoading && countryOptions.length > 0"
        class="text-center py-12 sm:py-16"
      >
        <div class="max-w-md mx-auto">
          <UIcon
            name="i-heroicons-globe-alt"
            class="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4"
          />
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Select a Country
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Choose a country from the dropdown above to explore its details
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Powered by
            <a
              href="https://restcountries.com"
              target="_blank"
              class="text-blue-600 dark:text-blue-400 hover:underline"
              >REST Countries API</a
            >
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useCountryStore } from '~/stores/countryStore'

const colorMode = useColorMode()
const countryStore = useCountryStore()

// Local state
const selectedCountry = ref<string>('')
const searchQuery = ref<string>('')
const showDropdown = ref<boolean>(false)

// Use store state directly
const countryOptions = computed(() => countryStore.countryList)
const countryDetail = computed(() => countryStore.countryDetail)
const isLoading = computed(() => countryStore.isLoading)
const isLoadingDetail = computed(() => countryStore.isLoadingDetail)
const errorMessage = computed(() => countryStore.errorMessage)

// Computed
const isDark = computed(() => colorMode.value === 'dark')

// Filtered countries based on search query
const filteredCountries = computed(() => {
  if (!searchQuery.value) {
    return countryOptions.value
  }
  return countryOptions.value.filter((country) =>
    country.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Methods
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

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

// Search functionality methods
function selectCountry(country: { label: string; value: string }) {
  selectedCountry.value = country.value
  searchQuery.value = country.label
  showDropdown.value = false
}

function clearSearch() {
  searchQuery.value = ''
  selectedCountry.value = ''
  showDropdown.value = false
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleInput() {
  showDropdown.value = true
}

function handleBlur() {
  // Delay hiding dropdown to allow for clicks
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
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

/* Custom scrollbar for dropdown */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
</style>
