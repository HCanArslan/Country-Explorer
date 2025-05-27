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
      <!-- Back Button -->
      <div class="mb-8">
        <NuxtLink to="/">
          <UButton
            color="neutral"
            variant="soft"
            size="lg"
            icon="i-heroicons-arrow-left"
            class="rounded-xl shadow-sm shadow-gray-200/60 dark:shadow-gray-900/40 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Back to Countries
          </UButton>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="max-w-4xl mx-auto">
        <UCard
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg"
        >
          <div class="p-8 sm:p-12">
            <div class="flex items-center justify-center space-x-3 mb-8">
              <div
                class="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"
              ></div>
              <span class="text-lg font-medium text-gray-600 dark:text-gray-400"
                >Loading country details...</span
              >
            </div>
            <div class="space-y-4">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-1/2"></div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-4xl mx-auto">
        <UCard
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg"
        >
          <div class="p-8 sm:p-12">
            <UAlert
              icon="i-heroicons-exclamation-triangle"
              color="error"
              variant="soft"
              title="Failed to load country details"
              :description="error.message || 'An error occurred while fetching country details.'"
              :actions="[
                {
                  variant: 'solid',
                  color: 'error',
                  label: 'Retry',
                  onClick: () => refresh(),
                },
                {
                  variant: 'outline',
                  color: 'neutral',
                  label: 'Go Back',
                  onClick: async () => {
                    await navigateTo('/')
                  },
                },
              ]"
              class="rounded-xl"
            />
          </div>
        </UCard>
      </div>

      <!-- Country Details Content -->
      <div v-else-if="data" class="max-w-6xl mx-auto">
        <UCard
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50"
        >
          <div class="p-8 sm:p-12">
            <!-- Country Header -->
            <div class="text-center mb-12">
              <h1
                class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8"
              >
                {{ data.name.common }}
              </h1>

              <!-- Flag -->
              <div class="flex justify-center mb-8">
                <div class="relative group">
                  <img
                    :src="data.flags.svg"
                    :alt="`${data.name.common} flag`"
                    class="w-32 h-22 sm:w-48 sm:h-32 lg:w-64 lg:h-44 object-cover rounded-xl shadow-lg shadow-gray-300/40 dark:shadow-gray-900/60 group-hover:shadow-xl group-hover:shadow-gray-400/50 dark:group-hover:shadow-black/40 transition-all duration-300"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 rounded-xl ring-1 ring-gray-200 dark:ring-gray-700"
                  ></div>
                </div>
              </div>

              <!-- Official Name -->
              <p
                v-if="data.name.official !== data.name.common"
                class="text-xl text-gray-600 dark:text-gray-400 mb-4"
              >
                Official: {{ data.name.official }}
              </p>
            </div>

            <!-- Detailed Information Grid -->
            <div class="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <!-- Basic Information -->
              <div
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mr-2 text-blue-500" />
                  Basic Information
                </h3>
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Capital:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ data.capital?.join(', ') || 'N/A' }}
                    </p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Population:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ data.population.toLocaleString() }}
                    </p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Region:</span
                    >
                    <p class="text-gray-900 dark:text-white">{{ data.region }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Subregion:</span
                    >
                    <p class="text-gray-900 dark:text-white">{{ data.subregion || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Geography -->
              <div
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 mr-2 text-green-500" />
                  Geography
                </h3>
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Area:</span>
                    <p class="text-gray-900 dark:text-white">
                      {{ data.area?.toLocaleString() || 'N/A' }} km²
                    </p>
                  </div>
                  <div v-if="data.landlocked !== undefined">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Landlocked:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ data.landlocked ? 'Yes' : 'No' }}
                    </p>
                  </div>
                  <div v-if="data.borders && data.borders.length > 0">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Borders:</span
                    >
                    <p class="text-gray-900 dark:text-white">{{ data.borders.join(', ') }}</p>
                  </div>
                  <div v-if="data.latlng">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Coordinates:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ data.latlng[0] }}°, {{ data.latlng[1] }}°
                    </p>
                  </div>
                </div>
              </div>

              <!-- Currencies -->
              <div
                v-if="data.currencies"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 mr-2 text-yellow-500" />
                  Currencies
                </h3>
                <div class="space-y-3">
                  <div v-for="(currency, code) in data.currencies" :key="code">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >{{ code }}:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ currency.name }} ({{ currency.symbol }})
                    </p>
                  </div>
                </div>
              </div>

              <!-- Languages -->
              <div
                v-if="data.languages"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon name="i-heroicons-language" class="w-5 h-5 mr-2 text-purple-500" />
                  Languages
                </h3>
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Spoken Languages:
                    </span>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(language, code) in data.languages"
                        :key="code"
                        class="inline-block light:bg-purple-100 dark:bg-gray-700 text-purple-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium border border-purple-200 dark:border-gray-600"
                      >
                        {{ language }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Government & Politics -->
              <div
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 mr-2 text-red-500" />
                  Government
                </h3>
                <div class="space-y-3">
                  <div v-if="data.government">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                    <p class="text-gray-900 dark:text-white">{{ data.government }}</p>
                  </div>
                  <div v-if="data.independent !== undefined">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Independent:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ data.independent ? 'Yes' : 'No' }}
                    </p>
                  </div>
                  <div v-if="data.unMember !== undefined">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >UN Member:</span
                    >
                    <p class="text-gray-900 dark:text-white">{{ data.unMember ? 'Yes' : 'No' }}</p>
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 mr-2 text-indigo-500" />
                  Additional Info
                </h3>
                <div class="space-y-3">
                  <div v-if="data.timezones">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Timezones:</span
                    >
                    <p class="text-gray-900 dark:text-white">{{ data.timezones.join(', ') }}</p>
                  </div>
                  <div v-if="data.tld">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Top Level Domain:</span
                    >
                    <p class="text-gray-900 dark:text-white">{{ data.tld.join(', ') }}</p>
                  </div>
                  <div v-if="data.callingCodes">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                      >Calling Code:</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      +{{ data.callingCodes.root
                      }}{{ data.callingCodes.suffixes?.join(', +') || '' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Maps Section -->
            <div v-if="data.maps" class="mt-12">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <UIcon name="i-heroicons-map" class="w-6 h-6 mr-3 text-blue-500" />
                Maps
              </h3>
              <div class="flex flex-wrap gap-4">
                <UButton
                  v-if="data.maps.googleMaps"
                  color="primary"
                  variant="outline"
                  size="lg"
                  icon="i-heroicons-map"
                  :to="data.maps.googleMaps"
                  external
                  target="_blank"
                  class="rounded-xl"
                >
                  View on Google Maps
                </UButton>
                <UButton
                  v-if="data.maps.openStreetMaps"
                  color="success"
                  variant="outline"
                  size="lg"
                  icon="i-heroicons-globe-alt"
                  :to="data.maps.openStreetMaps"
                  external
                  target="_blank"
                  class="rounded-xl"
                >
                  View on OpenStreetMap
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Vue imports
import { computed } from 'vue'

// Nuxt 3 page - auto-imports should be available
// If TypeScript shows errors, restart your IDE's TypeScript language server

// Define the page meta
definePageMeta({
  title: 'Country Details',
})

// Define the API response type
interface CountryApiResponse {
  name: {
    common: string
    official: string
  }
  flags: {
    svg: string
  }
  capital?: string[]
  population: number
  region: string
  subregion?: string
  area?: number
  landlocked?: boolean
  borders?: string[]
  latlng?: number[]
  currencies?: Record<string, { name: string; symbol: string }>
  languages?: Record<string, string>
  government?: string
  independent?: boolean
  unMember?: boolean
  timezones?: string[]
  tld?: string[]
  callingCodes?: {
    root: string
    suffixes?: string[]
  }
  maps?: {
    googleMaps?: string
    openStreetMaps?: string
  }
}

// Get the route parameter
const route = useRoute()
const countryCode = route.params.code as string

// Validate the country code
if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Invalid country code',
  })
}

// Fetch country details from the API
const { data, pending, error, refresh } = await useFetch(
  `https://restcountries.com/v3.1/alpha/${countryCode}`,
  {
    transform: (data: CountryApiResponse[]) => data[0], // The API returns an array with one item
    key: `country-${countryCode}`,
  },
)

// Set the page title dynamically
useHead({
  title: computed(() =>
    data.value ? `${data.value.name.common} - Country Details` : 'Country Details',
  ),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        data.value
          ? `Detailed information about ${data.value.name.common} including population, capital, languages, and more.`
          : 'Country details page',
      ),
    },
  ],
})
</script>
