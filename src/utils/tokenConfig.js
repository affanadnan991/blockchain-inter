/**
 * Token Configuration System
 * Supports unlimited whitelisted ERC20 tokens + native token
 * Easily add new tokens by pushing to SUPPORTED_TOKENS array
 */

import { polygon, polygonMumbai } from 'wagmi/chains'
import { LOCAL_CONFIG } from './localConfig'

/**
 * @notice Master token registry for the platform
 *         Admin can whitelist any ERC20 on the contract
 *         This config shows commonly used tokens - easily extensible
 */
export const TOKEN_REGISTRY = {
  // Local Hardhat Network (ID: 31337)
  31337: [
    {
      symbol: 'MATIC',
      name: 'Polygon MATIC (Local)',
      address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      decimals: 18,
      minDonation: '1000000000000000000', // 1 MATIC (contract minimum)
      logo: '/assets/polygon.png',
      type: 'native',
      color: '#8247E5',
      description: 'Local test MATIC'
    },
    // Populate with tokens from .env if available
    ...(LOCAL_CONFIG.tokens || [])
  ],

  [polygon.id]: [
    {
      // NATIVE TOKEN - No contract address
      symbol: 'MATIC',
      name: 'Polygon Native',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      minDonation: '1000000000000000000', // 1 MATIC (contract minimum)
      logo: '/assets/polygon.png',
      type: 'native',
      color: '#8247E5',
      description: 'Polygon native token - fastest & cheapest'
    },
    
    // STABLECOINS (Recommended)
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      decimals: 6,
      minDonation: '5000000', // 5 USDT
      logo: '/assets/usdt.png',
      type: 'stablecoin',
      color: '#26A17B',
      description: 'Most liquid stablecoin'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6,
      minDonation: '5000000', // 5 USDC
      logo: '/assets/usdc.png',
      type: 'stablecoin',
      color: '#2775CA',
      description: 'Circle-backed stablecoin'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      decimals: 18,
      minDonation: '5000000000000000000', // 5 DAI
      logo: '/assets/dai.png',
      type: 'stablecoin',
      color: '#F5AF1D',
      description: 'Decentralized stablecoin'
    },

    // OTHER TOKENS
    {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      decimals: 18,
      minDonation: '1000000000000000', // 0.001 WETH
      logo: '/assets/weth.png',
      type: 'erc20',
      color: '#627EEA',
      description: 'Ethereum token on Polygon'
    },
    {
      symbol: 'AAVE',
      name: 'Aave Token',
      address: '0xD6DF932A45108d2930BF6E69ff00d129B5C05E81',
      decimals: 18,
      minDonation: '10000000000000000', // 0.01 AAVE
      logo: '/assets/aave.png',
      type: 'erc20',
      color: '#ff8080',
      description: 'Governance token of Aave'
    },
  ],
  
  [polygonMumbai.id]: [
    {
      symbol: 'MATIC',
      name: 'Polygon Native (Testnet)',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      minDonation: '1000000000000000000', // 1 MATIC (contract minimum)
      logo: '/assets/polygon.png',
      type: 'native',
      color: '#8247E5',
      description: 'Testnet MATIC'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD (Testnet)',
      address: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
      decimals: 6,
      minDonation: '5000000',
      logo: '/assets/usdt.png',
      type: 'stablecoin',
      color: '#26A17B',
      description: 'Testnet USDT'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin (Testnet)',
      address: '0x9Ce2c2713cc76441e938112eba16fC30eBF4f45F',
      decimals: 6,
      minDonation: '5000000',
      logo: '/assets/usdc.png',
      type: 'stablecoin',
      color: '#2775CA',
      description: 'Testnet USDC'
    },
  ],

  // Ethereum mainnet tokens (if contract deployed there)
  [1]: [
    {
      symbol: 'ETH',
      name: 'Ethereum Native',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      minDonation: '1000000000000000000', // 1 ETH (contract minimum)
      logo: '/assets/eth.png',
      type: 'native',
      color: '#627EEA',
      description: 'Ethereum mainnet native token'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      minDonation: '5000000',
      logo: '/assets/usdt.png',
      type: 'stablecoin',
      color: '#26A17B',
      description: 'USDT on Ethereum'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48',
      decimals: 6,
      minDonation: '5000000',
      logo: '/assets/usdc.png',
      type: 'stablecoin',
      color: '#2775CA',
      description: 'USDC on Ethereum'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      minDonation: '5000000000000000000',
      logo: '/assets/dai.png',
      type: 'stablecoin',
      color: '#F5AF1D',
      description: 'DAI on Ethereum'
    },
    {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      minDonation: '1000000000000000',
      logo: '/assets/weth.png',
      type: 'erc20',
      color: '#627EEA',
      description: 'Wrapped Ether'
    },
    {
      symbol: 'AAVE',
      name: 'Aave Token',
      address: '0x7Fc66500c84A76Ad7e9c93437E434122A1f9AcDd',
      decimals: 18,
      minDonation: '10000000000000000',
      logo: '/assets/aave.png',
      type: 'erc20',
      color: '#c870ff',
      description: 'Aave governance token'
    },
  ]
}

