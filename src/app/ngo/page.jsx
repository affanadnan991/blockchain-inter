'use client'

import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { FaChartLine, FaHistory, FaCog, FaChartBar, FaLock } from 'react-icons/fa'
import Button from '../../components/ui/Button'

export default function NGOPortalPage() {
  const { isConnected } = useAccount()

  const portalSections = [
    {
      title: 'Dashboard',
      description: 'View your donations, balance, and key metrics',
      icon: FaChartLine,
      href: '/ngo/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Analytics',
      description: 'Detailed insights into your fundraising performance',
      icon: FaChartBar,
      href: '/ngo/analytics',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'History',
      description: 'Track all donations and transactions',
      icon: FaHistory,
      href: '/ngo/history',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Settings',
      description: 'Manage your profile and preferences',
      icon: FaCog,
      href: '/ngo/settings',
      color: 'from-gray-500 to-gray-600'
    }
  ]

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaLock size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet Not Connected</h1>
          <p className="text-gray-600">
            Please connect your registered NGO wallet to access the portal.
          </p>
          <Link href="/" className="inline-block">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              NGO <span className="text-green-600">Portal</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your organization, track donations, and monitor your impact on the blockchain
            </p>
          </div>

          {/* Portal Sections Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {portalSections.map((section) => {
              const IconComponent = section.icon
              return (
                <Link key={section.href} href={section.href}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full cursor-pointer group">
                    {/* Gradient top */}
                    <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>

                    {/* Content */}
                    <div className="p-8 space-y-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent size={32} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      <p className="text-gray-600 text-sm">{section.description}</p>
                      <div className="pt-4 flex items-center text-green-600 font-semibold">
                        <span>Access Now</span>
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
