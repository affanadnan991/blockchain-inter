'use client'

/**
 * Utility functions for common UI operations
 */

// Debounce handler for search, input filtering, etc.
export function debounce(func, delay = 300) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle handler for scroll, resize events
export function throttle(func, limit = 300) {
  let lastRun = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastRun >= limit) {
      func(...args)
      lastRun = now
    }
  }
}

// Format large numbers for display (1000 -> 1K, 1000000 -> 1M)
export function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toFixed(2)
}

// Truncate address for display (0x123...def)
export function truncateAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`
}

// Safe JSON parse
export function safeJsonParse(json, fallback = null) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// Copy to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Get URL parameters
export function getUrlParam(paramName) {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(paramName)
}

// Delay function (for setTimeout alternatives)
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Check if value is empty
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

export default {
  debounce,
  throttle,
  formatNumber,
  truncateAddress,
  safeJsonParse,
  copyToClipboard,
  getUrlParam,
  delay,
  isEmpty
}
