'use client'

import { useState, useCallback } from 'react'
import { usePublicClient, useWalletClient, useAccount, useChainId } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getContractAddress } from '../utils/web3Config'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { toast } from 'react-hot-toast'
import { keccak256, stringToHex } from 'viem'

/**
 * Advanced NGO operations hook
 * Handles NGO registration, approver management, and status updates
 */
export const useNGOOperations = () => {
    const { address } = useAccount()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    /**
     * Execute NGO operation transaction
     */
    const executeNGOTx = useCallback(
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
                        loading: 'Processing transaction...',
                        success: successMsg || 'Transaction successful!',
                        error: 'Transaction failed',
                    }
                )

                return hash
            } catch (err) {
                console.error(`[NGO ${functionName}] Error:`, err)
                const errorMsg = err.shortMessage || err.message || 'Transaction failed'
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
     * Register a new NGO (admin only)
     * @param {string} ngoAddress - NGO wallet address
     * @param {string} ngoName - NGO display name
     * @param {string[]} approversArray - Array of approver addresses
     * @param {number} minApprovalsRequired - Minimum approvals needed
     */
    const registerNGO = useCallback(
        async (ngoAddress, ngoName, approversArray, minApprovalsRequired) => {
            const nameHash = keccak256(stringToHex(ngoName))

            return executeNGOTx(
                'registerNGO',
                [ngoAddress, nameHash, approversArray, minApprovalsRequired],
                `✅ NGO ${ngoName} registered successfully with ${approversArray.length} approvers!`
            )
        },
        [executeNGOTx]
    )

    /**
     * Enable or disable an NGO
     * @param {string} ngoAddress - NGO address
     * @param {boolean} isActive - true to activate, false to deactivate
     */
    const updateNGOStatus = useCallback(
        async (ngoAddress, isActive) => {
            return executeNGOTx(
                'updateNGOStatus',
                [ngoAddress, isActive],
                `${isActive ? '✅ NGO Activated' : '🔒 NGO Deactivated'}`
            )
        },
        [executeNGOTx]
    )

    /**
     * Pause or unpause withdrawals for a specific NGO
     * @param {string} ngoAddress - NGO address
     * @param {boolean} paused - true to pause, false to unpause
     */
    const pauseNGOWithdrawals = useCallback(
        async (ngoAddress, paused) => {
            return executeNGOTx(
                'pauseNGOWithdrawals',
                [ngoAddress, paused],
                paused ? '⏸️ Withdrawals paused for this NGO' : '▶️ Withdrawals resumed for this NGO'
            )
        },
        [executeNGOTx]
    )

    /**
     * Add or remove an approver for an NGO
     * @param {string} ngoAddress - NGO address
     * @param {string} approverAddress - Approver wallet address
     * @param {boolean} shouldAdd - true to add, false to remove
     */
    const manageNGOApprover = useCallback(
        async (ngoAddress, approverAddress, shouldAdd) => {
            return executeNGOTx(
                'manageNGOApprover',
                [ngoAddress, approverAddress, shouldAdd],
                shouldAdd ? `✅ Approver added to NGO` : `❌ Approver removed from NGO`
            )
        },
        [executeNGOTx]
    )

    /**
     * Update minimum approval threshold for an NGO
     * @param {string} ngoAddress - NGO address
     * @param {number} newMinApprovals - New minimum approval count
     */
    const updateMinApprovals = useCallback(
        async (ngoAddress, newMinApprovals) => {
            return executeNGOTx(
                'updateMinApprovals',
                [ngoAddress, newMinApprovals],
                `✅ Minimum approvals updated to ${newMinApprovals}`
            )
        },
        [executeNGOTx]
    )

    /**
     * Get full NGO information
     */
    const getNGOInfo = useCallback(
        async (ngoAddress) => {
            if (!publicClient || !contractAddress) return null

            try {
                const info = await publicClient.readContract({
                    address: contractAddress,
                    abi: DonationPlatformABI,
                    functionName: 'getNGOInfo',
                    args: [ngoAddress],
                })

                // Fixed Bug 9: Proper field mapping
                return {
                    ngoAddress: info[0],
                    totalWithdrawn: info[1].toString(),
                    lastWithdrawal: Number(info[2]),
                    withdrawalCount: Number(info[3]),
                    pendingRequests: Number(info[4]),
                    isActive: info[5],
                    withdrawalsPaused: info[6],
                    minApprovals: Number(info[7]),
                    approversCount: Number(info[8]),
                }
            } catch (err) {
                console.error('Error fetching NGO info:', err)
                return null
            }
        },
        [publicClient, contractAddress]
    )

    return {
        isLoading,
        error,
        registerNGO,
        updateNGOStatus,
        pauseNGOWithdrawals,
        manageNGOApprover,
        updateMinApprovals,
        getNGOInfo,
    }
}

export default useNGOOperations
