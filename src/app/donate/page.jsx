'use client'

import { useState } from 'react'
import DonationForm from '@/components/donation/DonationForm'
import TokenSelector from '@/components/donation/TokenSelector'
import NGOSelector from '@/components/donation/NGOSelector'
import DonationSummary from '@/components/donation/DonationSummary'

export default function DonatePage() {
  const [selectedToken, setSelectedToken] = useState('MATIC')
  const [selectedNGO, setSelectedNGO] = useState(null)
  const [amount, setAmount] = useState('')

  return (
    <div className="section-spacing">
      <div className="container-padded">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Make a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Difference
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Your donation can change lives. Every contribution makes an impact.
          </p>
        </div>

        {/* Donation Form Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Form (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* NGO Selection Card */}
              <div className="card card-spacing">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select NGO</h2>
                  <p className="text-gray-600 mt-2">Choose where you want to make an impact</p>
                </div>
                <NGOSelector 
                  selectedNGO={selectedNGO}
                  onSelect={setSelectedNGO}
                />
              </div>

              {/* Donation Details Card */}
              <div className="card card-spacing">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Donation Details</h2>
                  <p className="text-gray-600 mt-2">Enter your donation amount and token</p>
                </div>
                
                <div className="space-y-8">
                  <TokenSelector
                    selectedToken={selectedToken}
                    onSelect={setSelectedToken}
                  />
                  
                  <div className="pt-6 border-t border-gray-100">
                    <DonationForm
                      amount={amount}
                      setAmount={setAmount}
                      selectedToken={selectedToken}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Summary (1/3 width) */}
            <div className="lg:col-span-1">
              <DonationSummary
                amount={amount}
                token={selectedToken}
                ngo={selectedNGO}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}