/**
 * Get tokens for current chain
 * @param {number} chainId - Blockchain chain ID
 * @returns {Array} Array of token configs
 */
export function getSupportedTokens(chainId) {
  return TOKEN_REGISTRY[chainId] || TOKEN_REGISTRY[polygon.id]
}

/**
 * Find token by symbol and chain
 * @param {string} symbol - Token symbol (e.g., 'USDT')
 * @param {number} chainId - Blockchain chain ID
 * @returns {Object|null} Token config or null if not found
 */
export function getTokenBySymbol(symbol, chainId) {
  const tokens = getSupportedTokens(chainId)
  return tokens.find(t => t.symbol === symbol) || null
}

/**
 * Find token by address and chain
 * @param {string} address - Token contract address
 * @param {number} chainId - Blockchain chain ID
 * @returns {Object|null} Token config or null if not found
 */
export function getTokenByAddress(address, chainId) {
  const tokens = getSupportedTokens(chainId)
  return tokens.find(t => t.address.toLowerCase() === address.toLowerCase()) || null
}

/**
 * Get only stablecoins for a chain
 * @param {number} chainId - Blockchain chain ID
 * @returns {Array} Array of stablecoin configs
 */
export function getStablecoins(chainId) {
  const tokens = getSupportedTokens(chainId)
  return tokens.filter(t => t.type === 'stablecoin')
}

/**
 * Get native token for a chain
 * @param {number} chainId - Blockchain chain ID
 * @returns {Object|null} Native token config
 */
export function getNativeToken(chainId) {
  const tokens = getSupportedTokens(chainId)
  return tokens.find(t => t.type === 'native') || null
}

/**
 * Group tokens by type
 * @param {number} chainId - Blockchain chain ID
 * @returns {Object} { native, stablecoins, erc20 }
 */
export function getTokensByType(chainId) {
  const tokens = getSupportedTokens(chainId)
  return {
    native: tokens.filter(t => t.type === 'native'),
    stablecoins: tokens.filter(t => t.type === 'stablecoin'),
    erc20: tokens.filter(t => t.type === 'erc20'),
  }
}

/**
 * Format token amount
 * @param {string|number} amount - Raw amount
 * @param {number} decimals - Token decimals
 * @param {number} displayDecimals - Decimals to display (default 2)
 * @returns {string} Formatted amount
 */
export function formatTokenAmount(amount, decimals, displayDecimals = 2) {
  if (!amount) return '0.00'
  const num = Number(amount) / Math.pow(10, decimals)
  return num.toFixed(displayDecimals)
}

/**
 * Convert display amount to raw (with decimals)
 * @param {string|number} displayAmount - Human-readable amount
 * @param {number} decimals - Token decimals
 * @returns {string} Raw amount
 */
export function toRawAmount(displayAmount, decimals) {
  if (!displayAmount) return '0'
  const num = Number(displayAmount)
  return (num * Math.pow(10, decimals)).toFixed(0)
}

export default {
  TOKEN_REGISTRY,
  getSupportedTokens,
  getTokenBySymbol,
  getTokenByAddress,
  getStablecoins,
  getNativeToken,
  getTokensByType,
  formatTokenAmount,
  toRawAmount
}
