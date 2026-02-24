import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import DonationPlatformABI from '../contracts/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'
import { createMessageHash, createPurposeHash } from '../utils/formatters'
import useWeb3 from './useWeb3'

/**
 * Custom hook for interacting with DonationPlatform contract
 */
export const useDonationContract = () => {
    const { chainId, isConnected } = useWeb3()
    const contractAddress = getContractAddress(chainId)

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
     * Get NGO Balance
     */
    const getNGOBalance = async (ngoAddress, tokenAddress) => {
        if (!isConnected || !ngoAddress) return '0'

        try {
            const { data } = await useContractRead({
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'getNGOBalance',
                args: [ngoAddress, tokenAddress],
            })
            return data
        } catch (error) {
            console.error('Error fetching NGO balance:', error)
            return '0'
        }
    }

    /**
     * Get NGO Info
     */
    const getNGOInfo = async (ngoAddress) => {
        if (!isConnected || !ngoAddress) return null

        try {
            const { data } = await useContractRead({
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
    }

    return {
        contractAddress,
        platformStats,
        platformFeePercent: platformFeePercent || 2,
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
    const { chainId } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const [txHash, setTxHash] = useState(null)

    const { config } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'donateNative',
        enabled: false,
    })

    const { write, data, isLoading: isWriting, isSuccess, isError, error } = useContractWrite(config)

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
        hash: data?.hash,
    })

    useEffect(() => {
        if (data?.hash) {
            setTxHash(data.hash)
        }
    }, [data])

    const donate = async (amount, message = '') => {
        if (!write) return

        const messageHash = createMessageHash(message)

        write({
            args: [messageHash],
            value: ethers.utils.parseEther(amount),
        })
    }

    return {
        donate,
        isLoading: isWriting || isConfirming,
        isSuccess: isConfirmed,
        isError,
        error,
        txHash,
    }
}

/**
 * Hook for donating to specific NGO (native token)
 */
export const useDonateToNGO = () => {
    const { chainId } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const [txHash, setTxHash] = useState(null)

    const { config } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'donateToNGO',
        enabled: false,
    })

    const { write, data, isLoading: isWriting, isSuccess, isError, error } = useContractWrite(config)

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
        hash: data?.hash,
    })

    useEffect(() => {
        if (data?.hash) {
            setTxHash(data.hash)
        }
    }, [data])

    const donate = async (ngoAddress, amount, message = '') => {
        if (!write || !ngoAddress) return

        const messageHash = createMessageHash(message)

        write({
            args: [ngoAddress, messageHash],
            value: ethers.utils.parseEther(amount),
        })
    }

    return {
        donate,
        isLoading: isWriting || isConfirming,
        isSuccess: isConfirmed,
        isError,
        error,
        txHash,
    }
}

/**
 * Hook for ERC20 token donations
 */
export const useDonateToken = () => {
    const { chainId } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const [txHash, setTxHash] = useState(null)

    const { config } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'donateToken',
        enabled: false,
    })

    const { write, data, isLoading: isWriting, isSuccess, isError, error } = useContractWrite(config)

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
        hash: data?.hash,
    })

    useEffect(() => {
        if (data?.hash) {
            setTxHash(data.hash)
        }
    }, [data])

    const donate = async (tokenAddress, amount, decimals, designatedNGO = ethers.constants.AddressZero, message = '') => {
        if (!write || !tokenAddress) return

        const messageHash = createMessageHash(message)
        const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals)

        write({
            args: [tokenAddress, amountInWei, designatedNGO, messageHash],
        })
    }

    return {
        donate,
        isLoading: isWriting || isConfirming,
        isSuccess: isConfirmed,
        isError,
        error,
        txHash,
    }
}

export default useDonationContract
