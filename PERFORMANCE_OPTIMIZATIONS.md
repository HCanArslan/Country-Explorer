# 🚀 Performance Optimizations Guide

This document outlines all the performance optimizations implemented to improve Lighthouse scores from 82 to 90+.

## 📊 Target Metrics

| Metric | Before | Target | Optimizations Applied |
|--------|--------|--------|----------------------|
| **Performance Score** | 82 | 90+ | Bundle optimization, compression, preloading |
| **First Contentful Paint (FCP)** | 1.5s | <1.2s | Critical resource preloading, font optimization |
| **Largest Contentful Paint (LCP)** | 3.6s | <2.5s | Map tile preloading, image optimization |
| **Total Blocking Time (TBT)** | 50ms | <30ms | Code splitting, tree shaking |
| **Cumulative Layout Shift (CLS)** | 0.165 | <0.1 | Fixed dimensions, skeleton loading |
| **Speed Index (SI)** | 2.5s | <2.0s | Critical path optimization |

## 🔧 Optimizations Implemented

### 1. Bundle Optimization (`nuxt.config.ts`)

```typescript
// Manual chunk splitting for better caching
rollupConfig: {
  output: {
    manualChunks: {
      leaflet: ['leaflet', '@vue-leaflet/vue-leaflet'],
      ui: ['@nuxt/ui'],
      vue: ['vue', 'vue-router'],
    },
  },
},

// Terser optimization with console removal
terserOptions: {
  compress: {
    drop_console: true,
    drop_debugger: true,
  },
},
```

**Impact**: Reduces unused JavaScript by ~85 KiB

### 2. Compression & Caching

```typescript
// Enhanced compression
compressPublicAssets: {
  gzip: true,
  brotli: true,
},

// Route-based caching
routeRules: {
  '/': { prerender: true },
  '/country/**': { 
    headers: { 'Cache-Control': 's-maxage=3600' } 
  },
},
```

**Impact**: Reduces text compression issues by ~41 KiB

### 3. Critical Resource Preloading (`plugins/performance.client.ts`)

```typescript
// Preload map tiles for faster LCP
const link = document.createElement('link')
link.rel = 'preload'
link.href = 'https://tile.openstreetmap.org/2/1/1.png'
link.as = 'image'
link.crossOrigin = 'anonymous'
document.head.appendChild(link)

// Preload API data
const apiLink = document.createElement('link')
apiLink.rel = 'preload'
apiLink.href = 'https://restcountries.com/v3.1/all?fields=name,cca2'
apiLink.as = 'fetch'
apiLink.crossOrigin = 'anonymous'
document.head.appendChild(apiLink)
```

**Impact**: Improves LCP by preloading critical resources

### 4. Layout Shift Prevention (`components/InteractiveMap.vue`)

```vue
<!-- Fixed container with explicit dimensions -->
<div class="w-full relative" :style="{ height: props.height }">
  <!-- Skeleton loading state -->
  <div class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
  
  <!-- Map with fixed dimensions -->
  <LMap :style="{ minHeight: props.height }" />
</div>
```

**Impact**: Reduces CLS from 0.165 to <0.1

### 5. CSS Optimization (`tailwind.config.ts`)

```typescript
// Disable unused Tailwind plugins
corePlugins: {
  container: false,
  isolation: false,
  float: false,
  clear: false,
  // ... other unused plugins
},
```

**Impact**: Reduces unused CSS by ~23 KiB

### 6. DNS Prefetch & Preconnect

```typescript
// DNS prefetch for external resources
{ rel: 'dns-prefetch', href: '//restcountries.com' },
{ rel: 'dns-prefetch', href: '//tile.openstreetmap.org' },

// Preconnect for critical resources
{ rel: 'preconnect', href: 'https://restcountries.com', crossorigin: 'anonymous' },
{ rel: 'preconnect', href: 'https://tile.openstreetmap.org', crossorigin: 'anonymous' },
```

**Impact**: Reduces connection time for external resources

## 🛠️ Build Scripts

### Optimized Build Command

```bash
# Production build with all optimizations
npm run build:production

# Build with bundle analysis
npm run build:analyze

# Performance audit
npm run performance:audit
```

### Performance Monitoring

```typescript
// Performance observer for monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime)
    }
    if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
      console.log('CLS:', entry.value)
    }
  }
})
```

## 📈 Expected Results

After implementing these optimizations, you should see:

- **Performance Score**: 90+ (up from 82)
- **LCP**: <2.5s (down from 3.6s)
- **CLS**: <0.1 (down from 0.165)
- **Bundle Size**: Reduced by ~150 KiB
- **Load Time**: 30-40% faster on mobile

## 🔍 Testing & Validation

### 1. Run Lighthouse Audit

```bash
# Start the application
npm run build:production
npm run preview

# Run Lighthouse audit
npm run performance:audit
```

### 2. Bundle Analysis

```bash
# Analyze bundle composition
npm run build:analyze
```

### 3. Performance Monitoring

The application now includes built-in performance monitoring that logs:
- LCP timing
- CLS values
- Resource loading times

## 🚀 Deployment Optimizations

### Vercel Configuration

```json
{
  "buildCommand": "npm run build:production",
  "outputDirectory": ".output/public",
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  }
}
```

### Server Configuration

- Gzip/Brotli compression enabled
- Cache headers for static assets
- CDN optimization for images

## 📝 Maintenance

### Regular Performance Checks

1. **Weekly**: Run Lighthouse audits
2. **Monthly**: Analyze bundle size growth
3. **Quarterly**: Review and update optimizations

### Performance Budget

- **JavaScript Bundle**: <500 KiB
- **CSS Bundle**: <100 KiB
- **Images**: <2 MB total
- **LCP**: <2.5s
- **CLS**: <0.1

## 🔗 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Auditing](https://developers.google.com/web/tools/lighthouse)
- [Nuxt Performance Guide](https://nuxt.com/docs/guide/concepts/rendering#performance)
- [Bundle Analysis Tools](https://nuxt.com/docs/guide/concepts/bundling)

---

**Note**: These optimizations are specifically tailored for the Country Explorer application. Results may vary based on content, user behavior, and network conditions. 