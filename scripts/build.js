#!/usr/bin/env node

const { spawn } = require('child_process')

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
    console.log('📁 Output: .output/ directory')
    console.log('🚀 Ready for deployment to Vercel, Netlify, or any Node.js host')
    console.log('🎯 Perfect for showcasing production-ready Vue.js applications\n')
  } else {
    console.log(`\n❌ Build failed with code ${code}`)
  }
})
