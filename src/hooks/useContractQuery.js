'use client'

import { useContractRead, usePublicClient, useChainId } from 'wagmi'
import { useState, useCallback, useEffect } from 'react'
import { parseAbiItem, formatEther as formatEtherViem } from 'viem'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'
import { formatEther } from '../utils/formatters'
import { getNGOName, loadNGORegistry } from '../utils/ngoRegistry'

/**
 * Hook to fetch registered NGOs and platform data from contract
 */
export const useRegisteredNGOs = () => {
    const publicClient = usePublicClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [ngos, setNgos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get total NGO count
    const { data: totalNGOsCount } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getTotalNGOs',
        watch: true,
    })

    // Get list of NGO addresses (paginated)
    const { data: ngoAddresses, refetch: refetchNGOAddresses } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getAllNGOs',
        args: [0n, 100n],
        watch: true,
    })

    // Fetch detailed info for all NGOs
    const fetchNGODetails = useCallback(async () => {
        if (!publicClient || !contractAddress || !ngoAddresses || ngoAddresses.length === 0) {
            setNgos([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            // Fetch NGORegistered events to get names
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem(
                    'event NGORegistered(address indexed ngo, bytes32 nameHash, uint8 approversCount, uint8 minApprovals, uint64 timestamp)'
                ),
                fromBlock: 0n,
                toBlock: 'latest',
            })

            // Create a map of NGO address to event data
            const ngoEventMap = {}
            logs.forEach(log => {
                ngoEventMap[log.args.ngo?.toLowerCase()] = {
                    nameHash: log.args.nameHash,
                    approversCount: Number(log.args.approversCount),
                    minApprovals: Number(log.args.minApprovals),
                    timestamp: Number(log.args.timestamp),
                }
            })

            // Fetch detailed info for each NGO
            const ngoDetails = await Promise.all(
                ngoAddresses.map(async (address) => {
                    try {
                        const info = await publicClient.readContract({
                            address: contractAddress,
                            abi: DonationPlatformABI,
                            functionName: 'getNGOInfo',
                            args: [address],
                        })

                        const eventData = ngoEventMap[address?.toLowerCase()] || {}

                        // Get actual NGO name from registry, fallback to address
                        const ngoNameData = getNGOName(address);
                        const displayName = ngoNameData?.name || `NGO ${address?.substring(0, 10)}...`;
                        const category = ngoNameData?.category || 'General Welfare';

                        return {
                            address,
                            // From getNGOInfo response
                            ngoAddress: info[0],
                            totalWithdrawn: formatEtherViem(info[1]),
                            lastWithdrawal: Number(info[2]),
                            lastGeneralWithdrawal: Number(info[3]),
                            withdrawalCount: Number(info[4]),
                            pendingRequests: Number(info[5]),
                            isActive: info[6],
                            withdrawalsPaused: info[7],
                            minApprovals: Number(info[8]),
                            approversCount: Number(info[9]),

                            // From event data
                            nameHash: eventData.nameHash,
                            registeredAt: eventData.timestamp * 1000,

                            // UI data with actual names
                            name: displayName,
                            description: 'Blockchain-verified organization for transparent social impact',
                            category: category,
                            verified: info[6], // isActive
                            trustScore: 90 + (info[4] > 0 ? 5 : 0), // Based on withdrawal count
                        }
                    } catch (err) {
                        console.error(`Error fetching info for NGO ${address}:`, err)
                        return null
                    }
                })
            )

            setNgos(ngoDetails.filter(ngo => ngo !== null))
            setError(null)
        } catch (err) {
            console.error('Error fetching NGO details:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [publicClient, contractAddress, ngoAddresses])

    // Fetch on mount and when data changes
    useEffect(() => {
        // Load NGO registry from localStorage on component mount
        loadNGORegistry()
        fetchNGODetails()
    }, [fetchNGODetails])

    return {
        ngos,
        totalNGOsCount: totalNGOsCount ? Number(totalNGOsCount) : 0,
        loading,
        error,
        refetch: fetchNGODetails,
    }
}

/**
 * Hook to fetch recent donation events
 */
export const useRecentDonations = (limit = 50) => {
    const publicClient = usePublicClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecentDonations = useCallback(async () => {
        if (!publicClient || !contractAddress) {
            setDonations([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem(
                    'event DonationReceived(uint256 indexed donationId, address indexed donor, address indexed designatedNGO, address token, uint96 amount, bytes32 messageHash, uint64 timestamp)'
                ),
                fromBlock: 0n,
                toBlock: 'latest',
            })

            const donationsList = logs
                .map(log => ({
                    id: log.args.donationId.toString(),
                    donor: log.args.donor,
                    ngo: log.args.designatedNGO,
                    token: log.args.token,
                    amount: formatEtherViem(log.args.amount),
                    rawAmount: log.args.amount,
                    messageHash: log.args.messageHash,
                    timestamp: Number(log.args.timestamp),
                    blockNumber: log.blockNumber,
                }))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, limit)

            setDonations(donationsList)
            setError(null)
        } catch (err) {
            console.error('Error fetching donations:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [publicClient, contractAddress, limit])

    useEffect(() => {
        fetchRecentDonations()
    }, [fetchRecentDonations])

    return {
        donations,
        loading,
        error,
        refetch: fetchRecentDonations,
    }
}

/**
 * Hook to fetch a specific donation record
 */
export const useDonationRecord = (donationId) => {
    const { data: donation, refetch: refetchDonation, isLoading } = useContractRead({
        address: getContractAddress(useChainId()),
        abi: DonationPlatformABI,
        functionName: 'getDonation',
        args: donationId ? [donationId] : undefined,
        enabled: !!donationId,
        watch: true,
    })

    const parseDonation = (data) => {
        if (!data) return null

        return {
            donor: data[0],
            designatedNGO: data[1],
            tokenAddress: data[2],
            amount: data[3],
            timestamp: Number(data[4]),
            withdrawnAmount: data[5],
            isWithdrawn: data[6],
        }
    }

    return {
        donation: parseDonation(donation),
        isLoading,
        refetch: refetchDonation,
    }
}

/**
 * Hook to get request approval status
 */
export const useRequestApprovalStatus = (requestId, approver) => {
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const { data: hasApproved, refetch: refetchApprovalStatus } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getRequestApprovalStatus',
        args: requestId && approver ? [requestId, approver] : undefined,
        enabled: !!requestId && !!approver,
        watch: true,
    })

    return {
        hasApproved: !!hasApproved,
        refetch: refetchApprovalStatus,
    }
}

export default {
    useRegisteredNGOs,
    useRecentDonations,
    useDonationRecord,
    useRequestApprovalStatus,
}
