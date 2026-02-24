'use client'
import { FaDonate, FaHandHoldingHeart, FaUsers, FaGlobe } from 'react-icons/fa'
import { useNGOData } from '../../hooks/useNGOData'
const Stats = () => {
  const { stats, loading } = useNGOData()
  const statItems = [
    {
      label: "Total Transactions",
      value: Number(stats.totalDonations).toFixed(2),
      suffix: " MATIC",
      icon: FaDonate,
      color: "text-blue-600",
      bg: "bg-blue-50"
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
      value: (stats.uniqueDonors * 12).toLocaleString(), // Estimated impact factor
      suffix: "+",
      icon: FaHandHoldingHeart,
      color: "text-red-600",
      bg: "bg-red-50"
    }
  ]
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-100 hover:border-green-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className={`text-xl ${item.color}`} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {item.label}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    {loading ? "..." : item.value}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    {item.suffix}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Stats 