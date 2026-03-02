'use client'

import React from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaBarChart, FaChartLine, FaCoins, FaCheckCircle } from 'react-icons/fa'

export default function ImpactReportsPage() {
  const reports = [
    {
      period: 'Q1 2026',
      totalDonations: '$2.4M',
      activeNGOs: 24,
      uniqueDonors: 3850,
      successRate: '98.5%',
      highlight: 'Record participation from international donors'
    },
    {
      period: 'Q4 2025',
      totalDonations: '$1.8M',
      activeNGOs: 19,
      uniqueDonors: 2640,
      successRate: '97.2%',
      highlight: 'Expanded to 5 new countries'
    },
    {
      period: 'Q3 2025',
      totalDonations: '$1.2M',
      activeNGOs: 15,
      uniqueDonors: 1920,
      successRate: '96.8%',
      highlight: 'Launch of multi-token support'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-semibold">
              <FaArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Reports</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                Complete transparency into how our platform is creating impact globally.
              </p>
              <p className="text-gray-500">All data verified on blockchain • Updated quarterly</p>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white mb-20 shadow-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">$5.4M+</div>
                <p className="text-green-50">Total Deployed</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">325K+</div>
                <p className="text-green-50">Lives Impacted</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">8,410</div>
                <p className="text-green-50">Total Donors</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">97.5%</div>
                <p className="text-green-50">Avg Success Rate</p>
              </div>
            </div>
          </div>

          {/* Quarterly Reports */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Quarterly Performance</h2>
            <div className="space-y-6">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{report.period}</h3>
                      <p className="text-gray-500 text-sm mt-1">{report.highlight}</p>
                    </div>
                    <div className="bg-green-100 px-6 py-3 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">{report.successRate}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <FaCoins size={24} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Total Donations</p>
                        <p className="text-xl font-bold text-gray-900">{report.totalDonations}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        <FaCheckCircle size={24} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Active NGOs</p>
                        <p className="text-xl font-bold text-gray-900">{report.activeNGOs}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <FaChartLine size={24} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Unique Donors</p>
                        <p className="text-xl font-bold text-gray-900">{report.uniqueDonors}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download CTA */}
          <div className="text-center bg-white rounded-2xl p-12 border border-gray-100 shadow-lg">
            <FaBarChart size={48} className="mx-auto text-green-600 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Full Audit Reports Available</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Download complete audit reports, smart contract verifications, and detailed transaction breakdowns.
            </p>
            <button className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all">
              Download Reports (PDF/CSV)
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}