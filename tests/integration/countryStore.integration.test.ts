import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCountryStore } from '../../stores/countryStore'
import { mockCountriesData, mockCountryDetails, createMockResponse } from '../helpers/mockData'

describe('Country Store Integration Tests', () => {
  let store: ReturnType<typeof useCountryStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCountryStore()
    vi.clearAllMocks()
    // Clear cache to ensure consistent test behavior
    store.clearCountriesCache()
  })

  describe('Complete User Flow', () => {
    it('should handle complete user journey: load countries -> select country -> load details', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Step 1: User loads the page - fetch countries
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCountriesData))

      await store.fetchCountries()

      // Verify countries are loaded and sorted
      expect(store.countryList).toHaveLength(5)
      expect(store.countryList[0].label).toBe('Brazil') // First alphabetically
      expect(store.countryList[4].label).toBe('United States') // Last alphabetically
      expect(store.isLoading).toBe(false)
      expect(store.errorMessage).toBe(null)

      // Step 2: User selects a country
      store.selectedCountry = 'US'
      expect(store.selectedCountry).toBe('US')

      // Step 3: Fetch country details
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCountryDetails.US))

      await store.fetchCountryDetail('US')

      // Verify country details are loaded
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
      expect(store.isLoadingDetail).toBe(false)
      expect(store.errorMessage).toBe(null)
    })

    it('should handle error recovery flow', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Step 1: Initial fetch fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await store.fetchCountries()

      // Verify error state
      expect(store.errorMessage).toBe('Network error')
      expect(store.countryList).toEqual([])
      expect(store.isLoading).toBe(false)

      // Step 2: User retries and succeeds
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCountriesData))

      await store.fetchCountries()

      // Verify recovery
      expect(store.errorMessage).toBe(null)
      expect(store.countryList).toHaveLength(5)
      expect(store.isLoading).toBe(false)
    })

    it('should handle multiple rapid requests correctly', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Mock multiple responses
      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockCountryDetails.US))
        .mockResolvedValueOnce(createMockResponse(mockCountryDetails.FR))
        .mockResolvedValueOnce(createMockResponse(mockCountryDetails.DE))

      // Make multiple rapid requests
      const promises = [
        store.fetchCountryDetail('US'),
        store.fetchCountryDetail('FR'),
        store.fetchCountryDetail('DE'),
      ]

      await Promise.all(promises)

      // The last request should win (Germany)
      expect(store.countryDetail?.name).toBe('Germany')
      expect(store.countryDetail?.code).toBe('DE')
      expect(store.isLoadingDetail).toBe(false)
    })
  })

  describe('State Consistency', () => {
    it('should maintain consistent state during concurrent operations', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Mock responses for concurrent operations
      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockCountriesData))
        .mockResolvedValueOnce(createMockResponse(mockCountryDetails.US))

      // Start both operations concurrently
      const countriesPromise = store.fetchCountries()
      const detailPromise = store.fetchCountryDetail('US')

      // Both loading states should be true
      expect(store.isLoading).toBe(true)
      expect(store.isLoadingDetail).toBe(true)

      await Promise.all([countriesPromise, detailPromise])

      // Both loading states should be false
      expect(store.isLoading).toBe(false)
      expect(store.isLoadingDetail).toBe(false)

      // Both data should be loaded
      expect(store.countryList).toHaveLength(5)
      expect(store.countryDetail?.name).toBe('United States')
      expect(store.errorMessage).toBe(null)
    })

    it('should handle partial failures in concurrent operations', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Mock one success, one failure
      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockCountriesData))
        .mockRejectedValueOnce(new Error('Country detail failed'))

      const countriesPromise = store.fetchCountries()
      const detailPromise = store.fetchCountryDetail('US')

      await Promise.all([countriesPromise, detailPromise])

      // Countries should be loaded, detail should fail
      expect(store.countryList).toHaveLength(5)
      expect(store.countryDetail).toBe(null)
      expect(store.errorMessage).toBe('Country detail failed')
      expect(store.isLoading).toBe(false)
      expect(store.isLoadingDetail).toBe(false)
    })
  })

  describe('Performance and Edge Cases', () => {
    it('should handle empty API responses gracefully', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Mock empty response
      mockFetch.mockResolvedValueOnce(createMockResponse([]))

      await store.fetchCountries()

      expect(store.countryList).toEqual([])
      expect(store.errorMessage).toBe(null)
      expect(store.isLoading).toBe(false)
    })

    it('should handle malformed API responses', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Mock malformed response
      const malformedData = [
        { name: 'Invalid' }, // Missing required fields
        { cca2: 'XX' }, // Missing name
      ]

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData))

      await store.fetchCountries()

      // Should handle gracefully and filter out invalid entries
      expect(store.isLoading).toBe(false)
      // The exact behavior depends on how the store handles malformed data
    })

    it('should handle very large datasets efficiently', async () => {
      const mockFetch = vi.mocked(global.fetch)

      // Create a large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        name: { common: `Country ${i.toString().padStart(3, '0')}` },
        cca2: `C${i.toString().padStart(2, '0')}`,
      }))

      mockFetch.mockResolvedValueOnce(createMockResponse(largeDataset))

      const startTime = Date.now()
      await store.fetchCountries()
      const endTime = Date.now()

      // Should complete in reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000)
      expect(store.countryList).toHaveLength(1000)
      expect(store.countryList[0].label).toBe('Country 000') // Should be sorted
    })
  })
})
