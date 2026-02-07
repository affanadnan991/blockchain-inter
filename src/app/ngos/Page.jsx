'use client'

import { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaSortAmountDown, FaHeart, FaCheckCircle } from 'react-icons/fa'
import NGOCard from '@/components/ngo/NGOCard'
import { useDonation } from '@/hooks/useDonation'

export default function NGOsPage() {
  const [ngos, setNgos] = useState([])
  const [filteredNGOs, setFilteredNGOs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('verified')

  const { getAllNGOs } = useDonation()

  useEffect(() => {
    fetchNGOs()
  }, [])

  useEffect(() => {
    filterAndSortNGOs()
  }, [searchQuery, categoryFilter, sortBy, ngos])

  const fetchNGOs = async () => {
    try {
      // Mock data - will be replaced with contract data
      const mockNGOs = [
        {
          id: 1,
          name: "Edhi Foundation",
          description: "Pakistan's largest social welfare organization providing healthcare, orphanages, and emergency services.",
          category: "Healthcare & Social Welfare",
          verified: true,
          totalDonations: 1250000,
          impact: "45+ million people helped",
          location: "Nationwide, Pakistan",
          rating: 4.9,
          logo: "/ngo-logos/edhi.png"
        },
        {
          id: 2,
          name: "Shaukat Khanum Memorial Hospital",
          description: "State-of-the-art cancer treatment and research hospital providing free care to 70% of patients.",
          category: "Healthcare",
          verified: true,
          totalDonations: 850000,
          impact: "70% patients treated free",
          location: "Lahore & Karachi, Pakistan",
          rating: 4.8,
          logo: "/ngo-logos/shoukat-khanum.png"
        },
        {
          id: 3,
          name: "The Citizens Foundation (TCF)",
          description: "Non-profit organization building schools and providing quality education to underprivileged children.",
          category: "Education",
          verified: true,
          totalDonations: 350000,
          impact: "300,000+ students educated",
          location: "Nationwide, Pakistan",
          rating: 4.7,
          logo: "/ngo-logos/tcf.png"
        },
        {
          id: 4,
          name: "Aman Foundation",
          description: "Providing emergency medical services and healthcare solutions in urban Pakistan.",
          category: "Healthcare",
          verified: true,
          totalDonations: 180000,
          impact: "2.5 million lives impacted",
          location: "Karachi, Pakistan",
          rating: 4.6,
          logo: "/ngo-logos/aman.png"
        },
        {
          id: 5,
          name: "Kashf Foundation",
          description: "Microfinance institution empowering women through financial inclusion and entrepreneurship.",
          category: "Economic Empowerment",
          verified: true,
          totalDonations: 220000,
          impact: "3.2 million women empowered",
          location: "Nationwide, Pakistan",
          rating: 4.5,
          logo: "/ngo-logos/kashf.png"
        },
        {
          id: 6,
          name: "Akhuwat Foundation",
          description: "Interest-free microfinance organization helping families break the cycle of poverty.",
          category: "Economic Empowerment",
          verified: true,
          totalDonations: 280000,
          impact: "5 million loans disbursed",
          location: "Nationwide, Pakistan",
          rating: 4.8,
          logo: "/ngo-logos/akhuwat.png"
        }
      ]

      setNgos(mockNGOs)
      setFilteredNGOs(mockNGOs)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching NGOs:', error)
      setLoading(false)
    }
  }

  const filterAndSortNGOs = () => {
    let result = [...ngos]

    // Search filter
    if (searchQuery) {
      result = result.filter(ngo =>
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(ngo => ngo.category === categoryFilter)
    }

    // Sort
    switch (sortBy) {
      case 'verified':
        result.sort((a, b) => b.verified - a.verified)
        break
      case 'donations':
        result.sort((a, b) => b.totalDonations - a.totalDonations)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredNGOs(result)
  }

  const categories = ['all', 'Healthcare', 'Education', 'Economic Empowerment', 'Social Welfare', 'Emergency Relief']
  const sortOptions = [
    { value: 'verified', label: 'Verified First' },
    { value: 'donations', label: 'Most Donations' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' }
  ]

  return (
    <div className="section-spacing">
      <div className="container-padded">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Verified{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              NGOs
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Browse and support trusted organizations making real impact across Pakistan
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card card-spacing-sm text-center">
            <div className="text-2xl font-bold text-primary mb-1">{ngos.length}</div>
            <div className="text-sm text-gray-600">Total NGOs</div>
          </div>
          <div className="card card-spacing-sm text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {ngos.filter(n => n.verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="card card-spacing-sm text-center">
            <div className="text-2xl font-bold text-primary mb-1">$2.4M+</div>
            <div className="text-sm text-gray-600">Total Donated</div>
          </div>
          <div className="card card-spacing-sm text-center">
            <div className="text-2xl font-bold text-primary mb-1">125K+</div>
            <div className="text-sm text-gray-600">Lives Impacted</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="card card-spacing mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search NGOs
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input w-full"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSortAmountDown className="inline mr-2" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input w-full"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-primary hover:text-primary-dark"
                >
                  ×
                </button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                Category: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="ml-2 text-blue-700 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card card-spacing">
                <div className="animate-pulse space-y-4">
                  <div className="h-48 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                Showing <span className="font-semibold">{filteredNGOs.length}</span> of{' '}
                <span className="font-semibold">{ngos.length}</span> NGOs
              </div>
              <div className="text-sm text-gray-500">
                <FaCheckCircle className="inline mr-1 text-green-500" />
                All NGOs are blockchain-verified
              </div>
            </div>

            {/* NGO Grid */}
            {filteredNGOs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNGOs.map(ngo => (
                  <NGOCard key={ngo.id} ngo={ngo} />
                ))}
              </div>
            ) : (
              <div className="card card-spacing text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No NGOs Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('all')
                    setSortBy('verified')
                  }}
                  className="btn btn-outline"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Featured NGO Highlight */}
            {filteredNGOs.length > 0 && (
              <div className="mt-12">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/3">
                      <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                        <FaHeart className="text-primary text-3xl" />
                      </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Featured NGO of the Month
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Edhi Foundation has been selected as our featured NGO for their 
                        outstanding humanitarian work across Pakistan. Consider making a 
                        special donation this month.
                      </p>
                      <button className="btn btn-primary">
                        Support Featured NGO
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}