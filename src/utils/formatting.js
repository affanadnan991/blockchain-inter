/**
 * formatting.js - Re-exports all formatting utilities from formatters.js
 * This file exists for backward compatibility with imports using '@/utils/formatting'
 */
export * from './formatters'

// Alias for backward compatibility
export { shortenAddress as formatAddress } from './formatters'
