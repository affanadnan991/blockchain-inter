'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePublicClient, useWalletClient, useAccount, useChainId } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getContractAddress } from '../utils/web3Config'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { toast } from 'react-hot-toast'
import { keccak256, stringToHex, toHex } from 'viem'

/**
 * Comprehensive withdrawal request management hook
 * Handles creation, approval, rejection, and execution of withdrawal requests
 */
export const useWithdrawalRequests = () => {
    const { address } = useAccount()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [requests, setRequests] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    /**
     * Execute a contract write operation
     */
    const executeContractTx = useCallback(
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
                console.error(`[${functionName}] Error:`, err)
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
     * Create a new withdrawal request
     * @param {string} token - Token address (0x0...0 for native)
     * @param {string} amount - Amount in wei
     * @param {string} purposeRawString - Plain text purpose
     * @param {string[]} donationIds - Backing donation IDs
     * @param {string[]} withdrawalAmounts - Per-donation withdrawal amounts
     */
    const createWithdrawalRequest = useCallback(
        async (token, amount, purposeRawString, donationIds = [], withdrawalAmounts = []) => {
            // Create purpose hash
            const purposeHash = purposeRawString ? keccak256(stringToHex(purposeRawString)) : toHex(0, { size: 32 })

            // Fixed Bug 4: Correct argument order with dummy requestId `0n` which will be overwritten by contract
            return executeContractTx(
                'createWithdrawalRequest',
                [0n, token, amount, purposeHash, donationIds || [], withdrawalAmounts || []],
                '✅ Withdrawal request created successfully!'
            )
        },
        [executeContractTx]
    )

    /**
     * Approve a pending withdrawal request (as NGO approver)
     */
    const approveWithdrawalRequest = useCallback(
        async (requestId) => {
            return executeContractTx(
                'approveWithdrawalRequest',
                [BigInt(requestId)],
                '✅ Withdrawal request approved!'
            )
        },
        [executeContractTx]
    )

    /**
     * Reject a pending withdrawal request
     */
    const rejectWithdrawalRequest = useCallback(
        async (requestId) => {
            return executeContractTx(
                'rejectWithdrawalRequest',
                [BigInt(requestId)],
                '❌ Withdrawal request rejected'
            )
        },
        [executeContractTx]
    )

    /**
     * Cancel a withdrawal request (NGO only)
     * Reuses reject withdrawal since we don't have cancel in ABI
     */
    const cancelWithdrawalRequest = useCallback(
        async (requestId) => {
            return rejectWithdrawalRequest(requestId)
        },
        [rejectWithdrawalRequest]
    )

    /**
     * Manually execute a withdrawal (fallback method)
     */
    const manualExecuteWithdrawal = useCallback(
        async (requestId) => {
            return executeContractTx(
                'executeWithdrawal',
                [BigInt(requestId)],
                '💰 Withdrawal executed successfully!'
            )
        },
        [executeContractTx]
    )


    /**
     * Fetch pending withdrawal requests for an NGO
     */
    const fetchPendingRequests = useCallback(
        async (ngoAddress, start = 0, limit = 10) => {
            if (!publicClient || !contractAddress) return []

            try {
                setIsLoading(true)
                const requestIds = await readContract(publicClient, {
                    address: contractAddress,
                    abi: DonationPlatformABI,
                    functionName: 'getPendingRequests',
                    args: [ngoAddress, BigInt(start), BigInt(limit)],
                })

                // Fetch details for each request
                const requestDetails = await Promise.all(
                    requestIds.map(async (id) => {
                        try {
                            const req = await readContract(publicClient, {
                                address: contractAddress,
                                abi: DonationPlatformABI,
                                functionName: 'withdrawalRequests',
                                args: [id],
                            })

                            // Fixed Bug 5: Accurate mapping of fields
                            return {
                                id: id.toString(),
                                ngo: req[0],
                                token: req[1],
                                amount: req[2].toString(),
                                timestamp: Number(req[3]),
                                executed: req[4],
                                approvalsNeeded: Number(req[5]),
                                approvalCount: Number(req[6]),
                                purposeHash: req[7],
                                rejected: false, // Not natively supported directly in the struct schema
                            }
                        } catch (err) {
                            console.error(`Error fetching request ${id}:`, err)
                            return null
                        }
                    })
                )

                setRequests(requestDetails.filter(r => r !== null))
                return requestDetails
            } catch (err) {
                console.error('Error fetching pending requests:', err)
                setError(err.message)
                return []
            } finally {
                setIsLoading(false)
            }
        },
        [publicClient, contractAddress]
    )

    /**
     * Get pending request count for an NGO
     */
    const getPendingRequestCount = useCallback(
        async (ngoAddress) => {
            if (!publicClient || !contractAddress) return 0

            try {
                // Fixed Bug 11: Call getNGOInfo instead to get the pending requests count 
                const info = await readContract(publicClient, {
                    address: contractAddress,
                    abi: DonationPlatformABI,
                    functionName: 'getNGOInfo',
                    args: [ngoAddress],
                })
                return Number(info[4]) // pendingRequests field
            } catch (err) {
                console.error('Error fetching pending request count:', err)
                return 0
            }
        },
        [publicClient, contractAddress]
    )

    /**
     * Check approval status for a specific approver on a request
     */
    const checkApprovalStatus = useCallback(
        async (requestId, approverAddress) => {
            if (!publicClient || !contractAddress) return false

            try {
                const hasApproved = await readContract(publicClient, {
                    address: contractAddress,
                    abi: DonationPlatformABI,
                    functionName: 'getRequestApprovalStatus',
                    args: [BigInt(requestId), approverAddress],
                })
                return hasApproved
            } catch (err) {
                console.error('Error checking approval status:', err)
                return false
            }
        },
        [publicClient, contractAddress]
    )

    return {
        requests,
        isLoading,
        error,
        createWithdrawalRequest,
        approveWithdrawalRequest,
        rejectWithdrawalRequest,
        cancelWithdrawalRequest,
        manualExecuteWithdrawal,
        fetchPendingRequests,
        getPendingRequestCount,
        checkApprovalStatus,
    }
}

export default useWithdrawalRequests
