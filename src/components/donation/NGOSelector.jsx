'use client'

import { useState, useEffect } from 'react'
import { FaCheck, FaHospital, FaSchool, FaHandsHelping } from 'react-icons/fa'

const NGOSelector = ({ selectedNGO, onSelect }) => {
  const [ngos, setNgos] = useState([])

  useEffect(() => {
    // Mock data - will be replaced with contract data
    const mockNGOs = [
      {
        id: 1,
        name: "Edhi Foundation",
        description: "Healthcare & Social Welfare",
        icon: <FaHospital className="text-green-600" />,
        color: "bg-green-100",
        verified: true
      },
      {
        id: 2,
        name: "Shaukat Khanum Memorial Hospital",
        description: "Cancer Treatment & Research",
        icon: <FaHospital className="text-pink-600" />,
        color: "bg-pink-100",
        verified: true
      },
      {
        id: 3,
        name: "The Citizens Foundation (TCF)",
        description: "Education for Underprivileged",
        icon: <FaSchool className="text-blue-600" />,
        color: "bg-blue-100",
        verified: true
      },
      {
        id: 4,
        name: "General Donation Pool",
        description: "Distributed among all NGOs",
        icon: <FaHandsHelping className="text-purple-600" />,
        color: "bg-purple-100",
        verified: true
      }
    ]
    
    setNgos(mockNGOs)
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ngos.map((ngo) => (
          <button
            key={ngo.id}
            onClick={() => onSelect(ngo)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300
              ${selectedNGO?.id === ngo.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }
            `}
          >
            {selectedNGO?.id === ngo.id && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <FaCheck className="text-white text-sm" />
                </div>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 ${ngo.color} rounded-xl flex items-center justify-center`}>
                {ngo.icon}
              </div>
              
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{ngo.name}</h3>
                <p className="text-sm text-gray-600">{ngo.description}</p>
                
                {ngo.verified && (
                  <div className="inline-flex items-center mt-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <FaCheck className="mr-1" size={10} />
                    Verified
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {selectedNGO && (
        <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-primary font-medium">
            Selected: <span className="font-bold">{selectedNGO.name}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default NGOSelector