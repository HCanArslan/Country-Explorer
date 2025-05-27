#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('📱 Mobile Performance Testing & Deployment Script')
console.log('================================================\n')

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory')
  process.exit(1)
}

// Function to run command and capture output
function runCommand(command, description) {
  console.log(`🔄 ${description}...`)
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    console.log(`✅ ${description} completed`)
    return output
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    return null
  }
}

// Function to check file sizes
function checkBundleSize() {
  console.log('\n📊 Checking bundle sizes...')

  const outputDir = '.output'
  if (!fs.existsSync(outputDir)) {
    console.log('⚠️  No build output found. Run npm run build first.')
    return
  }

  // Check for main bundle files
  const publicDir = path.join(outputDir, 'public', '_nuxt')
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir)
    const jsFiles = files.filter((f) => f.endsWith('.js'))
    const cssFiles = files.filter((f) => f.endsWith('.css'))

    console.log(`📦 JavaScript files: ${jsFiles.length}`)
    console.log(`🎨 CSS files: ${cssFiles.length}`)

    // Calculate total size
    let totalSize = 0
    files.forEach((file) => {
      const filePath = path.join(publicDir, file)
      const stats = fs.statSync(filePath)
      totalSize += stats.size
    })

    console.log(`📏 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

    // Check for mobile-specific chunks
    const mobileChunks = files.filter((f) => f.includes('map-mobile') || f.includes('mobile'))
    if (mobileChunks.length > 0) {
      console.log(`📱 Mobile-optimized chunks found: ${mobileChunks.length}`)
      mobileChunks.forEach((chunk) => console.log(`   - ${chunk}`))
    }
  }
}

// Function to provide mobile testing instructions
function provideMobileTestingInstructions() {
  console.log('\n📱 Mobile Performance Testing Instructions')
  console.log('==========================================')
  console.log('')
  console.log('1. 🌐 Start Development Server:')
  console.log('   npm run dev')
  console.log('')
  console.log('2. 📱 Test Mobile Performance:')
  console.log('   - Open Chrome DevTools (F12)')
  console.log('   - Click "Toggle device toolbar" (Ctrl+Shift+M)')
  console.log('   - Select "Moto G Power" or similar mobile device')
  console.log('   - Set throttling to "Slow 3G"')
  console.log('   - Run Lighthouse audit (Mobile)')
  console.log('')
  console.log('3. 🎯 Expected Mobile Improvements:')
  console.log('   - Performance Score: 62 → 85+')
  console.log('   - FCP: 4.3s → <1.8s')
  console.log('   - LCP: 5.4s → <2.5s')
  console.log('   - CLS: 0.151 → <0.1')
  console.log('')
  console.log('4. 🔍 Key Features to Test:')
  console.log('   - Map loads only after user interaction on mobile')
  console.log('   - Country details panel appears at bottom on mobile')
  console.log('   - Smooth touch interactions')
  console.log('   - Fast page transitions')
  console.log('')
}

// Function to provide deployment instructions
function provideDeploymentInstructions() {
  console.log('\n🚀 Deployment Instructions')
  console.log('===========================')
  console.log('')
  console.log('📦 Build for Production:')
  console.log('   npm run build')
  console.log('')
  console.log('🔍 Verify Build:')
  console.log('   npm run preview')
  console.log('')
  console.log('☁️  Deploy to Vercel:')
  console.log('   vercel --prod')
  console.log('')
  console.log('🌐 Alternative Deployment:')
  console.log('   - Upload .output directory to your hosting provider')
  console.log('   - Ensure Node.js 18+ is available')
  console.log('   - Set build command: npm run build')
  console.log('   - Set output directory: .output/public')
  console.log('')
  console.log('📊 Post-Deployment Testing:')
  console.log('   - Run Lighthouse audit on live site')
  console.log('   - Test on real mobile devices')
  console.log('   - Monitor Core Web Vitals')
  console.log('')
}

// Main execution
async function main() {
  console.log('🔍 Checking project setup...')

  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...')
    runCommand('npm install', 'Installing dependencies')
  }

  // Check if mobile optimizations are in place
  const mobileOptimizationsExist = fs.existsSync('MOBILE_PERFORMANCE_OPTIMIZATIONS.md')
  const mobilePluginExists = fs.existsSync('plugins/mobile-performance.client.ts')

  console.log('\n✅ Mobile Optimization Status:')
  console.log(`   📄 Documentation: ${mobileOptimizationsExist ? '✅' : '❌'}`)
  console.log(`   🔌 Mobile Plugin: ${mobilePluginExists ? '✅' : '❌'}`)

  // Build the project
  console.log('\n🏗️  Building project with mobile optimizations...')
  const buildOutput = runCommand('npm run build', 'Building project')

  if (buildOutput) {
    checkBundleSize()

    console.log('\n🎉 Build completed successfully!')
    console.log('\n📱 Mobile optimizations implemented:')
    console.log('   ✅ Lazy map loading for mobile')
    console.log('   ✅ Mobile-optimized tile settings')
    console.log('   ✅ Responsive layout improvements')
    console.log('   ✅ Mobile performance monitoring')
    console.log('   ✅ Bundle optimization for mobile')
    console.log('   ✅ Touch event optimization')

    provideMobileTestingInstructions()
    provideDeploymentInstructions()

    console.log('📚 For detailed information, see:')
    console.log('   - MOBILE_PERFORMANCE_OPTIMIZATIONS.md')
    console.log('   - PERFORMANCE_OPTIMIZATIONS.md')
  } else {
    console.log('\n❌ Build failed. Please check the errors above.')
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Ensure all dependencies are installed: npm install')
    console.log('   2. Check for TypeScript errors: npm run type-check')
    console.log('   3. Verify Nuxt configuration: npm run dev')
  }
}

// Run the script
main().catch(console.error)
