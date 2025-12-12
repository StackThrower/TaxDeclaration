#!/bin/bash

# SEO Verification Script
# Checks if all no-index configurations are in place

echo "🔍 Verifying SEO No-Index Configuration..."
echo ""

# Check robots.txt
echo "1️⃣ Checking robots.txt..."
if [ -f "public/robots.txt" ]; then
    echo "✅ robots.txt exists"
    if grep -q "Disallow: /" public/robots.txt; then
        echo "✅ robots.txt blocks all crawlers"
    else
        echo "⚠️  robots.txt doesn't block all crawlers"
    fi
else
    echo "❌ robots.txt not found"
fi
echo ""

# Check robots.ts
echo "2️⃣ Checking app/robots.ts..."
if [ -f "app/robots.ts" ]; then
    echo "✅ app/robots.ts exists"
    if grep -q "disallow: '/'," app/robots.ts; then
        echo "✅ robots.ts blocks all crawlers"
    else
        echo "⚠️  robots.ts doesn't block all crawlers"
    fi
else
    echo "❌ app/robots.ts not found"
fi
echo ""

# Check sitemap.ts
echo "3️⃣ Checking app/sitemap.ts..."
if [ -f "app/sitemap.ts" ]; then
    echo "✅ app/sitemap.ts exists"
else
    echo "❌ app/sitemap.ts not found"
fi
echo ""

# Check middleware.ts
echo "4️⃣ Checking middleware.ts..."
if [ -f "middleware.ts" ]; then
    echo "✅ middleware.ts exists"
    if grep -q "X-Robots-Tag" middleware.ts; then
        echo "✅ middleware.ts sets X-Robots-Tag"
    else
        echo "⚠️  middleware.ts doesn't set X-Robots-Tag"
    fi
else
    echo "❌ middleware.ts not found"
fi
echo ""

# Check next.config.mjs
echo "5️⃣ Checking next.config.mjs..."
if [ -f "next.config.mjs" ]; then
    echo "✅ next.config.mjs exists"
    if grep -q "X-Robots-Tag" next.config.mjs; then
        echo "✅ next.config.mjs sets X-Robots-Tag header"
    else
        echo "⚠️  next.config.mjs doesn't set X-Robots-Tag"
    fi
else
    echo "❌ next.config.mjs not found"
fi
echo ""

# Check layout.tsx
echo "6️⃣ Checking app/layout.tsx..."
if [ -f "app/layout.tsx" ]; then
    echo "✅ app/layout.tsx exists"
    if grep -q "noindex" app/layout.tsx; then
        echo "✅ layout.tsx has noindex meta tags"
    else
        echo "⚠️  layout.tsx doesn't have noindex meta tags"
    fi
    if grep -q "index: false" app/layout.tsx; then
        echo "✅ layout.tsx has robots metadata set to false"
    else
        echo "⚠️  layout.tsx robots metadata not configured"
    fi
else
    echo "❌ app/layout.tsx not found"
fi
echo ""

# Check SEO utils
echo "7️⃣ Checking lib/seo.ts..."
if [ -f "lib/seo.ts" ]; then
    echo "✅ lib/seo.ts exists (SEO utilities available)"
else
    echo "⚠️  lib/seo.ts not found"
fi
echo ""

echo "✨ Verification complete!"
echo ""
echo "📚 Documentation:"
echo "- SEO_README.md - Complete SEO configuration guide"
echo "- robots.txt - Blocks all search engines"
echo "- Multiple layers ensure no indexing"
echo ""
echo "🚀 To test locally:"
echo "  pnpm dev"
echo "  curl http://localhost:3000/robots.txt"
echo ""

