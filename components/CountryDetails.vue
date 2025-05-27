<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform translate-y-4"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-4"
  >
    <div v-if="selectedCountry" class="max-w-4xl mx-auto">
      <!-- Clean Modern Card with Minimalist Shadow -->
      <UCard
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-300/60 dark:hover:shadow-black/30 transition-all duration-300"
      >
        <!-- Loading State -->
        <div v-if="isLoadingDetail" class="p-8 sm:p-12">
          <div class="flex items-center justify-center space-x-3 mb-8">
            <div
              class="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"
            ></div>
            <span class="text-lg font-medium text-gray-600 dark:text-gray-400"
              >Loading details...</span
            >
          </div>

          <!-- Clean Loading Skeletons -->
          <div class="space-y-4">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-1/2"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage && !isLoadingDetail" class="p-8 sm:p-12">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="soft"
            :title="'Failed to load country details'"
            :description="errorMessage"
            :actions="[
              {
                variant: 'solid',
                color: 'error',
                label: 'Retry',
                onClick: () => $emit('retry'),
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
          <div v-if="countryDetail && !isLoadingDetail" class="p-8 sm:p-12">
            <!-- Screen reader announcement -->
            <div aria-live="polite" class="sr-only">
              Country details for {{ countryDetail.name }} have been loaded
            </div>

            <!-- Clean Header -->
            <div class="text-center mb-10 sm:mb-12">
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8"
              >
                {{ countryDetail.name }}
              </h2>

              <!-- Simple Flag Container with Elegant Shadow -->
              <div class="flex justify-center">
                <div class="relative group">
                  <img
                    :src="countryDetail.flag"
                    :alt="`${countryDetail.name} flag`"
                    class="w-24 h-16 sm:w-32 sm:h-22 lg:w-40 lg:h-28 object-cover rounded-xl shadow-md shadow-gray-300/40 dark:shadow-gray-900/60 group-hover:shadow-lg group-hover:shadow-gray-400/50 dark:group-hover:shadow-black/40 transition-all duration-300"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 rounded-xl ring-1 ring-gray-200 dark:ring-gray-700"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Clean Details Grid with Minimalist Shadows -->
            <div class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2">
              <!-- Capital Card -->
              <div
                class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm shadow-gray-200/60 dark:shadow-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div class="flex items-center space-x-3 mb-4">
                  <div
                    class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm shadow-blue-600/30"
                  >
                    <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-white" />
                  </div>
                  <h3
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                  >
                    Capital
                  </h3>
                </div>
                <p class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ countryDetail.capital.length > 0 ? countryDetail.capital.join(', ') : 'N/A' }}
                </p>
              </div>

              <!-- Population Card -->
              <div
                class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm shadow-gray-200/60 dark:shadow-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div class="flex items-center space-x-3 mb-4">
                  <div
                    class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm shadow-green-600/30"
                  >
                    <UIcon name="i-heroicons-users" class="w-5 h-5 text-white" />
                  </div>
                  <h3
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                  >
                    Population
                  </h3>
                </div>
                <p class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ countryDetail.population.toLocaleString() }}
                </p>
              </div>

              <!-- Currencies Card -->
              <div
                v-if="Object.keys(countryDetail.currencies).length > 0"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm shadow-gray-200/60 dark:shadow-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div class="flex items-center space-x-3 mb-4">
                  <div
                    class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-sm shadow-yellow-600/30"
                  >
                    <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-white" />
                  </div>
                  <h3
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                  >
                    Currency
                  </h3>
                </div>
                <div class="space-y-1">
                  <span
                    v-for="(currency, code) in countryDetail.currencies"
                    :key="code"
                    class="block text-lg sm:text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {{ currency.name }} ({{ currency.symbol }})
                  </span>
                </div>
              </div>

              <!-- Languages Card -->
              <div
                v-if="Object.keys(countryDetail.languages).length > 0"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm shadow-gray-200/60 dark:shadow-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div class="flex items-center space-x-3 mb-4">
                  <div
                    class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm shadow-purple-600/30"
                  >
                    <UIcon name="i-heroicons-language" class="w-5 h-5 text-white" />
                  </div>
                  <h3
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                  >
                    Languages
                  </h3>
                </div>
                <div class="space-y-1">
                  <span
                    v-for="(language, code) in countryDetail.languages"
                    :key="code"
                    class="inline-block text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mr-3"
                  >
                    {{ language }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <!-- View Details Button -->
              <NuxtLink :to="`/country/${countryDetail.code}`">
                <UButton
                  color="primary"
                  variant="solid"
                  size="lg"
                  icon="i-heroicons-eye"
                  class="rounded-xl shadow-sm shadow-blue-200/60 dark:shadow-blue-900/40 hover:shadow-md hover:shadow-blue-300/50 dark:hover:shadow-blue-800/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Details
                </UButton>
              </NuxtLink>

              <!-- Clear Selection Button -->
              <UButton
                color="neutral"
                variant="soft"
                size="lg"
                icon="i-heroicons-x-mark"
                class="rounded-xl shadow-sm shadow-gray-200/60 dark:shadow-gray-900/40 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
                @click="$emit('clear-selection')"
              >
                Clear Selection
              </UButton>
            </div>
          </div>
        </Transition>
      </UCard>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Currency {
  name: string
  symbol: string
}

interface CountryDetail {
  name: string
  code: string
  capital: string[]
  population: number
  flag: string
  currencies: Record<string, Currency>
  languages: Record<string, string>
}

interface Props {
  selectedCountry: string
  countryDetail: CountryDetail | null
  isLoadingDetail: boolean
  errorMessage: string | null
}

interface Emits {
  (e: 'retry' | 'clear-selection'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
