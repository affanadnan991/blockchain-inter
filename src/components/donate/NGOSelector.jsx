'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaCheck, FaHeart, FaSearch } from 'react-icons/fa'
import { formatCompactNumber } from '../../utils/formatters'

/**
 * NGO Selector Component
 * Allows user to choose which NGO to donate to
 */
export default function NGOSelector({ selectedNGO, onSelectNGO, ngos = [] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredNGOs, setFilteredNGOs] = useState(ngos)

    useEffect(() => {
        if (searchQuery) {
            const filtered = ngos.filter(ngo =>
                ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ngo.category?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredNGOs(filtered)
        } else {
            setFilteredNGOs(ngos)
        }
    }, [searchQuery, ngos])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Select NGO
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredNGOs.length} available
                </span>
            </div>

            {/* Search Box */}
            {ngos.length > 3 && (
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search NGOs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            )}

            {/* NGO List */}
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {/* All NGOs including General Pool */}
                {filteredNGOs.length > 0 ? (
                    filteredNGOs.map((ngo) => (
                        <NGOOption
                            key={ngo.address}
                            ngo={ngo}
                            isSelected={selectedNGO?.address === ngo.address}
                            onSelect={() => onSelectNGO(ngo)}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No NGOs found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Individual NGO Option
 */
function NGOOption({ ngo, isSelected, onSelect }) {
    return (
        <button
            onClick={onSelect}
            className={`
        w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
        ${isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
                }
      `}
        >
            <div className="flex items-start gap-3">
                {/* Selection Indicator */}
                <div className={`
          mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
          ${isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-300 dark:border-gray-600'
                    }
        `}>
                    {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                </div>

                {/* NGO Logo */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {ngo.logo ? (
                        <Image
                            src={ngo.logo}
                            alt={ngo.name}
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    ) : (
                        <FaHeart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                </div>

                {/* NGO Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">
                            {ngo.name}
                        </h4>
                        {ngo.trustScore && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                {ngo.trustScore}% ✓
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {ngo.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {ngo.category && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                {ngo.category}
                            </span>
                        )}
                        {ngo.donorCount && (
                            <span>
                                {formatCompactNumber(ngo.donorCount)} donors
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    )
}
