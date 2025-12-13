# Ukrainian Cyrillic Font Setup for PDF Export

## Overview

This project uses **DejaVu Sans** fonts to support Ukrainian Cyrillic characters in PDF exports. DejaVu Sans provides excellent Unicode coverage including all Ukrainian letters.

## Font Files

The following font files are included:

- **DejaVuSans.ttf** - Regular weight font with Cyrillic support
- **DejaVuSans-Bold.ttf** - Bold weight font with Cyrillic support

## Location

Fonts are stored in two locations:

1. **Source fonts**: `/lib/fonts/*.ttf` - Original TTF files
2. **Public fonts**: `/public/fonts/*.ttf` - Accessible by the browser

## How It Works

### 1. Font Loading (`lib/fonts/font-setup.ts`)

The `setupUkrainianFonts()` function:
- Fetches font files from `/public/fonts/` at runtime
- Converts them to base64 format
- Registers them with jsPDF using `addFileToVFS()`
- Sets DejaVuSans as the default font

### 2. PDF Generation (`lib/pdf-generator.ts`)

Both PDF generators (`generateF0100214PDF` and `generateF0121214PDF`):
- Are now async functions
- Call `await setupUkrainianFonts(doc)` before generating content
- Automatically use DejaVu Sans for all text rendering

### 3. Form Components

Form submission handlers are now async to support font loading:
- `components/forms/form-f0100214.tsx`
- `components/forms/form-f0121214.tsx`

## Usage

When generating a PDF, the fonts are automatically loaded:

```typescript
// In form components
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // PDF generator automatically loads Ukrainian fonts
  await generateF0100214PDF(formData, language)
}
```

## Testing

To test Ukrainian text rendering:

1. Fill out a form in Ukrainian (uk language)
2. Submit to generate PDF
3. Verify that Ukrainian characters (і, ї, є, ґ, etc.) display correctly

## Troubleshooting

### Fonts not loading

If fonts fail to load:
- Check browser console for 404 errors on `/fonts/*.ttf`
- Verify files exist in `/public/fonts/`
- Check that the dev server is serving static files correctly

### Characters still showing as symbols

If characters still appear as symbols:
- Ensure `setupUkrainianFonts()` is called before any text is added
- Check that `doc.setFont("DejaVuSans")` is being used
- Verify the font files are complete (not corrupted)

## Font License

DejaVu fonts are free and open source, licensed under a license based on the Bitstream Vera Fonts Copyright.

## Maintenance

To update or change fonts:

1. Replace TTF files in `/lib/fonts/`
2. Copy to `/public/fonts/`
3. Update font names in `/lib/fonts/font-setup.ts` if needed
4. Test with Ukrainian text

