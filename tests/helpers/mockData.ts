// Mock API response types
export interface MockCountryApiResponse {
  name: { common: string }
  cca2: string
}

export interface MockCountryDetailApiResponse {
  name: { common: string }
  cca2: string
  capital?: string[]
  population: number
  currencies?: Record<string, { name: string; symbol: string }>
  languages?: Record<string, string>
  flags: {
    png: string
    svg: string
  }
}

// Mock data for countries list
export const mockCountriesData: MockCountryApiResponse[] = [
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
  {
    name: { common: 'Japan' },
    cca2: 'JP',
  },
  {
    name: { common: 'Brazil' },
    cca2: 'BR',
  },
]

// Mock data for country details
export const mockCountryDetails: Record<string, MockCountryDetailApiResponse[]> = {
  US: [
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
  ],
  FR: [
    {
      name: { common: 'France' },
      cca2: 'FR',
      capital: ['Paris'],
      population: 67390000,
      currencies: {
        EUR: { name: 'Euro', symbol: '€' },
      },
      languages: {
        fra: 'French',
      },
      flags: {
        png: 'https://flagcdn.com/w320/fr.png',
        svg: 'https://flagcdn.com/fr.svg',
      },
    },
  ],
  DE: [
    {
      name: { common: 'Germany' },
      cca2: 'DE',
      capital: ['Berlin'],
      population: 83240000,
      currencies: {
        EUR: { name: 'Euro', symbol: '€' },
      },
      languages: {
        deu: 'German',
      },
      flags: {
        png: 'https://flagcdn.com/w320/de.png',
        svg: 'https://flagcdn.com/de.svg',
      },
    },
  ],
}

// Helper function to create mock fetch responses
export function createMockResponse(data: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => data,
  } as Response
}

// Helper function to create network error response
export function createNetworkErrorResponse(status = 500): Response {
  return {
    ok: false,
    status,
  } as Response
}
