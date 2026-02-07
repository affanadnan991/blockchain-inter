'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaWallet, FaLock, FaReceipt, FaCheck, FaSpinner } from 'react-icons/fa'
import { useDonation } from '@/hooks/useDonation'
import Button from '../ui/Button'

const DonationSummary = ({ amount, token, ngo }) => {
  const { isConnected, address } = useSelector((state) => state.web3)
  const { loading, error, balances, donateNative, donateToken } = useDonation()
  const [donationStatus, setDonationStatus] = useState(null)
  
  const calculateFees = () => {
    const donationAmount = parseFloat(amount || 0)
    const platformFee = donationAmount * 0.02
    const netAmount = donationAmount - platformFee
    
    return {
      donationAmount,
      platformFee,
      netAmount,
      totalAmount: donationAmount
    }
  }

  const fees = calculateFees()

  const handleDonate = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    
    if (!amount || parseFloat(amount) < 1) {
      alert(`Minimum donation is 1 ${token}`)
      return
    }
    
    if (!ngo) {
      alert('Please select an NGO')
      return
    }
    
    try {
      setDonationStatus('processing')
      
      let result
      if (token === 'MATIC') {
        result = await donateNative(amount, 'Donation from ZakatChain')
      } else {
        result = await donateToken(token, amount, ngo.address, 'Donation from ZakatChain')
      }
      
      if (result.success) {
        setDonationStatus('success')
        alert(`Donation successful! Transaction hash: ${result.hash}`)
        // Reset form or redirect
      } else {
        setDonationStatus('failed')
        alert(`Donation failed: ${result.error}`)
      }
    } catch (err) {
      setDonationStatus('failed')
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <div className="card sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Summary</h2>
      
      {/* Wallet Status */}
      <div className="mb-6">
        <div className={`flex items-center p-3 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <FaWallet className={`mr-3 ${isConnected ? 'text-green-600' : 'text-yellow-600'}`} />
          <div className="flex-1">
            <p className="font-medium">
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </p>
            <p className="text-sm opacity-75 truncate">
              {isConnected ? address : 'Required for donation'}
            </p>
          </div>
          
          {isConnected && balances[token] && (
            <div className="text-right">
              <p className="text-sm font-medium">Balance</p>
              <p className="text-sm">
                {balances[token]} {token}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Donation Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Amount</span>
          <span className="font-semibold">
            ${fees.donationAmount.toFixed(2)} {token}
          </span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Platform Fee (2%)</span>
          <span className="font-semibold">
            ${fees.platformFee.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">NGO Receives</span>
          <span className="font-semibold text-green-600">
            ${fees.netAmount.toFixed(2)}
          </span>
        </div>
        
        {ngo && (
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Selected NGO</span>
            <span className="font-semibold text-right">{ngo.name}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mb-6">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${fees.totalAmount.toFixed(2)} {token}
          </span>
        </div>
      </div>

      {/* Donate Button */}
      <Button
        onClick={handleDonate}
        disabled={!isConnected || !amount || !ngo || loading}
        className="w-full py-4 text-lg flex items-center justify-center"
      >
        {loading || donationStatus === 'processing' ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <FaLock className="mr-2" />
            {isConnected ? 'Confirm Donation' : 'Connect Wallet to Donate'}
          </>
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {donationStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          Donation successful! Check your wallet for confirmation.
        </div>
      )}

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <FaCheck className="text-green-600 mr-2" />
            <span>Blockchain Verified</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaReceipt className="text-green-600 mr-2" />
            <span>Tax Receipt</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationSummary