# База знань / Knowledge Base

## Опис / Description

Система управління базою знань з податкових питань для різних країн та мов. Статті зберігаються у форматі Markdown з метаданими для SEO-оптимізації.

Tax knowledge base management system for different countries and languages. Articles are stored in Markdown format with metadata for SEO optimization.

## Структура файлів / File Structure

```
articles/
  ├── {language}-{country}-{slug}.md
  └── ...

lib/
  ├── articles.ts           # Функції для роботи зі статтями
  └── knowledge-seo.ts      # SEO метадані

app/
  ├── [locale]/
  │   └── knowledge/
  │       ├── page.tsx           # Список статей
  │       └── [slug]/
  │           └── page.tsx       # Окрема стаття
  └── api/
      └── articles/
          ├── route.ts           # API: список статей
          └── [slug]/
              └── route.tsx      # API: окрема стаття
```

## Формат статті / Article Format

Назва файлу: `{language}-{country}-{slug}.md`

Приклади:
- `uk-ua-crypto-tax.md` - українська, Україна
- `en-us-tax-return-guide.md` - англійська, США
- `pl-pl-pit37-guide.md` - польська, Польща

### Метадані (Front Matter)

```markdown
---
title: "Заголовок статті"
description: "Короткий опис для SEO"
category: "категорія"
readTime: "8 хв"
publishedAt: "2025-01-15"
keywords:
  - "ключове слово 1"
  - "ключове слово 2"
---

# Заголовок

Контент статті в Markdown...
```

## Створені статті / Created Articles

### Україна (Ukrainian - Ukraine)

✅ `uk-ua-tax-basics.md` - Основи оподаткування
✅ `uk-ua-freelance-taxes.md` - Податки для фрілансерів
✅ `uk-ua-investment-income.md` - Дохід від інвестицій
✅ `uk-ua-real-estate-tax.md` - Податок на нерухомість
✅ `uk-ua-crypto-tax.md` - Податок на криптовалюту
✅ `uk-ua-fop-benefits.md` - Податкові пільги для ФОП
✅ `uk-ua-foreign-income.md` - Декларування закордонних доходів

### Польща (Polish - Poland)

✅ `pl-pl-pit37-guide.md` - Повний гід по PIT-37
✅ `pl-pl-child-benefit.md` - Улга на дитину
✅ `pl-pl-pit38.md` - PIT-38 (доходи з капіталу)
✅ `pl-pl-pit39.md` - PIT-39 (продаж нерухомості)

### Франція (French - France)

✅ `fr-fr-tax-declaration.md` - Декларація доходів (Formulaire 2042)
✅ `fr-fr-income-tax.md` - IRPF та податкові ставки
✅ `fr-fr-property-tax.md` - Податок на нерухомість

### Німеччина (German - Germany)

✅ `de-de-tax-return.md` - Steuererklärung 2025
✅ `de-de-income-tax.md` - Einkommensteuer
✅ `de-de-church-tax.md` - Kirchensteuer

### США (English - USA)

✅ `en-us-tax-return-guide.md` - US Tax Return Complete Guide
✅ `en-us-1040-form.md` - Form 1040 Instructions
✅ `en-us-tax-deductions.md` - Tax Deductions & Credits

### Іспанія (Spanish - Spain)

✅ `es-es-renta-guide.md` - Declaración de la Renta 2025
✅ `es-es-irpf.md` - IRPF y deducciones
✅ `es-es-autonomos.md` - Impuestos para autónomos

### Португалія (Portuguese - Portugal)

✅ `pt-pt-irs-guide.md` - IRS 2025 Portugal
✅ `pt-pt-deductions.md` - Deduções fiscais
✅ `pt-pt-rnh.md` - Residentes Não Habituais

## API Endpoints

### GET `/api/articles`

Отримати список статей для мови та країни

**Query параметри:**
- `language`: Language code (uk, en, fr, pl, es, pt, de)
- `country`: Country code (ua, pl, fr, de, pt, es, us)

**Відповідь:**
```json
{
  "articles": [
    {
      "slug": "crypto-tax",
      "title": "Податок на криптовалюту...",
      "description": "...",
      "category": "криптовалюти",
      "readTime": "8 хв",
      "publishedAt": "2025-01-15",
      "keywords": ["..."]
    }
  ]
}
```

### GET `/api/articles/{slug}`

Отримати повну статтю

**Query параметри:**
- `language`: Language code
- `country`: Country code

**Відповідь:**
```json
{
  "article": {
    "slug": "crypto-tax",
    "title": "...",
    "description": "...",
    "content": "# Full markdown content...",
    "category": "...",
    "readTime": "...",
    "publishedAt": "...",
    "keywords": ["..."]
  },
  "related": [...]
}
```

## Маршрути / Routes

### Список статей
`/{locale}/knowledge`

Приклади:
- `/uk-ua/knowledge` - українська, Україна
- `/en-us/knowledge` - англійська, США
- `/pl-pl/knowledge` - польська, Польща

### Окрема стаття
`/{locale}/knowledge/{slug}`

Приклади:
- `/uk-ua/knowledge/crypto-tax`
- `/en-us/knowledge/tax-return-guide`
- `/pl-pl/knowledge/pit37-guide`

## SEO Оптимізація

### Реалізовані функції:

✅ Динамічні meta tags (title, description)
✅ Keywords у front matter
✅ Open Graph tags
✅ Twitter Card tags
✅ Structured data (article schema)
✅ Semantic HTML5
✅ Mobile-responsive
✅ Fast loading (статична генерація)

### Покращення для пошукових систем:

- Унікальний контент для кожної країни/мови
- Довгі, детальні статті (1500-3000+ слів)
- Внутрішні посилання між статтями
- Зовнішні посилання на офіційні джерела
- Таблиці для структурованих даних
- Списки та підзаголовки для читабельності
- Примери та калькуляції
- FAQ секції

## Додавання нової статті

1. Створіть файл `{language}-{country}-{slug}.md` у папці `articles/`
2. Додайте front matter з метаданими
3. Напишіть контент у Markdown
4. Стаття автоматично з'явиться на сайті

### Приклад команди:

```bash
touch articles/uk-ua-new-article.md
```

## Локалізація

Переклади ключів знаходяться у `lib/i18n.ts`:

```typescript
{
  "knowledge.base": "База знань",
  "knowledge.title": "База знань з оподаткування",
  "knowledge.subtitle": "Корисні статті про податки та декларації",
  "knowledge.read_more": "Читати далі",
  "knowledge.back_to_list": "Повернутися до списку",
  "knowledge.related": "Схожі статті",
  "knowledge.categories": "Категорії"
}
```

## Технології

- **Next.js 16** - Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **gray-matter** - Front Matter Parser
- **react-markdown** - Markdown Renderer
- **Tailwind CSS** - Styling
- **Shadcn UI** - Components

## Майбутні покращення

- [ ] Пошук по статтях
- [ ] Фільтрація по категоріям
- [ ] Автор статей
- [ ] Дата останнього оновлення
- [ ] Рейтинг статей
- [ ] Коментарі
- [ ] Версії статей (tracking changes)
- [ ] RSS feed
- [ ] Sitemap для SEO
- [ ] Analytics tracking

## Ліцензія

Контент статей призначений для освітніх цілей. Завжди консультуйтеся з професійним податковим радником.

