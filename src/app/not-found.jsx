'use client'

import { FaMapMarkerAlt } from 'react-icons/fa'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <FaMapMarkerAlt className="text-7xl text-amber-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        
        <Button>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  )
}
