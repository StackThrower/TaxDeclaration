/**
 * DejaVu Sans Font Setup for jsPDF
 * This module provides helper functions to register DejaVu Sans fonts
 * with Cyrillic/Ukrainian character support
 */

import { jsPDF } from "jspdf"

let fontsLoaded = false

/**
 * Setup DejaVu Sans fonts for jsPDF with Cyrillic support
 * This version loads fonts from the public directory at runtime
 */
export async function setupUkrainianFonts(doc: jsPDF): Promise<boolean> {
  if (fontsLoaded) {
    doc.setFont("DejaVuSans", "normal")
    return true
  }

  try {
    // Try to load fonts from public directory
    const [normalResponse, boldResponse] = await Promise.all([
      fetch("/fonts/DejaVuSans.ttf"),
      fetch("/fonts/DejaVuSans-Bold.ttf"),
    ])

    if (normalResponse.ok && boldResponse.ok) {
      const normalBuffer = await normalResponse.arrayBuffer()
      const boldBuffer = await boldResponse.arrayBuffer()

      // Convert to base64
      const normalBase64 = arrayBufferToBase64(normalBuffer)
      const boldBase64 = arrayBufferToBase64(boldBuffer)

      // Register with jsPDF
      doc.addFileToVFS("DejaVuSans.ttf", normalBase64)
      doc.addFileToVFS("DejaVuSans-Bold.ttf", boldBase64)

      doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal")
      doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold")

      doc.setFont("DejaVuSans", "normal")

      fontsLoaded = true
      console.log("✅ Ukrainian fonts loaded successfully")
      return true
    }
  } catch (error) {
    console.warn("Could not load Ukrainian fonts:", error)
  }

  return false
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunkSize = 32768 // Process in chunks for better performance

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
    binary += String.fromCharCode.apply(null, Array.from(chunk))
  }

  return btoa(binary)
}

/**
 * Check if fonts are loaded
 */
export function areFontsLoaded(): boolean {
  return fontsLoaded
}

/**
 * Reset font loading state (useful for testing)
 */
export function resetFonts(): void {
  fontsLoaded = false
}

