'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaHeart, FaUsers, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'
import Button from '../ui/Button'

const FeaturedNGOs = () => {
  const [ngos, setNgos] = useState([])

  useEffect(() => {
    // Mock data - will be replaced with contract data
    const mockNGOs = [
      {
        id: 1,
        name: "Edhi Foundation",
        description: "Pakistan's largest social welfare organization",
        logo: "/ngo-logos/edhi.png",
        verified: true,
        totalDonations: 1250000,
        impact: "45+ million people helped",
        category: "Healthcare & Social Welfare"
      },
      {
        id: 2,
        name: "Shaukat Khanum Memorial Hospital",
        description: "Cancer treatment and research hospital",
        logo: "/ngo-logos/shoukat-khanum.png",
        verified: true,
        totalDonations: 850000,
        impact: "70% patients treated free",
        category: "Healthcare"
      },
      {
        id: 3,
        name: "The Citizens Foundation (TCF)",
        description: "Education for underprivileged children",
        logo: "/ngo-logos/tcf.png",
        verified: true,
        totalDonations: 350000,
        impact: "300,000+ students educated",
        category: "Education"
      }
    ]
    
    setNgos(mockNGOs)
  }, [])

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-green-600">NGOs</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Verified organizations making real impact
          </p>
        </div>
        <Link href="/ngos">
          <Button variant="outline">
            View All NGOs
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {ngos.map((ngo) => (
          <div key={ngo.id} className="card hover:shadow-xl transition-shadow group">
            <div className="relative">
              {/* NGO Logo */}
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl shadow-lg p-4 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-700">
                    {ngo.name.substring(0, 2)}
                  </span>
                </div>
              </div>
              
              {/* Verification Badge */}
              {ngo.verified && (
                <div className="absolute top-0 right-0 flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  <FaCheckCircle className="mr-1" />
                  Verified
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {ngo.name}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {ngo.description}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-3 text-gray-400" />
                <span>{ngo.impact}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-3 text-gray-400" />
                <span>{ngo.category}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Total Donations</span>
                <span className="text-xl font-bold text-green-600">
                  ${(ngo.totalDonations / 1000).toFixed(0)}K+
                </span>
              </div>
              
              <div className="flex gap-3">
                <Link href={`/ngos/${ngo.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Link href={`/donate?ngo=${ngo.id}`} className="flex-1">
                  <Button className="w-full">
                    <FaHeart className="mr-2" />
                    Donate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedNGOs