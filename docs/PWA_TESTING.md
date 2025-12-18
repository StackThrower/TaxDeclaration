# 🧪 PWA Testing Guide

## Quick Test Checklist

Use this checklist to verify that your PWA is working correctly.

## 1. Build and Start

```bash
# Build the production version
pnpm build

# Start the production server
pnpm start
```

The app will be available at: http://localhost:3000

## 2. Chrome DevTools Tests

### 2.1 Check Manifest

1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Go to **Application** tab
4. Click **Manifest** in left sidebar
5. ✅ Verify you see:
   - App name: "Monegoo - Tax Declaration System"
   - Short name: "Monegoo"
   - Icons displayed
   - Start URL: "/"
   - Display: "standalone"

### 2.2 Check Service Worker

1. In **Application** tab
2. Click **Service Workers**
3. ✅ Verify you see:
   - Status: "activated and running"
   - Source: `/swe-worker-*.js`
   - Update on reload checkbox

### 2.3 Run Lighthouse Audit

1. In DevTools, click **Lighthouse** tab
2. Select:
   - ✅ Progressive Web App
   - ✅ Performance (optional)
3. Click **Analyze page load**
4. ✅ Target Score: **90+** for PWA

Expected PWA checks:
- ✅ Installable
- ✅ Fast and reliable
- ✅ Works offline
- ✅ PWA optimized
- ✅ Has a registered service worker
- ✅ Uses HTTPS (in production)
- ✅ Provides a valid manifest

## 3. Test Offline Functionality

### Method 1: Chrome DevTools
1. Open **Network** tab
2. Change throttling to **Offline**
3. Reload the page
4. ✅ Should show the offline fallback page

### Method 2: Browser Offline Mode
1. Disconnect your internet
2. Try to navigate the app
3. ✅ Previously visited pages should still work

## 4. Test Installation

### Desktop (Chrome/Edge)

1. **Look for install icon**
   - In the address bar (right side)
   - Should see a ⊕ install icon

2. **Alternative: Browser menu**
   - Click the three dots (⋮)
   - Select "Install Monegoo..."

3. **After installation**
   - ✅ App opens in separate window
   - ✅ No browser UI (address bar, tabs)
   - ✅ App icon in taskbar/dock
   - ✅ Can find app in system search

### Mobile (Android - Chrome)

1. **Install prompt**
   - Should see "Add to Home Screen" banner
   - Or tap the three dots (⋮)
   - Select "Add to Home Screen"

2. **After installation**
   - ✅ Icon appears on home screen
   - ✅ Opens in fullscreen
   - ✅ Splash screen shows on launch

### Mobile (iOS - Safari)

1. **Add to Home Screen**
   - Tap the Share button (□↑)
   - Scroll and tap "Add to Home Screen"
   - Tap "Add"

2. **After installation**
   - ✅ Icon appears on home screen
   - ✅ Opens without Safari UI

## 5. Test Install Prompt Component

1. **First visit**
   - ✅ Should see install prompt at bottom
   - Message: "Install Monegoo App"

2. **Dismiss prompt**
   - Click "Not now"
   - ✅ Prompt disappears

3. **Refresh page**
   - ✅ Prompt should NOT appear again (dismissed)

4. **Clear local storage**
   ```javascript
   // In browser console
   localStorage.removeItem('pwa-prompt-dismissed')
   location.reload()
   ```
   - ✅ Prompt appears again

## 6. Test Caching Strategies

### Test Static Assets
```bash
# In browser console
fetch('/icon-light-32x32.png')
  .then(() => console.log('✅ Image cached'))
```

### Test API Caching
```bash
# Visit a page
# Go offline
# Navigate back
# ✅ Should work from cache
```

## 7. Test Theme Support

1. **Light mode**
   - Switch to light theme
   - ✅ Check manifest theme-color: white (#ffffff)

2. **Dark mode**
   - Switch to dark theme
   - ✅ Check manifest theme-color: black (#000000)

## 8. Test Updates

1. **Make a change**
   - Edit some content
   - Build: `pnpm build`

2. **Reload the app**
   - ✅ Should get update notification
   - ✅ New version loads

## 9. Production Tests (After Deployment)

### HTTPS Check
```bash
# Visit your production URL
# ✅ URL should start with https://
# ✅ Service worker should register
```

### Mobile Testing
1. **Visit on real device**
   - Test on actual phone/tablet
   - ✅ Install prompt appears
   - ✅ Can install successfully

### Performance Testing
1. **Test load time**
   - First load: ~2-3s
   - Cached load: <1s
   - ✅ Lighthouse Performance: 90+

## 10. Verification Script

Run the automated verification:

```bash
pnpm verify-pwa
```

Expected output:
```
✅ manifest.json found
✅ offline.html found
✅ PWA install prompt component found
✅ @ducanh2912/next-pwa package installed
✅ PWA configuration in next.config.mjs
✅ Manifest link in layout.tsx
✅ PWA meta tags in layout.tsx
✅ PWA install prompt imported in layout

🎉 PWA implementation verified successfully!
```

## Common Issues

### Issue: Service Worker Not Registering

**Solution:**
```bash
# Clear cache
# In browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})

# Then reload
location.reload()
```

### Issue: Install Prompt Not Showing

**Check:**
- ✅ Built with production mode
- ✅ Service worker registered
- ✅ Manifest is valid
- ✅ Not already installed
- ✅ Not previously dismissed

### Issue: Offline Page Not Showing

**Solution:**
- Visit a few pages first (to cache them)
- Service worker needs to be active
- Check `/offline.html` exists

### Issue: PWA Score Low in Lighthouse

**Common causes:**
- Missing HTTPS (dev only, OK on localhost)
- Missing manifest fields
- Icons wrong size
- Service worker not registered

## Browser Console Commands

```javascript
// Check if service worker is registered
navigator.serviceWorker.controller

// Get all registrations
navigator.serviceWorker.getRegistrations()

// Check if can install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ Can install as PWA');
  deferredPrompt = e;
});

// Check if already installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ Already installed as PWA');
}

// Check cache
caches.keys().then(console.log)

// Clear all caches
caches.keys().then(keys => keys.forEach(key => caches.delete(key)))
```

## Success Criteria

Your PWA is working correctly if:

- ✅ Lighthouse PWA score: 90+
- ✅ Service worker: Active
- ✅ Manifest: Valid and accessible
- ✅ Install: Prompt appears and works
- ✅ Offline: Fallback page shows
- ✅ Caching: Assets load from cache
- ✅ Icons: Display correctly
- ✅ Theme: Colors adapt to mode

## Next Steps After Testing

1. ✅ Deploy to production with HTTPS
2. ✅ Test on real mobile devices
3. ✅ Monitor PWA metrics
4. ✅ Share install instructions with users

---

**Need Help?**
- See: [docs/PWA.md](./PWA.md)
- Run: `pnpm verify-pwa`
- Check: Browser console for errors

