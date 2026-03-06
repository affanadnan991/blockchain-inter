import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, erc20ABI } from 'wagmi'
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import useWeb3 from './useWeb3'

/**
 * Custom hook for ERC20 token interactions
 */
export const useTokenContract = (tokenAddress) => {
    const { address, isConnected } = useWeb3()
    const [txHash, setTxHash] = useState(null)
    const approvalPromiseRef = useRef(null)

    /**
     * Get token balance
     */
    const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address],
        enabled: !!address && !!tokenAddress,
        watch: true,
    })

    /**
     * Get token decimals
     */
    const { data: decimals } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals',
        enabled: !!tokenAddress,
    })

    /**
     * Get token symbol
     */
    const { data: symbol } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'symbol',
        enabled: !!tokenAddress,
    })

    /**
     * Get token name
     */
    const { data: name } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'name',
        enabled: !!tokenAddress,
    })

    /**
     * Check allowance for spender
     */
    const { data: allowance, refetch: refetchAllowance } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, ''],  // Spender address to be provided
        enabled: false,
    })

    /**
     * Approve token spending
     */
    const { config: approveConfig } = usePrepareContractWrite({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        enabled: false,
    })

    const {
        write: approveWrite,
        data: approveData,
        isLoading: isApproving,
        isSuccess: approveSuccess,
        isError: approveError,
        error: approveErrorMessage,
        reset: resetApprove
    } = useContractWrite(approveConfig)

    const { isLoading: isApprovingConfirming, isSuccess: isApproveConfirmed } = useWaitForTransaction({
        hash: approveData?.hash,
    })

    useEffect(() => {
        if (approveData?.hash) {
            setTxHash(approveData.hash)
        }
    }, [approveData])

    // Resolve approval promise when confirmation succeeds
    useEffect(() => {
        if (isApproveConfirmed && approvalPromiseRef.current) {
            approvalPromiseRef.current.resolve(txHash)
            approvalPromiseRef.current = null
        }
    }, [isApproveConfirmed, txHash])

    // Reject approval promise on error
    useEffect(() => {
        if (approveError && approvalPromiseRef.current) {
            approvalPromiseRef.current.reject(approveErrorMessage || new Error('Approval failed'))
            approvalPromiseRef.current = null
        }
    }, [approveError, approveErrorMessage])

    /**
     * Approve spending - returns a Promise that resolves when confirmed
     */
    const approve = async (spender, amount, tokenDecimals) => {
        if (!approveWrite || !spender) {
            throw new Error('Cannot approve: spender or approveWrite is not available')
        }

        // Reset previous state
        resetApprove()

        const amountInWei = ethers.utils.parseUnits(amount.toString(), tokenDecimals)

        // Create a promise that will resolve when approval is confirmed
        const approvalPromise = new Promise((resolve, reject) => {
            approvalPromiseRef.current = { resolve, reject }
        })

        // Start the approval transaction
        approveWrite({
            args: [spender, amountInWei],
        })

        // Wait for confirmation
        return approvalPromise
    }

    /**
     * Approve unlimited (max uint256)
     */
    const approveUnlimited = async (spender) => {
        if (!approveWrite || !spender) {
            throw new Error('Cannot approve: spender or approveWrite is not available')
        }

        // Reset previous state
        resetApprove()

        // Create a promise that will resolve when approval is confirmed
        const approvalPromise = new Promise((resolve, reject) => {
            approvalPromiseRef.current = { resolve, reject }
        })

        // Start the approval transaction
        approveWrite({
            args: [spender, ethers.constants.MaxUint256],
        })

        // Wait for confirmation
        return approvalPromise
    }

    /**
     * Check if approved for amount
     */
    const checkAllowance = async (spender) => {
        if (!address || !spender || !tokenAddress) return '0'

        try {
            const result = await refetchAllowance({
                args: [address, spender],
            })
            return result.data || '0'
        } catch (error) {
            console.error('Error checking allowance:', error)
            return '0'
        }
    }

    /**
     * Check if needs approval
     */
    const needsApproval = async (spender, amount, tokenDecimals) => {
        const currentAllowance = await checkAllowance(spender)
        const requiredAmount = ethers.utils.parseUnits(amount.toString(), tokenDecimals)

        return ethers.BigNumber.from(currentAllowance).lt(requiredAmount)
    }

    return {
        // Token info
        balance,
        decimals,
        symbol,
        name,
        balanceLoading,

        // Approval
        approve,
        approveUnlimited,
        checkAllowance,
        needsApproval,
        isApproving: isApproving || isApprovingConfirming,
        isApproveConfirmed,
        approveError,
        approveErrorMessage,
        approveTxHash: txHash,

        // Refetch
        refetchBalance,
    }
}

export default useTokenContract
