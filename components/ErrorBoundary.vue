<template>
  <div>
    <div v-if="hasError" class="error-boundary">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div class="flex items-center mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
            Something went wrong
          </h3>
        </div>
        <p class="text-red-700 dark:text-red-300 mb-4">
          {{ errorMessage || 'An unexpected error occurred while loading this component.' }}
        </p>
        <div class="flex gap-3">
          <UButton
            color="red"
            variant="solid"
            size="sm"
            @click="retry"
          >
            Try Again
          </UButton>
          <UButton
            color="gray"
            variant="outline"
            size="sm"
            @click="reload"
          >
            Reload Page
          </UButton>
        </div>
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

interface Props {
  fallbackMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: 'An unexpected error occurred.',
})

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message || props.fallbackMessage
  return false
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
}

function reload() {
  if (import.meta.client) {
    window.location.reload()
  }
}
</script> 