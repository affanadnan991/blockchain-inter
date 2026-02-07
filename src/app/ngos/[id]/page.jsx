'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaGlobe, 
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaHandHoldingHeart,
  FaCheckCircle,
  FaShareAlt,
  FaHeart
} from 'react-icons/fa'
import { useDonation } from '@/hooks/useDonation'
import Button from '@/components/ui/Button'
import NGODetails from '@/components/ngo/NGODetails'
import NGOStats from '@/components/ngo/NGOStats'
import ImpactStories from '@/components/ngo/ImpactStories'

export default function NGODetailPage() {
  const params = useParams()
  const ngoId = params.id
  const [ngo, setNgo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchNGO()
  }, [ngoId])

  const fetchNGO = async () => {
    // Mock data - will be replaced with contract data
    const mockNGO = {
      id: ngoId,
      name: "Edhi Foundation",
      description: "Pakistan's largest and most organized social welfare organization.",
      fullDescription: "The Edhi Foundation is a non-profit social welfare organization in Pakistan, founded by Abdul Sattar Edhi in 1951. It runs the world's largest volunteer ambulance network, along with various homeless shelters, animal shelters, rehabilitation centers, and orphanages across Pakistan.",
      category: "Healthcare & Social Welfare",
      verified: true,
      totalDonations: 1250000,
      impact: "45+ million people helped",
      location: "Nationwide, Pakistan",
      rating: 4.9,
      logo: "/ngo-logos/edhi.png",
      website: "https://edhi.org",
      phone: "+92-21-111-111-111",
      founded: 1951,
      founder: "Abdul Sattar Edhi",
      services: [
        "Ambulance Services",
        "Orphanages",
        "Healthcare Clinics",
        "Homeless Shelters",
        "Animal Shelters",
        "Rehabilitation Centers"
      ],
      stats: {
        ambulances: 1800,
        orphanages: 17,
        healthcareCenters: 8,
        totalStaff: 7000,
        volunteers: 10000
      },
      recentDonations: [
        { amount: 5000, donor: "Anonymous", date: "2 hours ago" },
        { amount: 2500, donor: "John Doe", date: "5 hours ago" },
        { amount: 1000, donor: "Jane Smith", date: "1 day ago" }
      ]
    }

    setTimeout(() => {
      setNgo(mockNGO)
      setLoading(false)
    }, 1000)
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'impact', label: 'Impact' },
    { id: 'transparency', label: 'Transparency' },
    { id: 'donate', label: 'Donate Now' }
  ]

  if (loading) {
    return (
      <div className="section-spacing">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!ngo) {
    return (
      <div className="section-spacing">
        <div className="container-padded text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">NGO Not Found</h2>
          <p className="text-gray-600">The NGO you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <div className="container-padded">
        {/* NGO Header */}
        <div className="max-w-6xl mx-auto">
          <div className="card card-spacing-lg mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* NGO Logo & Basic Info */}
              <div className="md:w-1/3">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                  <FaHandHoldingHeart className="text-white text-4xl" />
                </div>
                
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">{ngo.name}</h1>
                    {ngo.verified && (
                      <FaCheckCircle className="text-green-500" title="Verified NGO" />
                    )}
                  </div>
                  
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary-dark mb-6">
                    {ngo.category}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-3 text-gray-400" />
                      <span>{ngo.location}</span>
                    </div>
                    {ngo.website && (
                      <div className="flex items-center text-gray-600">
                        <FaGlobe className="mr-3 text-gray-400" />
                        <a href={ngo.website} className="text-primary hover:underline">
                          Official Website
                        </a>
                      </div>
                    )}
                    {ngo.phone && (
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-3 text-gray-400" />
                        <span>{ngo.phone}</span>
                      </div>
                    )}
                    {ngo.founded && (
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-3 text-gray-400" />
                        <span>Founded: {ngo.founded}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* NGO Stats & CTA */}
              <div className="md:w-2/3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About {ngo.name}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {ngo.fullDescription}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      ${(ngo.totalDonations / 1000).toFixed(0)}K+
                    </div>
                    <div className="text-sm text-gray-600">Total Donated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">4.9</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">100%</div>
                    <div className="text-sm text-gray-600">Transparency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">45M+</div>
                    <div className="text-sm text-gray-600">Lives Impacted</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={`/donate?ngo=${ngo.id}`} className="flex-1">
                    <Button className="w-full py-4 text-lg">
                      <FaHeart className="mr-2" />
                      Donate Now
                    </Button>
                  </a>
                  <button className="btn btn-outline py-4 text-lg">
                    <FaShareAlt className="mr-2" />
                    Share NGO
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2
                    ${activeTab === tab.id 
                      ? 'text-primary border-primary' 
                      : 'text-gray-600 hover:text-gray-900 border-transparent'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && <NGODetails ngo={ngo} />}
            {activeTab === 'impact' && <ImpactStories ngo={ngo} />}
            {activeTab === 'transparency' && <NGOStats ngo={ngo} />}
            {activeTab === 'donate' && (
              <div className="card card-spacing">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h3>
                  <p className="text-gray-600 mb-8">
                    Your donation will directly support {ngo.name}'s mission.
                  </p>
                  <a href={`/donate?ngo=${ngo.id}`}>
                    <Button className="px-12 py-4 text-lg">
                      <FaHeart className="mr-2" />
                      Donate to {ngo.name}
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}