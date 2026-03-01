#!/bin/bash

# Sitemap Quick Test Script
# Tests sitemap generation and validates structure

echo "🗺️  Sitemap Testing for Taxered.com"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if server is running
SERVER_URL="${1:-http://localhost:3000}"
echo "Testing server: $SERVER_URL"
echo ""

# Function to check if URL is accessible
check_url() {
    if curl -s --head "$1" | head -n 1 | grep -q "200"; then
        return 0
    else
        return 1
    fi
}

# Check if server is accessible
if ! check_url "$SERVER_URL"; then
    echo -e "${RED}❌ Server is not accessible at $SERVER_URL${NC}"
    echo "Please start the server first with: pnpm dev or pnpm start"
    exit 1
fi

echo -e "${GREEN}✅ Server is accessible${NC}"
echo ""

# Test sitemap.xml
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📄 Testing Sitemap.xml${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

sitemap_url="$SERVER_URL/sitemap.xml"
sitemap_response=$(curl -s "$sitemap_url")

# Check if sitemap exists
if [ -z "$sitemap_response" ]; then
    echo -e "${RED}❌ Sitemap not found or empty${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Sitemap is accessible${NC}"
echo ""

# Count URLs in sitemap
url_count=$(echo "$sitemap_response" | grep -o "<loc>" | wc -l | tr -d ' ')
echo -e "${GREEN}✅ Total URLs in sitemap: $url_count${NC}"
echo ""

# Expected URLs
expected_urls=31
if [ "$url_count" -eq "$expected_urls" ]; then
    echo -e "${GREEN}✅ URL count matches expected: $expected_urls${NC}"
else
    echo -e "${YELLOW}⚠️  URL count ($url_count) differs from expected ($expected_urls)${NC}"
fi
echo ""

# Check for required elements
echo "🔍 Checking sitemap structure:"
echo ""

if echo "$sitemap_response" | grep -q "<urlset"; then
    echo -e "  ${GREEN}✅ <urlset> element found${NC}"
else
    echo -e "  ${RED}❌ <urlset> element missing${NC}"
fi

if echo "$sitemap_response" | grep -q "<loc>"; then
    echo -e "  ${GREEN}✅ <loc> elements found${NC}"
else
    echo -e "  ${RED}❌ <loc> elements missing${NC}"
fi

if echo "$sitemap_response" | grep -q "<lastmod>"; then
    echo -e "  ${GREEN}✅ <lastmod> elements found${NC}"
else
    echo -e "  ${YELLOW}⚠️  <lastmod> elements missing${NC}"
fi

if echo "$sitemap_response" | grep -q "<changefreq>"; then
    echo -e "  ${GREEN}✅ <changefreq> elements found${NC}"
else
    echo -e "  ${YELLOW}⚠️  <changefreq> elements missing${NC}"
fi

if echo "$sitemap_response" | grep -q "<priority>"; then
    echo -e "  ${GREEN}✅ <priority> elements found${NC}"
else
    echo -e "  ${YELLOW}⚠️  <priority> elements missing${NC}"
fi

echo ""

# Check for specific locales
echo "🌍 Checking locale coverage:"
echo ""

locales=("uk-ua" "en-us" "en-gb" "en-ca" "fr-fr" "pl-pl" "es-es" "pt-pt" "de-de" "sv-se")

for locale in "${locales[@]}"; do
    if echo "$sitemap_response" | grep -q "<loc>$SERVER_URL/$locale"; then
        echo -e "  ${GREEN}✅ $locale${NC}"
    else
        echo -e "  ${RED}❌ $locale (missing)${NC}"
    fi
done

echo ""

# Check for specific pages
echo "📄 Checking page coverage:"
echo ""

pages=("" "/about" "/help")
page_names=("home" "about" "help")

for i in "${!pages[@]}"; do
    page="${pages[$i]}"
    name="${page_names[$i]}"

    # Count how many times this page appears (should be 10, one per locale)
    count=$(echo "$sitemap_response" | grep -o "<loc>$SERVER_URL/[a-z-]*$page</loc>" | wc -l | tr -d ' ')

    if [ "$count" -gt 0 ]; then
        echo -e "  ${GREEN}✅ $name pages: $count${NC}"
    else
        echo -e "  ${RED}❌ $name pages: 0 (missing)${NC}"
    fi
done

echo ""

# Test robots.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🤖 Testing Robots.txt${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

robots_url="$SERVER_URL/robots.txt"
robots_response=$(curl -s "$robots_url")

if [ -z "$robots_response" ]; then
    echo -e "${RED}❌ Robots.txt not found or empty${NC}"
else
    echo -e "${GREEN}✅ Robots.txt is accessible${NC}"
    echo ""

    if echo "$robots_response" | grep -q "Sitemap:"; then
        echo -e "${GREEN}✅ Sitemap reference found in robots.txt${NC}"
        sitemap_ref=$(echo "$robots_response" | grep "Sitemap:" | head -1)
        echo "  $sitemap_ref"
    else
        echo -e "${YELLOW}⚠️  Sitemap reference missing in robots.txt${NC}"
    fi
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Sitemap URL: $sitemap_url"
echo "Total URLs: $url_count"
echo "Expected URLs: $expected_urls"
echo "Locales: 10"
echo "Pages per locale: 3"
echo ""

if [ "$url_count" -eq "$expected_urls" ]; then
    echo -e "${GREEN}✅ Sitemap is complete and ready!${NC}"
else
    echo -e "${YELLOW}⚠️  Sitemap may need attention${NC}"
fi

echo ""
echo "🔗 Next steps:"
echo "  1. Test sitemap in validators"
echo "  2. Submit to Google Search Console"
echo "  3. Submit to Bing Webmaster Tools"
echo "  4. Monitor indexing status"
echo ""
echo "📖 Documentation: SITEMAP_UA.md"
echo ""

