'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePublicClient, useChainId, useContractRead } from 'wagmi'
import { parseAbiItem, formatEther } from 'viem'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'

/**
 * Hook to fetch and manage NGO data and platform statistics from the smart contract
 */
export const useNGOData = () => {
    const publicClient = usePublicClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [ngos, setNgos] = useState([])
    const [recentDonations, setRecentDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /**
     * Fetch all registered NGOs by querying NGORegistered events
     */
    const fetchAllNGOs = useCallback(async () => {
        if (!publicClient || !contractAddress) return

        try {
            setLoading(true)

            // Fixed Bug 21: Don't scan from 0n on Polygon mainnet mapping 
            const latestBlock = await publicClient.getBlockNumber()
            const fromBlock = latestBlock > 10000n ? latestBlock - 10000n : 0n

            // 1. Get NGORegistered logs
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event NGORegistered(address indexed ngo, bytes32 nameHash, uint64 timestamp)'),
                fromBlock: fromBlock,
                toBlock: 'latest'
            })

            const ngoAddresses = [...new Set(logs.map(log => log.args.ngo))]

            // 2. Fetch details for each NGO
            const ngoDetails = await Promise.all(
                ngoAddresses.map(async (address) => {
                    try {
                        const data = await publicClient.readContract({
                            address: contractAddress,
                            abi: DonationPlatformABI,
                            functionName: 'getNGOInfo',
                            args: [address]
                        })

                        // Map contract response to NGO object
                        // Fixed Bug 1: Response structure is [ngoAddress, totalWithdrawn, lastWithdrawal, withdrawalCount, pendingRequests, isActive, withdrawalsPaused, minApprovals, approversCount]
                        return {
                            address,
                            ngoAddress: data[0],
                            totalWithdrawn: formatEther(data[1] || 0n),
                            lastWithdrawal: Number(data[2]),
                            withdrawalCount: Number(data[3]),
                            pendingRequests: Number(data[4]),
                            isActive: data[5],
                            withdrawalsPaused: data[6],
                            minApprovals: data[7],
                            approversCount: data[8],
                            // Add some mock UI data for now (since name is not in contract)
                            name: `NGO ${address.substring(0, 6)}...`,
                            logo: `/ngo-images/${address.toLowerCase()}.png`,
                            description: `Blockchain-verified organization focused on transparent social impact.`,
                            category: "General Welfare",
                            verified: data[5], // using isActive
                            trustScore: 95 + (Number(data[3]) > 0 ? 3 : 0) // Dynamic trust score based on activity
                        }
                    } catch (err) {
                        console.error(`Error fetching info for NGO ${address}:`, err)
                        return null
                    }
                })
            )

            setNgos(ngoDetails.filter(ngo => ngo !== null && ngo.isActive))
        } catch (err) {
            console.error('Error fetching NGOs:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [publicClient, contractAddress])

    /**
     * Fetch recent donation events
     */
    const fetchRecentDonations = useCallback(async () => {
        if (!publicClient || !contractAddress) return

        try {
            // Fixed Bug 16: Use a window instead of 'latest'
            const latestBlock = await publicClient.getBlockNumber()
            const fromBlock = latestBlock > 5000n ? latestBlock - 5000n : 0n

            // Fixed Bug 2: Match exact signature
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event DonationReceived(uint256 indexed donationId, address indexed donor, address indexed designatedNGO, address token, uint96 amount, bytes32 messageHash, uint64 timestamp)'),
                fromBlock: fromBlock,
                toBlock: 'latest'
            })

            const donations = logs.map(log => ({
                id: log.args.donationId.toString(),
                donor: log.args.donor,
                ngo: log.args.designatedNGO,
                token: log.args.token,
                amount: formatEther(log.args.amount),
                timestamp: Number(log.args.timestamp) * 1000
            }))

            setRecentDonations(donations.reverse())
        } catch (err) {
            console.error('Error fetching recent donations:', err)
        }
    }, [publicClient, contractAddress])

    /**
     * Get platform stats and status
     */
    const { data: platformStats } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'getPlatformStats',
        watch: true,
    })

    const { data: isPaused } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'paused',
        watch: true,
    })

    // Fixed Bug 3: Format platformStats properly
    const stats = platformStats ? {
        totalDonations: Number(platformStats[0]),
        activeNGOs: Number(platformStats[1]),
        uniqueDonors: Number(platformStats[2]),
        contractBalance: formatEther(platformStats[3] || 0n)
    } : {
        totalDonations: 0,
        activeNGOs: 0,
        uniqueDonors: 0,
        contractBalance: '0'
    }

    // Initial fetch
    useEffect(() => {
        if (contractAddress) {
            fetchAllNGOs()
            fetchRecentDonations()
        }
    }, [contractAddress, fetchAllNGOs, fetchRecentDonations])

    return {
        ngos,
        recentDonations,
        stats,
        loading,
        error,
        paused: isPaused || false,
        refresh: fetchAllNGOs
    }
}

export default useNGOData 
