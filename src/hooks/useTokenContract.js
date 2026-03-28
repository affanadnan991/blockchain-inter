import { useContractRead, usePublicClient, useWalletClient, erc20ABI } from 'wagmi'
import { useState } from 'react'
import { ethers } from 'ethers'
import useWeb3 from './useWeb3'

/**
 * Custom hook for ERC20 token interactions
 */
export const useTokenContract = (tokenAddress) => {
    const { address, isConnected } = useWeb3()
    const [txHash, setTxHash] = useState(null)
    const [isApproving, setIsApproving] = useState(false)
    const [isApproveConfirmed, setIsApproveConfirmed] = useState(false)
    const [approveError, setApproveError] = useState(false)
    const [approveErrorMessage, setApproveErrorMessage] = useState(null)
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

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
     * Approve spending - returns a Promise that resolves when confirmed
     */
    const approve = async (spender, amount, tokenDecimals) => {
        if (!walletClient || !spender || !tokenAddress) {
            throw new Error('Cannot approve: wallet not connected or inputs missing')
        }

        setIsApproving(true)
        setIsApproveConfirmed(false)
        setApproveError(false)
        setApproveErrorMessage(null)
        setTxHash(null)

        try {
            const amountInWei = ethers.utils.parseUnits(amount.toString(), tokenDecimals)

            const { request } = await publicClient.simulateContract({
                account: address,
                address: tokenAddress,
                abi: erc20ABI,
                functionName: 'approve',
                args: [spender, amountInWei],
            })

            const hash = await walletClient.writeContract(request)
            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })

            setIsApproveConfirmed(true)
            return hash
        } catch (error) {
            console.error('Approval failed:', error)
            setApproveError(true)
            setApproveErrorMessage(error.shortMessage || error.message || 'Approval failed')
            throw error
        } finally {
            setIsApproving(false)
        }
    }

    /**
     * Approve unlimited (max uint256)
     */
    const approveUnlimited = async (spender) => {
        if (!walletClient || !spender || !tokenAddress) {
            throw new Error('Cannot approve: wallet not connected or inputs missing')
        }

        setIsApproving(true)
        setIsApproveConfirmed(false)
        setApproveError(false)
        setApproveErrorMessage(null)
        setTxHash(null)

        try {
            const { request } = await publicClient.simulateContract({
                account: address,
                address: tokenAddress,
                abi: erc20ABI,
                functionName: 'approve',
                args: [spender, ethers.constants.MaxUint256],
            })

            const hash = await walletClient.writeContract(request)
            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })

            setIsApproveConfirmed(true)
            return hash
        } catch (error) {
            console.error('Approval failed:', error)
            setApproveError(true)
            setApproveErrorMessage(error.shortMessage || error.message || 'Approval failed')
            throw error
        } finally {
            setIsApproving(false)
        }
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
        isApproving,
        isApproveConfirmed,
        approveError,
        approveErrorMessage,
        approveTxHash: txHash,

        // Refetch
        refetchBalance,
    }
}

export default useTokenContract
