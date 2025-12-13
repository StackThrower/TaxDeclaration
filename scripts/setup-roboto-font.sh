#!/bin/bash
# Quick setup script for Roboto font with Cyrillic support

set -e

echo "🚀 Roboto Font Setup для jsPDF"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json не знайдено${NC}"
    echo "Запустіть скрипт з кореневої директорії проекту"
    exit 1
fi

echo "📁 Робоча директорія: $(pwd)"
echo ""

# Create temp directory
TEMP_DIR="tmp/font-setup"
mkdir -p "$TEMP_DIR"

echo "1️⃣  Завантаження Roboto шрифту..."
echo ""

# Try to download Roboto from GitHub
FONT_URL="https://github.com/google/roboto/releases/download/v2.138/roboto-unhinted.zip"
echo "   Джерело: $FONT_URL"

if command -v curl &> /dev/null; then
    curl -L "$FONT_URL" -o "$TEMP_DIR/roboto.zip" 2>&1 | grep -E "%" || true
elif command -v wget &> /dev/null; then
    wget "$FONT_URL" -O "$TEMP_DIR/roboto.zip"
else
    echo -e "${RED}❌ curl або wget не знайдено${NC}"
    echo ""
    echo "Будь ласка, встановіть curl:"
    echo "  brew install curl"
    exit 1
fi

# Check if download was successful
if [ ! -f "$TEMP_DIR/roboto.zip" ] || [ ! -s "$TEMP_DIR/roboto.zip" ]; then
    echo -e "${YELLOW}⚠️  Автоматичне завантаження не вдалося${NC}"
    echo ""
    echo "📖 РУЧНЕ ЗАВАНТАЖЕННЯ:"
    echo "   1. Відкрийте: https://fonts.google.com/specimen/Roboto"
    echo "   2. Натисніть 'Download family'"
    echo "   3. Розпакуйте ZIP"
    echo "   4. Помістіть Roboto-Regular.ttf в: $TEMP_DIR/"
    echo ""
    echo "   Потім запустіть:"
    echo "   node scripts/convert-font-to-base64.js $TEMP_DIR/Roboto-Regular.ttf lib/fonts/roboto-font-data.ts"
    exit 1
fi

echo -e "${GREEN}✓ Завантажено${NC}"
echo ""

echo "2️⃣  Розпакування архіву..."
unzip -q "$TEMP_DIR/roboto.zip" -d "$TEMP_DIR"
echo -e "${GREEN}✓ Розпаковано${NC}"
echo ""

# Find Roboto-Regular.ttf
FONT_FILE=$(find "$TEMP_DIR" -name "Roboto-Regular.ttf" | head -n 1)

if [ -z "$FONT_FILE" ]; then
    echo -e "${RED}❌ Roboto-Regular.ttf не знайдено в архіві${NC}"
    echo ""
    echo "Файли в архіві:"
    find "$TEMP_DIR" -name "*.ttf" | head -5
    exit 1
fi

echo "   Знайдено: $FONT_FILE"
echo ""

echo "3️⃣  Конвертування в base64..."
node scripts/convert-font-to-base64.js "$FONT_FILE" lib/fonts/roboto-font-data.ts

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Конвертовано успішно${NC}"
    echo ""
else
    echo -e "${RED}❌ Помилка конвертації${NC}"
    exit 1
fi

echo "4️⃣  Очищення тимчасових файлів..."
rm -rf "$TEMP_DIR"
echo -e "${GREEN}✓ Очищено${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ ГОТОВО!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Файл оновлено: lib/fonts/roboto-font-data.ts"
echo ""
echo "📝 Наступні кроки:"
echo "   1. Перезапустіть dev server:"
echo "      pnpm dev"
echo ""
echo "   2. Перевірте в консолі браузера:"
echo "      ✓ Roboto font with Cyrillic support loaded successfully"
echo ""
echo "   3. Згенеруйте PDF і перевірте кирилицю"
echo ""

