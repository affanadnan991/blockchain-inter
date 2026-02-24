'use client'

import { useState, useCallback } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { getContractAddress } from '../utils/web3Config'
import DonationPlatformABI from '../contracts/DonationPlatform.json'
import { toast } from 'react-hot-toast'
import { parseEther, keccak256, toHex, encodePacked } from 'viem'

export const useAdmin = () => {
    const { address } = useAccount()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()
    const contractAddress = getContractAddress(publicClient?.chain?.id)

    const [isLoading, setIsLoading] = useState(false)

    const executeAdminTx = useCallback(async (functionName, args, successMsg) => {
        if (!walletClient || !contractAddress) {
            toast.error("Wallet not connected or contract address missing")
            return
        }

        try {
            setIsLoading(true)
            const { request } = await publicClient.simulateContract({
                account: address,
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName,
                args
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
            console.error(`Admin error (${functionName}):`, err)
            toast.error(err.shortMessage || err.message || "Transaction failed")
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [walletClient, contractAddress, publicClient, address])

    // NGO Management
    const registerNGO = async (ngoAddr, name, approvers, minApprovals) => {
        const nameHash = keccak256(toHex(name))
        return executeAdminTx('registerNGO', [ngoAddr, nameHash, approvers, minApprovals], 'NGO Registered Successfully!')
    }

    const updateNGOStatus = async (ngoAddr, isActive) => {
        return executeAdminTx('updateNGOStatus', [ngoAddr, isActive], `NGO ${isActive ? 'Activated' : 'Deactivated'}`)
    }

    const updateMinApprovals = async (ngoAddr, minApprovals) => {
        return executeAdminTx('updateMinApprovals', [ngoAddr, minApprovals], 'Min Approvals Updated')
    }

    const manageNGOApprover = async (ngoAddr, approver, status) => {
        return executeAdminTx('manageNGOApprover', [ngoAddr, approver, status], 'Approver Status Updated')
    }

    // Token & Fee Management
    const whitelistToken = async (tokenAddr, status) => {
        return executeAdminTx('whitelistToken', [tokenAddr, status], `Token ${status ? 'Whitelisted' : 'Removed'}`)
    }

    const setTokenMinDonation = async (tokenAddr, minAmount, decimals = 18) => {
        const amount = parseEther(minAmount.toString()) // simplified for now, should handle decimals
        return executeAdminTx('setTokenMinDonation', [tokenAddr, amount], 'Minimum Donation Updated')
    }

    const updatePlatformFee = async (newPercent) => {
        return executeAdminTx('updatePlatformFee', [newPercent], 'Platform Fee Updated')
    }

    const updateFeeCollector = async (newCollector) => {
        return executeAdminTx('updateFeeCollector', [newCollector], 'Fee Collector Updated')
    }

    // System Controls
    const pause = async () => executeAdminTx('pause', [], 'Platform Paused')
    const unpause = async () => executeAdminTx('unpause', [], 'Platform Unpaused')

    const activateEmergencyMode = async () =>
        executeAdminTx('activateEmergencyMode', [], 'Emergency Mode Activated')

    const deactivateEmergencyMode = async () =>
        executeAdminTx('deactivateEmergencyMode', [], 'Emergency Mode Deactivated')

    const allocateGeneralPoolFunds = async (ngo, token, amount) => {
        return executeAdminTx('allocateGeneralPoolFunds', [ngo, token, amount], 'Funds Allocated from General Pool')
    }

    return {
        registerNGO,
        updateNGOStatus,
        updateMinApprovals,
        manageNGOApprover,
        whitelistToken,
        setTokenMinDonation,
        updatePlatformFee,
        updateFeeCollector,
        pause,
        unpause,
        activateEmergencyMode,
        deactivateEmergencyMode,
        allocateGeneralPoolFunds,
        isLoading
    }
}
