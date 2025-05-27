#!/usr/bin/env node

import { spawn } from 'child_process'

// Clear console for clean start
console.clear()

// Professional startup message
console.log('\n🌍 \x1b[36m\x1b[1mCountry Explorer\x1b[0m - Development Server')
console.log('\x1b[2m─────────────────────────────────────────\x1b[0m')
console.log('🚀 Starting development server...')
console.log('📱 Responsive design with dark/light mode')
console.log('🔍 Real-time search with intelligent caching')
console.log('🧪 25+ comprehensive tests included')
console.log('\x1b[2m─────────────────────────────────────────\x1b[0m\n')

// Start Nuxt with clean output
const nuxt = spawn('npx', ['nuxt', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation --no-warnings',
    NUXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'development',
    // Disable Sharp for development to avoid ES module issues
    NUXT_IMAGE_PROVIDER: 'ipx',
  },
})

nuxt.on('close', (code) => {
  if (code !== 0) {
    console.log(`\n❌ Development server exited with code ${code}`)
  }
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Thanks for exploring Country Explorer!')
  console.log('🌟 A modern Vue.js application with comprehensive features\n')
  nuxt.kill('SIGINT')
  process.exit(0)
})
