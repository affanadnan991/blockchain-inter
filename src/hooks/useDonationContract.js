import { useContractRead, usePublicClient, useWalletClient } from 'wagmi'
import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'
import { createMessageHash } from '../utils/formatters'
import useWeb3 from './useWeb3'

/**
 * Custom hook for interacting with DonationPlatform contract
 */
export const useDonationContract = () => {
    const { chainId, isConnected } = useWeb3()
    const publicClient = usePublicClient()
    const contractAddress = getContractAddress(chainId)
    if (!contractAddress) {
        console.warn('useDonationContract: no contract configured for chain', chainId)
    }

    /**
     * Read contract data - Platform Stats
     */
    const { data: platformStats, isLoading: statsLoading, refetch: refetchStats } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getPlatformStats',
        watch: true,
    })

    /**
     * Read contract data - Platform Fee
     */
    const { data: platformFeePercent } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'platformFeePercent',
    })

    /**
     * Get NGO Balance (uses readContract for dynamic args)
     */
    const getNGOBalance = useCallback(async (ngoAddress, tokenAddress) => {
        if (!publicClient || !contractAddress || !ngoAddress) return '0'
        try {
            const data = await publicClient.readContract({
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'getNGOBalance',
                args: [ngoAddress, tokenAddress ?? '0x0000000000000000000000000000000000000000'],
            })
            return data?.toString() ?? '0'
        } catch (error) {
            console.error('Error fetching NGO balance:', error)
            return '0'
        }
    }, [publicClient, contractAddress])

    /**
     * Get NGO Info (uses readContract for dynamic args)
     */
    const getNGOInfo = useCallback(async (ngoAddress) => {
        if (!publicClient || !contractAddress || !ngoAddress) return null
        try {
            const data = await publicClient.readContract({
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'getNGOInfo',
                args: [ngoAddress],
            })
            return data
        } catch (error) {
            console.error('Error fetching NGO info:', error)
            return null
        }
    }, [publicClient, contractAddress])

    return {
        contractAddress,
        platformStats,
        platformFeePercent: platformFeePercent ?? 2,
        statsLoading,
        refetchStats,
        getNGOBalance,
        getNGOInfo,
    }
}

/**
 * Hook for native (MATIC) donations
 */
export const useDonateMATIC = () => {
    const { chainId, address } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    if (!contractAddress) {
        console.warn('useDonateMATIC: no contract configured for chain', chainId)
    }

    const [txHash, setTxHash] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const donate = async (amount, message = '') => {
        if (!walletClient || !contractAddress) return

        try {
            setIsLoading(true)
            setIsSuccess(false)
            setIsError(false)
            setError(null)
            setTxHash(null)

            const messageHash = createMessageHash(message)

            const { request } = await publicClient.simulateContract({
                account: address,
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'donateNative',
                args: [messageHash],
                value: ethers.utils.parseEther(amount),
            })

            const hash = await walletClient.writeContract(request)
            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })
            setIsSuccess(true)
        } catch (err) {
            console.error('Error in donateMATIC:', err)
            setIsError(true)
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }

    return { donate, isLoading, isSuccess, isError, error, txHash }
}

/**
 * Hook for donating to specific NGO (native token)
 */
export const useDonateToNGO = () => {
    const { chainId, address } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    if (!contractAddress) {
        console.warn('useDonateToNGO: no contract configured for chain', chainId)
    }

    const [txHash, setTxHash] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const donate = async (ngoAddress, amount, message = '') => {
        if (!walletClient || !contractAddress || !ngoAddress) return

        try {
            setIsLoading(true)
            setIsSuccess(false)
            setIsError(false)
            setError(null)
            setTxHash(null)

            const messageHash = createMessageHash(message)

            const { request } = await publicClient.simulateContract({
                account: address,
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'donateToNGO',
                args: [ngoAddress, messageHash],
                value: ethers.utils.parseEther(amount),
            })

            const hash = await walletClient.writeContract(request)
            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })
            setIsSuccess(true)
        } catch (err) {
            console.error('Error in donateToNGO:', err)
            setIsError(true)
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }

    return { donate, isLoading, isSuccess, isError, error, txHash }
}

/**
 * Hook for ERC20 token donations
 */
export const useDonateToken = () => {
    const { chainId, address } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    if (!contractAddress) {
        console.warn('useDonateToken: no contract configured for chain', chainId)
    }

    const [txHash, setTxHash] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const donate = async (tokenAddress, amount, decimals, designatedNGO = ethers.constants.AddressZero, message = '') => {
        if (!walletClient || !contractAddress || !tokenAddress) return

        try {
            setIsLoading(true)
            setIsSuccess(false)
            setIsError(false)
            setError(null)
            setTxHash(null)

            const messageHash = createMessageHash(message)
            const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals)

            const { request } = await publicClient.simulateContract({
                account: address,
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'donateToken',
                args: [tokenAddress, amountInWei, designatedNGO, messageHash],
            })

            const hash = await walletClient.writeContract(request)
            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })
            setIsSuccess(true)
        } catch (err) {
            console.error('Error in donateToken:', err)
            setIsError(true)
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }

    return { donate, isLoading, isSuccess, isError, error, txHash }
}

export default useDonationContract
