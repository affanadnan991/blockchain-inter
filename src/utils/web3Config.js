import { configureChains, createConfig } from 'wagmi'
import { polygon, polygonMumbai, hardhat, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

// Get environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'
const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true'

// Select chain based on environment
// when running in production we support both Polygon and Ethereum mainnet
export const supportedChains = isTestnet ? [hardhat] : [polygon, mainnet]
export const defaultChain = isTestnet ? hardhat : polygon

// Wagmi configuration for v1
const { chains, publicClient, webSocketPublicClient } = configureChains(
    supportedChains,
    [publicProvider()]
)

const { connectors } = getDefaultWallets({
    appName: 'GiveHope',
    projectId,
    chains,
})

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
})

// Contract addresses
export const CONTRACT_ADDRESSES = {
    [polygon.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    [polygonMumbai.id]: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS,
    [hardhat.id]: process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS,
    [mainnet.id]: process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS,
}

// Get contract address for current chain
export const getContractAddress = (chainId) => {
    // return address only if explicitly configured for this chain
    if (CONTRACT_ADDRESSES[chainId]) {
        return CONTRACT_ADDRESSES[chainId]
    }
    // fallback to default if nothing available (useful on localhost/test)
    return CONTRACT_ADDRESSES[defaultChain.id] || null
}

// tokens now managed via centralized tokenConfig.js
import { getSupportedTokens as getTokensFromConfig } from './tokenConfig'

// helper that proxies to tokenConfig - kept for backward compatibility
export const getSupportedTokens = (chainId) => {
    return getTokensFromConfig(chainId)
}

// NOTE: the old SUPPORTED_TOKENS object has been deprecated; use tokenConfig helpers instead.  

// Block explorer URLs
export const BLOCK_EXPLORER = {
    [polygon.id]: 'https://polygonscan.com',
    [polygonMumbai.id]: 'https://mumbai.polygonscan.com',
    [mainnet.id]: 'https://etherscan.io',
    [hardhat.id] : 'http://localhost:8545',
}

export const getExplorerUrl = (chainId) => {
    return BLOCK_EXPLORER[chainId] || BLOCK_EXPLORER[defaultChain.id]
}

// Platform constants
export const PLATFORM_FEE_PERCENT = 2
export const WITHDRAWAL_COOLDOWN_DAYS = 1
export const MAX_WITHDRAWAL_ITEMS = 10
export const MIN_NATIVE_DONATION = '1000000000000000000' // 1 MATIC

// Platform constants & Fee Structure  
export const FEE_BREAKDOWN = {
  PLATFORM_FEE: 2, // 2% collected by GiveHope
  NGO_ALLOCATION: 98, // 98% goes directly to NGOs/donors
  NETWORK_GAS: 'Variable', // Gas fees vary by network
}

// Transparency Info
export const TRANSPARENCY_INFO = {
  description: 'Every transaction is recorded on the Polygon blockchain',
  features: [
    { icon: '🔒', title: 'Immutable Records', text: 'All donations permanently recorded' },
    { icon: '👁️', title: 'Real-time Tracking', text: 'View transactions as they happen' },
    { icon: '💰', title: 'Fee Transparency', text: `${PLATFORM_FEE_PERCENT}% fee supports GiveHope` },
  ]
}
