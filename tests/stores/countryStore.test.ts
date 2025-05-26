import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCountryStore } from '../../stores/countryStore'

// Mock data
const mockCountriesApiResponse = [
  {
    name: { common: 'United States' },
    cca2: 'US',
  },
  {
    name: { common: 'France' },
    cca2: 'FR',
  },
  {
    name: { common: 'Germany' },
    cca2: 'DE',
  },
]

const mockCountryDetailApiResponse = [
  {
    name: { common: 'United States' },
    cca2: 'US',
    capital: ['Washington, D.C.'],
    population: 331900000,
    currencies: {
      USD: { name: 'United States dollar', symbol: '$' },
    },
    languages: {
      eng: 'English',
    },
    flags: {
      png: 'https://flagcdn.com/w320/us.png',
      svg: 'https://flagcdn.com/us.svg',
    },
  },
]

describe('Country Store', () => {
  let store: ReturnType<typeof useCountryStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCountryStore()
    vi.clearAllMocks()
    // Clear cache to ensure consistent test behavior
    store.clearCountriesCache()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.countryList).toEqual([])
      expect(store.selectedCountry).toBe(null)
      expect(store.countryDetail).toBe(null)
      expect(store.isLoading).toBe(false)
      expect(store.isLoadingDetail).toBe(false)
      expect(store.errorMessage).toBe(null)
    })
  })

  describe('fetchCountries', () => {
    it('should fetch countries successfully and update state', async () => {
      // Mock successful API response
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCountriesApiResponse,
      } as Response)

      // Call the action
      await store.fetchCountries()

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all?fields=name,cca2')

      // Verify state updates
      expect(store.isLoading).toBe(false)
      expect(store.errorMessage).toBe(null)
      expect(store.countryList).toEqual([
        { label: 'France', value: 'FR' },
        { label: 'Germany', value: 'DE' },
        { label: 'United States', value: 'US' },
      ])
    })

    it('should set loading state correctly during fetch', async () => {
      // Mock a delayed response
      const mockFetch = vi.mocked(global.fetch)
      let resolvePromise: (value: Response) => void
      const fetchPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve
      })

      mockFetch.mockReturnValueOnce(fetchPromise)

      // Start the fetch
      const fetchPromise2 = store.fetchCountries()

      // Check loading state is true
      expect(store.isLoading).toBe(true)

      // Resolve the promise
      resolvePromise!({
        ok: true,
        status: 200,
        json: async () => mockCountriesApiResponse,
      } as Response)

      await fetchPromise2

      // Check loading state is false after completion
      expect(store.isLoading).toBe(false)
    })

    it('should handle network errors correctly', async () => {
      // Mock network error
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await store.fetchCountries()

      // Verify error handling
      expect(store.isLoading).toBe(false)
      expect(store.errorMessage).toBe('Network error')
      expect(store.countryList).toEqual([])
    })

    it('should handle fetch exceptions correctly', async () => {
      // Mock fetch throwing an error
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockRejectedValueOnce(new Error('Connection failed'))

      await store.fetchCountries()

      // Verify error handling
      expect(store.isLoading).toBe(false)
      expect(store.errorMessage).toBe('Connection failed')
      expect(store.countryList).toEqual([])
    })

    it('should handle unknown errors correctly', async () => {
      // Mock fetch throwing a non-Error object
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockRejectedValueOnce('Unknown error')

      await store.fetchCountries()

      // Verify error handling
      expect(store.isLoading).toBe(false)
      expect(store.errorMessage).toBe('Failed to fetch countries.')
      expect(store.countryList).toEqual([])
    })

    it('should sort countries alphabetically', async () => {
      // Mock API response with unsorted countries
      const unsortedCountries = [
        { name: { common: 'Zimbabwe' }, cca2: 'ZW' },
        { name: { common: 'Albania' }, cca2: 'AL' },
        { name: { common: 'Brazil' }, cca2: 'BR' },
      ]

      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => unsortedCountries,
      } as Response)

      await store.fetchCountries()

      // Verify countries are sorted alphabetically
      expect(store.countryList).toEqual([
        { label: 'Albania', value: 'AL' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Zimbabwe', value: 'ZW' },
      ])
    })

    it('should use cached countries on subsequent calls', async () => {
      // Mock first API call
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCountriesApiResponse,
      } as Response)

      // First call should fetch from API
      await store.fetchCountries()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(store.countryList).toHaveLength(3)

      // Second call should use cache (no additional API call)
      await store.fetchCountries()
      expect(mockFetch).toHaveBeenCalledTimes(1) // Still only 1 call
      expect(store.countryList).toHaveLength(3) // Data still available
    })

    it('should fetch from API after cache is cleared', async () => {
      // Mock API calls
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCountriesApiResponse,
      } as Response)

      // First call
      await store.fetchCountries()
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Clear cache
      store.clearCountriesCache()
      expect(store.countryList).toHaveLength(0)

      // Next call should fetch from API again
      await store.fetchCountries()
      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(store.countryList).toHaveLength(3)
    })
  })

  describe('fetchCountryDetail', () => {
    it('should fetch country details successfully and update state', async () => {
      // Mock successful API response
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCountryDetailApiResponse,
      } as Response)

      // Call the action
      await store.fetchCountryDetail('US')

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/US')

      // Verify state updates
      expect(store.isLoadingDetail).toBe(false)
      expect(store.errorMessage).toBe(null)
      expect(store.countryDetail).toEqual({
        name: 'United States',
        code: 'US',
        capital: ['Washington, D.C.'],
        population: 331900000,
        currencies: {
          USD: { name: 'United States dollar', symbol: '$' },
        },
        languages: {
          eng: 'English',
        },
        flag: 'https://flagcdn.com/us.svg',
      })
    })

    it('should set loading detail state correctly during fetch', async () => {
      // Mock a delayed response
      const mockFetch = vi.mocked(global.fetch)
      let resolvePromise: (value: Response) => void
      const fetchPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve
      })

      mockFetch.mockReturnValueOnce(fetchPromise)

      // Start the fetch
      const fetchPromise2 = store.fetchCountryDetail('US')

      // Check loading state is true
      expect(store.isLoadingDetail).toBe(true)

      // Resolve the promise
      resolvePromise!({
        ok: true,
        status: 200,
        json: async () => mockCountryDetailApiResponse,
      } as Response)

      await fetchPromise2

      // Check loading state is false after completion
      expect(store.isLoadingDetail).toBe(false)
    })

    it('should handle network errors correctly', async () => {
      // Mock network error
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await store.fetchCountryDetail('INVALID')

      // Verify error handling
      expect(store.isLoadingDetail).toBe(false)
      expect(store.errorMessage).toBe('Failed to fetch country details')
      expect(store.countryDetail).toBe(null)
    })

    it('should handle fetch exceptions correctly', async () => {
      // Mock fetch throwing an error
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'))

      await store.fetchCountryDetail('US')

      // Verify error handling
      expect(store.isLoadingDetail).toBe(false)
      expect(store.errorMessage).toBe('Network timeout')
      expect(store.countryDetail).toBe(null)
    })

    it('should handle unknown errors correctly', async () => {
      // Mock fetch throwing a non-Error object
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockRejectedValueOnce('Unknown error')

      await store.fetchCountryDetail('US')

      // Verify error handling
      expect(store.isLoadingDetail).toBe(false)
      expect(store.errorMessage).toBe('Failed to fetch country details.')
      expect(store.countryDetail).toBe(null)
    })

    it('should handle missing optional fields correctly', async () => {
      // Mock API response with missing optional fields
      const incompleteCountryResponse = [
        {
          name: { common: 'Test Country' },
          cca2: 'TC',
          population: 1000000,
          flags: {
            png: 'https://example.com/flag.png',
            svg: 'https://example.com/flag.svg',
          },
          // Missing capital, currencies, languages
        },
      ]

      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => incompleteCountryResponse,
      } as Response)

      await store.fetchCountryDetail('TC')

      // Verify state handles missing fields correctly
      expect(store.countryDetail).toEqual({
        name: 'Test Country',
        code: 'TC',
        capital: [],
        population: 1000000,
        currencies: {},
        languages: {},
        flag: 'https://example.com/flag.svg',
      })
    })
  })

  describe('Error State Management', () => {
    it('should clear error message when starting a new fetch', async () => {
      // Set initial error state
      store.errorMessage = 'Previous error'

      // Mock successful response
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCountriesApiResponse,
      } as Response)

      await store.fetchCountries()

      // Verify error is cleared
      expect(store.errorMessage).toBe(null)
    })

    it('should clear error message when starting a new country detail fetch', async () => {
      // Set initial error state
      store.errorMessage = 'Previous error'

      // Mock successful response
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCountryDetailApiResponse,
      } as Response)

      await store.fetchCountryDetail('US')

      // Verify error is cleared
      expect(store.errorMessage).toBe(null)
    })
  })
})
