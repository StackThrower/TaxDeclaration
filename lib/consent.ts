"use client"

/**
 * Cookie-consent state shared between the banner and the analytics loader.
 *
 * Analytics (Google Analytics + Microsoft Clarity) must not load until the user
 * has explicitly accepted, so consent has to be readable synchronously and
 * observable — the banner and the script loader are siblings in the tree with
 * no common provider between them.
 */

export type ConsentValue = "accepted" | "rejected"

export const CONSENT_STORAGE_KEY = "cookieConsent"
export const CONSENT_DATE_STORAGE_KEY = "cookieConsentDate"

/** Fired on `window` whenever consent changes in this tab. */
export const CONSENT_CHANGE_EVENT = "cookieconsentchange"

// Fallback for browsers where localStorage throws or silently drops writes
// (Safari private mode, cookies blocked). Without it the user's choice would be
// read back as `null` immediately after they made it, so accepting would appear
// to do nothing. Scoped to the page session on purpose — it is deliberately not
// persisted, so the banner reappears on the next visit.
let memoryConsent: ConsentValue | null = null

function readStoredConsent(): ConsentValue | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return stored === "accepted" || stored === "rejected" ? stored : null
  } catch {
    return null
  }
}

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null

  // Storage wins when readable so that a choice made in another tab is honoured;
  // absent that, fall back to what was chosen in this session.
  return readStoredConsent() ?? memoryConsent
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "accepted"
}

export function setConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return

  memoryConsent = value

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
    window.localStorage.setItem(CONSENT_DATE_STORAGE_KEY, new Date().toISOString())
  } catch {
    // Storage unavailable — `memoryConsent` above keeps the choice for this
    // page session, and the event below still notifies listeners.
  }

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }))
}

/** Subscribe to consent changes, including changes made in another tab. */
export function subscribeToConsent(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {}

  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) listener()
  }

  window.addEventListener(CONSENT_CHANGE_EVENT, listener)
  window.addEventListener("storage", onStorage)

  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, listener)
    window.removeEventListener("storage", onStorage)
  }
}
