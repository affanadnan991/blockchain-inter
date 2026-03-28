'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { FaHeart, FaWallet } from 'react-icons/fa'
import { ethers } from 'ethers'
import useWeb3 from '../../hooks/useWeb3'
import { useDonateMATIC, useDonateToken, useDonateToNGO, useDonationContract } from '../../hooks/useDonationContract'
import useTokenContract from '../../hooks/useTokenContract'
import TokenSelector from './TokenSelector'
import NGOSelector from './NGOSelector'
import FeeDisplay from './FeeDisplay'
import TransactionModal from './TransactionModal'
import WalletConnect from '../wallet/WalletConnect'
import ImpactSlider from './ImpactSlider'
import { parseEther, formatTokenAmount } from '../../utils/formatters'

/**
 * Main Donation Form Component
 */
export default function DonateForm({ ngos = [], platformFeePercent = 2, loading = false, selectedToken: selectedTokenProp = null }) {
    const { address, isConnected, isWrongNetwork } = useWeb3()
    const { contractAddress } = useDonationContract()

    // Form state
    const [selectedToken, setSelectedToken] = useState(null)
    const [selectedNGO, setSelectedNGO] = useState(null)
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')

    // Initialize selected token from prop if provided
    useEffect(() => {
      if (selectedTokenProp && !selectedToken) {
        setSelectedToken(selectedTokenProp)
      }
    }, [selectedTokenProp, selectedToken])

    // Transaction state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [txStatus, setTxStatus] = useState('pending')
    const [txStep, setTxStep] = useState('approving')
    const [txHash, setTxHash] = useState(null)
    const [txError, setTxError] = useState(null)

    // Hooks for donations
    const { donate: donateMATIC, isLoading: maticLoading, isSuccess: maticSuccess, txHash: maticHash, error: maticError } = useDonateMATIC()
    const { donate: donateToNGO, isLoading: ngoLoading, isSuccess: ngoSuccess, txHash: ngoHash, error: ngoError } = useDonateToNGO()
    const { donate: donateToken, isLoading: tokenLoading, isSuccess: tokenSuccess, txHash: tokenHash, error: tokenError } = useDonateToken()

    // Token approval hook (only for ERC20)
    const isNativeToken = selectedToken?.type === 'native'
    const {
        approve,
        needsApproval,
        isApproving,
        isApproveConfirmed,
        approveTxHash,
        approveError
    } = useTokenContract(!isNativeToken ? selectedToken?.address : null)

    // Validation - enforce minDonation to match contract (avoids revert)
    const amountNum = parseFloat(amount) || 0
    const minDonation = selectedToken?.minDonation ? parseFloat(formatTokenAmount(selectedToken.minDonation, selectedToken.decimals, 6)) : 0
    const meetsMinDonation = minDonation === 0 || amountNum >= minDonation

    const isValid =
        amount &&
        amountNum > 0 &&
        selectedToken &&
        isConnected &&
        !isWrongNetwork &&
        meetsMinDonation

    // Handle donation submission
    const handleDonate = async () => {
        if (!isValid) return
        if (!meetsMinDonation) {
            toast.error(`Minimum donation is ${minDonation} ${selectedToken?.symbol}`)
            return
        }

        try {
            setIsModalOpen(true)
            setTxStatus('pending')
            setTxError(null)

            const isGeneralPool = !selectedNGO || selectedNGO.id === 'general-pool'

            // For ERC20 tokens, check if approval is needed
            if (!isNativeToken) {
                const requiresApproval = await needsApproval(
                    contractAddress,
                    amountNum,
                    selectedToken.decimals
                )

                if (requiresApproval) {
                    setTxStep('approving')
                    toast.loading('Approving token spending...', { id: 'approve' })

                    try {
                        // Wait for approval to complete (this now returns a promise)
                        const approveTx = await approve(
                            contractAddress,
                            amountNum,
                            selectedToken.decimals
                        )
                        
                        toast.success('Token approved!', { id: 'approve' })
                        setTxHash(approveTx)
                    } catch (approvalError) {
                        console.error('Approval error:', approvalError)
                        toast.error('Token approval failed', { id: 'approve' })
                        setTxStatus('error')
                        setTxError({ message: approvalError.message || 'Token approval was not confirmed' })
                        return
                    }
                }
            }

            // Proceed with donation
            setTxStep('donating')
            toast.loading('Submitting donation...', { id: 'donate' })

            if (isNativeToken) {
                // Native token donation
                if (isGeneralPool) {
                    await donateMATIC(amount, message)
                } else {
                    await donateToNGO(selectedNGO.address, amount, message)
                }
            } else {
                // ERC20 token donation
                await donateToken(
                    selectedToken.address,
                    amount,
                    selectedToken.decimals,
                    isGeneralPool ? ethers.constants.AddressZero : selectedNGO.address,
                    message
                )
            }

            setTxStep('confirming')
            toast.loading('Confirming transaction...', { id: 'donate' })

        } catch (error) {
            console.error('Donation error:', error)
            toast.error(error.message || 'Donation failed', { id: 'donate' })
            setTxStatus('error')
            setTxError(error)
        }
    }

    // Monitor transaction status - improved tracking
    useEffect(() => {
        if (maticSuccess) {
            console.log('MATIC donation successful')
            setTxStatus('success')
            setTxStep('success')
            toast.success('Donation successful! 🎉', { id: 'donate' })
            setTimeout(() => {
                // Reset form after 2 seconds
                setAmount('')
                setMessage('')
            }, 2000)
        }
    }, [maticSuccess])

    useEffect(() => {
        if (ngoSuccess) {
            console.log('NGO donation successful')
            setTxStatus('success')
            setTxStep('success')
            toast.success('Donation successful! 🎉', { id: 'donate' })
            setTimeout(() => {
                // Reset form after 2 seconds
                setAmount('')
                setMessage('')
            }, 2000)
        }
    }, [ngoSuccess])

    useEffect(() => {
        if (tokenSuccess) {
            console.log('Token donation successful')
            setTxStatus('success')
            setTxStep('success')
            toast.success('Donation successful! 🎉', { id: 'donate' })
            setTimeout(() => {
                // Reset form after 2 seconds
                setAmount('')
                setMessage('')
            }, 2000)
        }
    }, [tokenSuccess])

    // Monitor errors separately
    useEffect(() => {
        if (maticError) {
            console.error('MATIC donation error:', maticError)
            setTxStatus('error')
            setTxError(maticError)
            toast.error(maticError.message || 'Transaction failed', { id: 'donate' })
        }
    }, [maticError])

    useEffect(() => {
        if (ngoError) {
            console.error('NGO donation error:', ngoError)
            setTxStatus('error')
            setTxError(ngoError)
            toast.error(ngoError.message || 'Transaction failed', { id: 'donate' })
        }
    }, [ngoError])

    useEffect(() => {
        if (tokenError) {
            console.error('Token donation error:', tokenError)
            setTxStatus('error')
            setTxError(tokenError)
            toast.error(tokenError.message || 'Transaction failed', { id: 'donate' })
        }
    }, [tokenError])

    // Monitor approval errors
    useEffect(() => {
        if (approveError) {
            console.error('Approval error:', approveError)
            setTxStatus('error')
            setTxError(approveError)
            toast.error(approveError.message || 'Approval failed', { id: 'approve' })
        }
    }, [approveError])

    // Monitor transaction hashes
    useEffect(() => {
        if (maticHash) setTxHash(maticHash)
        if (ngoHash) setTxHash(ngoHash)
        if (tokenHash) setTxHash(tokenHash)
    }, [maticHash, ngoHash, tokenHash])

    const isLoading = maticLoading || ngoLoading || tokenLoading || isApproving

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <FaHeart className="w-6 h-6" />
                        <h2 className="text-2xl font-bold">Make a Donation</h2>
                    </div>
                    <p className="text-primary-light">
                        Every contribution makes a real difference
                    </p>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Wallet Connection */}
                    {!isConnected && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <FaWallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <span className="font-semibold text-amber-900 dark:text-amber-100">
                                    Connect Your Wallet
                                </span>
                            </div>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                                Connect your wallet to make a donation
                            </p>
                            <WalletConnect />
                        </div>
                    )}

                    {/* Token Selector */}
                    <TokenSelector
                        selectedToken={selectedToken}
                        onSelectToken={setSelectedToken}
                    />

                    {/* Wrong network reminder */}
                    {isWrongNetwork && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            ⚠️ You're connected to an unsupported network. Please switch to Polygon.
                        </div>
                    )}

                    {/* NGO Selector */}
                    <NGOSelector
                        selectedNGO={selectedNGO}
                        onSelectNGO={setSelectedNGO}
                        ngos={ngos}
                    />

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Donation Amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                            {selectedToken && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                                    {selectedToken.symbol}
                                </span>
                            )}
                        </div>
                        {selectedToken && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Minimum: {formatTokenAmount(selectedToken.minDonation, selectedToken.decimals, 2)} {selectedToken.symbol}
                            </p>
                        )}
                    </div>

                    {/* Gamified Tangible Impact Display */}
                    <ImpactSlider amount={amount} targetAmountBase={selectedToken?.symbol || ''} />

                    {/* Fee Display */}
                    {amount && selectedToken && (
                        <FeeDisplay
                            amount={amount}
                            tokenSymbol={selectedToken.symbol}
                            platformFeePercent={platformFeePercent}
                        />
                    )}

                    {/* Message (Optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Message (Optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Leave an inspiring message..."
                            rows={3}
                            maxLength={200}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                            {message.length}/200
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleDonate}
                        disabled={!isValid || isLoading}
                        className={`
              w-full py-4 rounded-lg font-bold text-lg transition-all duration-200
              ${isValid && !isLoading
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : !isConnected ? (
                            'Connect Wallet First'
                        ) : (
                            '💚 Donate Now'
                        )}
                    </button>
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                status={txStatus}
                txHash={txHash}
                error={txError}
                step={txStep}
                donationData={{
                    amount,
                    donor: address,
                    ngo: selectedNGO,
                    token: selectedToken
                }}
            />
        </div>
    )
}
