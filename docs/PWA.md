# PWA Documentation

## Progressive Web App Features

This project is now a fully functional Progressive Web App (PWA) with the following features:

### ✨ Features

- **📱 Installable**: Users can install the app on their devices (mobile and desktop)
- **🔄 Offline Support**: The app works offline with intelligent caching strategies
- **⚡ Fast Loading**: Optimized caching for faster subsequent loads
- **📲 App-like Experience**: Runs in standalone mode without browser UI
- **🎨 Adaptive Icons**: Theme-aware icons for light and dark modes

### 🛠 Implementation Details

#### Package Used:
- **[@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa)** - Next.js 15+ compatible PWA plugin

#### Files Added/Modified:

1. **`public/manifest.json`** - PWA manifest configuration
2. **`public/offline.html`** - Beautiful offline fallback page
3. **`components/pwa-install-prompt.tsx`** - Install prompt component
4. **`next.config.mjs`** - PWA configuration with caching strategies
5. **`app/layout.tsx`** - Added PWA meta tags and manifest link

#### Caching Strategies:

- **CacheFirst**: For fonts and media files that rarely change
- **StaleWhileRevalidate**: For images, CSS, JS - serve cached version while updating
- **NetworkFirst**: For API calls and dynamic content - try network first, fallback to cache

### 📦 Installation

The PWA is automatically configured. When users visit the site:

1. On supported browsers, an install prompt will appear
2. Users can also install via browser menu (Chrome: "Install App", Safari: "Add to Home Screen")
3. The app icon will appear on their device home screen

### 🚀 Development

```bash
# Development mode (PWA disabled)
pnpm dev

# Production build (PWA enabled) - uses webpack
pnpm build

# Start production server
pnpm start
```

**Note:** The build uses webpack instead of Turbopack for PWA compatibility with Next.js 16.

### 📝 Generated Files

The following files are auto-generated and should not be committed (already in .gitignore):

- `public/swe-worker-*.js` - Service worker entry
- `public/workbox-*.js` - Workbox runtime files
- `public/sw.js.map` - Source maps (if generated)

### 🎯 Testing PWA

1. Build the production version: `pnpm build`
2. Start the server: `pnpm start`
3. Open Chrome DevTools → Application → Manifest
4. Check the "Service Workers" section
5. Use Lighthouse to audit PWA score

### 📱 Platform Support

- ✅ Chrome/Edge (Android/Desktop)
- ✅ Safari (iOS/macOS) - with "Add to Home Screen"
- ✅ Firefox (Android/Desktop)
- ✅ Samsung Internet

### 🔐 HTTPS Requirement

PWA features require HTTPS in production. Local development works on `localhost` without HTTPS.

### 🎨 Icons

The app uses adaptive icons:
- Light mode: `/icon-light-32x32.png`
- Dark mode: `/icon-dark-32x32.png`
- Apple Touch: `/apple-icon.png`
- Logo: `/placeholder-logo.png`

For best results, provide icons in these sizes:
- 32x32, 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### 🧪 Offline Testing

1. Open Chrome DevTools
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Reload the page
5. You should see the offline fallback page

### 📊 Performance Benefits

- **First Load**: ~2-3s (depends on connection)
- **Subsequent Loads**: <1s (from cache)
- **Offline**: Instant (from cache)

### 🔄 Updates

The service worker automatically updates when you deploy new versions. Users will get the update on their next visit after the old service worker expires.

### 🐛 Troubleshooting

If PWA features aren't working:

1. Check HTTPS is enabled (required for production)
2. Clear browser cache and service workers
3. Rebuild the app: `pnpm build`
4. Check browser console for errors
5. Verify manifest.json is accessible at `/manifest.json`

### 📚 Resources

- [@ducanh2912/next-pwa Documentation](https://ducanh-next-pwa.vercel.app/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

