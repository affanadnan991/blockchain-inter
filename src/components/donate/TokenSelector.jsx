'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaCheck, FaWallet } from 'react-icons/fa'
import { getSupportedTokens } from '../../utils/web3Config'
import { formatTokenAmount } from '../../utils/formatters'
import useWeb3 from '../../hooks/useWeb3'
import useTokenContract from '../../hooks/useTokenContract'

/**
 * Token Selector Component
 * Allows user to choose which token to donate (MATIC, USDT, USDC, DAI)
 */
export default function TokenSelector({ selectedToken, onSelectToken }) {
    const { chainId, isConnected } = useWeb3()
    const [tokens, setTokens] = useState([])

    useEffect(() => {
        if (chainId) {
            const supportedTokens = getSupportedTokens(chainId)
            setTokens(supportedTokens)

            // Auto-select first token if none selected
            if (!selectedToken && supportedTokens.length > 0) {
                onSelectToken(supportedTokens[0])
            }
        }
    }, [chainId])

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Choose Payment Method
            </label>

            <div className="grid grid-cols-2 gap-3">
                {tokens.map((token) => (
                    <TokenOption
                        key={token.symbol}
                        token={token}
                        isSelected={selectedToken?.symbol === token.symbol}
                        onSelect={() => onSelectToken(token)}
                        isConnected={isConnected}
                    />
                ))}
            </div>

            {!isConnected && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    💡 Connect wallet to see your balances
                </p>
            )}
        </div>
    )
}

/**
 * Individual Token Option
 */
function TokenOption({ token, isSelected, onSelect, isConnected }) {
    const { address } = useWeb3()
    const { balance, decimals, balanceLoading } = useTokenContract(
        token.address !== '0x0000000000000000000000000000000000000000' ? token.address : null
    )

    // For native token, we'd need to use a different hook or method
    const displayBalance = balance && decimals
        ? formatTokenAmount(balance, decimals, 4)
        : '0.00'

    return (
        <button
            onClick={onSelect}
            className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${isSelected
                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
                }
      `}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <FaCheck className="w-3 h-3 text-white" />
                </div>
            )}

            {/* Token Info */}
            <div className="flex items-center gap-3">
                {/* Token Icon */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    {token.logo ? (
                        <Image
                            src={token.logo}
                            alt={token.symbol}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    ) : (
                        <FaWallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                </div>

                {/* Token Details */}
                <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900 dark:text-white">
                        {token.symbol}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {token.name}
                    </div>
                </div>
            </div>

            {/* Balance Display */}
            {isConnected && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Balance:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {balanceLoading ? '...' : displayBalance}
                        </span>
                    </div>
                </div>
            )}

            {/* Min Donation Info */}
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Min: {formatTokenAmount(token.minDonation, token.decimals, 2)}
            </div>
        </button>
    )
}
