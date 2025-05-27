import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  // Only apply to API routes
  if (event.node.req.url?.startsWith('/api/')) {
    // Set compression headers
    setHeader(event, 'Content-Encoding', 'gzip')
    setHeader(event, 'Vary', 'Accept-Encoding')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
  }
})
