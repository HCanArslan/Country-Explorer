<template>
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
                role="combobox"
                aria-expanded="false"
                aria-haspopup="listbox"
                aria-label="Search for a country"
                aria-describedby="search-hint"
                @focus="showDropdown = true"
                @blur="handleBlur"
                @input="handleInput"
                @keydown.escape="showDropdown = false"
                @keydown.arrow-down.prevent="showDropdown = true"
              />

              <!-- Clear Button -->
              <button
                v-if="searchQuery"
                class="absolute right-12 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Clear search"
                @click="clearSearch"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-gray-400" />
              </button>

              <!-- Dropdown Arrow -->
              <button
                class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label="Toggle country dropdown"
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
              <div
                class="max-h-64 overflow-y-auto custom-scrollbar"
                role="listbox"
                aria-label="Country options"
              >
                <button
                  v-for="country in filteredCountries"
                  :key="country.value"
                  class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 flex items-center space-x-3 group"
                  :aria-label="`Select ${country.label}`"
                  @click="selectCountry(country)"
                >
                  <div
                    class="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  ></div>
                  <span class="text-gray-900 dark:text-white font-medium">{{ country.label }}</span>
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
            <p id="search-hint" class="text-sm text-gray-500 dark:text-gray-400">
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
            <span class="text-gray-600 dark:text-gray-400 font-medium">Loading countries...</span>
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
            color="error"
            variant="soft"
            :title="'Failed to load countries'"
            :description="errorMessage"
            :actions="[
              {
                variant: 'solid',
                color: 'error',
                label: 'Retry',
                onClick: () => $emit('retry'),
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
        <div v-if="countryOptions.length > 0" class="mt-4 text-center">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
          >
            <UIcon name="i-heroicons-globe-alt" class="w-3 h-3 mr-1" />
            {{ countryOptions.length }} countries available
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Country {
  label: string
  value: string
}

interface Props {
  countryOptions: Country[]
  selectedCountry: string
  isLoading: boolean
  errorMessage: string | null
}

interface Emits {
  (e: 'country-selected', country: string): void
  (e: 'retry' | 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state
const searchQuery = ref<string>('')
const showDropdown = ref<boolean>(false)

// Computed
const filteredCountries = computed(() => {
  if (!searchQuery.value) {
    return props.countryOptions
  }
  return props.countryOptions.filter((country) =>
    country.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Methods
function selectCountry(country: Country) {
  emit('country-selected', country.value)
  searchQuery.value = country.label
  showDropdown.value = false
}

function clearSearch() {
  searchQuery.value = ''
  emit('country-selected', '')
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
</script>

<style scoped>
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
