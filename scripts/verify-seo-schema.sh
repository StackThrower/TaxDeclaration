#!/bin/bash

# SEO & Schema.org Verification Script
# This script checks all SEO elements including schema.org structured data

echo "🔍 SEO & Schema.org Verification"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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

# Array of pages to test
pages=(
    "/"
    "/en-us"
    "/uk-ua"
    "/en-us/about"
    "/uk-ua/about"
    "/en-us/help"
    "/uk-ua/help"
)

# Test each page
for page in "${pages[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 Testing: $page"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    url="$SERVER_URL$page"
    response=$(curl -s "$url")

    # Check for basic meta tags
    echo ""
    echo "📋 Basic Meta Tags:"

    if echo "$response" | grep -q '<meta name="description"'; then
        echo -e "  ${GREEN}✅ Description meta tag found${NC}"
    else
        echo -e "  ${RED}❌ Description meta tag missing${NC}"
    fi

    if echo "$response" | grep -q '<meta name="keywords"'; then
        echo -e "  ${GREEN}✅ Keywords meta tag found${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Keywords meta tag missing${NC}"
    fi

    if echo "$response" | grep -q '<title>'; then
        echo -e "  ${GREEN}✅ Title tag found${NC}"
    else
        echo -e "  ${RED}❌ Title tag missing${NC}"
    fi

    # Check for Open Graph tags
    echo ""
    echo "📱 Open Graph Tags:"

    og_tags=("og:title" "og:description" "og:type" "og:url" "og:image")
    for tag in "${og_tags[@]}"; do
        if echo "$response" | grep -q "property=\"$tag\""; then
            echo -e "  ${GREEN}✅ $tag found${NC}"
        else
            echo -e "  ${RED}❌ $tag missing${NC}"
        fi
    done

    # Check for Twitter Card tags
    echo ""
    echo "🐦 Twitter Card Tags:"

    twitter_tags=("twitter:card" "twitter:title" "twitter:description")
    for tag in "${twitter_tags[@]}"; do
        if echo "$response" | grep -q "name=\"$tag\""; then
            echo -e "  ${GREEN}✅ $tag found${NC}"
        else
            echo -e "  ${RED}❌ $tag missing${NC}"
        fi
    done

    # Check for Schema.org JSON-LD
    echo ""
    echo "🏗️  Schema.org Structured Data:"

    if echo "$response" | grep -q 'type="application/ld+json"'; then
        echo -e "  ${GREEN}✅ JSON-LD structured data found${NC}"

        # Count number of schema objects
        schema_count=$(echo "$response" | grep -o 'type="application/ld+json"' | wc -l)
        echo -e "  ${GREEN}✅ Number of schema objects: $schema_count${NC}"

        # Check for specific schema types
        if echo "$response" | grep -q '"@type":"WebSite"'; then
            echo -e "  ${GREEN}✅ WebSite schema found${NC}"
        fi

        if echo "$response" | grep -q '"@type":"Organization"'; then
            echo -e "  ${GREEN}✅ Organization schema found${NC}"
        fi

        if echo "$response" | grep -q '"@type":"WebPage"'; then
            echo -e "  ${GREEN}✅ WebPage schema found${NC}"
        fi

        if echo "$response" | grep -q '"@type":"FAQPage"'; then
            echo -e "  ${GREEN}✅ FAQPage schema found${NC}"
        fi

        if echo "$response" | grep -q '"@type":"BreadcrumbList"'; then
            echo -e "  ${GREEN}✅ BreadcrumbList schema found${NC}"
        fi

        if echo "$response" | grep -q '"@type":"SoftwareApplication"'; then
            echo -e "  ${GREEN}✅ SoftwareApplication schema found${NC}"
        fi

    else
        echo -e "  ${RED}❌ No JSON-LD structured data found${NC}"
    fi

    # Check for canonical URL
    echo ""
    echo "🔗 Canonical & Alternates:"

    if echo "$response" | grep -q '<link rel="canonical"'; then
        echo -e "  ${GREEN}✅ Canonical URL found${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Canonical URL missing${NC}"
    fi

    if echo "$response" | grep -q 'rel="alternate" hreflang'; then
        alt_count=$(echo "$response" | grep -o 'rel="alternate" hreflang' | wc -l)
        echo -e "  ${GREEN}✅ Language alternates found ($alt_count)${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Language alternates missing${NC}"
    fi

    # Check for robots directives
    echo ""
    echo "🤖 Robots Directives:"

    if echo "$response" | grep -q '<meta name="robots"'; then
        echo -e "  ${GREEN}✅ Robots meta tag found${NC}"
    else
        echo -e "  ${RED}❌ Robots meta tag missing${NC}"
    fi

    echo ""
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pages tested: ${#pages[@]}"
echo ""
echo "✅ All pages have been checked for:"
echo "  • Basic meta tags (title, description, keywords)"
echo "  • Open Graph tags (og:title, og:description, etc.)"
echo "  • Twitter Card tags"
echo "  • Schema.org JSON-LD structured data"
echo "  • Canonical URLs"
echo "  • Language alternates"
echo "  • Robots directives"
echo ""
echo "🔗 Test your structured data with:"
echo "  • Google Rich Results Test: https://search.google.com/test/rich-results"
echo "  • Schema.org Validator: https://validator.schema.org/"
echo ""
echo "💡 Tips:"
echo "  • Green ✅ means the element is present"
echo "  • Red ❌ means the element is missing (should be fixed)"
echo "  • Yellow ⚠️  means the element is optional or may need attention"
echo ""

