'use client'

import { use } from 'react'
import Link from 'next/link'
import { FaHeart, FaChevronLeft, FaShieldAlt, FaGlobal, FaCalendarAlt, FaHistory, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useNGOData } from '../../../hooks/useNGOData'
import Button from '../../../components/ui/Button'
import Image from 'next/image'

export default function NGODetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const { id: ngoAddress } = params
  const { ngos, recentDonations, loading } = useNGOData()

  const ngo = ngos.find(n => n.address.toLowerCase() === ngoAddress.toLowerCase())
  const ngoDonations = recentDonations.filter(d => d.ngo.toLowerCase() === ngoAddress.toLowerCase())

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 pt-32 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="h-8 w-32 bg-gray-200 rounded-lg mb-8" />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 bg-gray-200 rounded-3xl" />
              <div className="h-64 bg-gray-200 rounded-3xl" />
            </div>
            <div className="h-[500px] bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!ngo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase tracking-widest text-gray-400">
        NGO Not Found
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-32">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/ngos" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-8 group">
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to NGOs
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: NGO Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-600 to-emerald-700 p-8 flex items-end">
                <div className="p-4 bg-white rounded-2xl shadow-2xl">
                  <div className="relative w-24 h-24">
                    <Image src={ngo.logo} alt={ngo.name} fill className="object-contain" />
                  </div>
                </div>
              </div>
              <div className="p-8 pt-12 relative">
                <div className="absolute top-8 right-8 flex gap-2">
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full border border-green-200 flex items-center gap-2">
                    <FaCheckCircle /> REGISTERED
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{ngo.name}</h1>
                <p className="text-gray-500 font-mono text-sm mb-6 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                  {ngoAddress}
                </p>
                <div className="prose prose-green max-w-none text-gray-600 leading-relaxed text-lg">
                  <p>{ngo.description}</p>
                </div>
              </div>
            </div>

            {/* Impact Analytics */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaShieldAlt className="text-blue-600" /> Transparency & Impact
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Total Withdrawn</div>
                  <div className="text-2xl font-bold text-gray-900">{ngo.totalWithdrawn} MATIC</div>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl">
                  <div className="text-sm font-semibold text-green-600 uppercase mb-2">Withdrawal Count</div>
                  <div className="text-2xl font-bold text-gray-900">{ngo.withdrawalCount}</div>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl">
                  <div className="text-sm font-semibold text-purple-600 uppercase mb-2">Trust Score</div>
                  <div className="text-2xl font-bold text-gray-900">{ngo.trustScore}%</div>
                </div>
              </div>
            </div>

            {/* Donation History */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaHistory className="text-red-500" /> Recent Donations
              </h2>
              {ngoDonations.length === 0 ? (
                <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-2xl">
                  No public donations recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {ngoDonations.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <FaHeart size={14} />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">{d.amount} MATIC</span>
                          <p className="text-xs text-gray-400">from {d.donor.slice(0, 10)}...</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(d.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Donation Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Support this Cause</h3>
              <div className="space-y-6">
                <div className="p-6 bg-green-600 rounded-2xl text-white">
                  <div className="text-sm opacity-80 mb-1 uppercase tracking-wider font-semibold">Ready to help?</div>
                  <p className="text-lg leading-snug mb-6">Your donation will directly support {ngo.name}'s mission.</p>
                  <Link href={`/donate?ngo=${ngoAddress}`}>
                    <Button className="w-full bg-white text-green-600 hover:bg-green-50 shadow-xl py-4">
                      Donate Now
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <p>Donations are final and recorded immutably on the Polygon blockchain.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
