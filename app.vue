<template>
  <NuxtPage />
</template>

<script setup>
// Set meta tags for better mobile experience

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content:
        'Explore countries around the world with detailed information about capitals, populations, currencies, and languages.',
    },
  ],
  title: 'Country Explorer - Discover Countries Worldwide',
})
</script>
