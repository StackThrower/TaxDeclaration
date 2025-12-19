#!/bin/bash

# Pre-deploy PWA Check
echo "🔍 Проверка PWA перед деплоем..."
echo "================================"
echo ""

ERROR_COUNT=0

echo "1️⃣ Проверка файла manifest.json..."
if [ -f "public/manifest.json" ]; then
    echo "✅ manifest.json существует"
    # Validate JSON
    if command -v python3 &> /dev/null; then
        if python3 -m json.tool public/manifest.json > /dev/null 2>&1; then
            echo "✅ manifest.json валидный JSON"
        else
            echo "❌ manifest.json невалидный JSON!"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    fi
else
    echo "❌ manifest.json НЕ найден!"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi
echo ""

echo "2️⃣ Проверка иконок..."
ICONS=("icon-192x192.png" "icon-512x512.png" "apple-icon.png" "favicon.ico")
for icon in "${ICONS[@]}"; do
    if [ -f "public/$icon" ]; then
        echo "✅ $icon"
    else
        echo "❌ $icon НЕ найден!"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi
done
echo ""

echo "3️⃣ Проверка layout.tsx..."
if grep -q '<link rel="manifest"' app/layout.tsx; then
    echo "✅ <link rel=\"manifest\"> найден в layout.tsx"
else
    echo "❌ <link rel=\"manifest\"> НЕ найден в layout.tsx!"
    echo "   Добавьте: <link rel=\"manifest\" href=\"/manifest.json\" />"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi
echo ""

echo "4️⃣ Проверка next.config.mjs..."
if grep -q 'application/manifest+json' next.config.mjs; then
    echo "✅ Правильный Content-Type для manifest настроен"
else
    echo "⚠️  Content-Type для manifest не настроен"
    echo "   (Не критично, но рекомендуется)"
fi
echo ""

echo "5️⃣ Проверка PWA пакета..."
if grep -q '@ducanh2912/next-pwa' package.json; then
    echo "✅ @ducanh2912/next-pwa установлен"
else
    echo "❌ @ducanh2912/next-pwa НЕ установлен!"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi
echo ""

echo "6️⃣ Проверка InstallButton компонента..."
if [ -f "components/install-button.tsx" ]; then
    echo "✅ InstallButton компонент существует"

    if grep -q 'InstallButton' components/header.tsx; then
        echo "✅ InstallButton импортирован в header"
    else
        echo "⚠️  InstallButton НЕ используется в header"
        echo "   (Можно добавить для лучшего UX)"
    fi
else
    echo "⚠️  InstallButton компонент не найден"
    echo "   (Необязательно, но улучшает UX)"
fi
echo ""

echo "================================"
if [ $ERROR_COUNT -eq 0 ]; then
    echo "✅ ВСЁ ГОТОВО К ДЕПЛОЮ!"
    echo ""
    echo "📝 Следующие шаги:"
    echo "   1. Соберите проект: pnpm build"
    echo "   2. Проверьте что PWA сгенерирован:"
    echo "      Должны увидеть: ✓ (pwa) Service worker"
    echo "   3. Задеплойте:"
    echo "      git add ."
    echo "      git commit -m 'Fix PWA manifest detection'"
    echo "      git push origin main"
    echo ""
    echo "   4. После деплоя проверьте:"
    echo "      ./scripts/diagnose-pwa-production.sh"
    echo ""
    exit 0
else
    echo "❌ НАЙДЕНО $ERROR_COUNT ОШИБОК!"
    echo ""
    echo "Исправьте ошибки перед деплоем."
    echo ""
    exit 1
fi

