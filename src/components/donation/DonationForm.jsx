'use client'

import { useState } from 'react'
import { FaDollarSign, FaInfoCircle } from 'react-icons/fa'

const DonationForm = ({ amount, setAmount, selectedToken }) => {
  const [message, setMessage] = useState('')
  
  const quickAmounts = [10, 25, 50, 100, 250, 500]

  const handleAmountChange = (value) => {
    // Allow only numbers and one decimal point
    const regex = /^[0-9]*\.?[0-9]*$/
    if (regex.test(value)) {
      setAmount(value)
    }
  }

  const handleQuickSelect = (quickAmount) => {
    setAmount(quickAmount.toString())
  }

  const getTokenInfo = () => {
    const tokenInfo = {
      'MATIC': { symbol: 'MATIC', decimals: 18, minAmount: 1 },
      'USDT': { symbol: 'USDT', decimals: 6, minAmount: 1 },
      'USDC': { symbol: 'USDC', decimals: 6, minAmount: 1 },
      'DAI': { symbol: 'DAI', decimals: 18, minAmount: 1 }
    }
    return tokenInfo[selectedToken] || tokenInfo['MATIC']
  }

  const token = getTokenInfo()

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Donation Amount
        </label>
        
        {/* Amount Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaDollarSign />
          </div>
          
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={`Enter amount in ${token.symbol}`}
            className="input-field pl-12 text-lg"
          />
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
            {token.symbol}
          </div>
        </div>
        
        {/* Quick Amounts */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleQuickSelect(quickAmount)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message with your donation..."
          className="input-field min-h-[100px] resize-none"
          maxLength={100}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {message.length}/100 characters
        </div>
      </div>

      {/* Fee Information */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900 mb-1">Platform Fee: 2%</p>
            <p className="text-sm text-blue-700">
              {parseFloat(amount || 0) > 0 ? (
                <>
                  You donate: <span className="font-bold">${(parseFloat(amount) * 0.98).toFixed(2)}</span> • 
                  Platform fee: <span className="font-bold">${(parseFloat(amount) * 0.02).toFixed(2)}</span>
                </>
              ) : (
                'Minimum donation: 1 ' + token.symbol
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationForm