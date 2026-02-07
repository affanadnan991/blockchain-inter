'use client'

import { FaEthereum, FaDollarSign } from 'react-icons/fa'

const TokenSelector = ({ selectedToken, onSelect }) => {
  const tokens = [
    {
      symbol: 'MATIC',
      name: 'Polygon (MATIC)',
      icon: <FaEthereum className="text-purple-600" />,
      color: 'bg-purple-100',
      minDonation: '1 MATIC',
      recommended: true
    },
    {
      symbol: 'USDT',
      name: 'Tether (USDT)',
      icon: <FaDollarSign className="text-green-600" />,
      color: 'bg-green-100',
      minDonation: '1 USDT'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin (USDC)',
      icon: <FaDollarSign className="text-blue-600" />,
      color: 'bg-blue-100',
      minDonation: '1 USDC'
    },
    {
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      icon: <FaDollarSign className="text-yellow-600" />,
      color: 'bg-yellow-100',
      minDonation: '1 DAI'
    }
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Token</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => onSelect(token.symbol)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${selectedToken === token.symbol 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 ${token.color} rounded-full flex items-center justify-center mb-3`}>
                {token.icon}
              </div>
              
              <div className="font-bold text-gray-900 mb-1">
                {token.symbol}
              </div>
              
              <div className="text-sm text-gray-600">
                {token.name}
              </div>
              
              {token.recommended && (
                <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Recommended
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TokenSelector