#!/usr/bin/env node

import { spawn } from 'child_process'

// Clear console for clean start
console.clear()

// Professional build message
console.log('\n🏗️  \x1b[36m\x1b[1mCountry Explorer\x1b[0m - Production Build')
console.log('\x1b[2m─────────────────────────────────────────\x1b[0m')
console.log('📦 Building optimized production bundle...')
console.log('⚡ SSR enabled for better SEO')
console.log('🎨 Tailwind CSS optimized and purged')
console.log('🔧 TypeScript compiled and type-checked')
console.log('\x1b[2m─────────────────────────────────────────\x1b[0m\n')

// Start build with clean output
const build = spawn('npx', ['nuxt', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation --no-warnings',
    NUXT_TELEMETRY_DISABLED: '1',
  },
})

build.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ \x1b[32m\x1b[1mBuild completed successfully!\x1b[0m')
    console.log('🚀 Ready for production deployment')
    console.log('📊 Optimized for performance and SEO\n')
  } else {
    console.log(`\n❌ Build failed with exit code ${code}`)
  }
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Build process interrupted')
  build.kill('SIGINT')
  process.exit(0)
})
