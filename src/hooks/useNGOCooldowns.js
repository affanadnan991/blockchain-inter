'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePublicClient, useChainId, useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getContractAddress } from '../utils/web3Config'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'

/**
 * Hook for managing NGO cooldowns and withdrawal availability
 * Provides real-time cooldown countdown and status information
 */
export const useNGOCooldowns = () => {
    const { address, isConnected } = useAccount()
    const publicClient = usePublicClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [normalCooldown, setNormalCooldown] = useState(0)
    const [generalCooldown, setGeneralCooldown] = useState(0)
    const [cooldownLoading, setCooldownLoading] = useState(false)

    const COOLDOWN_SECONDS = 30 * 24 * 60 * 60 // 30 days standard cooldown

    /**
     * Get remaining cooldown time for normal withdrawals
     */
    const getWithdrawalCooldownRemaining = useCallback(async () => {
        if (!publicClient || !contractAddress || !address || !isConnected) return 0

        try {
            setCooldownLoading(true)
            // Fixed Bug 12: Computed locally based on actual ABI data
            const info = await publicClient.readContract({
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'getNGOInfo',
                args: [address],
            })

            const lastWithdrawal = Number(info[2])
            if (lastWithdrawal === 0) {
                setNormalCooldown(0)
                return 0
            }

            const now = Math.floor(Date.now() / 1000)
            const remaining = Math.max(0, (lastWithdrawal + COOLDOWN_SECONDS) - now)

            setNormalCooldown(remaining)
            return remaining
        } catch (err) {
            console.error('Error fetching withdrawal cooldown:', err)
            return 0
        } finally {
            setCooldownLoading(false)
        }
    }, [publicClient, contractAddress, address, isConnected])

    /**
     * Get remaining cooldown time for general pool withdrawals
     */
    const getGeneralPoolCooldownRemaining = useCallback(async () => {
        // Not natively supported by ABI, defaulting to 0
        setGeneralCooldown(0)
        return 0
    }, [])

    /**
     * Get both cooldowns at once
     */
    const getActiveCooldowns = useCallback(async () => {
        const normal = await getWithdrawalCooldownRemaining()
        const general = await getGeneralPoolCooldownRemaining()
        return { normalWithdrawal: normal, generalPool: general }
    }, [getWithdrawalCooldownRemaining, getGeneralPoolCooldownRemaining])

    /**
     * Format cooldown time to human-readable string
     */
    const formatCooldownTime = (seconds) => {
        if (seconds === 0) return 'Ready now! ✅'
        if (seconds < 60) return `${seconds}s remaining`
        if (seconds < 3600) {
            const mins = Math.floor(seconds / 60)
            return `${mins}m ${seconds % 60}s remaining`
        }
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${mins}m remaining`
    }

    /**
     * Auto-refresh cooldowns every second when active
     */
    useEffect(() => {
        if (!isConnected || !address) return

        // Initial fetch
        getActiveCooldowns()

        // Set up interval to decrement cooldowns
        const interval = setInterval(() => {
            setNormalCooldown((prev) => (prev > 0 ? prev - 1 : 0))
            setGeneralCooldown((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        // Fixed Bug 17: Fixed internal sync interval
        const syncInterval = setInterval(() => {
            getActiveCooldowns()
        }, 60000) // Sync every 60 seconds

        return () => {
            clearInterval(interval)
            clearInterval(syncInterval)
        }
    }, [isConnected, address, getActiveCooldowns])

    return {
        normalCooldown,
        generalCooldown,
        cooldownLoading,
        getWithdrawalCooldownRemaining,
        getGeneralPoolCooldownRemaining,
        getActiveCooldowns,
        formatCooldownTime,
        isNormalCooldownActive: normalCooldown > 0,
        isGeneralCooldownActive: generalCooldown > 0,
    }
}

export default useNGOCooldowns
