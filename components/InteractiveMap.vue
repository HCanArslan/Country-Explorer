<template>
  <ClientOnly>
    <!-- Fixed container with explicit dimensions to prevent layout shift -->
    <div class="w-full relative" :style="{ height: props.height }">
      <!-- Mobile-optimized loading state -->
      <div
        v-if="isLoadingGeoJSON || (isMobile && !mapReady)"
        class="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50"
      >
        <div class="text-center">
          <!-- Mobile-optimized skeleton -->
          <div
            class="w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"
            :style="{ height: isMobile ? '300px' : props.height }"
          ></div>
          <div
            class="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"
          ></div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ isMobile ? 'Loading map...' : 'Loading world map...' }}
          </p>
        </div>
      </div>

      <!-- Error State for GeoJSON -->
      <div
        v-else-if="geoJSONError"
        class="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50"
      >
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="soft"
          title="Failed to load map data"
          :description="geoJSONError"
          :actions="[
            {
              variant: 'solid',
              color: 'red',
              label: 'Retry',
              click: loadGeoJSONData,
            },
          ]"
          class="max-w-md"
        />
      </div>

      <!-- Map Container with mobile optimizations -->
      <div v-else class="w-full h-full">
        <!-- Mobile: Show simplified map or defer loading -->
        <div v-if="isMobile && !userInteracted" class="w-full h-full relative">
          <!-- Mobile placeholder with interaction prompt -->
          <div
            class="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors"
            @click="initializeMobileMap"
          >
            <div class="text-center p-6">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-globe-americas"
                  class="w-8 h-8 text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Interactive World Map
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tap to load the interactive map and explore countries
              </p>
              <div
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                <UIcon name="i-heroicons-cursor-arrow-rays" class="w-4 h-4 mr-2" />
                Load Map
              </div>
            </div>
          </div>
        </div>

        <!-- Full map for desktop or after mobile interaction -->
        <LMap
          v-else
          ref="mapRef"
          :zoom="mapZoom"
          :center="mapCenter"
          :options="mapOptions"
          class="w-full h-full rounded-lg"
          :style="{ minHeight: isMobile ? '300px' : props.height }"
          @ready="onMapReady"
        >
          <!-- Mobile-optimized tile layer -->
          <LTileLayer
            :url="tileLayerUrl"
            :attribution="tileLayerAttribution"
            :options="mobileOptimizedTileOptions"
          />

          <!-- Countries GeoJSON Layer with mobile optimization -->
          <LGeoJson
            v-if="geoJSONData && (!isMobile || mapReady)"
            :geojson="geoJSONData"
            :options="geoJSONOptions"
            :options-style="getCountryStyle"
          />
        </LMap>

        <!-- Country Details Panel with mobile optimization -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform translate-x-full"
          enter-to-class="opacity-100 transform translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform translate-x-0"
          leave-to-class="opacity-0 transform translate-x-full"
        >
          <div
            v-if="selectedCountryData || isLoadingCountryData"
            :class="[
              'absolute z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50',
              isMobile
                ? 'bottom-2 left-2 right-2 max-h-[40vh]'
                : 'top-2 right-2 w-72 max-w-[calc(100%-1rem)] max-h-[calc(100%-1rem)]',
            ]"
            style="will-change: transform"
          >
            <!-- Loading State for Country Data -->
            <div v-if="isLoadingCountryData" class="p-4">
              <div class="flex items-center space-x-2 mb-3">
                <div
                  class="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"
                ></div>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>

            <!-- Country Data Display -->
            <div v-else-if="selectedCountryData" class="p-4 overflow-y-auto">
              <!-- Close Button -->
              <button
                class="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close country details"
                @click="clearSelection"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <!-- Country Header -->
              <div class="mb-3">
                <div class="flex items-center space-x-2 mb-1">
                  <img
                    v-if="selectedCountryData.flags?.svg"
                    :src="selectedCountryData.flags.svg"
                    :alt="`${selectedCountryData.name?.common} flag`"
                    class="w-6 h-4 object-cover rounded shadow-sm"
                    loading="lazy"
                    width="24"
                    height="16"
                  />
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    {{ selectedCountryData.name?.common }}
                  </h3>
                </div>
                <p
                  v-if="selectedCountryData.name?.official"
                  class="text-xs text-gray-600 dark:text-gray-400 ml-8"
                >
                  {{ selectedCountryData.name.official }}
                </p>
              </div>

              <!-- Country Details - Mobile optimized layout -->
              <div class="space-y-2">
                <!-- Primary Info Grid -->
                <div :class="isMobile ? 'space-y-2' : 'grid grid-cols-2 gap-2'">
                  <!-- Capital -->
                  <div
                    v-if="selectedCountryData.capital?.length"
                    class="bg-gray-100 dark:bg-gray-700 rounded-md p-2 border border-gray-200 dark:border-gray-600"
                  >
                    <div class="flex items-center gap-1 mb-1">
                      <UIcon
                        name="i-heroicons-building-office-2"
                        class="w-3 h-3 text-blue-500 dark:text-blue-400"
                      />
                      <span
                        class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                        >Capital</span
                      >
                    </div>
                    <p class="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight">
                      {{ selectedCountryData.capital.join(', ') }}
                    </p>
                  </div>

                  <!-- Population -->
                  <div
                    v-if="selectedCountryData.population"
                    class="bg-gray-100 dark:bg-gray-700 rounded-md p-2 border border-gray-200 dark:border-gray-600"
                  >
                    <div class="flex items-center gap-1 mb-1">
                      <UIcon
                        name="i-heroicons-users"
                        class="w-3 h-3 text-green-500 dark:text-green-400"
                      />
                      <span
                        class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                        >Population</span
                      >
                    </div>
                    <p class="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight">
                      {{ selectedCountryData.population.toLocaleString() }}
                    </p>
                  </div>
                </div>

                <!-- Region -->
                <div
                  v-if="selectedCountryData.region"
                  class="bg-gray-100 dark:bg-gray-700 rounded-md p-2 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-1 mb-1">
                    <UIcon
                      name="i-heroicons-globe-americas"
                      class="w-3 h-3 text-purple-500 dark:text-purple-400"
                    />
                    <span
                      class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                      >Region</span
                    >
                  </div>
                  <p class="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight">
                    {{ selectedCountryData.region }}
                    <span
                      v-if="selectedCountryData.subregion"
                      class="text-gray-600 dark:text-gray-300"
                    >
                      • {{ selectedCountryData.subregion }}
                    </span>
                  </p>
                </div>

                <!-- Languages -->
                <div
                  v-if="
                    selectedCountryData.languages &&
                    Object.keys(selectedCountryData.languages).length
                  "
                  class="bg-gray-100 dark:bg-gray-700 rounded-md p-2 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-1 mb-1">
                    <UIcon
                      name="i-heroicons-language"
                      class="w-3 h-3 text-orange-500 dark:text-orange-400"
                    />
                    <span
                      class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                      >Languages</span
                    >
                  </div>
                  <p class="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight">
                    {{ Object.values(selectedCountryData.languages).join(', ') }}
                  </p>
                </div>

                <!-- Currencies -->
                <div
                  v-if="
                    selectedCountryData.currencies &&
                    Object.keys(selectedCountryData.currencies).length
                  "
                  class="bg-gray-100 dark:bg-gray-700 rounded-md p-2 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-1 mb-1">
                    <UIcon
                      name="i-heroicons-banknotes"
                      class="w-3 h-3 text-emerald-500 dark:text-emerald-400"
                    />
                    <span
                      class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                      >Currencies</span
                    >
                  </div>
                  <div class="space-y-0.5">
                    <div
                      v-for="(currency, code) in selectedCountryData.currencies"
                      :key="code"
                      class="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight"
                    >
                      {{ currency.name }}
                      <span class="text-gray-600 dark:text-gray-300">
                        ({{ currency.symbol || code }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View Details Button -->
              <div class="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                <NuxtLink
                  :to="`/country/${selectedCountryData.cca2?.toLowerCase()}`"
                  class="block w-full group"
                >
                  <button
                    class="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium text-xs rounded-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 cursor-pointer"
                  >
                    <span>View Details</span>
                    <UIcon
                      name="i-heroicons-arrow-top-right-on-square"
                      class="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </NuxtLink>
              </div>
            </div>

            <!-- Error State for Country Data -->
            <div v-else-if="countryDataError" class="p-4">
              <UAlert
                icon="i-heroicons-exclamation-triangle"
                color="red"
                variant="soft"
                title="Failed to load"
                :description="countryDataError"
                size="xs"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
    <template #fallback>
      <div
        class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <div class="text-center">
          <div
            class="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
          ></div>
          <p class="text-lg font-medium text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h, nextTick, onUnmounted } from 'vue'

// Types
interface CountryFeature {
  type: 'Feature'
  properties: {
    // Common ISO code fields
    ISO_A3?: string
    iso_a3?: string
    ISO3?: string
    iso3?: string
    ADM0_A3?: string
    adm0_a3?: string

    // Common name fields
    NAME?: string
    name?: string
    NAME_EN?: string
    name_en?: string
    ADMIN?: string
    admin?: string

    // Allow any other properties
    [key: string]: unknown
  }
  geometry: {
    type: string
    coordinates: unknown
  }
}

interface CountryLayer {
  feature: CountryFeature
  setStyle: (style: Record<string, unknown>) => void
  on: (event: string, handler: (e: Event) => void) => void
}

interface GeoJSONData {
  type: 'FeatureCollection'
  features: CountryFeature[]
}

interface CountryData {
  name: {
    common: string
    official?: string
  }
  capital?: string[]
  population?: number
  region?: string
  subregion?: string
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  flags?: {
    svg?: string
    png?: string
  }
  cca2?: string
  cca3?: string
}

// Component props
interface Props {
  height?: string
  initialZoom?: number
  initialCenter?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px',
  initialZoom: 2,
  initialCenter: () => [0, 0] as [number, number],
})

// Component emits
const emit = defineEmits<{
  countrySelected: [countryData: CountryData]
}>()

// Ensure Leaflet is properly loaded before Vue Leaflet components
const ensureLeafletLoaded = async () => {
  if (!import.meta.client) return false

  if (window.L) return true

  try {
    await import('leaflet/dist/leaflet.css')
    const L = await import('leaflet')
    const LeafletLib = L.default || L

    if (!LeafletLib) {
      throw new Error('Leaflet library not available')
    }

    // Fix marker icons
    if (LeafletLib?.Icon?.Default) {
      try {
        const iconRetinaUrl = await import('leaflet/dist/images/marker-icon-2x.png')
        const iconUrl = await import('leaflet/dist/images/marker-icon.png')
        const shadowUrl = await import('leaflet/dist/images/marker-shadow.png')

        LeafletLib.Icon.Default.mergeOptions({
          iconRetinaUrl: iconRetinaUrl.default,
          iconUrl: iconUrl.default,
          shadowUrl: shadowUrl.default,
        })
      } catch {
        // Continue without icons - this is not critical
      }
    }

    window.L = LeafletLib
    return true
  } catch {
    return false
  }
}

// Dynamic imports for @vue-leaflet/vue-leaflet components with error handling
const LMap = defineAsyncComponent({
  loader: async () => {
    const leafletReady = await ensureLeafletLoaded()
    if (!leafletReady) {
      throw new Error('Leaflet failed to initialize')
    }

    const vueLeaflet = await import('@vue-leaflet/vue-leaflet')
    if (!vueLeaflet?.LMap) {
      throw new Error('Vue Leaflet LMap component not available')
    }
    return vueLeaflet.LMap
  },
  errorComponent: () => h('div', { class: 'text-red-500 p-4' }, 'Failed to load map component'),
  loadingComponent: () => h('div', { class: 'text-gray-500 p-4' }, 'Loading map...'),
  delay: 200,
  timeout: 15000,
})

const LTileLayer = defineAsyncComponent({
  loader: async () => {
    const leafletReady = await ensureLeafletLoaded()
    if (!leafletReady) {
      throw new Error('Leaflet failed to initialize')
    }

    const vueLeaflet = await import('@vue-leaflet/vue-leaflet')
    if (!vueLeaflet?.LTileLayer) {
      throw new Error('Vue Leaflet LTileLayer component not available')
    }
    return vueLeaflet.LTileLayer
  },
  errorComponent: () => h('div', { class: 'text-red-500 p-4' }, 'Failed to load tile layer'),
  delay: 200,
  timeout: 15000,
})

const LGeoJson = defineAsyncComponent({
  loader: async () => {
    const leafletReady = await ensureLeafletLoaded()
    if (!leafletReady) {
      throw new Error('Leaflet failed to initialize')
    }

    const vueLeaflet = await import('@vue-leaflet/vue-leaflet')
    if (!vueLeaflet?.LGeoJson) {
      throw new Error('Vue Leaflet LGeoJson component not available')
    }
    return vueLeaflet.LGeoJson
  },
  errorComponent: () => h('div', { class: 'text-red-500 p-4' }, 'Failed to load GeoJSON layer'),
  delay: 200,
  timeout: 15000,
})

// Reactive state
const mapRef = ref<InstanceType<typeof LMap> | null>(null)
const geoJSONData = ref<GeoJSONData | null>(null)
const selectedCountryData = ref<CountryData | null>(null)
const selectedLayer = ref<CountryLayer | null>(null)
const isLoadingGeoJSON = ref(true)
const isLoadingCountryData = ref(false)
const geoJSONError = ref<string | null>(null)
const countryDataError = ref<string | null>(null)

// Mobile-specific state
const isMobile = ref(false)
const mapReady = ref(false)
const userInteracted = ref(false)

// Map configuration
const mapZoom = ref(props.initialZoom)
const mapCenter = ref<[number, number]>(props.initialCenter)

const mapOptions = {
  zoomControl: true,
  attributionControl: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  boxZoom: true,
  keyboard: true,
  dragging: true,
  touchZoom: true,
}

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tileLayerAttribution = '© OpenStreetMap contributors'

// Mobile-optimized tile layer options
const mobileOptimizedTileOptions = computed(() => ({
  maxZoom: isMobile.value ? 16 : 18,
  minZoom: 1,
  tileSize: isMobile.value ? 256 : 256,
  updateWhenZooming: !isMobile.value,
  updateWhenIdle: isMobile.value,
  keepBuffer: isMobile.value ? 1 : 2,
  // Reduce quality on mobile for faster loading
  detectRetina: !isMobile.value,
}))

// GeoJSON configuration
const geoJSONOptions = computed(() => ({
  onEachFeature: (feature: CountryFeature, layer: CountryLayer) => {
    // Add click event handler
    layer.on('click', () => handleCountryClick(feature, layer))

    // Add hover effects
    layer.on('mouseover', () => {
      if (layer !== selectedLayer.value) {
        layer.setStyle({
          fillOpacity: 0.5,
          weight: 2,
        })
      }
    })

    layer.on('mouseout', () => {
      if (layer !== selectedLayer.value) {
        layer.setStyle(getCountryStyle())
      }
    })
  },
}))

// Styling functions
function getCountryStyle() {
  return {
    fillColor: '#e5e7eb', // gray-200
    weight: 1,
    opacity: 1,
    color: '#6b7280', // gray-500
    fillOpacity: 0.3,
  }
}

function getSelectedCountryStyle() {
  return {
    fillColor: '#3b82f6', // blue-500
    weight: 3,
    opacity: 1,
    color: '#1d4ed8', // blue-700
    fillOpacity: 0.6,
  }
}

// Event handlers
async function handleCountryClick(feature: CountryFeature, layer: CountryLayer) {
  // Try multiple possible country identifier fields
  const isoCode =
    feature.properties?.ISO_A3 ||
    feature.properties?.iso_a3 ||
    feature.properties?.ISO3 ||
    feature.properties?.iso3 ||
    feature.properties?.ADM0_A3 ||
    feature.properties?.adm0_a3

  const countryName =
    feature.properties?.NAME ||
    feature.properties?.name ||
    feature.properties?.NAME_EN ||
    feature.properties?.name_en ||
    feature.properties?.ADMIN ||
    feature.properties?.admin

  if (!isoCode && !countryName) {
    return
  }

  // Reset previous selection
  if (selectedLayer.value && selectedLayer.value !== layer) {
    selectedLayer.value.setStyle(getCountryStyle())
  }

  // Set new selection
  selectedLayer.value = layer
  layer.setStyle(getSelectedCountryStyle())

  // Clear previous data and errors
  selectedCountryData.value = null
  countryDataError.value = null
  isLoadingCountryData.value = true

  try {
    let response: CountryData[] | null = null

    // Try to fetch by ISO code first (most reliable)
    if (isoCode) {
      try {
        response = await $fetch<CountryData[]>(`https://restcountries.com/v3.1/alpha/${isoCode}`)
      } catch {
        // Continue to try by name
      }
    }

    // If ISO code failed or not available, try by name
    if (!response && countryName) {
      try {
        response = await $fetch<CountryData[]>(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(String(countryName))}?fullText=true`,
        )
      } catch {
        // Try partial name search as fallback
        try {
          response = await $fetch<CountryData[]>(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(String(countryName))}`,
          )
        } catch {
          // All attempts failed
        }
      }
    }

    if (response && response.length > 0) {
      selectedCountryData.value = response[0]
      // Emit the country selection event to parent component
      emit('countrySelected', response[0])
    } else {
      throw new Error(`No country data found for ${isoCode || countryName}`)
    }
  } catch (error) {
    countryDataError.value = error instanceof Error ? error.message : 'Failed to fetch country data'
  } finally {
    isLoadingCountryData.value = false
  }
}

