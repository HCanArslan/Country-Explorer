<template>
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
                click: () => $emit('retry'),
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
                  {{ countryDetail.capital.length > 0 ? countryDetail.capital.join(', ') : 'N/A' }}
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
