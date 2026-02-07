'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  FaUser, 
  FaHistory, 
  FaReceipt, 
  FaChartBar, 
  FaHeart,
  FaWallet,
  FaDownload
} from 'react-icons/fa'
import DonationHistory from '@/components/dashboard/DonationHistory'
import TaxReceipt from '@/components/dashboard/TaxReceipt'
import StatsCards from '@/components/dashboard/StatsCards'
import { formatAddress } from '@/utils/formatting'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isConnected, address, balance } = useSelector((state) => state.web3)
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    favoriteNGO: 'Edhi Foundation',
    lastDonation: null
  })

  useEffect(() => {
    if (isConnected) {
      setUserStats({
        totalDonated: 1250.50,
        donationCount: 8,
        favoriteNGO: 'Edhi Foundation',
        lastDonation: new Date().toISOString()
      })
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="section-spacing">
        <div className="container-padded">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaWallet className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-8">
              Please connect your wallet to view your donation dashboard
            </p>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'history', label: 'Donation History', icon: <FaHistory /> },
    { id: 'receipts', label: 'Tax Receipts', icon: <FaReceipt /> },
  ]

  return (
    <div className="section-spacing">
      <div className="container-padded">
        {/* User Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
                <p className="text-gray-600">
                  {formatAddress(address)} • Balance: {balance || '0'} MATIC
                </p>
              </div>
            </div>
            <button className="btn btn-primary btn-spacing">
              <FaDownload className="mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsCards stats={userStats} />
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex overflow-x-auto">
            <div className="flex border-b border-gray-200 min-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="card card-spacing">
                <div className="flex items-center gap-3 mb-6">
                  <FaHistory className="text-primary text-xl" />
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <FaHeart className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Donated to Edhi Foundation</p>
                        <p className="text-sm text-gray-500">2 hours ago • $50.00</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Summary */}
              <div className="card card-spacing">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Impact</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Lives Impacted</p>
                    <div className="text-3xl font-bold text-primary">12+</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Carbon Saved</p>
                    <div className="text-3xl font-bold text-primary">24kg CO₂</div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      You're in the top 20% of donors
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="card card-spacing">
              <DonationHistory />
            </div>
          )}
          
          {activeTab === 'receipts' && (
            <div className="card card-spacing">
              <TaxReceipt />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}