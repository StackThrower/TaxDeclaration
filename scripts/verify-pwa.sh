#!/bin/bash

# PWA Verification Script
echo "🔍 Checking PWA Implementation..."
echo ""

# Check if manifest.json exists
if [ -f "public/manifest.json" ]; then
    echo "✅ manifest.json found"
else
    echo "❌ manifest.json NOT found"
    exit 1
fi

# Check if offline.html exists
if [ -f "public/offline.html" ]; then
    echo "✅ offline.html found"
else
    echo "❌ offline.html NOT found"
    exit 1
fi

# Check if PWA component exists
if [ -f "components/pwa-install-prompt.tsx" ]; then
    echo "✅ PWA install prompt component found"
else
    echo "❌ PWA install prompt component NOT found"
    exit 1
fi

# Check if @ducanh2912/next-pwa is installed
if grep -q "@ducanh2912/next-pwa" package.json; then
    echo "✅ @ducanh2912/next-pwa package installed"
else
    echo "❌ @ducanh2912/next-pwa package NOT installed"
    exit 1
fi

# Check if next.config.mjs has PWA configuration
if grep -q "withPWAInit" next.config.mjs; then
    echo "✅ PWA configuration in next.config.mjs"
else
    echo "❌ PWA configuration NOT found in next.config.mjs"
    exit 1
fi

# Check if layout.tsx has manifest link
if grep -q "manifest.*manifest.json" app/layout.tsx; then
    echo "✅ Manifest link in layout.tsx"
else
    echo "❌ Manifest link NOT found in layout.tsx"
    exit 1
fi

# Check if layout.tsx has PWA meta tags
if grep -q "apple-mobile-web-app" app/layout.tsx; then
    echo "✅ PWA meta tags in layout.tsx"
else
    echo "❌ PWA meta tags NOT found in layout.tsx"
    exit 1
fi

# Check if PWA component is imported in layout
if grep -q "PwaInstallPrompt" app/layout.tsx; then
    echo "✅ PWA install prompt imported in layout"
else
    echo "❌ PWA install prompt NOT imported in layout"
    exit 1
fi

echo ""
echo "🎉 PWA implementation verified successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Run 'pnpm build' to generate service worker"
echo "   2. Run 'pnpm start' to test in production mode"
echo "   3. Open Chrome DevTools → Application → Manifest"
echo "   4. Test offline functionality"
echo "   5. Try installing the app"
echo ""

