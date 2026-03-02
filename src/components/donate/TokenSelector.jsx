'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaCheck, FaWallet, FaShieldAlt, FaSpinner, FaPlus, FaSearch, FaCoins } from 'react-icons/fa'
import { getSupportedTokens, getTokensByType, formatTokenAmount } from '../../utils/tokenConfig'
import useWeb3 from '../../hooks/useWeb3'
import useMultipleTokenBalances from '../../hooks/useMultipleTokenBalances'

// Default token logos
const tokenLogos = {
  'MATIC': '/assets/polygon.png',
  'USDT': '/assets/usdt.png',
  'USDC': '/assets/usdc.png',
  'DAI': '/assets/dai.png',
  'WETH': '/assets/weth.png',
  'AAVE': '/assets/aave.png',
}

/**
 * Enhanced Token Selector Component
 * - Supports UNLIMITED whitelisted tokens
 * - Real-time balance fetching for each token
 * - Easy to add new tokens in tokenConfig.js
 * - Shows balance per token card
 */
export default function TokenSelector({ selectedToken, onSelectToken }) {       
  const { chainId, isConnected, isWrongNetwork } = useWeb3()
  const [tokens, setTokens] = useState([])
  const [grouped, setGrouped] = useState({ native: [], stablecoins: [], erc20: [] })
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all tokens for current chain
  useEffect(() => {
    if (chainId) {
      const supportedTokens = getSupportedTokens(chainId)
      setTokens(supportedTokens)
      setGrouped(getTokensByType(chainId))

      // Auto-select first token if none selected
      if (!selectedToken && supportedTokens.length > 0) {
        onSelectToken(supportedTokens[0])
      }
    }
  }, [chainId, selectedToken, onSelectToken])

  // Filter tokens by search term
  const filterTokens = (tokenList) => {
    if (!searchTerm) return tokenList
    return tokenList.filter(t => 
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredGrouped = {
    native: filterTokens(grouped.native),
    stablecoins: filterTokens(grouped.stablecoins),
    erc20: filterTokens(grouped.erc20),
  }

  // Fetch real-time balances for ALL tokens (only when connected & on correct network)
  const { balances, isLoading } = useMultipleTokenBalances(
    tokens,
    chainId,
    isConnected && !isWrongNetwork
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FaWallet className="text-blue-600" />
          Choose Token to Donate
        </label>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Select any whitelisted token - balances update in real-time
        </p>
      </div>

      {/* Search Box */}
      {tokens.length > 3 && (
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search tokens by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {isWrongNetwork ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            ⚠️ Please switch your wallet to the Polygon network to view and donate tokens.
          </p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">No tokens available for this network</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* NATIVE TOKEN */}
          {filteredGrouped.native.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <FaCoins className="text-white text-xs" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                  Native Token
                </h3>
                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                  {filteredGrouped.native.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGrouped.native.map((token) => (
                  <TokenCard
                    key={token.symbol}
                    token={token}
                    isSelected={selectedToken?.symbol === token.symbol}
                    onSelect={() => onSelectToken(token)}
                    isConnected={isConnected}
                    balanceData={balances[token.symbol]}
                    isLoading={isLoading}
                    isWrongNetwork={isWrongNetwork}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STABLECOINS */}
          {filteredGrouped.stablecoins.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaShieldAlt className="text-green-600 dark:text-green-400 text-sm" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                  🎯 Recommended: Stablecoins
                </h3>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                  {filteredGrouped.stablecoins.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredGrouped.stablecoins.map((token) => (
                  <TokenCard
                    key={token.symbol}
                    token={token}
                    isSelected={selectedToken?.symbol === token.symbol}
                    onSelect={() => onSelectToken(token)}
                    isConnected={isConnected}
                    balanceData={balances[token.symbol]}
                    isLoading={isLoading}
                    // isStablecoin={true}
                    isWrongNetwork={isWrongNetwork}
                  />
                ))}
              </div>
            </div>
          )}

          {/* OTHER ERC20 TOKENS */}
          {filteredGrouped.erc20.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaCoins className="text-blue-600 dark:text-blue-400 text-sm" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                  Other Tokens
                </h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {filteredGrouped.erc20.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredGrouped.erc20.map((token) => (
                  <TokenCard
                    key={token.symbol}
                    token={token}
                    isSelected={selectedToken?.symbol === token.symbol}
                    onSelect={() => onSelectToken(token)}
                    isConnected={isConnected}
                    balanceData={balances[token.symbol]}
                    isLoading={isLoading}
                    isWrongNetwork={isWrongNetwork}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {Object.values(filteredGrouped).every(arr => arr.length === 0) && searchTerm && (
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <FaSearch className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No tokens match "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Connection reminder */}
      {!isConnected && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
          <FaWallet className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0 text-sm" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <strong>💡 Connect wallet</strong> to see real-time balances for all tokens. Your donation flow will be seamless!
          </p>
        </div>
      )}

      {/* Add token info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
        <FaPlus className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 text-sm" />
        <div>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">
            Want to add more tokens?
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Admin can whitelist any ERC20 token. Contact support to add your token to the platform.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Individual Token Card Component
 * Shows token info + real-time balance
 */
function TokenCard({
  token,
  isSelected,
  onSelect,
  isConnected,
  balanceData,
  isLoading,
  isStablecoin = false,
  isWrongNetwork = false
}) {
  const displayBalance = balanceData
    ? formatTokenAmount(balanceData.raw, balanceData.decimals, 4)
    : '0.00'

  const hasError = balanceData?.error && balanceData.error !== null

  return (
    <button
      onClick={onSelect}
      className={`
        w-full min-w-[240px] lg:min-w-[260px] relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group
        ${isSelected
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/10 shadow-lg scale-105'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:shadow-md hover:scale-102 active:scale-95'
        }
      `}
    >
      {/* Stablecoin Badge */}
      {isStablecoin && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <FaShieldAlt className="w-2.5 h-2.5" />
          Stable
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-3 -left-3 w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white dark:border-gray-800 animate-pulse">
          <FaCheck className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Token Info */}
      <div className="flex items-center gap-4 mb-4">
        {/* Token Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
          style={{ backgroundColor: token.color || '#E5E7EB' }}
        >
          {tokenLogos[token.symbol] ? (
            <Image
              src={tokenLogos[token.symbol]}
              alt={token.symbol}
              width={28}
              height={28}
              className="rounded-full"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <FaWallet className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Token Details */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 dark:text-white truncate text-base">
            {token.symbol}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {token.name}
          </div>
        </div>
      </div>

      {/* Balance Display */}
      {isConnected && !isWrongNetwork && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">Balance:</span>
            <div className="flex items-center gap-1">
              {isLoading ? (
                <>
                  <FaSpinner className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-gray-400">...</span>
                </>
              ) : hasError ? (
                <span className="text-red-600 dark:text-red-400 text-xs">Error</span>
              ) : (
                <span className={`font-bold ${Number(displayBalance) > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600'}`}>
                  {displayBalance}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Min Donation Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          <strong>Min Donation:</strong> {formatTokenAmount(token.minDonation, token.decimals, 2)} {token.symbol}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 flex items-start gap-1">
          <span className="text-sm" style={{ color: token.color }}>●</span>
          <span className="flex-1">{token.description}</span>
        </p>
      </div>
    </button>
  )
}

