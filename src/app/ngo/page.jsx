'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { FaChartLine, FaHistory, FaCog, FaChartBar, FaLock, FaShieldAlt, FaCheckCircle, FaRocket, FaGlobeAmericas, FaClock, FaBell, FaKey, FaEye, FaUsers, FaArrowRight } from 'react-icons/fa'
import Button from '../../components/ui/Button'

export default function NGOPortalPage() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('features')

  const portalSections = [
    {
      title: 'Dashboard',
      description: 'Real-time overview of donations, balance, and key metrics. Monitor your fundraising performance at a glance.',
      icon: FaChartLine,
      href: '/ngo/dashboard',
      color: 'from-blue-500 to-blue-600',
      badge: 'Essential',
      features: ['Live balance tracking', 'Donation metrics', 'Quick stats']
    },
    {
      title: 'Analytics',
      description: 'Deep dive analytics into fundraising performance and donor insights. Understand your impact in real-time.',
      icon: FaChartBar,
      href: '/ngo/analytics',
      color: 'from-green-500 to-green-600',
      badge: 'Insights',
      features: ['Donor analytics', 'Trends & growth', 'Performance reports']
    },
    {
      title: 'History',
      description: 'Complete transaction history with blockchain verification. Full audit trail for complete transparency.',
      icon: FaHistory,
      href: '/ngo/history',
      color: 'from-purple-500 to-purple-600',
      badge: 'Audit',
      features: ['Transaction logs', 'Blockchain verified', 'Exportable data']
    },
    {
      title: 'Settings',
      description: 'Configure profile, approvers, and withdrawal preferences. Customize your organization\'s security settings.',
      icon: FaCog,
      href: '/ngo/settings',
      color: 'from-orange-500 to-orange-600',
      badge: 'Config',
      features: ['Profile setup', 'Approver management', 'Preferences']
    }
  ]

  const securityFeatures = [
    {
      icon: FaShieldAlt,
      title: 'Multi-Signature Security',
      description: 'Multi-signature approval required for all withdrawals. Prevent unauthorized access with multiple authorized signers.',
      level: 'Bank-Grade'
    },
    {
      icon: FaGlobeAmericas,
      title: 'Complete Transparency',
      description: 'All transactions recorded on blockchain - permanently transparent and immutable. Blockchain verification badge.',
      level: 'Immutable'
    },
    {
      icon: FaClock,
      title: 'Real-Time Updates',
      description: 'Live balance updates and instant notification of donations. Stay connected 24/7 with push notifications.',
      level: 'Instant'
    },
    {
      icon: FaBell,
      title: 'Smart Notifications',
      description: 'Automated alerts for donations, withdrawals, and important events. Never miss critical updates.',
      level: 'Automated'
    },
    {
      icon: FaKey,
      title: 'Non-Custodial Wallets',
      description: 'Your organization maintains full control of funds. No exchange or intermediary holds your assets.',
      level: 'Private'
    },
    {
      icon: FaEye,
      title: 'Full Audit Trail',
      description: 'Complete history of all actions. Blockchain-verified logs ensure accountability for every transaction.',
      level: 'Verified'
    }
  ]

  const integrations = [
    {
      name: 'Multi-Token Support',
      description: 'Accept donations in USDC, USDT, MATIC, and more',
      tokens: ['USDC', 'USDT', 'MATIC', 'DAI']
    },
    {
      name: 'Polygon Network',
      description: 'Lightning-fast transactions with minimal fees',
      feature: 'Ultra-fast blockchain'
    },
    {
      name: 'Smart Contracts',
      description: 'Transparent, audited, and verified code',
      feature: 'Open-source verified'
    }
  ]

  const stats = [
    { value: '100%', label: 'On-Chain Verified', detail: 'Every transaction immutable' },
    { value: '24/7', label: 'Available', detail: 'Round-the-clock monitoring' },
    { value: 'Multi', label: 'Token Support', detail: 'Accept multiple assets' },
    { value: '0', label: 'Hidden Fees', detail: 'Transparent fee structure' }
  ]

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6 pt-32">
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-5 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                  <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                    <FaRocket size={16} />
                    Professional Portal
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Your Blockchain-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">NGO Hub</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Complete management suite for transparent fundraising. Track donations, manage withdrawals, analyze impact, and maintain perfect transparency—all built on blockchain.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/ngo/dashboard" className="inline-block">
                    <Button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <span className="flex items-center gap-2">
                        <FaRocket />
                        Go to Dashboard
                      </span>
                    </Button>
                  </Link>
                  <Link href="/donate" className="inline-block">
                    <Button className="px-8 py-4 border-2 border-green-200 text-green-600 hover:bg-green-50 font-semibold rounded-xl transition-all">
                      <span className="flex items-center gap-2">
                        <FaArrowRight />
                        Share Portal
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur rounded-lg p-3 border border-gray-100">
                    <FaCheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Verified</p>
                      <p className="text-sm font-bold text-gray-900">On-Chain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur rounded-lg p-3 border border-gray-100">
                    <FaClock className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Real-Time</p>
                      <p className="text-sm font-bold text-gray-900">Updates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur rounded-lg p-3 border border-gray-100">
                    <FaShieldAlt className="text-purple-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Secure</p>
                      <p className="text-sm font-bold text-gray-900">Multi-Sig</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-emerald-50 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5"></div>
                  <div className="relative space-y-4 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-2xl">
                      <FaRocket size={64} />
                    </div>
                    <p className="text-sm font-bold text-gray-600">Portal Redesigned for Success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage your NGO's finances with transparency and security
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {portalSections.map((section) => {
                const IconComponent = section.icon
                return (
                  <Link key={section.href} href={section.href}>
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full cursor-pointer group border border-gray-100 hover:border-green-300">
                      {/* Gradient accent */}
                      <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>

                      {/* Content */}
                      <div className="p-8 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                            <IconComponent size={28} />
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${section.color} text-white`}>
                            {section.badge}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
                        </div>

                        {/* Quick features */}
                        <ul className="space-y-2 pt-4 border-t border-gray-100">
                          {section.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <FaCheckCircle size={14} className="text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="pt-4 flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                          <span>Access Portal</span>
                          <FaArrowRight className="ml-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Security & Features */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Bank-Grade Security</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Protection built in at every level with blockchain verification and industry-leading security practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                      <Icon size={32} />
                    </div>
                    
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">{feature.level}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-16 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Portal Capabilities</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <div className="text-5xl md:text-6xl font-bold text-white">{stat.value}</div>
                  <h3 className="text-lg font-bold text-green-50">{stat.label}</h3>
                  <p className="text-sm text-green-100">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Integrations</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built on modern blockchain infrastructure for speed, reliability, and maximum accessibility
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {integrations.map((integration, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all group">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{integration.name}</h3>
                  <p className="text-gray-600 mb-6">{integration.description}</p>
                  
                  {integration.tokens && (
                    <div className="flex flex-wrap gap-2">
                      {integration.tokens.map((token, i) => (
                        <span key={i} className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                          {token}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {integration.feature && (
                    <div className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-lg flex items-center gap-2">
                      <FaCheckCircle size={16} />
                      {integration.feature}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-12 border-2 border-green-200 text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your NGO?</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Launch your professional blockchain-powered portal today. Access all features immediately upon connecting your NGO wallet.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
              <Link href="/ngo/dashboard" className="inline-block">
                <Button className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <span className="flex items-center gap-2">
                    <FaRocket size={20} />
                    Access Dashboard Now
                  </span>
                </Button>
              </Link>
              <Link href="/ngos" className="inline-block">
                <Button className="px-10 py-4 border-2 border-green-300 text-green-700 hover:bg-green-100 font-bold rounded-xl transition-all">
                  <span className="flex items-center gap-2">
                    <FaUsers size={20} />
                    Browse NGOs
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
