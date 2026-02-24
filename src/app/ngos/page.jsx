'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaSearch, FaFilter, FaThLarge, FaList, FaHeart, FaChevronRight } from 'react-icons/fa'
import { useNGOData } from '../../hooks/useNGOData'
import Button from '../../components/ui/Button'
import Image from 'next/image'

export default function NGOListPage() {
  const { ngos, loading } = useNGOData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')

  const categories = ['All', 'Healthcare', 'Education', 'Social Welfare', 'Environment', 'Disaster Relief']

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || ngo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trust Our Verified <span className="text-green-600">Network</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10">
              Discover and support organizations that are making a real difference. All NGOs listed here are thoroughly vetted and their impact is recorded on the blockchain.
            </p>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or mission..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-semibold text-gray-700 appearance-none cursor-pointer pr-10 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5rem' }}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-green-600' : 'text-gray-400'}`}
                  >
                    <FaThLarge />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-green-600' : 'text-gray-400'}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredNGOs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No NGOs Found</h2>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
              className="mt-6 text-green-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-6 max-w-5xl mx-auto"
          }>
            {filteredNGOs.map((ngo) => (
              <div
                key={ngo.address}
                className={`group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
              >
                <div className={`${viewMode === 'list' ? 'md:w-1/3' : 'h-48'} bg-gradient-to-br from-green-50 to-emerald-50 relative p-8 flex items-center justify-center`}>
                  <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform">
                    <Image
                      src={ngo.logo}
                      alt={ngo.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-green-700 shadow-sm border border-green-100">
                    {ngo.category}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                        {ngo.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-mono">{ngo.address.slice(0, 6)}...{ngo.address.slice(-4)}</span>
                        <span>•</span>
                        <span className="font-bold text-green-600">{ngo.trustScore}% Trust</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {ngo.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Total Impact</div>
                      <div className="text-lg font-bold text-gray-900">{ngo.totalWithdrawn} MATIC</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Activities</div>
                      <div className="text-lg font-bold text-gray-900">{ngo.withdrawalCount}+</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/ngos/${ngo.address}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-between">
                        Details <FaChevronRight size={12} />
                      </Button>
                    </Link>
                    <Link href={`/donate?ngo=${ngo.address}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-100">
                        <FaHeart className="mr-2" /> Donate
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 
