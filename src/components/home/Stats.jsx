'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CountUp from '../ui/CountUp'

const Stats = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeNGOs: 0,
    uniqueDonors: 0,
    impactScore: 0
  })

  const { isConnected } = useSelector((state) => state.web3)

  useEffect(() => {
    const fetchStats = async () => {
      setStats({
        totalDonations: 2450000,
        activeNGOs: 3,
        uniqueDonors: 12500,
        impactScore: 98
      })
    }
    
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [isConnected])

  const statItems = [
    { label: "Total Donations", value: stats.totalDonations, prefix: "$", suffix: "+", color: "text-green-600" },
    { label: "Active NGOs", value: stats.activeNGOs, suffix: "+", color: "text-blue-600" },
    { label: "Unique Donors", value: stats.uniqueDonors, suffix: "+", color: "text-orange-600" },
    { label: "Impact Score", value: stats.impactScore, suffix: "%", color: "text-purple-600" }
  ]

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 py-12 rounded-3xl mx-4 md:mx-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="text-center fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  prefix={stat.prefix || ""}
                  suffix={stat.suffix || ""}
                  separator=","
                />
              </div>
              <p className="text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stats