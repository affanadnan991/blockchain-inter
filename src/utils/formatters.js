import { ethers } from 'ethers'

/**
 * Format wei amount to readable number
 */
export const formatEther = (amount, decimals = 18) => {
    if (!amount) return '0'
    return ethers.utils.formatUnits(amount, decimals)
}

/**
 * Parse readable number to wei
 */
export const parseEther = (amount, decimals = 18) => {
    if (!amount) return '0'
    return ethers.utils.parseUnits(amount.toString(), decimals)
}

/**
 * Format token amount with proper decimals
 */
export const formatTokenAmount = (amount, decimals, maxDecimals = 6) => {
    if (!amount) return '0'
    const formatted = ethers.utils.formatUnits(amount, decimals)
    const num = parseFloat(formatted)

    if (num === 0) return '0'
    if (num < 0.000001) return '< 0.000001'

    return num.toLocaleString('en-US', {
        maximumFractionDigits: maxDecimals,
        minimumFractionDigits: 2,
    })
}

/**
 * Shorten wallet address
 */
export const shortenAddress = (address, chars = 4) => {
    if (!address) return ''
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

/**
 * Format USD amount
 */
export const formatUSD = (amount) => {
    if (!amount) return '$0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num)
}

/**
 * Format large numbers (1K, 1M, etc.)
 */
export const formatCompactNumber = (num) => {
    if (!num) return '0'
    const number = typeof num === 'string' ? parseFloat(num) : num

    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`
    }
    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`
    }
    return number.toLocaleString()
}

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

/**
 * Format timestamp to relative time (2 hours ago, etc.)
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return ''
    const now = Date.now()
    const then = timestamp * 1000
    const seconds = Math.floor((now - then) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`

    return formatDate(timestamp)
}

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address) => {
    return ethers.utils.isAddress(address)
}

/**
 * Create message hash for donations
 */
export const createMessageHash = (message) => {
    if (!message) return ethers.constants.HashZero
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message))
}

/**
 * Create purpose hash for withdrawals
 */
export const createPurposeHash = (purpose) => {
    if (!purpose) return ethers.constants.HashZero
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(purpose))
}

/**
 * Get transaction status text
 */
export const getTransactionStatus = (status) => {
    switch (status) {
        case 0:
            return 'Pending'
        case 1:
            return 'Success'
        case 2:
            return 'Failed'
        default:
            return 'Unknown'
    }
}

/**
 * Calculate platform fee
 */
export const calculateFee = (amount, feePercent = 2) => {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount
    return (amountNum * feePercent) / 100
}

/**
 * Calculate net amount after fee
 */
export const calculateNetAmount = (amount, feePercent = 2) => {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount
    const fee = calculateFee(amountNum, feePercent)
    return amountNum - fee
}
