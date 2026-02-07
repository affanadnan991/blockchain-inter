import { FaDonate, FaMoneyBillWave, FaHeart, FaTrophy } from 'react-icons/fa'

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Donated",
      value: `$${stats.totalDonated.toFixed(2)}`,
      icon: <FaDonate className="text-2xl" />,
      color: "bg-green-100 text-green-600",
      trend: "+12% from last month"
    },
    {
      title: "Donation Count",
      value: stats.donationCount,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: "bg-blue-100 text-blue-600",
      trend: "8 donations"
    },
    {
      title: "Favorite NGO",
      value: stats.favoriteNGO,
      icon: <FaHeart className="text-2xl" />,
      color: "bg-pink-100 text-pink-600",
      trend: "Most supported"
    },
    {
      title: "Impact Rank",
      value: "#124",
      icon: <FaTrophy className="text-2xl" />,
      color: "bg-yellow-100 text-yellow-600",
      trend: "Top 15% globally"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="card hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.trend}</p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards