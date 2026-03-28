'use client'

import { useState, useCallback } from 'react'
import { usePublicClient, useWalletClient, useAccount, useChainId } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getContractAddress } from '../utils/web3Config'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { toast } from 'react-hot-toast'

/**
 * Emergency functions hook
 * Handles emergency mode, fund recovery, and emergency refunds
 * Only accessible to contract owner
 */
export const useEmergencyFunctions = () => {
    const { address } = useAccount()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [emergencyMode, setEmergencyMode] = useState(false)

    /**
     * Execute emergency function
     */
    const executeEmergencyTx = useCallback(
        async (functionName, args, successMsg) => {
            if (!walletClient || !contractAddress || !publicClient) {
                toast.error('Wallet not connected or contract address missing')
                return null
            }

            try {
                setIsLoading(true)
                setError(null)

                const { request } = await publicClient.simulateContract({
                    account: address,
                    address: contractAddress,
                    abi: DonationPlatformABI,
                    functionName,
                    args,
                })

                const hash = await walletClient.writeContract(request)

                toast.promise(
                    publicClient.waitForTransactionReceipt({ hash }),
                    {
                        loading: 'Processing emergency transaction...',
                        success: successMsg || '⚠️ Emergency function executed!',
                        error: 'Emergency transaction failed',
                    }
                )

                return hash
            } catch (err) {
                console.error(`[Emergency ${functionName}] Error:`, err)
                const errorMsg = err.shortMessage || err.message || 'Emergency transaction failed'
                setError(errorMsg)
                toast.error(errorMsg)
                throw err
            } finally {
                setIsLoading(false)
            }
        },
        [walletClient, contractAddress, publicClient, address]
    )

    /**
     * Check if platform is in emergency mode
     */
    const checkEmergencyMode = useCallback(async () => {
        if (!publicClient || !contractAddress) return false

        try {
            const isEmergency = await readContract(publicClient, {
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'emergencyMode',
            })
            setEmergencyMode(isEmergency)
            return isEmergency
        } catch (err) {
            console.error('Error checking emergency mode:', err)
            return false
        }
    }, [publicClient, contractAddress])

    /**
     * Activate emergency mode
     * Pauses platform and enables emergency functions
     */
    const activateEmergencyMode = useCallback(async () => {
        return executeEmergencyTx(
            'activateEmergencyMode',
            [],
            '🚨 Emergency mode activated! Platform paused for safety.'
        )
    }, [executeEmergencyTx])

    /**
     * Deactivate emergency mode
     */
    const deactivateEmergencyMode = useCallback(async () => {
        return executeEmergencyTx(
            'deactivateEmergencyMode',
            [],
            '✅ Emergency mode deactivated. Platform resumed.'
        )
    }, [executeEmergencyTx])

    /**
     * Emergency withdraw stuck funds from the contract
     * Only works when called by the owner in emergency mode
     * @param {string} tokenAddress - Token address (0x0...0 for native)
     * @param {string} toAddress - Destination address to receive funds
     * @param {string} amount - Amount in wei
     */
    const emergencyWithdrawStuckFunds = useCallback(
        async (tokenAddress, toAddress, amount) => {
            return executeEmergencyTx(
                'emergencyWithdrawStuckFunds',
                [tokenAddress, toAddress, amount],
                `⚠️ Emergency withdrawal of tokens executed to ${toAddress}.`
            )
        },
        [executeEmergencyTx]
    )

    /**
     * Pause platform entirely
     */
    const pausePlatform = useCallback(async () => {
        return executeEmergencyTx('pause', [], '⏸️ Platform paused.')
    }, [executeEmergencyTx])

    /**
     * Unpause platform
     */
    const unpausePlatform = useCallback(async () => {
        return executeEmergencyTx('unpause', [], '▶️ Platform resumed.')
    }, [executeEmergencyTx])

    return {
        isLoading,
        error,
        emergencyMode,
        checkEmergencyMode,
        activateEmergencyMode,
        deactivateEmergencyMode,
        emergencyWithdrawStuckFunds,
        pausePlatform,
        unpausePlatform,
    }
}

export default useEmergencyFunctions
