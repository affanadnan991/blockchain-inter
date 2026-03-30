import { configureChains, createConfig } from 'wagmi'
import { polygon, polygonMumbai, hardhat } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import Image from "next/image"

// Get environment variables
// Fixed Bug 20: Fallback WalletConnect project ID to prevent crashes
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1c09eb0910f54b6c382f64c614da0571'
const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true'
const isLocalHardhat = process.env.NEXT_PUBLIC_HARDHAT === 'true'

// Select chains based on environment
const getChains = () => {
    if (isLocalHardhat) return [hardhat]
    if (isTestnet) return [polygonMumbai]
    return [polygon]
}

export const supportedChains = getChains()
export const defaultChain = supportedChains[0]

// Wagmi configuration — use local RPC for Hardhat
const providers = isLocalHardhat
    ? [jsonRpcProvider({ rpc: () => ({ http: 'http://127.0.0.1:8545' }) })]
    : [publicProvider()]

const { chains, publicClient, webSocketPublicClient } = configureChains(
    supportedChains,
    providers
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

// Contract addresses — keyed by chainId
export const CONTRACT_ADDRESSES = {
    [polygon.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    [polygonMumbai.id]: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS,
    [hardhat.id]: process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS, // 31337
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
            address: '0x0000000000000000000000000000000000000000',
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
    ],
    // Hardhat localhost — native ETH + no ERC20 tokens (unless you deploy test tokens)
    [hardhat.id]: [
        {
            symbol: 'ETH',
            name: 'Ether (Local)',
            address: '0x0000000000000000000000000000000000000000',
            decimals: 18,
            minDonation: '100000000000000000', // 0.1 ETH
            logo: '/tokens/eth.svg',
        },
    ],
}

// Get supported tokens for chain
export const getSupportedTokens = (chainId) => {
    // Fixed Bug 19: CRITICAL NOTE FOR FUTURE POLYGON DEPLOYMENT
    // ========================================================
    // When you deploy this to Polygon Mainnet, you MUST call:
    // contract.whitelistToken(tokenAddress, true)
    // using the contract Owner wallet for EACH of the ERC20 tokens.
    // If you don't whitelist them, all token donations will revert!

    return SUPPORTED_TOKENS[chainId] || SUPPORTED_TOKENS[defaultChain.id]
}

// Block explorer URLs
export const BLOCK_EXPLORER = {
    [polygon.id]: 'https://polygonscan.com',
    [polygonMumbai.id]: 'https://mumbai.polygonscan.com',
    [hardhat.id]: '', // No block explorer for local Hardhat
}

export const getExplorerUrl = (chainId) => {
    return BLOCK_EXPLORER[chainId] || BLOCK_EXPLORER[defaultChain.id] || ''
}

// Platform constants & Fee Structure
export const PLATFORM_FEE_PERCENT = 2 // 2% platform fee
export const FEE_BREAKDOWN = {
    PLATFORM_FEE: 2, // 2% collected by GiveHope
    NGO_ALLOCATION: 98, // 98% goes directly to NGOs/donors
    NETWORK_GAS: 'Variable', // Gas fees vary by network
}
export const WITHDRAWAL_COOLDOWN_DAYS = 1
export const MAX_WITHDRAWAL_ITEMS = 10
export const MIN_NATIVE_DONATION = '100000000000000000' // 0.1 ETH/MATIC

// Transparency Info
export const TRANSPARENCY_INFO = {
    description: 'Every transaction is recorded on the blockchain',
    features: [
        { icon: <Image src="/assets/immutable.png" alt="MATIC" width={40} height={40} />, title: 'Immutable Records', text: 'All donations permanently recorded' },
        { icon: <Image src="/assets/real-time.png" alt="USDT" width={40} height={40} />, title: 'Real-time Tracking', text: 'View transactions as they happen' },
        { icon: <Image src="/assets/fee-transparency.png" alt="USDC" width={40} height={40} />, title: 'Fee Transparency', text: `${PLATFORM_FEE_PERCENT}% fee supports GiveHope` },
    ],
}
