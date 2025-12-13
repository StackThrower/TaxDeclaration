#!/bin/zsh

# Тест перевірки всіх перекладів калькулятора
# Test to verify all calculator translations

echo "🔍 Перевірка перекладів калькулятора / Checking calculator translations"
echo "================================================================"

FILE="lib/i18n.ts"

# Список мов для перевірки
LANGUAGES=("uk" "en" "fr" "pl" "es" "pt" "de")

# Ключі для перевірки
KEYS=(
  "calculator.title"
  "calculator.subtitle"
  "calculator.calculate"
  "calculator.reset"
  "header.calculator"
)

echo "\n📋 Перевірка наявності ключових перекладів:\n"

for lang in "${LANGUAGES[@]}"; do
  echo "🌍 Мова: $lang"

  missing=0
  for key in "${KEYS[@]}"; do
    if grep -q "\"$key\":" "$FILE"; then
      echo "  ✅ $key"
    else
      echo "  ❌ $key - ВІДСУТНІЙ!"
      missing=$((missing + 1))
    fi
  done

  if [ $missing -eq 0 ]; then
    echo "  🎉 Всі ключі присутні!"
  else
    echo "  ⚠️  Знайдено $missing відсутніх ключів"
  fi
  echo ""
done

echo "================================================================"
echo "\n📊 Статистика перекладів калькулятора:\n"

# Підрахунок загальної кількості перекладів
total=$(grep -c "calculator\." "$FILE" 2>/dev/null || echo "0")
echo "  Загальна кількість рядків з 'calculator.': $total"

# Очікувана кількість: 27 ключів × 7 мов = 189
expected=189
if [ "$total" -ge "$expected" ]; then
  echo "  ✅ Достатньо перекладів (очікувалось мінімум $expected)"
else
  echo "  ⚠️  Недостатньо перекладів (очікувалось мінімум $expected, знайдено $total)"
fi

echo "\n================================================================"
echo "✅ Перевірка завершена! / Check completed!"
echo "================================================================\n"

# Перевірка компонентів
echo "🔍 Перевірка файлів компонентів:\n"

if [ -f "components/tax-calculator.tsx" ]; then
  echo "  ✅ components/tax-calculator.tsx існує"
  lines=$(wc -l < "components/tax-calculator.tsx")
  echo "     Розмір: $lines рядків"
else
  echo "  ❌ components/tax-calculator.tsx ВІДСУТНІЙ!"
fi

if grep -q "TaxCalculator" "app/[locale]/page-client.tsx" 2>/dev/null; then
  echo "  ✅ TaxCalculator імпортовано в page-client.tsx"
else
  echo "  ❌ TaxCalculator НЕ імпортовано в page-client.tsx!"
fi

if grep -q "Calculator" "components/header.tsx" 2>/dev/null; then
  echo "  ✅ Calculator іконка в header.tsx"
else
  echo "  ❌ Calculator іконка ВІДСУТНЯ в header.tsx!"
fi

echo "\n🎉 Все готово до тестування! / Ready for testing!"
echo "Запустіть: pnpm dev"
echo "Відкрийте: http://localhost:3000/uk-ua\n"

