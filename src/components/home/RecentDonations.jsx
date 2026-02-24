'use client'

import { FaHistory, FaHeart, FaExternalLinkAlt } from 'react-icons/fa'
import { useNGOData } from '../../hooks/useNGOData'

const RecentDonations = () => {
  const { recentDonations, loading } = useNGOData()

  const truncateAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <FaHistory />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="hidden md:block">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                LIVE ON-CHAIN
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading live feed...
              </div>
            ) : recentDonations.length === 0 ? (
              <div className="p-12 text-center text-gray-500 italic">
                No recent donations found. Be the first to donate!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentDonations.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <FaHeart className="group-hover:scale-125 transition-transform" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {truncateAddress(tx.donor)}
                          </span>
                          <span className="text-gray-500 text-sm">donated</span>
                          <span className="font-bold text-green-600">
                            {tx.amount} MATIC
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <span>{formatTimeAgo(tx.timestamp)} ago</span>
                          <span>•</span>
                          <span>to {truncateAddress(tx.ngo)}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`https://mumbai.polygonscan.com/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View on Polygonscan"
                    >
                      <FaExternalLinkAlt size={14} />
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Real-time updates powered by Polygon Blockchain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentDonations 
