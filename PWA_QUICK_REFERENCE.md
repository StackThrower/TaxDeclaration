# 🚀 PWA Quick Reference

## One-Command Test

```bash
pnpm build && pnpm start && pnpm verify-pwa
```

## Key Files

| File | Purpose |
|------|---------|
| `public/manifest.json` | PWA configuration |
| `public/offline.html` | Offline fallback |
| `components/pwa-install-prompt.tsx` | Install UI |
| `next.config.mjs` | PWA build config |

## Quick Checks

### ✅ Is PWA Working?

```bash
# 1. Verify files
pnpm verify-pwa

# 2. Build
pnpm build
# Look for: ✓ (pwa) Service worker

# 3. Start
pnpm start

# 4. Test manifest
curl http://localhost:3000/manifest.json

# 5. Open browser
open http://localhost:3000
# Check DevTools → Application → Manifest
```

### ✅ Test Offline

1. Open http://localhost:3000
2. DevTools → Network → Offline
3. Reload page
4. Should see offline.html

### ✅ Test Install

1. Open Chrome
2. Look for ⊕ icon in address bar
3. Click to install
4. App opens in new window

## Generated Files (Don't Commit)

```
public/swe-worker-*.js
public/workbox-*.js
```

## Caching Strategy

- **Fonts**: Cache first (1 year)
- **Images**: Stale while revalidate (24h)
- **JS/CSS**: Stale while revalidate (24h)
- **API**: Network first (24h)
- **Pages**: Network first with cache fallback

## Browser Commands

```javascript
// Check service worker
navigator.serviceWorker.controller

// Check if installed
window.matchMedia('(display-mode: standalone)').matches

// Clear cache
caches.keys().then(keys => keys.forEach(k => caches.delete(k)))

// Clear dismissed prompt
localStorage.removeItem('pwa-prompt-dismissed')
```

## Lighthouse Target Scores

- PWA: **90+** ✅
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## Common Issues

| Issue | Solution |
|-------|----------|
| No install prompt | Build production, clear cache |
| Offline not working | Visit pages first, check SW active |
| Manifest not found | Check `/manifest.json` accessible |
| Icons not showing | Verify icon paths in manifest |

## Scripts

```bash
pnpm dev          # Development (PWA disabled)
pnpm build        # Production build with PWA
pnpm start        # Start production server
pnpm verify-pwa   # Verify PWA setup
```

## Documentation

- Full guide: `docs/PWA.md`
- Testing: `docs/PWA_TESTING.md`
- Summary: `PWA_IMPLEMENTATION_SUMMARY.md`

## Package Info

- **Package**: @ducanh2912/next-pwa@10.2.9
- **Docs**: https://ducanh-next-pwa.vercel.app/
- **Next.js**: 16.0.7 (webpack mode)

---

**Status**: ✅ Fully Implemented & Tested
**Date**: December 18, 2024

