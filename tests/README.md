# Testing Setup

This project uses **Vitest** for unit testing with comprehensive coverage of the Pinia stores.

## 🧪 Test Configuration

- **Test Runner**: Vitest
- **Environment**: happy-dom (lightweight DOM simulation)
- **Mocking**: Vitest's built-in mocking capabilities
- **Store Testing**: Pinia with proper setup and teardown

## 📁 Test Structure

```
tests/
├── setup.ts                    # Global test setup and configuration
├── helpers/
│   └── mockData.ts             # Reusable mock data and helper functions
└── stores/
    └── countryStore.test.ts    # Country store unit tests
```

## 🚀 Running Tests

### Run all tests once
```bash
npm run test:run
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests interactively
```bash
npm test
```

## 📊 Test Coverage

The country store tests cover:

### ✅ **fetchCountries** Function
- ✅ Successful API response handling
- ✅ Loading state management
- ✅ Network error handling
- ✅ Exception handling
- ✅ Unknown error handling
- ✅ Alphabetical sorting of countries
- ✅ State updates verification

### ✅ **fetchCountryDetail** Function
- ✅ Successful API response handling
- ✅ Loading detail state management
- ✅ Network error handling
- ✅ Exception handling
- ✅ Unknown error handling
- ✅ Missing optional fields handling
- ✅ State updates verification

### ✅ **Error State Management**
- ✅ Error message clearing on new requests
- ✅ Proper error state transitions

### ✅ **Initial State**
- ✅ Correct default values for all state properties

## 🔧 Mock Strategy

### API Mocking
- Uses Vitest's `vi.mocked()` to mock the global `fetch` function
- Provides realistic API response structures
- Tests both success and failure scenarios

### State Management
- Fresh Pinia instance for each test
- Proper cleanup between tests
- Isolated test environments

### Console Mocking
- Console methods are mocked to reduce test noise
- Maintains clean test output

## 📝 Test Examples

### Testing Successful API Call
```typescript
it('should fetch countries successfully and update state', async () => {
  const mockFetch = vi.mocked(global.fetch)
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => mockCountriesApiResponse,
  } as Response)

  await store.fetchCountries()

  expect(store.countryList).toEqual(expectedSortedCountries)
  expect(store.errorMessage).toBe(null)
})
```

### Testing Error Handling
```typescript
it('should handle network errors correctly', async () => {
  const mockFetch = vi.mocked(global.fetch)
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  } as Response)

  await store.fetchCountries()

  expect(store.errorMessage).toBe('Network error')
  expect(store.countryList).toEqual([])
})
```

### Testing Loading States
```typescript
it('should set loading state correctly during fetch', async () => {
  // Test loading state during async operation
  const fetchPromise = store.fetchCountries()
  expect(store.isLoading).toBe(true)
  
  await fetchPromise
  expect(store.isLoading).toBe(false)
})
```

## 🎯 Best Practices

1. **Isolated Tests**: Each test has a fresh Pinia instance
2. **Comprehensive Mocking**: All external dependencies are mocked
3. **Edge Case Testing**: Tests cover error scenarios and edge cases
4. **State Verification**: Tests verify both successful and error state updates
5. **Async Testing**: Proper handling of async operations and loading states
6. **Type Safety**: Full TypeScript support with proper typing

## 🔍 Debugging Tests

To debug failing tests:

1. **Run specific test file**:
   ```bash
   npx vitest run tests/stores/countryStore.test.ts
   ```

2. **Run specific test**:
   ```bash
   npx vitest run -t "should fetch countries successfully"
   ```

3. **Enable verbose output**:
   ```bash
   npx vitest run --reporter=verbose
   ```

## 📈 Adding New Tests

When adding new tests:

1. Follow the existing test structure
2. Use the mock data helpers from `tests/helpers/mockData.ts`
3. Ensure proper cleanup with `beforeEach` hooks
4. Test both success and failure scenarios
5. Verify state changes and side effects
6. Add appropriate TypeScript types 