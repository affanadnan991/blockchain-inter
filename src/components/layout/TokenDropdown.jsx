'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaChevronDown } from 'react-icons/fa'
import { useChainId } from 'wagmi'
import { TOKEN_REGISTRY } from '../../utils/tokenConfig'

export default function TokenDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const chainId = useChainId()

  const tokens = TOKEN_REGISTRY[chainId] || []

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on select
  const handleTokenClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isOpen
            ? 'bg-green-600 text-white shadow-lg'
            : 'bg-green-50 text-green-700 border border-green-200 hover:border-green-400 group-hover:bg-green-100'
          }`}
      >
        <span>Quick Donate</span>
        <FaChevronDown
          size={12}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Select Token to Donate</p>
          </div>

          {/* Token List */}
          <div className="max-h-96 overflow-y-auto">
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <Link
                  key={token.address}
                  href={`/donate?token=${token.address}`}
                  onClick={handleTokenClick}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {/* Token Logo */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: token.color }}
                  >
                    {token.symbol.substring(0, 2)}
                  </div>

                  {/* Token Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{token.symbol}</p>
                    <p className="text-xs text-gray-500 truncate">{token.name}</p>
                  </div>

                  {/* Type Badge */}
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${token.type === 'native'
                        ? 'bg-purple-100 text-purple-700'
                        : token.type === 'stablecoin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {token.type === 'native' ? '⚡ Native' : token.type === 'stablecoin' ? '💵 Stable' : 'Token'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 text-sm">No tokens available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <Link
            href="/donate"
            onClick={handleTokenClick}
            className="block px-4 py-3 border-t border-gray-100 text-center text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
          >
            View All Tokens →
          </Link>
        </div>
      )}
    </div>
  )
}
