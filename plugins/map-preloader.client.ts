export default defineNuxtPlugin(() => {
  // Only run on client side
  if (import.meta.server) return

  // Preload critical map tiles immediately for faster LCP
  const criticalTiles = [
    // World view tiles at zoom level 2
    'https://a.tile.openstreetmap.org/2/0/0.png',
    'https://a.tile.openstreetmap.org/2/0/1.png',
    'https://a.tile.openstreetmap.org/2/1/0.png',
    'https://a.tile.openstreetmap.org/2/1/1.png',
    'https://a.tile.openstreetmap.org/2/2/0.png',
    'https://a.tile.openstreetmap.org/2/2/1.png',
    'https://a.tile.openstreetmap.org/2/3/0.png',
    'https://a.tile.openstreetmap.org/2/3/1.png',
  ]

  // Preload tiles using different servers for better distribution
  const servers = ['a', 'b', 'c']
  let serverIndex = 0

  criticalTiles.forEach((tileUrl, index) => {
    // Distribute across different tile servers
    const server = servers[serverIndex % servers.length]
    const optimizedUrl = tileUrl.replace('https://a.', `https://${server}.`)
    
    // Create preload link
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = optimizedUrl
    link.as = 'image'
    link.crossOrigin = 'anonymous'
    
    // Add to head with slight delay to avoid blocking critical resources
    setTimeout(() => {
      document.head.appendChild(link)
    }, index * 50) // Stagger the preloads
    
    serverIndex++
  })

  // Preload the tile server connections
  servers.forEach((server) => {
    const preconnectLink = document.createElement('link')
    preconnectLink.rel = 'preconnect'
    preconnectLink.href = `https://${server}.tile.openstreetmap.org`
    preconnectLink.crossOrigin = 'anonymous'
    document.head.appendChild(preconnectLink)
  })
}) 