import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CountryOption {
  label: string
  value: string
}

interface CountryDetail {
  name: string
  code: string
  capital: string[]
  population: number
  currencies: Record<string, { name: string; symbol: string }>
  languages: Record<string, string>
  flag: string
}

interface CountryApiResponse {
  name: {
    common: string
  }
  cca2: string
}

interface CountryDetailApiResponse {
  name: {
    common: string
  }
  cca2: string
  capital: string[]
  population: number
  currencies: Record<string, { name: string; symbol: string }>
  languages: Record<string, string>
  flags: {
    png: string
    svg: string
  }
}

export const useCountryStore = defineStore('country', () => {
  // State
  const countryList = ref<CountryOption[]>([])
  const selectedCountry = ref<string | null>(null)
  const countryDetail = ref<CountryDetail | null>(null)
  const isLoading = ref(false)
  const isLoadingDetail = ref(false)
  const errorMessage = ref<string | null>(null)

  // Actions
  async function fetchCountries() {
    console.log('Store: Starting fetchCountries...')

    // Check if countries are already cached
    if (countryList.value.length > 0) {
      console.log('Store: Using cached countries:', countryList.value.length)
      return
    }

    isLoading.value = true
    errorMessage.value = null
    try {
      console.log('Store: Making API call to fetch countries...')
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      console.log('Store: API response status:', res.status)
      if (!res.ok) throw new Error('Network error')
      const data: CountryApiResponse[] = await res.json()
      console.log('Store: Received data:', data.length, 'countries')
      countryList.value = data
        .map((c: CountryApiResponse) => ({ label: c.name.common, value: c.cca2 }))
        .sort((a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label))
      console.log('Store: Countries processed and sorted:', countryList.value.length)
    } catch (e: unknown) {
      console.error('Store: Error fetching countries:', e)
      errorMessage.value = e instanceof Error ? e.message : 'Failed to fetch countries.'
      countryList.value = []
    } finally {
      isLoading.value = false
      console.log('Store: fetchCountries completed')
    }
  }

  async function fetchCountryDetail(code: string) {
    console.log('Store: Starting fetchCountryDetail for code:', code)
    isLoadingDetail.value = true
    errorMessage.value = null
    try {
      console.log('Store: Making API call to fetch country details...')
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      console.log('Store: Country detail API response status:', res.status)
      if (!res.ok) throw new Error('Failed to fetch country details')
      const data: CountryDetailApiResponse[] = await res.json()
      console.log('Store: Received country detail data:', data)
      const country = data[0]
      countryDetail.value = {
        name: country.name.common,
        code: country.cca2,
        capital: country.capital || [],
        population: country.population,
        currencies: country.currencies || {},
        languages: country.languages || {},
        flag: country.flags.svg,
      }
      console.log('Store: Country detail processed:', countryDetail.value)
    } catch (e: unknown) {
      console.error('Store: Error fetching country details:', e)
      errorMessage.value = e instanceof Error ? e.message : 'Failed to fetch country details.'
      countryDetail.value = null
    } finally {
      isLoadingDetail.value = false
      console.log('Store: fetchCountryDetail completed')
    }
  }

  // Helper function to clear cache (useful for testing or force refresh)
  function clearCountriesCache() {
    console.log('Store: Clearing countries cache')
    countryList.value = []
  }

  return {
    countryList,
    selectedCountry,
    countryDetail,
    isLoading,
    isLoadingDetail,
    errorMessage,
    fetchCountries,
    fetchCountryDetail,
    clearCountriesCache,
  }
})
