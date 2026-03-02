'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { usePublicClient, useChainId, useContractRead } from 'wagmi'
import { parseAbiItem, formatEther } from 'viem'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../utils/web3Config'

// Cache to avoid redundant fetches
const ngoDataCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const BLOCK_BATCH_SIZE = 10000n // Fetch in chunks to avoid RPC limits

/**
 * Hook to fetch and manage NGO data and platform statistics from the smart contract
 * OPTIMIZED: Limited block ranges, batch fetching, caching
 */
export const useNGOData = () => {
    const publicClient = usePublicClient()
    const chainId = useChainId()
    const contractAddress = getContractAddress(chainId)

    const [ngos, setNgos] = useState([])
    const [recentDonations, setRecentDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const cacheKeyRef = useRef(`ngo_${chainId}_${contractAddress}`)

    /**
     * Fetch all registered NGOs by querying NGORegistered events
     * OPTIMIZATION: Uses rolling block window instead of from block 0
     */
    const fetchAllNGOs = useCallback(async () => {
        if (!publicClient || !contractAddress) return

        const cacheKey = cacheKeyRef.current
        const cached = ngoDataCache.get(cacheKey)
        
        // Return cached data if still fresh
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setNgos(cached.ngos)
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            // Get current block number for optimized range
            const blockNumber = await publicClient.getBlockNumber()
            // Look back 2 days worth of blocks (on Polygon ~2880 blocks/day)
            const lookbackBlocks = 5760n
            const fromBlock = blockNumber > lookbackBlocks ? blockNumber - lookbackBlocks : 0n

            // 1. Get NGORegistered logs with optimized range
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event NGORegistered(address indexed ngo, bytes32 nameHash, uint64 timestamp)'),
                fromBlock,
                toBlock: 'latest'
            })

            const ngoAddresses = [...new Set(logs.map(log => log.args.ngo))]

            // 2. Fetch details for each NGO - batch in parallel
            const ngoDetails = await Promise.allSettled(
                ngoAddresses.map(async (address) => {
                    try {
                        const data = await publicClient.readContract({
                            address: contractAddress,
                            abi: DonationPlatformABI,
                            functionName: 'getNGOInfo',
                            args: [address]
                        })

                        const regLog = logs.find(l => l.args.ngo.toLowerCase() === address.toLowerCase())
                        const nameHash = regLog ? regLog.args.nameHash : null

                        return {
                            address,
                            nameHash,
                            isActive: data[6],
                            withdrawalsPaused: data[7],
                            totalWithdrawn: formatEther(data[1]),
                            withdrawalCount: Number(data[4]),
                            pendingRequests: Number(data[5]),
                            minApprovals: data[8],
                            approversCount: data[9],
                            logo: `/ngo-images/${address.toLowerCase()}.png`,
                            description: nameHash
                                ? `NGO registered with nameHash ${nameHash.slice(0, 6)}...`
                                : 'Blockchain-verified organization',
                        }
                    } catch (err) {
                        console.error(`Error fetching info for NGO ${address}:`, err)
                        throw err
                    }
                })
            )

            // Filter fulfilled promises only
            const validNGOs = ngoDetails
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value)

            setNgos(validNGOs)
            
            // Cache the result
            ngoDataCache.set(cacheKey, {
                ngos: validNGOs,
                timestamp: Date.now()
            })

        } catch (err) {
            console.error('Error fetching NGOs:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [publicClient, contractAddress])

    /**
     * Fetch recent donation events
     * OPTIMIZATION: Fetch from recent blocks only
     */
    const fetchRecentDonations = useCallback(async () => {
        if (!publicClient || !contractAddress) return

        try {
            const blockNumber = await publicClient.getBlockNumber()
            // Look back last 1000 blocks for recent donations
            const fromBlock = blockNumber > 1000n ? blockNumber - 1000n : 0n

            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event DonationReceived(uint256 indexed donationId, address indexed donor, address indexed designatedNGO, address token, uint256 amount, bytes32 messageHash, uint64 timestamp)'),
                fromBlock,
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

            setRecentDonations(donations.reverse().slice(0, 10)) // Keep last 10 only
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
        watch: false, // Disable auto-watch for perf, refresh manually
    })

    const { data: isPaused } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'paused',
        watch: false,
    })

    // Memoize stats object to prevent unnecessary re-renders
    const stats = useMemo(() => platformStats ? {
        totalDonations: formatEther(platformStats[0]),
        activeNGOs: Number(platformStats[1]),
        uniqueDonors: Number(platformStats[2]),
        contractBalance: formatEther(platformStats[3])
    } : {
        totalDonations: '0',
        activeNGOs: 0,
        uniqueDonors: 0,
        contractBalance: '0'
    }, [platformStats])

    // Initial fetch with debounce on contractAddress change
    useEffect(() => {
        if (contractAddress) {
            const timer = setTimeout(() => {
                fetchAllNGOs()
                fetchRecentDonations()
            }, 300)
            
            return () => clearTimeout(timer)
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
