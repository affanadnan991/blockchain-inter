'use client'

import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'
import { createPurposeHash } from '../utils/formatters'
import useWeb3 from './useWeb3'

/**
 * Hook for managing withdrawal requests
 */
export const useWithdrawalRequests = (ngoAddress) => {
    const { chainId, address } = useWeb3()
    const contractAddress = getContractAddress(chainId)
    const [txHash, setTxHash] = useState(null)

    // Get pending requests
    const { data: pendingRequests, refetch: refetchPendingRequests, isLoading: pendingLoading } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getPendingRequests',
        args: ngoAddress ? [ngoAddress, 0n, 100n] : undefined,
        enabled: !!ngoAddress,
        watch: true,
    })

    // Get pending request count
    const { data: pendingRequestCount } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getPendingRequestCount',
        args: ngoAddress ? [ngoAddress] : undefined,
        enabled: !!ngoAddress,
        watch: true,
    })

    // Create withdrawal request
    const { config: createRequestConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'createWithdrawalRequest',
        enabled: false,
    })

    const {
        write: writeCreateRequest,
        data: createRequestData,
        isLoading: isCreatingRequest,
        isSuccess: createSuccess,
        isError: createError,
        error: createErrorMsg,
    } = useContractWrite(createRequestConfig)

    const { isLoading: isConfirmingCreate } = useWaitForTransaction({
        hash: createRequestData?.hash,
    })

    // Approve withdrawal request
    const { config: approveRequestConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'approveWithdrawalRequest',
        enabled: false,
    })

    const {
        write: writeApproveRequest,
        data: approveRequestData,
        isLoading: isApprovingRequest,
        isSuccess: approveSuccess,
    } = useContractWrite(approveRequestConfig)

    const { isLoading: isConfirmingApprove } = useWaitForTransaction({
        hash: approveRequestData?.hash,
    })

    // Reject withdrawal request
    const { config: rejectRequestConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'rejectWithdrawalRequest',
        enabled: false,
    })

    const {
        write: writeRejectRequest,
        data: rejectRequestData,
    } = useContractWrite(rejectRequestConfig)

    // Execute withdrawal
    const { config: executeWithdrawalConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'executeWithdrawal',
        enabled: false,
    })

    const {
        write: writeExecuteWithdrawal,
        data: executeWithdrawalData,
        isLoading: isExecutingWithdrawal,
        isSuccess: executeSuccess,
    } = useContractWrite(executeWithdrawalConfig)

    const { isLoading: isConfirmingExecute } = useWaitForTransaction({
        hash: executeWithdrawalData?.hash,
    })

    // Cancel withdrawal request
    const { config: cancelRequestConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'cancelWithdrawalRequest',
        enabled: false,
    })

    const {
        write: writeCancelRequest,
        data: cancelRequestData,
    } = useContractWrite(cancelRequestConfig)

    // Create withdrawal request
    const createWithdrawalRequest = useCallback(async (
        token,
        amount,
        purposeHash,
        purposeRawString,
        donationIds,
        withdrawalAmounts
    ) => {
        if (!writeCreateRequest) return

        try {
            writeCreateRequest({
                args: [
                    token,
                    ethers.BigNumber.from(amount),
                    purposeHash,
                    purposeRawString,
                    donationIds.map(id => ethers.BigNumber.from(id)),
                    withdrawalAmounts.map(amt => ethers.BigNumber.from(amt))
                ],
            })
        } catch (err) {
            console.error('Error creating withdrawal request:', err)
            throw err
        }
    }, [writeCreateRequest])

    // Approve withdrawal request
    const approveRequest = useCallback(async (requestId) => {
        if (!writeApproveRequest) return

        try {
            writeApproveRequest({
                args: [ethers.BigNumber.from(requestId)],
            })
        } catch (err) {
            console.error('Error approving request:', err)
            throw err
        }
    }, [writeApproveRequest])

    // Reject withdrawal request
    const rejectRequest = useCallback(async (requestId) => {
        if (!writeRejectRequest) return

        try {
            writeRejectRequest({
                args: [ethers.BigNumber.from(requestId)],
            })
        } catch (err) {
            console.error('Error rejecting request:', err)
            throw err
        }
    }, [writeRejectRequest])

    // Execute withdrawal
    const executeWithdrawal = useCallback(async (requestId) => {
        if (!writeExecuteWithdrawal) return

        try {
            writeExecuteWithdrawal({
                args: [ethers.BigNumber.from(requestId)],
            })
        } catch (err) {
            console.error('Error executing withdrawal:', err)
            throw err
        }
    }, [writeExecuteWithdrawal])

    // Cancel withdrawal request
    const cancelRequest = useCallback(async (requestId) => {
        if (!writeCancelRequest) return

        try {
            writeCancelRequest({
                args: [ethers.BigNumber.from(requestId)],
            })
        } catch (err) {
            console.error('Error canceling request:', err)
            throw err
        }
    }, [writeCancelRequest])

    useEffect(() => {
        if (createRequestData?.hash) setTxHash(createRequestData.hash)
        if (approveRequestData?.hash) setTxHash(approveRequestData.hash)
        if (executeWithdrawalData?.hash) setTxHash(executeWithdrawalData.hash)
    }, [createRequestData, approveRequestData, executeWithdrawalData])

    return {
        // State
        pendingRequests,
        pendingRequestCount: pendingRequestCount ? Number(pendingRequestCount) : 0,
        txHash,

        // Loading states
        isLoading: isCreatingRequest || isApprovingRequest || isExecutingWithdrawal || isConfirmingCreate || isConfirmingApprove || isConfirmingExecute || pendingLoading,
        isCreatingRequest: isCreatingRequest || isConfirmingCreate,
        isApprovingRequest: isApprovingRequest || isConfirmingApprove,
        isExecutingWithdrawal: isExecutingWithdrawal || isConfirmingExecute,

        // Success states
        createSuccess,
        approveSuccess,
        executeSuccess,

        // Errors
        createError,
        createErrorMsg,

        // Actions
        createWithdrawalRequest,
        approveRequest,
        rejectRequest,
        executeWithdrawal,
        cancelRequest,

        // Refetch
        refetchPendingRequests,
    }
}

export default useWithdrawalRequests
