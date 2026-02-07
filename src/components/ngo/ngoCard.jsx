import Link from 'next/link'
import { FaHeart, FaMapMarkerAlt, FaStar, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa'
import Button from '../ui/Button'

const NGOCard = ({ ngo }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Healthcare': 'bg-red-100 text-red-700',
      'Education': 'bg-blue-100 text-blue-700',
      'Economic Empowerment': 'bg-green-100 text-green-700',
      'Social Welfare': 'bg-purple-100 text-purple-700',
      'Emergency Relief': 'bg-orange-100 text-orange-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="card card-spacing hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* NGO Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{ngo.name}</h3>
            {ngo.verified && (
              <FaCheckCircle className="text-green-500" title="Verified NGO" />
            )}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(ngo.category)}`}>
            {ngo.category}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            ${(ngo.totalDonations / 1000).toFixed(0)}K+
          </div>
          <div className="text-sm text-gray-500">Total Donated</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
        {ngo.description}
      </p>

      {/* Impact Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-3 text-gray-400 flex-shrink-0" />
          <span className="truncate">{ngo.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaHeart className="mr-3 text-gray-400 flex-shrink-0" />
          <span>{ngo.impact}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaStar className="mr-3 text-gray-400 flex-shrink-0" />
          <span>Rating: {ngo.rating}/5</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-6 border-t border-gray-100">
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
  )
}

export default NGOCard