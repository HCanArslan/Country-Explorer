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
    // Check if countries are already cached
    if (countryList.value.length > 0) {
      return
    }

    isLoading.value = true
    errorMessage.value = null
    try {
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      if (!res.ok) throw new Error('Network error')
      const data: CountryApiResponse[] = await res.json()
      countryList.value = data
        .map((c: CountryApiResponse) => ({ label: c.name.common, value: c.cca2 }))
        .sort((a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label))
    } catch (e: unknown) {
      console.error('Store: Error fetching countries:', e)
      errorMessage.value = e instanceof Error ? e.message : 'Failed to fetch countries.'
      countryList.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCountryDetail(code: string) {
    isLoadingDetail.value = true
    errorMessage.value = null
    try {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      if (!res.ok) throw new Error('Failed to fetch country details')
      const data: CountryDetailApiResponse[] = await res.json()
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
    } catch (e: unknown) {
      console.error('Store: Error fetching country details:', e)
      errorMessage.value = e instanceof Error ? e.message : 'Failed to fetch country details.'
      countryDetail.value = null
    } finally {
      isLoadingDetail.value = false
    }
  }

  // Helper function to clear cache (useful for testing or force refresh)
  function clearCountriesCache() {
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
