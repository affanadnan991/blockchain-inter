import DonateForm from '../../components/donate/DonateForm'

// Mock NGO data - Replace with actual data from contract
const mockNGOs = [
  {
    id: '1',
    name: 'Clean Water Initiative',
    description: 'Providing clean water to communities in need',
    category: 'Water & Sanitation',
    logo: '/images/ngos/clean-water.jpg',
    address: '0x1234567890123456789012345678901234567890',
    trustScore: 98,
    donorCount: 1250,
  },
  {
    id: '2',
    name: 'Education for All',
    description: 'Building schools and providing education resources',
    category: 'Education',
    logo: '/images/ngos/education.jpg',
    address: '0x2345678901234567890123456789012345678901',
    trustScore: 95,
    donorCount: 850,
  },
  {
    id: '3',
    name: 'Medical Relief Foundation',
    description: 'Emergency medical care and support',
    category: 'Healthcare',
    logo: '/images/ngos/medical.jpg',
    address: '0x3456789012345678901234567890123456789012',
    trustScore: 97,
    donorCount: 2100,
  },
]

export default function DonatePage() {
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
        <DonateForm ngos={mockNGOs} platformFeePercent={2} />

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
