'use client'

import { useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaUserCircle, FaCheckCircle } from 'react-icons/fa'
import { formatCurrency, formatAddress } from '@/utils/formatting'

const RecentDonations = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockDonations = [
      {
        id: 1,
        donor: "0x742d35Cc6634C0532925a3b844Bc9e",
        ngo: "Edhi Foundation",
        amount: 5000,
        token: "USDT",
        time: "2 minutes ago",
        status: "confirmed"
      },
      {
        id: 2,
        donor: "0x1234567890abcdef",
        ngo: "Shaukat Khanum",
        amount: 2500,
        token: "MATIC",
        time: "15 minutes ago",
        status: "confirmed"
      },
      {
        id: 3,
        donor: "0xfedcba0987654321",
        ngo: "TCF",
        amount: 1000,
        token: "DAI",
        time: "1 hour ago",
        status: "confirmed"
      },
      {
        id: 4,
        donor: "0xabcdef1234567890",
        ngo: "Edhi Foundation",
        amount: 750,
        token: "USDC",
        time: "3 hours ago",
        status: "confirmed"
      }
    ]
    
    // Simulate loading
    setTimeout(() => {
      setDonations(mockDonations)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <section className="section-py bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="badge badge-primary mb-4">Live Updates</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Recent{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                  Donations
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Real-time donations happening on our platform
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Live Updates</span>
              </div>
              <button className="btn btn-ghost text-primary">
                View All
                <FaExternalLinkAlt />
              </button>
            </div>
          </div>

          {/* Donations Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Donor</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">NGO</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Time</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                
                <tbody>
                  {loading ? (
                    // Skeleton Loader
                    Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                            <div className="space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                              <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    donations.map((donation) => (
                      <tr key={donation.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <FaUserCircle className="text-primary" size={20} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatAddress(donation.donor)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Anonymous donor
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {donation.ngo}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-900 text-lg">
                            {formatCurrency(donation.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.token}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-600">{donation.time}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            <FaCheckCircle size={12} />
                            {donation.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer */}
            {!loading && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    Showing <span className="font-semibold">{donations.length}</span> recent donations
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live updates every 30 seconds</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentDonations