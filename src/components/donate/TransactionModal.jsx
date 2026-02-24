'use client'

import { useEffect } from 'react'
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaExternalLinkAlt, FaClock } from 'react-icons/fa'
import { getExplorerUrl } from '../../utils/web3Config'
import useWeb3 from '../../hooks/useWeb3'
import DonationReceipt from './DonationReceipt'

/**
 * Transaction Modal Component
 * Shows transaction progress and status
 */
export default function TransactionModal({
    isOpen,
    onClose,
    status,
    txHash,
    error,
    step = 'approving', // 'approving', 'donating', 'confirming', 'success', 'error'
    donationData = null
}) {
    const { chainId } = useWeb3()

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const explorerUrl = chainId ? getExplorerUrl(chainId) : 'https://polygonscan.com'
    const txUrl = txHash ? `${explorerUrl}/tx/${txHash}` : null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={status === 'success' || status === 'error' ? onClose : undefined}
            />

            {/* Modal */}
            <div className={`relative w-full ${status === 'success' ? 'max-w-2xl' : 'max-w-md'} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
                    <h3 className="text-xl font-bold">
                        {status === 'success' ? '🎉 Donation Successful!' :
                            status === 'error' ? '❌ Transaction Failed' :
                                '⏳ Processing Transaction'}
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Icon */}
                    <div className="flex justify-center">
                        {status === 'success' ? (
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        ) : status === 'error' ? (
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <FaTimesCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <FaSpinner className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Progress Steps */}
                    {status !== 'error' && status !== 'success' && (
                        <div className="space-y-3">
                            <StepItem
                                label="Approve Token (if needed)"
                                status={step === 'approving' ? 'active' : 'completed'}
                            />
                            <StepItem
                                label="Submit Donation"
                                status={step === 'donating' ? 'active' : step === 'confirming' || step === 'success' ? 'completed' : 'pending'}
                            />
                            <StepItem
                                label="Confirming on Blockchain"
                                status={step === 'confirming' ? 'active' : step === 'success' ? 'completed' : 'pending'}
                            />
                        </div>
                    )}

                    {/* Success Message & Receipt */}
                    {status === 'success' && (
                        <div className="space-y-6">
                            <DonationReceipt
                                donation={{
                                    amount: donationData?.amount,
                                    donor: donationData?.donor,
                                    timestamp: Date.now(),
                                    id: txHash
                                }}
                                ngo={donationData?.ngo}
                                token={donationData?.token}
                            />
                            <div className="text-center space-y-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Your donation has been secured on the Polygon blockchain.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {status === 'error' && (
                        <div className="text-center space-y-3">
                            <p className="text-red-600 dark:text-red-400 font-semibold">
                                {error?.message || 'Transaction failed'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Please try again or contact support if the issue persists.
                            </p>
                        </div>
                    )}

                    {/* Transaction Hash */}
                    {txHash && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Transaction Hash
                                </span>
                                {txUrl && (
                                    <a
                                        href={txUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
                                    >
                                        View on Explorer
                                        <FaExternalLinkAlt className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                            <div className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                                {txHash}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {status === 'success' && (
                            <>
                                {txUrl && (
                                    <a
                                        href={txUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 btn-secondary py-3 rounded-lg font-semibold text-center border-2 border-gray-300 dark:border-gray-600 hover:border-primary transition-colors"
                                    >
                                        View Receipt
                                    </a>
                                )}
                                <button
                                    onClick={onClose}
                                    className="flex-1 btn-primary py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg transition-all"
                                >
                                    Done
                                </button>
                            </>
                        )}

                        {status === 'error' && (
                            <button
                                onClick={onClose}
                                className="w-full btn-primary py-3 rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                            >
                                Close
                            </button>
                        )}

                        {status !== 'success' && status !== 'error' && (
                            <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                                Please don't close this window...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Progress Step Item
 */
function StepItem({ label, status }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`
        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
        ${status === 'completed' ? 'bg-green-500' :
                    status === 'active' ? 'bg-blue-500' :
                        'bg-gray-300 dark:bg-gray-700'}
      `}>
                {status === 'completed' ? (
                    <FaCheckCircle className="w-4 h-4 text-white" />
                ) : status === 'active' ? (
                    <FaSpinner className="w-4 h-4 text-white animate-spin" />
                ) : (
                    <FaClock className="w-3 h-3 text-gray-500" />
                )}
            </div>
            <span className={`
        text-sm font-medium
        ${status === 'active' ? 'text-gray-900 dark:text-white' :
                    'text-gray-500 dark:text-gray-400'}
      `}>
                {label}
            </span>
        </div>
    )
}
