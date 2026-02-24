import { configureChains, createConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

// Get environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'
const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true'

// Select chain based on environment
export const supportedChains = isTestnet ? [polygonMumbai] : [polygon]
export const defaultChain = isTestnet ? polygonMumbai : polygon

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
}

// Get contract address for current chain
export const getContractAddress = (chainId) => {
    return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[defaultChain.id]
}

// Supported tokens configuration
export const SUPPORTED_TOKENS = {
    [polygon.id]: [
        {
            symbol: 'MATIC',
            name: 'Polygon',
            address: '0x0000000000000000000000000000000000000000', // Native token
            decimals: 18,
            minDonation: '1000000000000000000', // 1 MATIC
            logo: '/tokens/matic.svg',
        },
        {
            symbol: 'USDT',
            name: 'Tether USD',
            address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            decimals: 6,
            minDonation: '10000000', // 10 USDT
            logo: '/tokens/usdt.svg',
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            decimals: 6,
            minDonation: '10000000', // 10 USDC
            logo: '/tokens/usdc.svg',
        },
        {
            symbol: 'DAI',
            name: 'Dai Stablecoin',
            address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            decimals: 18,
            minDonation: '10000000000000000000', // 10 DAI
            logo: '/tokens/dai.svg',
        },
    ],
    [polygonMumbai.id]: [
        {
            symbol: 'MATIC',
            name: 'Polygon',
            address: '0x0000000000000000000000000000000000000000',
            decimals: 18,
            minDonation: '1000000000000000000',
            logo: '/tokens/matic.svg',
        },
        // Add testnet token addresses here
    ],
}

// Get supported tokens for chain
export const getSupportedTokens = (chainId) => {
    return SUPPORTED_TOKENS[chainId] || SUPPORTED_TOKENS[defaultChain.id]
}

// Block explorer URLs
export const BLOCK_EXPLORER = {
    [polygon.id]: 'https://polygonscan.com',
    [polygonMumbai.id]: 'https://mumbai.polygonscan.com',
}

export const getExplorerUrl = (chainId) => {
    return BLOCK_EXPLORER[chainId] || BLOCK_EXPLORER[defaultChain.id]
}

// Platform constants
export const PLATFORM_FEE_PERCENT = 2
export const WITHDRAWAL_COOLDOWN_DAYS = 1
export const MAX_WITHDRAWAL_ITEMS = 10
export const MIN_NATIVE_DONATION = '1000000000000000000' // 1 MATIC
