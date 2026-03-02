'use client'

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { readContract } from '@wagmi/core'
import { formatEther, parseAbi } from 'viem'
import { wagmiConfig } from '../utils/web3Config'

// ERC20 ABI for balance checking
const ERC20_ABI = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
])

/**
 * Fetch real-time balances for multiple tokens
 * Supports native token + multiple ERC20s
 */
export function useMultipleTokenBalances(tokens = [], chainId = null, enabled = true) {
  const { address, chainId: activeChainId } = useAccount()
  const publicClient = usePublicClient()
  
  const currentChainId = chainId || activeChainId
  
  const [balances, setBalances] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled || !address || !tokens.length || !currentChainId) {
      setBalances({})
      return
    }

    const fetchBalances = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const balanceMap = {}

        // Fetch balances in parallel
        await Promise.all(
          tokens.map(async (token) => {
            try {
              // Native token - use getBalance
              if (token.address === '0x0000000000000000000000000000000000000000') {
                const nativeBalance = await publicClient.getBalance({
                  account: address,
                  blockTag: 'latest',
                })
                balanceMap[token.symbol] = {
                  raw: nativeBalance.toString(),
                  formatted: formatEther(nativeBalance),
                  symbol: token.symbol,
                  decimals: 18,
                  error: null
                }
              } else {
                // ERC20 token
                const balance = await readContract(wagmiConfig, {
                  address: token.address,
                  abi: ERC20_ABI,
                  functionName: 'balanceOf',
                  args: [address],
                  chainId: currentChainId,
                })

                // Format balance based on decimals
                const decimals = token.decimals || 18
                const formatted = Number(balance) / Math.pow(10, decimals)

                balanceMap[token.symbol] = {
                  raw: balance.toString(),
                  formatted: formatted.toFixed(6),
                  symbol: token.symbol,
                  decimals: decimals,
                  error: null
                }
              }
            } catch (err) {
              console.warn(`Error fetching ${token.symbol} balance:`, err)
              balanceMap[token.symbol] = {
                raw: '0',
                formatted: '0.00',
                symbol: token.symbol,
                decimals: token.decimals || 18,
                error: err.message
              }
            }
          })
        )

        setBalances(balanceMap)
      } catch (err) {
        console.error('Error fetching balances:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalances()

    // Refresh every 15 seconds
    const interval = setInterval(fetchBalances, 15000)
    return () => clearInterval(interval)
  }, [address, tokens, currentChainId, publicClient])

  /**
   * Get balance for specific token
   */
  const getBalance = (symbol) => {
    return balances[symbol] || {
      raw: '0',
      formatted: '0.00',
      symbol,
      decimals: 18,
      error: 'Not loaded'
    }
  }

  return {
    balances,
    isLoading,
    error,
    getBalance,
    hasBalance: (symbol, minAmount = 0) => {
      const bal = balances[symbol]
      return bal && Number(bal.formatted) > minAmount
    }
  }
}

export default useMultipleTokenBalances
