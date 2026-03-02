'use client'

import React from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaHeart, FaUsers, FaGlobeAmericas, FaCheckCircle } from 'react-icons/fa'

export default function SuccessStoriesPage() {
  const stories = [
    {
      title: 'Clean Water Initiative',
      organization: 'Global Water Foundation',
      impact: '50,000 lives',
      description: 'Provided clean drinking water to remote villages in 5 countries',
      amount: '$125,000 USDC',
      date: 'Completed March 2026'
    },
    {
      title: 'Education for All',
      organization: 'Learning Without Borders',
      impact: '10,000 students',
      description: 'Built 25 schools and educated underprivileged children',
      amount: '$345,000 MATIC',
      date: 'Ongoing'
    },
    {
      title: 'Emergency Medical Relief',
      organization: 'Doctors for Humanity',
      impact: '75,000 patients',
      description: 'Provided free medical camps and essential medicines',
      amount: '$89,500 USDT',
      date: 'Completed February 2026'
    },
    {
      title: 'Rural Healthcare',
      organization: 'Health Everywhere',
      impact: '30,000 beneficiaries',
      description: 'Established mobile health clinics in underserved areas',
      amount: '$210,000 USDC',
      date: 'Completed January 2026'
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
                Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Stories</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                Real impact from real donations. See how blockchain transparency empowered organizations to make measurable differences.
              </p>
              <p className="text-gray-500">Every story verified on-chain • Every dollar tracked</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">165K+</div>
              <p className="text-gray-600">Lives Impacted</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">$769.5K</div>
              <p className="text-gray-600">Deployed Funds</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">4</div>
              <p className="text-gray-600">Completed Projects</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-gray-600">Transparent</p>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {stories.map((story, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-green-600 font-semibold text-sm">{story.organization}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <FaCheckCircle size={24} />
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{story.description}</p>

                <div className="space-y-3 mb-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <FaUsers size={14} /> Impact
                    </span>
                    <span className="font-bold text-gray-900">{story.impact}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Funds Deployed</span>
                    <span className="font-bold text-green-600">{story.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Status</span>
                    <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">{story.date}</span>
                  </div>
                </div>

                <button className="w-full py-3 border-2 border-green-200 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all">
                  View Full Report →
                </button>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Be Part of These Stories</h2>
            <p className="text-green-50 mb-8 max-w-2xl mx-auto">
              Your donation can create the next success story. Every contribution is tracked on blockchain and makes real impact.
            </p>
            <Link href="/donate" className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}