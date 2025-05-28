import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  // Only apply to API routes, but exclude icon API
  if (event.node.req.url?.startsWith('/api/') && !event.node.req.url?.includes('_nuxt_icon')) {
    // Set compression headers
    setHeader(event, 'Content-Encoding', 'gzip')
    setHeader(event, 'Vary', 'Accept-Encoding')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
  }
})
