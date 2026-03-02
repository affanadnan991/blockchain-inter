/**
 * Environment Configuration Validator
 * Checks required environment variables on app startup
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_INFURA_KEY',
  'NEXT_PUBLIC_ALCHEMY_KEY',
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
]

const optionalEnvVars = [
  'NEXT_PUBLIC_NETWORK',
  'NEXT_PUBLIC_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_DONATION_TOKEN_ADDRESS',
]

export function validateEnvironment() {
  const missing = []
  const warnings = []

  // Check required variables
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })

  // Check optional variables
  optionalEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      warnings.push(envVar)
    }
  })

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    throw new Error(`Missing required env vars: ${missing.join(', ')}`)
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Missing optional environment variables:', warnings)
  }

  console.log('✅ Environment validation passed')
  return true
}

export function getEnv(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue
  
  if (!value && requiredEnvVars.includes(key)) {
    throw new Error(`Required environment variable not found: ${key}`)
  }

  return value
}

export default { validateEnvironment, getEnv }
