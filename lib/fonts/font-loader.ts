/**
 * Font Loader for jsPDF with Ukrainian/Cyrillic support
 * Dynamically loads DejaVu Sans fonts and registers them with jsPDF
 */

import { jsPDF } from "jspdf"

let fontsRegistered = false

/**
 * Load and register DejaVu Sans fonts with jsPDF for Cyrillic/Ukrainian support
 */
export async function registerDejaVuFonts(doc: jsPDF): Promise<void> {
  if (fontsRegistered) {
    doc.setFont("DejaVuSans", "normal")
    return
  }

  try {
    // Load font files from public directory or use fetch
    const regularFontResponse = await fetch('/fonts/DejaVuSans.ttf')
    const boldFontResponse = await fetch('/fonts/DejaVuSans-Bold.ttf')

    if (!regularFontResponse.ok || !boldFontResponse.ok) {
      console.warn("Could not load DejaVu fonts, falling back to default")
      return
    }

    const regularFontBuffer = await regularFontResponse.arrayBuffer()
    const boldFontBuffer = await boldFontResponse.arrayBuffer()

    // Convert ArrayBuffer to base64
    const regularBase64 = arrayBufferToBase64(regularFontBuffer)
    const boldBase64 = arrayBufferToBase64(boldFontBuffer)

    // Register fonts with jsPDF
    doc.addFileToVFS("DejaVuSans-normal.ttf", regularBase64)
    doc.addFileToVFS("DejaVuSans-bold.ttf", boldBase64)

    doc.addFont("DejaVuSans-normal.ttf", "DejaVuSans", "normal")
    doc.addFont("DejaVuSans-bold.ttf", "DejaVuSans", "bold")

    // Set as default font
    doc.setFont("DejaVuSans", "normal")

    fontsRegistered = true
    console.log("✅ DejaVu fonts registered successfully")
  } catch (error) {
    console.error("Error loading DejaVu fonts:", error)
  }
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Reset font registration (useful for testing)
 */
export function resetFontRegistration(): void {
  fontsRegistered = false
}

