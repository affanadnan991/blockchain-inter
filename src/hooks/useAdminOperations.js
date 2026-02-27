'use client'

import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'
import useWeb3 from './useWeb3'

/**
 * Hook for admin operations on the DonationPlatform contract
 */
export const useAdminOperations = () => {
    const { chainId, address } = useWeb3()
    const contractAddress = getContractAddress(chainId)

    // Get all registered NGOs
    const { data: allNGOs, refetch: refetchNGOs, isLoading: ngosLoading } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getAllNGOs',
        args: [0n, 100n],
        watch: true,
    })

    // Get total NGOs count
    const { data: totalNGOsCount } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getTotalNGOs',
        watch: true,
    })

    // Get platform stats
    const { data: platformStats, refetch: refetchStats, isLoading: statsLoading } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getPlatformStats',
        watch: true,
    })

    // Get platform fee
    const { data: platformFeePercent } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'platformFeePercent',
        watch: true,
    })

    // Register NGO
    const { config: registerNGOConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'registerNGO',
        enabled: false,
    })

    const {
        write: writeRegisterNGO,
        data: registerNGOData,
        isLoading: isRegisteringNGO,
        isSuccess: registerNGOSuccess,
        error: registerNGOError,
    } = useContractWrite(registerNGOConfig)

    const { isLoading: isConfirmingRegisterNGO } = useWaitForTransaction({
        hash: registerNGOData?.hash,
    })

    // Update NGO status
    const { config: updateNGOStatusConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'updateNGOStatus',
        enabled: false,
    })

    const {
        write: writeUpdateNGOStatus,
        data: updateNGOStatusData,
    } = useContractWrite(updateNGOStatusConfig)

    // Pause NGO withdrawals
    const { config: pauseNGOWithdrawalsConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'pauseNGOWithdrawals',
        enabled: false,
    })

    const {
        write: writePauseNGOWithdrawals,
        data: pauseNGOWithdrawalsData,
    } = useContractWrite(pauseNGOWithdrawalsConfig)

    // Update platform fee
    const { config: updatePlatformFeeConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'updatePlatformFee',
        enabled: false,
    })

    const {
        write: writeUpdatePlatformFee,
        data: updatePlatformFeeData,
    } = useContractWrite(updatePlatformFeeConfig)

    // Whitelist token
    const { config: whitelistTokenConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'whitelistToken',
        enabled: false,
    })

    const {
        write: writeWhitelistToken,
        data: whitelistTokenData,
    } = useContractWrite(whitelistTokenConfig)

    // Set fee on transfer blacklist
    const { config: setFeeOnTransferBlacklistConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'setFeeOnTransferBlacklist',
        enabled: false,
    })

    const {
        write: writeSetFeeOnTransferBlacklist,
        data: setFeeOnTransferBlacklistData,
    } = useContractWrite(setFeeOnTransferBlacklistConfig)

    // Set token minimum donation
    const { config: setTokenMinDonationConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'setTokenMinDonation',
        enabled: false,
    })

    const {
        write: writeSetTokenMinDonation,
        data: setTokenMinDonationData,
    } = useContractWrite(setTokenMinDonationConfig)

    // Pause platform
    const { config: pauseConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'pause',
        enabled: false,
    })

    const { write: writePause } = useContractWrite(pauseConfig)

    // Unpause platform
    const { config: unpauseConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'unpause',
        enabled: false,
    })

    const { write: writeUnpause } = useContractWrite(unpauseConfig)

    // Activate emergency mode
    const { config: activateEmergencyConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'activateEmergencyMode',
        enabled: false,
    })

    const { write: writeActivateEmergency } = useContractWrite(activateEmergencyConfig)

    // Deactivate emergency mode
    const { config: deactivateEmergencyConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'deactivateEmergencyMode',
        enabled: false,
    })

    const { write: writeDeactivateEmergency } = useContractWrite(deactivateEmergencyConfig)

    // Register NGO callback
    const registerNGO = useCallback(async (ngo, nameHash, approvers, minApprovals) => {
        if (!writeRegisterNGO) return

        try {
            writeRegisterNGO({
                args: [
                    ngo,
                    nameHash,
                    approvers,
                    minApprovals,
                ],
            })
        } catch (err) {
            console.error('Error registering NGO:', err)
            throw err
        }
    }, [writeRegisterNGO])

    // Update NGO status callback
    const updateNGOStatus = useCallback(async (ngo, active) => {
        if (!writeUpdateNGOStatus) return

        try {
            writeUpdateNGOStatus({
                args: [ngo, active],
            })
        } catch (err) {
            console.error('Error updating NGO status:', err)
            throw err
        }
    }, [writeUpdateNGOStatus])

    // Pause NGO withdrawals callback
    const pauseNGOWithdrawals = useCallback(async (ngo, paused) => {
        if (!writePauseNGOWithdrawals) return

        try {
            writePauseNGOWithdrawals({
                args: [ngo, paused],
            })
        } catch (err) {
            console.error('Error pausing withdrawals:', err)
            throw err
        }
    }, [writePauseNGOWithdrawals])

    // Update platform fee callback
    const updatePlatformFee = useCallback(async (newPercent) => {
        if (!writeUpdatePlatformFee) return

        try {
            writeUpdatePlatformFee({
                args: [newPercent],
            })
        } catch (err) {
            console.error('Error updating platform fee:', err)
            throw err
        }
    }, [writeUpdatePlatformFee])

    // Whitelist token callback
    const whitelistToken = useCallback(async (token, status) => {
        if (!writeWhitelistToken) return

        try {
            writeWhitelistToken({
                args: [token, status],
            })
        } catch (err) {
            console.error('Error whitelisting token:', err)
            throw err
        }
    }, [writeWhitelistToken])

    // Set fee on transfer blacklist callback
    const setFeeOnTransferBlacklist = useCallback(async (token, status) => {
        if (!writeSetFeeOnTransferBlacklist) return

        try {
            writeSetFeeOnTransferBlacklist({
                args: [token, status],
            })
        } catch (err) {
            console.error('Error setting fee on transfer blacklist:', err)
            throw err
        }
    }, [writeSetFeeOnTransferBlacklist])

    // Set token min donation callback
    const setTokenMinDonation = useCallback(async (token, minAmount) => {
        if (!writeSetTokenMinDonation) return

        try {
            writeSetTokenMinDonation({
                args: [token, ethers.BigNumber.from(minAmount)],
            })
        } catch (err) {
            console.error('Error setting token minimum donation:', err)
            throw err
        }
    }, [writeSetTokenMinDonation])

    // Pause platform callback
    const pausePlatform = useCallback(async () => {
        if (!writePause) return

        try {
            writePause({
                args: [],
            })
        } catch (err) {
            console.error('Error pausing platform:', err)
            throw err
        }
    }, [writePause])

    // Unpause platform callback
    const unpausePlatform = useCallback(async () => {
        if (!writeUnpause) return

        try {
            writeUnpause({
                args: [],
            })
        } catch (err) {
            console.error('Error unpausing platform:', err)
            throw err
        }
    }, [writeUnpause])

    // Activate emergency mode callback
    const activateEmergencyMode = useCallback(async () => {
        if (!writeActivateEmergency) return

        try {
            writeActivateEmergency({
                args: [],
            })
        } catch (err) {
            console.error('Error activating emergency mode:', err)
            throw err
        }
    }, [writeActivateEmergency])

    // Deactivate emergency mode callback
    const deactivateEmergencyMode = useCallback(async () => {
        if (!writeDeactivateEmergency) return

        try {
            writeDeactivateEmergency({
                args: [],
            })
        } catch (err) {
            console.error('Error deactivating emergency mode:', err)
            throw err
        }
    }, [writeDeactivateEmergency])

    // Parse platform stats
    const parsePlatformStats = (stats) => {
        if (!stats) return null

        return {
            totalDonations: Number(stats[0]),
            activeNGOs: Number(stats[1]),
            uniqueDonors: Number(stats[2]),
            contractNativeBalance: stats[3],
            totalPendingRequests: Number(stats[4]),
            pendingNativeFees: stats[5],
            registeredNGOs: Number(stats[6]),
        }
    }

    return {
        // Data
        allNGOs,
        totalNGOsCount: totalNGOsCount ? Number(totalNGOsCount) : 0,
        platformStats: parsePlatformStats(platformStats),
        platformFeePercent: platformFeePercent ? Number(platformFeePercent) : 0,

        // Loading states
        isLoading: ngosLoading || statsLoading || isRegisteringNGO || isConfirmingRegisterNGO,
        isRegisteringNGO: isRegisteringNGO || isConfirmingRegisterNGO,

        // Success states
        registerNGOSuccess,

        // Errors
        registerNGOError,

        // Actions
        registerNGO,
        updateNGOStatus,
        pauseNGOWithdrawals,
        updatePlatformFee,
        whitelistToken,
        setFeeOnTransferBlacklist,
        setTokenMinDonation,
        pausePlatform,
        unpausePlatform,
        activateEmergencyMode,
        deactivateEmergencyMode,

        // Refetch
        refetchNGOs,
        refetchStats,
    }
}

export default useAdminOperations
