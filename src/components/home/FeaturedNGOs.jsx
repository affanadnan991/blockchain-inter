'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaShieldAlt, FaTrophy, FaCheckCircle, FaUsers, FaHeart, FaMapMarkerAlt } from 'react-icons/fa'
import { useNGOData } from '../../hooks/useNGOData'
import useIsOwner from '../../hooks/useIsOwner'

// Memoized SkeletonCard Component
const SkeletonCard = React.memo(() => (
    <div className="card overflow-hidden bg-white border border-gray-100 rounded-2xl animate-pulse">
        <div className="h-32 bg-gray-200" />
        <div className="px-6 pb-6 relative">
            <div className="-mt-12 mb-4 relative z-10 w-24 h-24 bg-gray-300 rounded-2xl mx-auto" />
            <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
                <div className="h-20 bg-gray-100 rounded-xl mt-4" />
                <div className="h-10 bg-gray-200 rounded mt-4" />
            </div>
        </div>
    </div>
))
SkeletonCard.displayName = 'SkeletonCard'

// Memoized NGOCard Component
const NGOCard = React.memo(({ ngo }) => (
    <div className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden bg-white border border-gray-100 rounded-2xl relative">
        {/* Card Cover - Dynamic Gradient */}
        <div className={`h-36 bg-gradient-to-r ${ngo.coverColor || 'from-green-600 to-emerald-600'} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

            {/* Trust Score Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                <FaTrophy className="text-yellow-500 text-sm" />
                <span className="text-xs font-bold text-gray-900">{ngo.trustScore || 90}% Trust Score</span>
            </div>
        </div>

        <div className="px-6 pb-6 relative">
            {/* NGO Logo - Floating */}
            <div className="-mt-14 mb-4 relative z-10 w-28 h-28 bg-white rounded-2xl shadow-xl p-3 flex items-center justify-center group-hover:scale-110 transition-all duration-300 mx-auto border-4 border-white">
                <div className="relative w-full h-full">
                    <Image
                        src={ngo.logo}
                        alt={ngo.name}
                        fill
                        className="object-contain"
                        unoptimized={ngo.logo.startsWith('/ngo-images/')}
                    />
                </div>
            </div>

            {/* Verification Badge */}
            {ngo.verified && (
                <div className="absolute top-2 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <FaCheckCircle />
                    <span>VERIFIED</span>
                </div>
            )}

            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {ngo.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {ngo.description}
                </p>
            </div>

            {/* Stats Section */}
            <div className="space-y-3 mb-6 bg-gradient-to-br from-gray-50 to-green-50/30 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaUsers className="text-green-600" />
                        <span className="font-medium">Impact</span>
                    </div>
                    <span className="font-bold text-gray-900">{ngo.impact || 'Verified'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaHeart className="text-red-500" />
                        <span className="font-medium">Withdrawals</span>
                    </div>
                    <span className="font-bold text-gray-900">{ngo.withdrawalCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <span className="font-medium">Category</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full text-right overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">
                        {ngo.category}
                    </span>
                </div>
            </div>

            {/* Total Raised */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl mb-4 text-center shadow-lg">
                <div className="text-xs opacity-90 mb-1 uppercase tracking-wide font-semibold">Total Withdrawn</div>
                <div className="text-2xl font-bold">
                    {Number(ngo.totalWithdrawn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MATIC
                </div>
                <div className="text-xs opacity-80 mt-1">Blockchain Verified</div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Link href={`/ngos/${ngo.address}`} className="w-full">
                    <button className="w-full text-sm py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all">
                        View Details
                    </button>
                </Link>
                <Link href={`/donate?ngo=${ngo.address}`} className="w-full">
                    <button className="w-full text-sm py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]">
                        <FaHeart className="inline mr-1" />
                        Donate
                    </button>
                </Link>
            </div>
        </div>
    </div>
), (prevProps, nextProps) => {
    // Custom comparison - only re-render if NGO data changes
    return JSON.stringify(prevProps.ngo) === JSON.stringify(nextProps.ngo)
})
NGOCard.displayName = 'NGOCard'

const FeaturedNGOs = () => {
    const { ngos, loading: isLoading } = useNGOData()
    const { isOwner } = useIsOwner()

    // Memoize first 3 NGOs
    const featuredNGOs = useMemo(() => ngos.slice(0, 3), [ngos])

    return (
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-4">
                        <FaShieldAlt className="text-green-600" />
                        <span className="text-sm font-semibold text-green-800">Verified & Trusted</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Organizations</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Blockchain-verified NGOs making measurable, real-world impact. Every organization thoroughly vetted and tracked.
                    </p>
                    <Link href="/ngos" className="inline-block px-6 py-2 border-2 border-green-100 hover:border-green-600 text-green-700 font-bold rounded-xl transition-all">
                        Browse All NGOs →
                    </Link>
                </div>

                {/* NGO Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        featuredNGOs.map((ngo) => (
                            <NGOCard key={ngo.address} ngo={ngo} />
                        ))
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-white border border-green-100 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your NGO not listed?</h3>
                        <p className="text-gray-600 mb-4">Get verified on blockchain and join our trusted network</p>
                        {isOwner ? (
                            <Link href="/admin/ngos" className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md">
                                Register Your NGO
                            </Link>
                        ) : (
                            <>
                                <Link href="/register-ngo" className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md">
                                    Apply to be listed
                                </Link>
                                <div className="text-xs text-gray-500 mt-3">Only platform admins can approve and register NGOs.</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default React.memo(FeaturedNGOs)
