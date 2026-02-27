'use client'

import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'
import useWeb3 from './useWeb3'

/**
 * Hook for NGO-specific operations and data
 */
export const useNGOOperations = (ngoAddress) => {
    const { chainId } = useWeb3()
    const contractAddress = getContractAddress(chainId)

    // Get NGO Info
    const { data: ngoInfo, refetch: refetchNGOInfo, isLoading: ngoInfoLoading } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getNGOInfo',
        args: ngoAddress ? [ngoAddress] : undefined,
        enabled: !!ngoAddress,
        watch: true,
    })

    // Get NGO Balance for a token
    const { data: ngoBalance, refetch: refetchNGOBalance } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getNGOBalance',
        args: ngoAddress ? [ngoAddress, '0x0000000000000000000000000000000000000000'] : undefined,
        enabled: !!ngoAddress,
        watch: true,
    })

    // Get balance for specific token
    const getNGOBalanceForToken = useCallback(async (tokenAddress) => {
        if (!ngoAddress) return null

        try {
            // Note: This uses the read hook internally
            // In real usage, you'd need to read balance dynamically
            const balance = await contractAddress
            return balance
        } catch (err) {
            console.error('Error fetching NGO balance:', err)
            return null
        }
    }, [ngoAddress, contractAddress])

    // Withdraw allocated general funds
    const { config: withdrawGeneralConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'withdrawAllocatedGeneralFunds',
        enabled: false,
    })

    const {
        write: writeWithdrawGeneral,
        data: withdrawGeneralData,
        isLoading: isWithdrawingGeneral,
        isSuccess: withdrawGeneralSuccess,
    } = useContractWrite(withdrawGeneralConfig)

    const { isLoading: isConfirmingWithdrawGeneral } = useWaitForTransaction({
        hash: withdrawGeneralData?.hash,
    })

    // Withdraw general funds
    const withdrawGeneralFunds = useCallback(async (
        token,
        amount,
        purposeHash,
        purposeRawString
    ) => {
        if (!writeWithdrawGeneral) return

        try {
            writeWithdrawGeneral({
                args: [
                    token,
                    ethers.BigNumber.from(amount),
                    purposeHash,
                    purposeRawString,
                ],
            })
        } catch (err) {
            console.error('Error withdrawing general funds:', err)
            throw err
        }
    }, [writeWithdrawGeneral])

    // Get withdrawal cooldown remaining
    const { data: withdrawalCooldownRemaining } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getWithdrawalCooldownRemaining',
        args: ngoAddress ? [ngoAddress] : undefined,
        enabled: !!ngoAddress,
        watch: true,
    })

    // Get general pool cooldown remaining
    const { data: generalCooldownRemaining } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getGeneralCooldownRemaining',
        args: ngoAddress ? [ngoAddress] : undefined,
        enabled: !!ngoAddress,
        watch: true,
    })

    const parseNGOInfo = (info) => {
        if (!info) return null

        return {
            ngoAddress: info[0],
            totalWithdrawn: info[1],
            lastWithdrawal: Number(info[2]),
            lastGeneralWithdrawal: Number(info[3]),
            withdrawalCount: Number(info[4]),
            pendingRequests: Number(info[5]),
            isActive: info[6],
            withdrawalsPaused: info[7],
            minApprovals: Number(info[8]),
            approversCount: Number(info[9]),
        }
    }

    return {
        // Data
        ngoInfo: parseNGOInfo(ngoInfo),
        ngoBalance,
        withdrawalCooldownRemaining: withdrawalCooldownRemaining ? Number(withdrawalCooldownRemaining) : 0,
        generalCooldownRemaining: generalCooldownRemaining ? Number(generalCooldownRemaining) : 0,

        // Loading states
        isLoading: ngoInfoLoading || isWithdrawingGeneral || isConfirmingWithdrawGeneral,
        isWithdrawingGeneral: isWithdrawingGeneral || isConfirmingWithdrawGeneral,

        // Success states
        withdrawGeneralSuccess,

        // Actions
        withdrawGeneralFunds,
        getNGOBalanceForToken,

        // Refetch
        refetchNGOInfo,
        refetchNGOBalance,
    }
}

export default useNGOOperations
