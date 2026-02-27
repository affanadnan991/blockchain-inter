'use client'

import { useState, useEffect } from 'react'
import DonateForm from '../../components/donate/DonateForm'
import { useRegisteredNGOs } from '../../hooks/useContractQuery'
import { useDonationContract } from '../../hooks/useDonationContract'

export default function DonatePage() {
  const { ngos, loading: ngosLoading } = useRegisteredNGOs()
  const { platformFeePercent } = useDonationContract()
  const [ngoOptions, setNgoOptions] = useState([])

  // Transform NGO data to component format
  useEffect(() => {
    if (ngos && ngos.length > 0) {
      const transformed = ngos.map((ngo) => ({
        id: ngo.address,
        name: ngo.name || `NGO ${ngo.address.substring(0, 10)}...`,
        description: ngo.description || 'Blockchain-verified organization',
        category: ngo.category || 'General Welfare',
        logo: ngo.logo || '/ngo-images/default.png',
        address: ngo.address,
        trustScore: ngo.trustScore || 90,
        isActive: ngo.isActive,
      }))

      // Add general pool option
      transformed.unshift({
        id: 'general-pool',
        name: 'General Pool',
        description: 'Donate to the general pool - funds will be allocated by administrators',
        category: 'General',
        logo: '/ngo-images/general-pool.png',
        address: '0x0000000000000000000000000000000000000000',
        trustScore: 100,
        isActive: true,
      })

      setNgoOptions(transformed)
    }
  }, [ngos])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Difference</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your donation is tracked on the blockchain - 100% transparent, 100% secure
          </p>
        </div>

        {/* Donation Form */}
        <DonateForm ngos={ngoOptions} platformFeePercent={platformFeePercent || 2} loading={ngosLoading} />

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <TrustBadge
            icon="🔒"
            title="Blockchain Secured"
            description="Every transaction verified on-chain"
          />
          <TrustBadge
            icon="👁️"
            title="100% Transparent"
            description="Track every penny in real-time"
          />
          <TrustBadge
            icon="✅"
            title="Verified NGOs"
            description="Only approved organizations"
          />
        </div>
      </div>
    </main>
  )
}

function TrustBadge({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
