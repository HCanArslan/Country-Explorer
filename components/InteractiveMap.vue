<template>
  <div class="relative w-full" :style="{ height }">
    <!-- Loading State -->
    <div
      v-if="isLoadingGeoJSON && !geoJSONError"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg"
    >
      <div class="text-center">
        <div
          class="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">Loading world map...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="geoJSONError || mapLoadError"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg"
    >
      <div class="text-center p-6">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-12 h-12 text-yellow-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Map Loading Failed</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          The interactive map could not be loaded. This might be due to a network issue or browser
          compatibility.
        </p>
        <UButton color="blue" variant="outline" size="sm" @click="retryMapLoad">
          Try Again
        </UButton>
      </div>
    </div>

    <!-- Map Container -->
    <div v-else class="w-full h-full relative">
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
            'absolute z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden',
            isMobile
              ? 'bottom-1 left-1 right-1 max-h-[40vh] min-h-[180px] max-w-[calc(100vw-0.5rem)]'
              : 'top-2 right-2 w-80 max-w-[calc(100%-1rem)] max-h-[calc(100vh-4rem)]',
          ]"
          style="will-change: transform"
        >
          <!-- Loading State for Country Data -->
          <div v-if="isLoadingCountryData" class="p-3">
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
          <div v-else-if="selectedCountryData" class="flex flex-col h-full">
            <!-- Header with Close Button -->
            <div class="flex-shrink-0 p-1.5 pb-1">
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-1.5 mb-0.5">
                    <img
                      v-if="selectedCountryData.flags?.svg"
                      :src="selectedCountryData.flags.svg"
                      :alt="`${selectedCountryData.name?.common} flag`"
                      class="w-5 h-3.5 object-cover rounded shadow-sm flex-shrink-0"
                      loading="lazy"
                      width="20"
                      height="14"
                    />
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {{ selectedCountryData.name?.common }}
                    </h3>
                  </div>
                  <p
                    v-if="selectedCountryData.name?.official"
                    class="text-[10px] text-gray-600 dark:text-gray-400 ml-6 truncate"
                  >
                    {{ selectedCountryData.name.official }}
                  </p>
                </div>
                <button
                  class="flex-shrink-0 ml-1.5 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close country details"
                  @click="clearSelection"
                >
                  <UIcon
                    name="i-heroicons-x-mark"
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto px-1.5 pb-1 min-h-0">
              <div class="space-y-1">
                <!-- Primary Info Grid -->
                <div :class="isMobile ? 'space-y-1' : 'grid grid-cols-2 gap-1'">
                  <!-- Capital -->
                  <div
                    v-if="selectedCountryData.capital?.length"
                    class="bg-gray-100 dark:bg-gray-700 rounded-md p-1 border border-gray-200 dark:border-gray-600"
                  >
                    <div class="flex items-center gap-0.5 mb-0.5">
                      <UIcon
                        name="i-heroicons-building-office-2"
                        class="w-2.5 h-2.5 text-blue-500 dark:text-blue-400 flex-shrink-0"
                      />
                      <span
                        class="text-[9px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                      >
                        Capital
                      </span>
                    </div>
                    <p
                      class="text-[10px] font-medium text-gray-900 dark:text-gray-100 leading-tight"
                    >
                      {{ selectedCountryData.capital.join(', ') }}
                    </p>
                  </div>

                  <!-- Population -->
                  <div
                    v-if="selectedCountryData.population"
                    class="bg-gray-100 dark:bg-gray-700 rounded-md p-1 border border-gray-200 dark:border-gray-600"
                  >
                    <div class="flex items-center gap-0.5 mb-0.5">
                      <UIcon
                        name="i-heroicons-users"
                        class="w-2.5 h-2.5 text-green-500 dark:text-green-400 flex-shrink-0"
                      />
                      <span
                        class="text-[9px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                      >
                        Population
                      </span>
                    </div>
                    <p
                      class="text-[10px] font-medium text-gray-900 dark:text-gray-100 leading-tight"
                    >
                      {{ selectedCountryData.population.toLocaleString() }}
                    </p>
                  </div>
                </div>

                <!-- Region -->
                <div
                  v-if="selectedCountryData.region"
                  class="bg-gray-100 dark:bg-gray-700 rounded-md p-1.5 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-1 mb-1">
                    <UIcon
                      name="i-heroicons-globe-americas"
                      class="w-3 h-3 text-purple-500 dark:text-purple-400 flex-shrink-0"
                    />
                    <span
                      class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                    >
                      Region
                    </span>
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
                  class="bg-gray-100 dark:bg-gray-700 rounded-md p-1.5 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-1 mb-1">
                    <UIcon
                      name="i-heroicons-language"
                      class="w-3 h-3 text-orange-500 dark:text-orange-400 flex-shrink-0"
                    />
                    <span
                      class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                    >
                      Languages
                    </span>
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
                  class="bg-gray-100 dark:bg-gray-700 rounded-md p-1.5 border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-1 mb-1">
                    <UIcon
                      name="i-heroicons-banknotes"
                      class="w-3 h-3 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                    />
                    <span
                      class="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
                    >
                      Currencies
                    </span>
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
            </div>

            <!-- Footer with View Details Button -->
            <div
              class="flex-shrink-0 p-1.5 border-t border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50"
            >
              <NuxtLink
                :to="`/country/${selectedCountryData.cca2?.toLowerCase()}`"
                class="block w-full"
              >
                <UButton
                  color="blue"
                  variant="solid"
                  size="xs"
                  class="w-full justify-center text-[10px] font-medium py-1 px-1.5"
                >
                  <UIcon name="i-heroicons-arrow-right" class="w-2.5 h-2.5 mr-0.5" />
                  Details
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Map Component -->
      <ClientOnly>
        <LMap
          v-if="geoJSONData && !mapLoadError"
          ref="mapRef"
          :zoom="mapZoom"
          :center="mapCenter"
          :options="mapOptions"
          class="w-full h-full rounded-lg"
          @ready="onMapReady"
        >
          <LTileLayer
            :url="tileLayerUrl"
            :attribution="tileLayerAttribution"
            :options="mobileOptimizedTileOptions"
          />
          <LGeoJson
            v-if="geoJSONData"
            :geojson="geoJSONData"
            :options="geoJSONOptions"
            :options-style="getCountryStyle"
          />
        </LMap>
        <template #fallback>
          <div
            class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
              ></div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Initializing map...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, defineAsyncComponent } from 'vue'

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

  if (window.L) {
    return true
  }

  try {
    // Import Leaflet CSS using dynamic import
    await import('leaflet/dist/leaflet.css')
    const L = await import('leaflet')
    const LeafletLib = L.default || L

    if (!LeafletLib) {
      return false
    }

    // Fix marker icons with proper imports
    if (LeafletLib?.Icon?.Default) {
      try {
        // Use proper asset imports for Vite
        LeafletLib.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
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
const LMap = defineAsyncComponent(async () => {
  if (!import.meta.client) {
    throw new Error('Map only available on client')
  }

  const leafletReady = await ensureLeafletLoaded()
  if (!leafletReady) {
    throw new Error('Leaflet failed to initialize')
  }

  const vueLeaflet = await import('@vue-leaflet/vue-leaflet')

  if (!vueLeaflet.LMap) {
    throw new Error('LMap component not found in Vue Leaflet')
  }

  return vueLeaflet.LMap
})

const LTileLayer = defineAsyncComponent(async () => {
  if (!import.meta.client) {
    throw new Error('TileLayer only available on client')
  }

  const leafletReady = await ensureLeafletLoaded()
  if (!leafletReady) {
    throw new Error('Leaflet failed to initialize')
  }

  const vueLeaflet = await import('@vue-leaflet/vue-leaflet')

  if (!vueLeaflet.LTileLayer) {
    throw new Error('LTileLayer component not found in Vue Leaflet')
  }

  return vueLeaflet.LTileLayer
})

const LGeoJson = defineAsyncComponent(async () => {
  if (!import.meta.client) {
    throw new Error('GeoJson only available on client')
  }

  const leafletReady = await ensureLeafletLoaded()
  if (!leafletReady) {
    throw new Error('Leaflet failed to initialize')
  }

  const vueLeaflet = await import('@vue-leaflet/vue-leaflet')

  if (!vueLeaflet.LGeoJson) {
    throw new Error('LGeoJson component not found in Vue Leaflet')
  }

  return vueLeaflet.LGeoJson
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
const _userInteracted = ref(false)
const mapLoadError = ref(false)

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

// Mobile-optimized tile layer options for faster LCP
const mobileOptimizedTileOptions = computed(() => {
  const mobileConfig = window.__MOBILE_MAP_CONFIG__
  return {
    maxZoom: isMobile.value ? (mobileConfig?.maxZoom || 8) : 18,
    minZoom: 1,
    tileSize: isMobile.value ? (mobileConfig?.tileSize || 256) : 256,
    updateWhenZooming: !isMobile.value,
    updateWhenIdle: isMobile.value,
    keepBuffer: isMobile.value ? 0 : 2, // Reduced buffer for faster loading
    // Disable retina detection on mobile for faster loading
    detectRetina: !isMobile.value && (mobileConfig?.detectRetina !== false),
    // Add crossOrigin for better caching
    crossOrigin: true,
    // Optimize loading priority
    loading: 'eager',
  }
})

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
  // Try multiple possible country identifier fields with better mapping
  const rawIsoCode =
    feature.properties?.ISO_A3 ||
    feature.properties?.iso_a3 ||
    feature.properties?.ISO3 ||
    feature.properties?.iso3 ||
    feature.properties?.ADM0_A3 ||
    feature.properties?.adm0_a3 ||
    feature.properties?.ISO_A2 ||
    feature.properties?.iso_a2 ||
    feature.properties?.ISO2 ||
    feature.properties?.iso2 ||
    feature.properties?.cca3 ||
    feature.properties?.cca2

  let isoCode: string | null = null

  // Clean up the ISO code (remove any extra characters, ensure proper format)
  if (rawIsoCode) {
    isoCode = String(rawIsoCode).trim().toUpperCase()

    // Handle special cases and common mapping issues
    const isoCodeMappings: Record<string, string> = {
      USA: 'US',
      GBR: 'GB',
      FRA: 'FR',
      DEU: 'DE',
      ITA: 'IT',
      ESP: 'ES',
      CAN: 'CA',
      AUS: 'AU',
      JPN: 'JP',
      CHN: 'CN',
      IND: 'IN',
      BRA: 'BR',
      RUS: 'RU',
      MEX: 'MX',
      ZAF: 'ZA',
      KOR: 'KR',
      IDN: 'ID',
      TUR: 'TR',
      SAU: 'SA',
      ARG: 'AR',
      THA: 'TH',
      EGY: 'EG',
      NGA: 'NG',
      VNM: 'VN',
      PHL: 'PH',
      MYS: 'MY',
      SGP: 'SG',
      CHE: 'CH',
      AUT: 'AT',
      BEL: 'BE',
      NLD: 'NL',
      SWE: 'SE',
      NOR: 'NO',
      DNK: 'DK',
      FIN: 'FI',
      POL: 'PL',
      CZE: 'CZ',
      HUN: 'HU',
      PRT: 'PT',
      GRC: 'GR',
      IRE: 'IE',
      NZL: 'NZ',
      ISR: 'IL',
      ARE: 'AE',
      QAT: 'QA',
      KWT: 'KW',
      BHR: 'BH',
      OMN: 'OM',
      JOR: 'JO',
      LBN: 'LB',
      SYR: 'SY',
      IRQ: 'IQ',
      IRN: 'IR',
      AFG: 'AF',
      PAK: 'PK',
      BGD: 'BD',
      LKA: 'LK',
      NPL: 'NP',
      BTN: 'BT',
      MMR: 'MM',
      LAO: 'LA',
      KHM: 'KH',
      PRK: 'KP',
      MNG: 'MN',
      KAZ: 'KZ',
      UZB: 'UZ',
      TKM: 'TM',
      KGZ: 'KG',
      TJK: 'TJ',
      AZE: 'AZ',
      ARM: 'AM',
      GEO: 'GE',
      UKR: 'UA',
      BLR: 'BY',
      MDA: 'MD',
      ROU: 'RO',
      BGR: 'BG',
      SRB: 'RS',
      HRV: 'HR',
      BIH: 'BA',
      MNE: 'ME',
      MKD: 'MK',
      ALB: 'AL',
      SVN: 'SI',
      SVK: 'SK',
      EST: 'EE',
      LVA: 'LV',
      LTU: 'LT',
      CYP: 'CY',
      MLT: 'MT',
      LUX: 'LU',
      MCO: 'MC',
      AND: 'AD',
      SMR: 'SM',
      VAT: 'VA',
      LIE: 'LI',
      ISL: 'IS',
      FRO: 'FO',
      GRL: 'GL',
      SJM: 'SJ',
      // Handle some problematic codes
      '-99': null, // Invalid code
      'N/A': null, // Invalid code
      '': null, // Empty string
    }

    // Use mapping if available, otherwise keep original
    const mappedCode = isoCodeMappings[isoCode]
    if (mappedCode === null) {
      isoCode = null // Mark as invalid
    } else if (mappedCode) {
      isoCode = mappedCode
    }
  }

  if (!isoCode) {
    // Try to use country name as fallback
    const countryName =
      feature.properties?.NAME ||
      feature.properties?.name ||
      feature.properties?.NAME_EN ||
      feature.properties?.name_en ||
      feature.properties?.ADMIN ||
      feature.properties?.admin ||
      feature.properties?.NAME_LONG ||
      feature.properties?.name_long

    if (countryName) {
      await loadCountryDataByName(String(countryName), layer)
      return
    }

    // Show error if no identifier found
    selectedCountryData.value = null
    countryDataError.value = 'Unable to identify this country'
    return
  }

  // Update selected layer styling
  if (selectedLayer.value) {
    selectedLayer.value.setStyle(getCountryStyle())
  }
  selectedLayer.value = layer
  layer.setStyle(getSelectedCountryStyle())

  // Load country data
  await loadCountryData(isoCode)
}

async function loadCountryData(isoCode: string) {
  isLoadingCountryData.value = true
  countryDataError.value = null

  try {
    // Try different API endpoints for better compatibility
    let response: CountryData[] | CountryData | null = null

    // First try with alpha code (2 or 3 letter)
    try {
      response = await $fetch<CountryData[] | CountryData>(
        `https://restcountries.com/v3.1/alpha/${isoCode}?fields=name,capital,population,region,subregion,languages,currencies,flags,cca2,cca3`,
      )
    } catch {
      // If 3-letter code failed, try 2-letter code
      if (isoCode.length === 3) {
        // Try to convert 3-letter to 2-letter using common mappings
        const threeToTwoMapping: Record<string, string> = {
          USA: 'US',
          GBR: 'GB',
          FRA: 'FR',
          DEU: 'DE',
          ITA: 'IT',
          ESP: 'ES',
          CAN: 'CA',
          AUS: 'AU',
          JPN: 'JP',
          CHN: 'CN',
          IND: 'IN',
          BRA: 'BR',
          RUS: 'RU',
          MEX: 'MX',
          ZAF: 'ZA',
          ARG: 'AR',
          THA: 'TH',
          EGY: 'EG',
          NGA: 'NG',
          VNM: 'VN',
          PHL: 'PH',
          MYS: 'MY',
          SGP: 'SG',
          CHE: 'CH',
          AUT: 'AT',
          BEL: 'BE',
          NLD: 'NL',
          SWE: 'SE',
          NOR: 'NO',
          DNK: 'DK',
          FIN: 'FI',
          POL: 'PL',
          CZE: 'CZ',
          HUN: 'HU',
          PRT: 'PT',
          GRC: 'GR',
          IRE: 'IE',
          NZL: 'NZ',
          ISR: 'IL',
          ARE: 'AE',
          QAT: 'QA',
          KWT: 'KW',
          BHR: 'BH',
          OMN: 'OM',
          JOR: 'JO',
          LBN: 'LB',
          SYR: 'SY',
          IRQ: 'IQ',
          IRN: 'IR',
          AFG: 'AF',
          PAK: 'PK',
          BGD: 'BD',
          LKA: 'LK',
          NPL: 'NP',
          BTN: 'BT',
          MMR: 'MM',
          LAO: 'LA',
          KHM: 'KH',
          PRK: 'KP',
          MNG: 'MN',
          KAZ: 'KZ',
          UZB: 'UZ',
          TKM: 'TM',
          KGZ: 'KG',
          TJK: 'TJ',
          AZE: 'AZ',
          ARM: 'AM',
          GEO: 'GE',
          UKR: 'UA',
          BLR: 'BY',
          MDA: 'MD',
          ROU: 'RO',
          BGR: 'BG',
          SRB: 'RS',
          HRV: 'HR',
          BIH: 'BA',
          MNE: 'ME',
          MKD: 'MK',
          ALB: 'AL',
          SVN: 'SI',
          SVK: 'SK',
          EST: 'EE',
          LVA: 'LV',
          LTU: 'LT',
          CYP: 'CY',
          MLT: 'MT',
          LUX: 'LU',
          MCO: 'MC',
          AND: 'AD',
          SMR: 'SM',
          VAT: 'VA',
          LIE: 'LI',
          ISL: 'IS',
          FRO: 'FO',
          GRL: 'GL',
          SJM: 'SJ',
        }

        const twoLetterCode = threeToTwoMapping[isoCode]
        if (twoLetterCode) {
          try {
            response = await $fetch<CountryData[] | CountryData>(
              `https://restcountries.com/v3.1/alpha/${twoLetterCode}?fields=name,capital,population,region,subregion,languages,currencies,flags,cca2,cca3`,
            )
          } catch {
            // Silent fallback
          }
        }
      } else if (isoCode.length === 2) {
        // If 2-letter code failed, try some 3-letter equivalents
        const twoToThreeMapping: Record<string, string> = {
          US: 'USA',
          GB: 'GBR',
          FR: 'FRA',
          DE: 'DEU',
          IT: 'ITA',
          ES: 'ESP',
          CA: 'CAN',
          AU: 'AUS',
          JP: 'JPN',
          CN: 'CHN',
          IN: 'IND',
          BR: 'BRA',
          RU: 'RUS',
          MX: 'MEX',
          ZA: 'ZAF',
        }

        const threeLetterCode = twoToThreeMapping[isoCode]
        if (threeLetterCode) {
          try {
            response = await $fetch<CountryData[] | CountryData>(
              `https://restcountries.com/v3.1/alpha/${threeLetterCode}?fields=name,capital,population,region,subregion,languages,currencies,flags,cca2,cca3`,
            )
          } catch {
            // Silent fallback
          }
        }
      }
    }

    // Handle both array and single object responses
    let countryData: CountryData | null = null

    if (Array.isArray(response) && response.length > 0) {
      countryData = response[0]
    } else if (response && !Array.isArray(response)) {
      countryData = response as CountryData
    }

    if (countryData) {
      selectedCountryData.value = countryData
      emit('countrySelected', countryData)
    } else {
      throw new Error('No country data found')
    }
  } catch {
    countryDataError.value = `Unable to load information for country code: ${isoCode}`

    // Clear selection on error
    selectedCountryData.value = null
    if (selectedLayer.value) {
      selectedLayer.value.setStyle(getCountryStyle())
      selectedLayer.value = null
    }
  } finally {
    isLoadingCountryData.value = false
  }
}

async function loadCountryDataByName(countryName: string, layer: CountryLayer) {
  isLoadingCountryData.value = true
  countryDataError.value = null

  try {
    // Clean up country name for search
    const cleanName = countryName
      .trim()
      .replace(/[^\w\s]/g, '')
      .toLowerCase()

    const response = await $fetch<CountryData[]>(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(cleanName)}?fields=name,capital,population,region,subregion,languages,currencies,flags,cca2,cca3&fullText=false`,
    )

    if (response && response.length > 0) {
      // Update selected layer styling
      if (selectedLayer.value) {
        selectedLayer.value.setStyle(getCountryStyle())
      }
      selectedLayer.value = layer
      layer.setStyle(getSelectedCountryStyle())

      selectedCountryData.value = response[0]
      emit('countrySelected', response[0])
    } else {
      throw new Error('No country data found by name')
    }
  } catch {
    countryDataError.value = `Unable to load information for: ${countryName}`
    selectedCountryData.value = null
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

function retryMapLoad() {
  mapLoadError.value = false
  geoJSONError.value = null
  loadGeoJSONData()
}

function onMapReady() {
  mapReady.value = true
}

// Mobile detection
function checkMobile() {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 768
  }
}

function handleResize() {
  checkMobile()
}

// Load GeoJSON data
async function loadGeoJSONData() {
  isLoadingGeoJSON.value = true
  geoJSONError.value = null

  try {
    // Try multiple reliable GeoJSON sources for world countries
    let response: GeoJSONData | null = null

    // Primary source: Natural Earth data via GitHub
    try {
      response = await $fetch<GeoJSONData>(
        'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
      )
    } catch {
      // Fallback source: Alternative GitHub repository
      try {
        response = await $fetch<GeoJSONData>(
          'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        )
      } catch {
        // Final fallback: Simple world countries
        response = await $fetch<GeoJSONData>(
          'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
        )
      }
    }

    // Validate the response
    if (!response) {
      throw new Error('No response received from any GeoJSON source')
    }

    if (typeof response === 'string') {
      try {
        response = JSON.parse(response) as GeoJSONData
      } catch {
        throw new Error('Failed to parse GeoJSON data')
      }
    }

    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format')
    }

    if (response.type !== 'FeatureCollection') {
      throw new Error(`Expected FeatureCollection, got: ${response.type || 'undefined'}`)
    }

    if (!Array.isArray(response.features)) {
      throw new Error('Features property is not an array')
    }

    if (response.features.length === 0) {
      throw new Error('No countries found in GeoJSON data')
    }

    // Validate that features have the required structure
    const validFeatures = response.features.filter(
      (feature) => feature && feature.type === 'Feature' && feature.properties && feature.geometry,
    )

    if (validFeatures.length === 0) {
      throw new Error('No valid country features found')
    }

    // Use only valid features
    geoJSONData.value = {
      type: 'FeatureCollection',
      features: validFeatures,
    }
  } catch (error) {
    geoJSONError.value = error instanceof Error ? error.message : 'Failed to load map data'
    mapLoadError.value = true
  } finally {
    isLoadingGeoJSON.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  if (import.meta.client) {
    window.addEventListener('resize', handleResize)
  }
  loadGeoJSONData()
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize)
  }
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
