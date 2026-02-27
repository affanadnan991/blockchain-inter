'use client'

import React, { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaClock, FaExclamationCircle, FaCheckDouble } from 'react-icons/fa'
import { formatTokenAmount, shortenAddress, formatDate } from '../../utils/formatters'
import { useRequestApprovalStatus } from '../../hooks/useContractQuery'
import { useWithdrawalRequests } from '../../hooks/useWithdrawalRequests'
import useWeb3 from '../../hooks/useWeb3'

/**
 * Component for NGO approvers to approve/reject withdrawal requests
 */
export default function WithdrawalApprovalPanel({ requestId, request, onApprove, onReject, loading = false }) {
    const { address } = useWeb3()
    const { hasApproved } = useRequestApprovalStatus(requestId, address)
    const [isApproving, setIsApproving] = useState(false)

    if (!request) {
        return (
            <div className="p-6 text-center text-gray-500">
                Request not found
            </div>
        )
    }

    const canApprove = !hasApproved && !request.executed && !request.rejected
    const approvalPercentage = (request.approvalCount / request.approvalsNeeded) * 100
    const isReadyToExecute = request.approvalCount >= request.approvalsNeeded
    const timeRemaining = calculateTimeRemaining(request.timestamp)

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Withdrawal Request #{requestId}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Amount: <span className="font-semibold text-gray-900 dark:text-white">
                                {formatTokenAmount(request.amount, request.token === '0x0000000000000000000000000000000000000000' ? 18 : 6)}
                            </span> {getTokenSymbol(request.token)}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="px-3 py-1 rounded-full text-xs font-bold inline-block mb-2" style={{
                            backgroundColor: isReadyToExecute ? '#10b981' : '#f59e0b',
                            color: 'white'
                        }}>
                            {request.executed ? 'Executed' : isReadyToExecute ? 'Ready to Execute' : 'Pending'}
                        </div>
                        {timeRemaining && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{timeRemaining}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Approval Progress */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Approvals
                        </label>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {request.approvalCount} / {request.approvalsNeeded}
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-300"
                            style={{ width: `${Math.min(approvalPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Status Message */}
                {request.executed && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <FaCheck className="text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-sm text-green-700 dark:text-green-300">
                            This withdrawal has been executed successfully
                        </span>
                    </div>
                )}
                {request.rejected && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <FaTimes className="text-red-600 dark:text-red-400 flex-shrink-0" />
                        <span className="text-sm text-red-700 dark:text-red-300">
                            This withdrawal request has been rejected
                        </span>
                    </div>
                )}
                {isReadyToExecute && !request.executed && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <FaCheckDouble className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                            All required approvals have been received. This request is ready to be executed.
                        </span>
                    </div>
                )}
            </div>

            {/* Approval Status */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Approval Status</p>
                <div className="flex items-center gap-3">
                    {hasApproved ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <FaCheck className="text-green-600 dark:text-green-400 text-sm" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                You have <span className="font-semibold">approved</span> this request
                            </span>
                        </>
                    ) : request.executed || request.rejected ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <FaClock className="text-gray-400 text-sm" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                This request is no longer pending
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <FaClock className="text-yellow-600 dark:text-yellow-400 text-sm" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Awaiting your <span className="font-semibold">approval</span>
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Purpose Information */}
            {request.purposeHash && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Withdrawal Purpose</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        Purpose hash: <code className="font-mono text-xs">{shortenAddress(request.purposeHash, 8)}</code>
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            {canApprove && (
                <div className="p-6 flex gap-3">
                    <button
                        onClick={() => {
                            setIsApproving(true)
                            onApprove(requestId)
                        }}
                        disabled={loading || isApproving}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isApproving ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Approving...
                            </>
                        ) : (
                            <>
                                <FaCheck className="w-4 h-4" />
                                Approve Request
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to reject this request?')) {
                                onReject(requestId)
                            }
                        }}
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FaTimes className="w-4 h-4" />
                        Reject Request
                    </button>
                </div>
            )}

            {/* Rejected/Executed Info */}
            {(request.executed || request.rejected) && (
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.executed ? 'This request has been executed on-chain.' : 'This request has been rejected.'}
                    </p>
                </div>
            )}
        </div>
    )
}

/**
 * Helper function to get token symbol
 */
function getTokenSymbol(tokenAddress) {
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') return 'MATIC'

    const tokenMap = {
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'USDT',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': 'DAI',
    }

    return tokenMap[tokenAddress?.toLowerCase()] || 'TOKEN'
}

/**
 * Helper function to calculate time remaining
 */
function calculateTimeRemaining(timestamp) {
    const REQUEST_EXPIRY = 30 * 24 * 60 * 60 // 30 days
    const now = Math.floor(Date.now() / 1000)
    const expiryTime = timestamp + REQUEST_EXPIRY
    const timeRemaining = expiryTime - now

    if (timeRemaining <= 0) {
        return 'This request has expired'
    }

    const days = Math.floor(timeRemaining / (24 * 60 * 60))
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60))

    if (days > 0) {
        return `Expires in ${days}d ${hours}h`
    } else {
        return `Expires in ${hours}h`
    }
}
