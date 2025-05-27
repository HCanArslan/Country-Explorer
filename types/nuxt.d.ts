// Nuxt 3 auto-imports type declarations
declare global {
  // These are auto-imported by Nuxt 3
  const definePageMeta: (typeof import('#app/composables/router'))['definePageMeta']
  const useRoute: (typeof import('#app/composables/router'))['useRoute']
  const useRouter: (typeof import('#app/composables/router'))['useRouter']
  const navigateTo: (typeof import('#app/composables/router'))['navigateTo']
  const useHead: (typeof import('#app/composables/head'))['useHead']
  const useFetch: (typeof import('#app/composables/fetch'))['useFetch']
  const createError: (typeof import('#app/composables/error'))['createError']
}

export {}
