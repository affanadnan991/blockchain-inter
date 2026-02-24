'use client'

import { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import { calculateFee, calculateNetAmount } from '../../utils/formatters'

/**
 * Fee Display Component
 * Shows breakdown of donation amount with platform fee
 */
export default function FeeDisplay({ amount, tokenSymbol, platformFeePercent = 2 }) {
    const [showBreakdown, setShowBreakdown] = useState(false)

    if (!amount || parseFloat(amount) <= 0) {
        return null
    }

    const donationAmount = parseFloat(amount)
    const feeAmount = calculateFee(donationAmount, platformFeePercent)
    const ngoReceives = calculateNetAmount(donationAmount, platformFeePercent)

    return (
        <div className="space-y-3">
            {/* Fee Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Platform Fee ({platformFeePercent}%)
                    </span>
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <FaInfoCircle className="w-4 h-4" />
                    </button>
                </div>

                {/* Main Amount Display */}
                <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        NGO Receives:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {ngoReceives.toFixed(6)} {tokenSymbol}
                    </span>
                </div>

                {/* Detailed Breakdown */}
                {showBreakdown && (
                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Your donation:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {donationAmount.toFixed(6)} {tokenSymbol}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Platform fee:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                                -{feeAmount.toFixed(6)} {tokenSymbol}
                            </span>
                        </div>
                        <div className="h-px bg-blue-200 dark:bg-blue-700 my-2"></div>
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                NGO receives:
                            </span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                                {ngoReceives.toFixed(6)} {tokenSymbol}
                            </span>
                        </div>
                    </div>
                )}

                {/* Info Text */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    💡 Platform fees help maintain blockchain infrastructure and ensure transparency
                </p>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>100% of remaining amount goes to the NGO</span>
            </div>
        </div>
    )
}