function clearSelection() {
  if (selectedLayer.value) {
    selectedLayer.value.setStyle(getCountryStyle())
    selectedLayer.value = null
  }
  selectedCountryData.value = null
  countryDataError.value = null
}

function onMapReady() {
  mapReady.value = true
}

// Mobile-specific functions
function initializeMobileMap() {
  userInteracted.value = true
  // Small delay to ensure smooth transition
  nextTick(() => {
    if (mapRef.value) {
      mapRef.value.leafletObject?.invalidateSize()
    }
  })
}

function detectMobile() {
  if (import.meta.client) {
    isMobile.value =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
}

// Data loading
async function loadGeoJSONData() {
  isLoadingGeoJSON.value = true
  geoJSONError.value = null

  try {
    // Use $fetch with explicit type handling
    const rawResponse = await $fetch<string>(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    )

    // Parse the JSON string
    let response: GeoJSONData | string
    if (typeof rawResponse === 'string') {
      response = JSON.parse(rawResponse)
    } else {
      response = rawResponse
    }

    // Detailed validation with helpful error messages
    if (!response) {
      throw new Error('No response received from server')
    }

    if (typeof response !== 'object') {
      throw new Error(`Expected object response, got ${typeof response}`)
    }

    if (response.type !== 'FeatureCollection') {
      throw new Error(`Expected FeatureCollection, got: ${response.type || 'undefined'}`)
    }

    if (!Array.isArray(response.features)) {
      throw new Error(`Expected features array, got: ${typeof response.features}`)
    }

    if (response.features.length === 0) {
      throw new Error('Features array is empty')
    }

    // Success! Assign the validated data
    geoJSONData.value = response as GeoJSONData
  } catch (error) {
    geoJSONError.value = error instanceof Error ? error.message : 'Failed to load map data'
  } finally {
    isLoadingGeoJSON.value = false
  }
}

// Lifecycle
onMounted(() => {
  detectMobile()
  loadGeoJSONData()

  // Listen for resize events to update mobile detection
  if (import.meta.client) {
    window.addEventListener('resize', detectMobile)
  }
})

// Cleanup
onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', detectMobile)
  }
})

// Expose methods for parent components
defineExpose({
  clearSelection,
  loadGeoJSONData,
})
</script>

<style scoped>
@reference "@/assets/css/main.css";
/* Ensure the map container has proper height */
:deep(.leaflet-container) {
  height: v-bind(height);
  min-height: 350px;
}

/* Dark mode adjustments for Leaflet controls */
:deep(.leaflet-control-zoom a) {
  @apply bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600;
}

:deep(.leaflet-control-zoom a:hover) {
  @apply bg-gray-50 dark:bg-gray-700;
}

:deep(.leaflet-control-attribution) {
  @apply bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400;
}

/* Custom scrollbar for country details panel */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgb(156 163 175) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(156 163 175);
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}
</style>
