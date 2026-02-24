'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePublicClient, useChainId, useContractRead } from 'wagmi'
import { parseAbiItem, formatEther } from 'viem'
import DonationPlatformABI from '../contracts/DonationPlatform.json'
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

            // 1. Get NGORegistered logs
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event NGORegistered(address indexed ngo, bytes32 nameHash, uint64 timestamp)'),
                fromBlock: 0n, // In production, use a more recent block or indexed data
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
                        // Response structure: [name, admin, isRegistered, isActive, totalWithdrawn, withdrawalCount, minApprovals, approversCount]
                        return {
                            address,
                            name: data[0],
                            admin: data[1],
                            isRegistered: data[2],
                            isActive: data[3],
                            totalWithdrawn: formatEther(data[4]),
                            withdrawalCount: Number(data[5]),
                            minApprovals: data[6],
                            // Add some mock UI data for now (since it's not in contract)
                            logo: `/ngo-images/${address.toLowerCase()}.png`,
                            description: `${data[0]} is a blockchain-verified organization focused on transparent social impact.`,
                            category: "General Welfare",
                            verified: data[2],
                            trustScore: 95 + (Number(data[5]) > 0 ? 3 : 0) // Dynamic trust score based on activity
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
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event DonationReceived(uint256 indexed donationId, address indexed donor, address indexed designatedNGO, address token, uint256 amount, bytes32 messageHash, uint64 timestamp)'),
                fromBlock: 'latest', // For demo purposes, we might want to go back some blocks
                // Using a block range in real apps
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

    const stats = platformStats ? {
        totalDonations: formatEther(platformStats[0]),
        activeNGOs: Number(platformStats[1]),
        uniqueDonors: Number(platformStats[2]),
        contractBalance: formatEther(platformStats[3])
    } : {
        totalDonations: '0',
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
