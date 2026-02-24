'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaHeart, FaUsers, FaMapMarkerAlt, FaCheckCircle, FaShieldAlt, FaTrophy } from 'react-icons/fa'
import Button from '../ui/Button'
import Image from "next/image";
const FeaturedNGOs = () => {
    const [ngos, setNgos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            // Mock data - will be replaced with contract data
            const mockNGOs = [
                {
                    id: 1,
                    name: "Edhi Foundation",
                    description: "Pakistan's largest social welfare organization providing healthcare, education, and emergency relief",
                    logo: "/ngo-images/edhi.png",
                    verified: true,
                    totalDonations: 1250000,
                    donorCount: 15420,
                    impact: "45+ million people helped",
                    category: "Healthcare & Social Welfare",
                    coverColor: "from-blue-600 to-blue-700",
                    trustScore: 98
                },
                {
                    id: 2,
                    name: "Shaukat Khanum Memorial Hospital",
                    description: "Leading cancer treatment and research hospital offering free care to those in need",
                    logo: "/ngo-images/shaukat-khanum.png",
                    verified: true,
                    totalDonations: 850000,
                    donorCount: 8340,
                    impact: "70% patients treated free",
                    category: "Healthcare",
                    coverColor: "from-green-600 to-emerald-600",
                    trustScore: 99
                },
                {
                    id: 3,
                    name: "The Citizens Foundation (TCF)",
                    description: "Providing quality education to underprivileged children across Pakistan",
                    logo: "/ngo-images/tcf.png",
                    verified: true,
                    totalDonations: 350000,
                    donorCount: 5780,
                    impact: "300,000+ students educated",
                    category: "Education",
                    coverColor: "from-purple-600 to-pink-600",
                    trustScore: 97
                }
            ]
            setNgos(mockNGOs)
            setIsLoading(false)
        }, 800)
    }, [])
    // Skeleton Loader Component
    const SkeletonCard = () => (
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
    )
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
                    <Link href="/ngos">
                        <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                            Browse All NGOs →
                        </Button>
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
                        ngos.map((ngo) => (
                            <div
                                key={ngo.id}
                                className="card group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden bg-white border border-gray-100 rounded-2xl relative"
                            >
                                {/* Card Cover - Dynamic Gradient */}
                                <div className={`h-36 bg-gradient-to-r ${ngo.coverColor} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                                    {/* Animated Pattern */}
                                    <div
                                        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                            backgroundSize: '20px 20px',
                                            animation: 'slide 20s linear infinite'
                                        }}
                                    />
                                    {/* Trust Score Badge - NEW */}
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                        <FaTrophy className="text-yellow-500 text-sm" />
                                        <span className="text-xs font-bold text-gray-900">{ngo.trustScore}% Trust Score</span>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 relative">
                                    {/* NGO Logo - Floating */}
                                    <div className="-mt-14 mb-4 relative z-10 w-28 h-28 bg-white rounded-2xl shadow-xl p-3 flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 mx-auto border-4 border-white">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={ngo.logo}
                                                alt={ngo.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    {/* Verification Badge - IMPROVED */}
                                    {ngo.verified && (
                                        <div className="absolute top-2 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse-slow">
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
                                    {/* Stats Section - IMPROVED */}
                                    <div className="space-y-3 mb-6 bg-gradient-to-br from-gray-50 to-green-50/30 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaUsers className="text-green-600" />
                                                <span className="font-medium">Impact</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{ngo.impact}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaHeart className="text-red-500" />
                                                <span className="font-medium">Donors</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{ngo.donorCount.toLocaleString()}+</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaMapMarkerAlt className="text-blue-600" />
                                                <span className="font-medium">Category</span>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full">
                                                {ngo.category}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Total Raised - HIGHLIGHTED */}
                                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl mb-4 text-center shadow-lg">
                                        <div className="text-xs opacity-90 mb-1 uppercase tracking-wide font-semibold">Total Raised</div>
                                        <div className="text-3xl font-bold">
                                            ${(ngo.totalDonations / 1000).toFixed(0)}K+
                                        </div>
                                        <div className="text-xs opacity-80 mt-1">Blockchain Verified</div>
                                    </div>
                                    {/* Action Buttons - IMPROVED */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/ngos/${ngo.id}`} className="w-full">
                                            <Button
                                                variant="outline"
                                                className="w-full text-sm py-3 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                        <Link href={`/donate?ngo=${ngo.id}`} className="w-full">
                                            <Button className="w-full text-sm py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl shadow-green-200 transition-all transform hover:scale-105">
                                                <FaHeart className="inline mr-1" />
                                                Donate Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-green-500/20" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Bottom CTA - NEW */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your NGO not listed?</h3>
                        <p className="text-gray-600 mb-4">Get verified on blockchain and join our trusted network</p>
                        <Link href="/register-ngo">
                            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                Register Your NGO
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <style jsx>{`
        @keyframes slide {
          from { transform: translateX(0) translateY(0); }
          to { transform: translateX(20px) translateY(20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
        </section>
    )
}
export default FeaturedNGOs
