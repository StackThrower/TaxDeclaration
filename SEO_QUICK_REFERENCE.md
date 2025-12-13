# Quick Reference Guide - Dynamic SEO

## 📍 URL Structure

All pages use the pattern: `/{language}-{country}`

### Examples:
- `/uk-ua` - Українська мова, Україна (Ukrainian language, Ukraine)
- `/en-us` - English, United States
- `/pl-pl` - Polski, Polska (Polish, Poland)
- `/fr-fr` - Français, France (French, France)
- `/de-de` - Deutsch, Deutschland (German, Germany)
- `/en-gb` - English, United Kingdom
- `/es-es` - Español, España (Spanish, Spain)
- `/pt-pt` - Português, Portugal (Portuguese, Portugal)

## 🔍 SEO Metadata by Country

### 🇺🇦 Ukraine (F0100214, F0121214)
- **Forms**: F0100214 (Property and Income Declaration), F0121214 (Annex F1 - Tax Calculations)
- **Keywords**: податкова декларація, ПДФО, військовий збір, інвестиції
- **Target**: Ukrainian citizens filing personal income tax

### 🇵🇱 Poland (PIT-37, PIT-38, PIT-39)
- **Forms**: PIT-37 (Income Declaration), PIT-38 (Capital Income), PIT-39 (Property Sales)
- **Keywords**: PIT, zeznanie podatkowe, rozliczenie
- **Target**: Polish taxpayers

### 🇫🇷 France (2042, 2042-C, 2044)
- **Forms**: 2042 (Income Declaration), 2042-C (Supplementary), 2044 (Property Income)
- **Keywords**: déclaration d'impôts, revenus
- **Target**: French residents

### 🇩🇪 Germany (EST 1A, Anlage N, Anlage KAP)
- **Forms**: EST 1A (Income Tax), Anlage N (Employment), Anlage KAP (Capital)
- **Keywords**: Steuererklärung, Einkommensteuer
- **Target**: German taxpayers

### 🇵🇹 Portugal (IRS Modelo 3, Anexo A, Anexo E)
- **Forms**: IRS Modelo 3 (Income Declaration), Anexo A (Employment), Anexo E (Capital)
- **Keywords**: IRS, declaração de impostos
- **Target**: Portuguese taxpayers

### 🇪🇸 Spain (Modelo 100, D-100, 720)
- **Forms**: Modelo 100 (Income Tax), D-100 (Additional Data), 720 (Foreign Assets)
- **Keywords**: declaración de la renta, IRPF
- **Target**: Spanish taxpayers

### 🇸🇪 Sweden (INK1, K4, K10)
- **Forms**: INK1 (Income Declaration), K4 (Capital Income), K10 (Securities)
- **Keywords**: inkomstdeklaration, Skatteverket
- **Target**: Swedish taxpayers

### 🇬🇧 United Kingdom (SA100, SA108, SA109)
- **Forms**: SA100 (Tax Return), SA108 (Capital Gains), SA109 (Residence)
- **Keywords**: tax return, self assessment, HMRC
- **Target**: UK taxpayers

### 🇺🇸 United States (1040, Schedule D, 8949, Schedule C)
- **Forms**: Form 1040 (Individual Income Tax), Schedule D (Capital Gains), Form 8949 (Sales), Schedule C (Business)
- **Keywords**: tax return, IRS, income tax
- **Target**: US taxpayers

### 🇨🇦 Canada (T1 General, Schedule 3, T5008)
- **Forms**: T1 General (Income Tax), Schedule 3 (Capital Gains), T5008 (Securities)
- **Keywords**: tax return, CRA, income tax
- **Target**: Canadian taxpayers

## 🛠️ How to Test

### 1. Start Development Server
```bash
cd /Users/vs/Projects/TaxDeclaration
pnpm dev
```

### 2. Test Different Locales
Open your browser and navigate to:
- http://localhost:3000/uk-ua
- http://localhost:3000/en-us
- http://localhost:3000/pl-pl

### 3. Check Meta Tags
Open DevTools (F12) → Elements → `<head>`:
```html
<title>Податкова декларація F0100214 та F0121214 - Україна 2025</title>
<meta name="description" content="Заповніть податкову декларацію онлайн...">
<meta name="keywords" content="податкова декларація, F0100214, F0121214...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
```

### 4. Test Dynamic Updates
1. Navigate to `/uk-ua`
2. Use the country switcher to select Poland
3. URL changes to `/uk-pl`
4. Watch the browser title update immediately
5. Check DevTools - meta tags are updated

### 5. Test Language Switcher
1. Navigate to `/uk-ua`
2. Use the language switcher to select English
3. URL changes to `/en-ua`
4. Title changes from Ukrainian to English
5. Description and keywords also update

## 📱 Social Media Testing

### Open Graph (Facebook, LinkedIn)
1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your page URL
3. Verify title, description, and image appear correctly

### Twitter Card
1. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your page URL
3. Verify card preview looks good

## 🔧 Common Issues & Solutions

### Issue: Title doesn't update
**Solution**: Clear browser cache and reload

### Issue: Meta tags show old content
**Solution**: The client-side update happens in useEffect - check browser console for errors

### Issue: Wrong language displayed
**Solution**: Check localStorage - the language preference is saved there

### Issue: Redirects to wrong locale
**Solution**: Check `lib/countries.ts` - verify languageToCountryMap

## 📊 SEO Checklist

- ✅ Unique title for each country-language combination
- ✅ Description includes specific tax form numbers
- ✅ Keywords relevant to country and forms
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ HTML lang attribute updates dynamically
- ✅ Canonical URLs set
- ✅ Alternate language links provided

## 🚀 Next Steps

### Optional Enhancements:
1. **Add JSON-LD structured data** for better search engine understanding
2. **Implement hreflang tags** for international SEO
3. **Add breadcrumb schema** for forms pages
4. **Create sitemap** with all locale URLs
5. **Add FAQ schema** for help pages
6. **Monitor SEO metrics** using Google Search Console

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `lib/seo-metadata.ts` | SEO metadata generation |
| `app/[locale]/page.tsx` | Server component with generateMetadata |
| `app/[locale]/page-client.tsx` | Client component with dynamic updates |
| `components/dynamic-html-lang.tsx` | Dynamic lang attribute updater |
| `lib/countries.ts` | Country and tax form data |
| `lib/i18n.ts` | Language translations |

## 💡 Tips

1. **Year Updates**: The year (2025) is automatically included - no manual updates needed
2. **Form Names**: Automatically pulled from `countries.ts` - update there to change SEO
3. **Testing**: Use browser DevTools Network tab to see meta tag updates
4. **Debugging**: Check browser console for any errors during dynamic updates
5. **Performance**: Meta tag updates happen instantly without page reload

