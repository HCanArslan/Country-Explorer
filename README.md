# 🌍 Country Explorer

> A modern, responsive web application for exploring countries around the world with interactive maps, detailed information, and optimized mobile performance.

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.17.4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5.14-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Live Demo](#-live-demo)
- [🛠️ Tech Stack](#️-tech-stack)
- [📱 Performance](#-performance)
- [📊 Analytics & Monitoring](#-analytics--monitoring)
- [🏗️ Architecture](#️-architecture)
- [⚡ Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🔧 Development](#-development)
- [🏭 Production](#-production)
- [🧪 Testing](#-testing)
- [📊 Performance Optimizations](#-performance-optimizations)
- [🎨 UI/UX Features](#-uiux-features)
- [🌐 API Integration](#-api-integration)
- [📱 Mobile Optimizations](#-mobile-optimizations)
- [🔍 SEO & Accessibility](#-seo--accessibility)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🗺️ Interactive World Map
- **Clickable Countries**: Interactive Leaflet.js map with clickable country boundaries
- **Real-time Information**: Instant country details on map interaction
- **Mobile Optimized**: Touch-friendly interface with optimized tile loading
- **Responsive Design**: Adapts seamlessly to all screen sizes

### 🔍 Advanced Search
- **Smart Search**: Intelligent country search with autocomplete
- **Multiple Filters**: Search by name, region, or other criteria
- **Real-time Results**: Instant search results as you type
- **Error Handling**: Graceful fallbacks for network issues

### 📊 Comprehensive Country Data
- **Detailed Information**: Population, capital, languages, currencies
- **Visual Elements**: Country flags and regional information
- **Data Validation**: Robust error handling and data validation
- **Multiple Sources**: Fallback data sources for reliability

### 🎨 Modern UI/UX
- **Dark/Light Mode**: System preference detection with manual toggle
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Optimized transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation

### ⚡ Performance Optimized
- **Mobile LCP**: Optimized for Largest Contentful Paint < 3s
- **Zero CLS**: Cumulative Layout Shift prevention
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Lazy loading and responsive images

### 📊 Analytics & Monitoring
- **Web Analytics**: Real-time visitor tracking with Vercel Analytics
- **Performance Monitoring**: Core Web Vitals and page performance metrics
- **User Behavior**: Page views, navigation patterns, and user engagement
- **Privacy-Focused**: GDPR compliant analytics without cookies

## 🚀 Live Demo

🔗 **[View Live Application](https://country-explorer-zeta.vercel.app/)**

## 🛠️ Tech Stack

### Frontend Framework
- **[Nuxt 3](https://nuxt.com/)** - Full-stack Vue framework with SSR/SSG
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Nuxt UI](https://ui.nuxt.com/)** - Vue component library
- **[Heroicons](https://heroicons.com/)** - Beautiful hand-crafted SVG icons

### State Management & Data
- **[Pinia](https://pinia.vuejs.org/)** - Vue state management
- **[REST Countries API](https://restcountries.com/)** - Country data source

### Maps & Visualization
- **[Leaflet.js](https://leafletjs.com/)** - Interactive map library
- **[Vue Leaflet](https://vue-leaflet.github.io/)** - Vue wrapper for Leaflet
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Map tile provider

### Development & Build
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Vitest](https://vitest.dev/)** - Unit testing framework

### Deployment & Infrastructure
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics and performance monitoring
- **[Nitro](https://nitro.unjs.io/)** - Server engine

## 📱 Performance

### Lighthouse Scores 
- **Performance**: 95+ / 100
- **Accessibility**: 100 / 100
- **Best Practices**: 100 / 100
- **SEO**: 100 / 100

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 📊 Analytics & Monitoring

### 🔍 Vercel Analytics Integration
The application includes comprehensive web analytics powered by **Vercel Analytics**, providing real-time insights into user behavior and application performance.

#### Features
- **Real-time Tracking**: Live visitor data and page view analytics
- **Performance Metrics**: Core Web Vitals monitoring and performance insights
- **User Journey**: Navigation patterns and user engagement tracking
- **Privacy-First**: GDPR compliant analytics without cookies or personal data collection
- **Zero Configuration**: Automatic setup with no additional configuration required

#### Implementation
```typescript
// app.vue - Analytics component integration
import { Analytics } from '@vercel/analytics/vue'

// Automatically tracks:
// - Page views across all routes
// - Navigation events
// - Core Web Vitals
// - User engagement metrics
```

#### Analytics Dashboard
Access your analytics data through the [Vercel Dashboard](https://vercel.com/analytics) to monitor:
- **Traffic Patterns**: Visitor counts, page views, and session duration
- **Performance Insights**: Real user monitoring of Core Web Vitals
- **Geographic Data**: Visitor locations and regional performance
- **Device Analytics**: Desktop vs mobile usage patterns
- **Referral Sources**: Traffic sources and campaign effectiveness

#### Privacy & Compliance
- **No Cookies**: Analytics work without storing cookies
- **Anonymous Data**: No personally identifiable information collected
- **GDPR Compliant**: Meets European privacy regulations
- **Lightweight**: < 1KB impact on bundle size

## 🏗️ Architecture

```
country-explorer/
├── 📁 assets/              # Static assets (CSS, images)
│   └── css/
│       ├── main.css        # Global styles
│       └── mobile-performance.css
├── 📁 components/          # Vue components
│   ├── AppHeader.vue       # Navigation header
│   ├── CountryDetails.vue  # Country information display
│   ├── CountrySearch.vue   # Search functionality
│   ├── ErrorBoundary.vue   # Error handling
│   └── InteractiveMap.vue  # Map component
├── 📁 composables/         # Vue composables
│   └── useCountries.ts     # Country data logic
├── 📁 pages/              # Route pages
│   ├── index.vue          # Home page
│   └── country/
│       └── [code].vue     # Country detail page
├── 📁 plugins/            # Nuxt plugins
│   ├── mobile-performance.client.ts
│   └── map-preloader.client.ts
├── 📁 stores/             # Pinia stores
│   └── countryStore.ts    # Country state management
├── 📁 types/              # TypeScript definitions
│   └── country.ts         # Country interfaces
├── 📁 server/             # Server-side code
│   └── api/               # API routes
├── 📁 tests/              # Test files
│   └── components/        # Component tests
├── 📄 nuxt.config.ts      # Nuxt configuration
├── 📄 tailwind.config.ts  # Tailwind configuration
└── 📄 package.json        # Dependencies
```

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/HCanArslan/Country-Explorer.git
cd Country-Explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 📦 Installation

### Prerequisites
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

### Step-by-step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HCanArslan/Country-Explorer.git
   cd Country-Explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup** (optional)
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run typecheck` | TypeScript type checking |

### Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name
   
   # Start development server
   npm run dev
   
   # Make changes and test
   npm run test
   npm run lint
   ```

2. **Code Quality**
   ```bash
   # Format code
   npm run lint:fix
   
   # Type checking
   npm run typecheck
   
   # Run tests
   npm run test:coverage
   ```

3. **Build Testing**
   ```bash
   # Build for production
   npm run build
   
   # Preview build
   npm run preview
   ```

## 🏭 Production

### Build Process

```bash
# Production build
npm run build

# Analyze bundle
npm run build:analyze

# Performance audit
npm run performance:audit
```

### Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Manual Deployment
```bash
# Build
npm run build

# Deploy .output directory to your hosting provider
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Countries API endpoint | `https://restcountries.com/v3.1` |
| `NODE_ENV` | Environment mode | `development` |

## 🧪 Testing

### Test Structure
```
tests/
├── components/           # Component tests
├── composables/         # Composable tests
├── pages/              # Page tests
└── utils/              # Utility tests
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- CountrySearch.test.ts
```

### Test Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 📊 Performance Optimizations

### 🚀 Core Optimizations

#### Bundle Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip/Brotli compression enabled
- **Minification**: CSS and JavaScript minification

#### Image Optimization
- **Lazy Loading**: Images load on demand
- **Responsive Images**: Multiple sizes for different screens
- **WebP Support**: Modern image format when supported
- **Preloading**: Critical images preloaded

#### Caching Strategy
- **Static Assets**: 1-year cache with immutable headers
- **API Responses**: 5-minute cache with CDN
- **Pages**: 1-hour ISR (Incremental Static Regeneration)

### 📱 Mobile-Specific Optimizations

#### Map Performance
- **Tile Preloading**: Critical map tiles preloaded
- **Reduced Quality**: Lower zoom levels on mobile
- **Buffer Optimization**: Minimal tile buffer for faster loading
- **Touch Optimization**: Passive event listeners

#### Layout Stability
- **Fixed Dimensions**: Prevent layout shifts
- **CSS Containment**: Layout containment for map components
- **Skeleton Loading**: Consistent loading states

#### Network Optimization
- **Preconnect**: DNS prefetch for external domains
- **Resource Hints**: Preload critical resources
- **Service Worker**: Offline capability (future enhancement)

## 🎨 UI/UX Features

### 🌓 Dark/Light Mode
- **System Detection**: Automatic theme based on OS preference
- **Manual Toggle**: User can override system preference
- **Persistent**: Theme choice saved in localStorage
- **Smooth Transitions**: Animated theme switching

### 📱 Responsive Design
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: Tailwind's responsive breakpoint system
- **Touch-Friendly**: Optimized touch targets (44px minimum)
- **Flexible Layouts**: CSS Grid and Flexbox

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators

### 🎭 Animations
- **Micro-interactions**: Subtle hover and focus effects
- **Page Transitions**: Smooth route transitions
- **Loading States**: Engaging loading animations
- **Reduced Motion**: Respects user's motion preferences

## 🌐 API Integration

### REST Countries API
- **Endpoint**: `https://restcountries.com/v3.1/`
- **Rate Limiting**: No rate limits
- **Data Fields**: Name, capital, population, region, languages, currencies, flags
- **Error Handling**: Graceful fallbacks and retry logic

### Data Flow
```
User Interaction → Pinia Store → API Call → Data Validation → UI Update
```

### Caching Strategy
- **Memory Cache**: Store data in Pinia for session
- **HTTP Cache**: Browser cache for API responses
- **Fallback Data**: Static country list for offline scenarios

## 📱 Mobile Optimizations

### Performance Metrics
- **Target LCP**: < 2.5 seconds
- **Target CLS**: < 0.1
- **Target FID**: < 100ms

### Optimization Techniques

#### Map Optimizations
```typescript
// Mobile-specific tile options
const mobileOptimizedTileOptions = {
  maxZoom: 8,           // Reduced from 18
  keepBuffer: 0,        // Minimal buffer
  updateWhenIdle: true, // Update only when idle
  detectRetina: false,  // Disable retina detection
}
```

#### CSS Optimizations
```css
/* Prevent layout shifts */
.leaflet-container {
  contain: layout style paint;
  min-height: 352px;
  height: 300px !important;
}

/* Optimize animations */
@media (max-width: 768px) {
  * {
    animation-duration: 0.2s !important;
    transition-duration: 0.2s !important;
  }
}
```

#### JavaScript Optimizations
- **Passive Event Listeners**: Touch events use passive listeners
- **Intersection Observer**: Lazy loading implementation
- **RequestIdleCallback**: Non-critical tasks during idle time

## 🔍 SEO & Accessibility

### SEO Features
- **Meta Tags**: Dynamic meta descriptions and titles
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling instructions

### Accessibility Features
- **ARIA Labels**: Comprehensive ARIA implementation
- **Semantic HTML**: Proper HTML5 semantic elements
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader**: VoiceOver and NVDA tested
- **Color Contrast**: WCAG AA compliance

### Performance Monitoring
- **Lighthouse CI**: Automated performance testing
- **Core Web Vitals**: Real user monitoring
- **Error Tracking**: Client-side error monitoring

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new features**
5. **Ensure all tests pass**
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Standards
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is enforced
- **TypeScript**: Strict type checking enabled
- **Testing**: Maintain test coverage above 80%
- **Commits**: Use conventional commit messages

### Bug Reports
Please use the [GitHub Issues](https://github.com/HCanArslan/Country-Explorer/issues) page to report bugs.

Include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed reproduction steps
- **Expected Behavior**: What should happen
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[REST Countries API](https://restcountries.com/)** - Free country data API
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Open-source map data
- **[Nuxt Team](https://nuxt.com/)** - Amazing Vue.js framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vercel](https://vercel.com/)** - Deployment platform

---

<div align="center">

**[⬆ Back to Top](#-country-explorer)**

Made with ❤️ by [HCanArslan](https://github.com/HCanArslan)

</div>
