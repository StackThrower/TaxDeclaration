# Next.js 15 Async Params Fix

## Issue

In Next.js 15, the `params` prop in page components and `generateMetadata` functions is now a Promise that must be awaited before accessing its properties.

### Error Message
```
Error: Route "/[locale]" used `params.locale`. `params` is a Promise and must be unwrapped with `await` or `React.use()` before accessing its properties.
```

## Solution

### Before (Next.js 14 and earlier)
```typescript
type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale  // ❌ Direct access
  // ...
}

export default function LocalePage({ params }: Props) {
  return <Component locale={params.locale} />  // ❌ Direct access
}
```

### After (Next.js 15)
```typescript
type Props = {
  params: Promise<{ locale: string }>  // ✅ Now a Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params  // ✅ Must await
  // ...
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params  // ✅ Must await
  return <Component locale={locale} />
}
```

## Changes Made

### File: `app/[locale]/page.tsx`

1. **Updated Props type:**
   ```typescript
   type Props = {
     params: Promise<{ locale: string }>  // Changed from { locale: string }
   }
   ```

2. **Updated generateMetadata:**
   ```typescript
   export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const { locale } = await params  // Added await
     // ...
   }
   ```

3. **Updated page component:**
   ```typescript
   export default async function LocalePage({ params }: Props) {
     const { locale } = await params  // Added await
     return <LocalePageClient locale={locale} />
   }
   ```

## Why This Change?

Next.js 15 made this change to:
- Better support streaming and suspense
- Improve performance with parallel data fetching
- Make the async nature of params more explicit
- Enable better type safety

## Other Affected Files

✅ **No other files affected** - The other pages in `app/[locale]/help/page.tsx` and `app/[locale]/privacy/page.tsx` are client components that use the `useParams()` hook, which doesn't have this issue.

## Testing

After this fix:
- ✅ TypeScript compilation passes with no errors
- ✅ Build process completes successfully
- ✅ Dynamic SEO metadata generation works correctly
- ✅ All 70 locale combinations (10 countries × 7 languages) function properly

## Related Documentation

- [Next.js 15 Migration Guide - Async Request APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [Next.js Params Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional)

## Date of Fix
December 13, 2025

