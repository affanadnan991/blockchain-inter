'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaExternalLinkAlt, FaCopy, FaCheckCircle } from 'react-icons/fa'
import { formatCurrency, formatDate } from '@/utils/formatting'

const DonationHistory = () => {
  const { address } = useSelector((state) => state.web3)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    if (address) {
      fetchDonations()
    }
  }, [address])

  const fetchDonations = async () => {
    // Mock data - will be replaced with contract events
    const mockDonations = [
      {
        id: '0xabc123...',
        ngo: 'Edhi Foundation',
        amount: 50.00,
        token: 'USDT',
        date: new Date().toISOString(),
        status: 'completed',
        txHash: '0x123...'
      },
      {
        id: '0xdef456...',
        ngo: 'Shaukat Khanum',
        amount: 100.00,
        token: 'MATIC',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        txHash: '0x456...'
      },
      {
        id: '0xghi789...',
        ngo: 'TCF',
        amount: 25.00,
        token: 'DAI',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        txHash: '0x789...'
      }
    ]
    
    setDonations(mockDonations)
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading donation history...</p>
      </div>
    )
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No donations yet</h3>
        <p className="text-gray-600 mb-6">Make your first donation to see it here</p>
        <a href="/donate" className="btn-primary inline-block">
          Donate Now
        </a>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Donation History</h3>
        <div className="text-sm text-gray-600">
          {donations.length} total donations
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm truncate max-w-[100px]">
                      {donation.id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(donation.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedId === donation.id ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{donation.ngo}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold">{formatCurrency(donation.amount)}</div>
                  <div className="text-sm text-gray-600">{donation.token}</div>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {formatDate(new Date(donation.date).getTime() / 1000)}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {donation.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${donation.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    View
                    <FaExternalLinkAlt className="ml-1" size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <div className="text-sm text-gray-600">
          Showing {donations.length} of {donations.length} donations
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border rounded-lg bg-primary text-white">
            1
          </button>
          <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonationHistory