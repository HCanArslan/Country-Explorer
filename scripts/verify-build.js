#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

console.log('Build Verification Script')
console.log('========================\n')

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('Error: Please run this script from the project root directory')
  process.exit(1)
}

// Function to run command
function runCommand(command, description) {
  console.log(`Running: ${description}...`)
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    console.log(`Success: ${description} completed`)
    return output
  } catch (error) {
    console.error(`Error: ${description} failed:`, error.message)
    return null
  }
}

// Main execution
async function main() {
  console.log('Checking project setup...')

  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...')
    runCommand('npm install', 'Installing dependencies')
  }

  // Build the project
  console.log('\nBuilding project...')
  const buildOutput = runCommand('npm run build', 'Building project')

  if (buildOutput) {
    console.log('\nBuild completed successfully!')
    console.log('Project is ready for production deployment.')

    // Check if build output exists
    if (fs.existsSync('.output')) {
      console.log('Build output directory created: .output')

      // Check for main files
      const publicDir = '.output/public'
      if (fs.existsSync(publicDir)) {
        console.log('Public assets directory created: .output/public')
      }

      const serverDir = '.output/server'
      if (fs.existsSync(serverDir)) {
        console.log('Server directory created: .output/server')
      }
    }

    console.log('\nNext steps:')
    console.log('1. Test locally: npm run preview')
    console.log('2. Deploy to Vercel: vercel --prod')
    console.log('3. Or upload .output directory to your hosting provider')
  } else {
    console.log('\nBuild failed. Please check the errors above.')
  }
}

// Run the script
main().catch(console.error)
