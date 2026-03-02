'use client'
import { FaDonate, FaHandHoldingHeart, FaUsers, FaGlobe, FaShieldAlt, FaCoins } from 'react-icons/fa'
import { useNGOData } from '../../hooks/useNGOData'
import { PLATFORM_FEE_PERCENT, TRANSPARENCY_INFO } from '../../utils/web3Config'
import CountUp from '../ui/CountUp'

const Stats = () => {
  const { stats, loading } = useNGOData()

  const statItems = [
    {
      label: "Total Donations",
      value: Number(stats.totalDonations).toFixed(2),
      suffix: " MATIC",
      icon: FaDonate,
      color: "text-blue-600",
      bg: "bg-blue-50",
      highlight: true
    },
    {
      label: "Active NGOs",
      value: stats.activeNGOs,
      suffix: "",
      icon: FaGlobe,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Total Donors",
      value: stats.uniqueDonors,
      suffix: "",
      icon: FaUsers,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      label: "Lives Impacted",
      value: (stats.uniqueDonors * 12).toLocaleString(),
      suffix: "+",
      icon: FaHandHoldingHeart,
      color: "text-red-600",
      bg: "bg-red-50"
    }
  ]

  // Calculate NGO allocation from donations
  const totalInUSD = Number(stats.totalDonations) * 1.5 // Approximate conversion to USD
  const platformFeeUSD = (totalInUSD * PLATFORM_FEE_PERCENT) / 100
  const ngoAllocationUSD = totalInUSD - platformFeeUSD

  return (
    <section className="py-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 group ${
              item.highlight 
                ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-xl' 
                : 'border-gray-100 hover:border-green-100 hover:shadow-xl'
            }`}
          >
            <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon className={`text-xl ${item.color}`} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">
                {item.label}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-4xl font-bold text-gray-900">
                  {loading ? "..." : item.value}
                </span>
                <span className="text-xs md:text-sm font-semibold text-gray-500">
                  {item.suffix}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transparency & Fee Breakdown Section */}
      <div className="mt-16 pt-12 border-t-2 border-gray-200">
        <div className="mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaShieldAlt className="text-green-600" />
            100% Blockchain Transparent
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Every transaction is verified and immutable on the Polygon blockchain. Track donations in real-time with complete fee transparency.
          </p>
        </div>

        {/* Transparency Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TRANSPARENCY_INFO.features.map((feature, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-green-200 transition-all">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Fee Breakdown */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-6">
            <FaCoins className="text-blue-600 text-2xl" />
            <h4 className="text-xl md:text-2xl font-bold text-gray-900">Fee Breakdown</h4>
          </div>

          <div className="space-y-4">
            {/* Donation Amount */}
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <span className="text-gray-700 font-semibold">Total Donations</span>
              <span className="text-lg font-bold text-gray-900">${totalInUSD.toFixed(2)}</span>
            </div>

            {/* Platform Fee */}
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <span className="text-gray-700 font-semibold">GiveHope Fee</span>
                <p className="text-xs text-gray-500 mt-1">Used for platform maintenance & development</p>
              </div>
              <span className="text-lg font-bold text-red-600">${platformFeeUSD.toFixed(2)} ({PLATFORM_FEE_PERCENT}%)</span>
            </div>

            {/* NGO Allocation */}
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <div>
                <span className="text-gray-700 font-bold text-lg">Delivered to NGOs</span>
                <p className="text-xs text-gray-500 mt-1">Direct impact on ground level</p>
              </div>
              <span className="text-2xl font-bold text-green-600">${ngoAllocationUSD.toFixed(2)}</span>
            </div>

            {/* Percentage Visual */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Distribution</span>
                <span className="text-gray-500">100%</span>
              </div>
              <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-red-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                  style={{ width: `${PLATFORM_FEE_PERCENT}%` }}
                >
                  {PLATFORM_FEE_PERCENT}%
                </div>
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                  style={{ width: `${100 - PLATFORM_FEE_PERCENT}%` }}
                >
                  {100 - PLATFORM_FEE_PERCENT}%
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Platform</span>
                <span>NGOs & Beneficiaries</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
            💡 <strong>Full Transparency:</strong> All transactions are viewable on Polygon PolygonScan. We believe in complete accountability in charitable giving.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Stats
