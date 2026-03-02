'use client'

import { useEffect } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import Button from '@/components/ui/Button'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-2">{error?.message || 'An unexpected error occurred'}</p>
        <p className="text-sm text-gray-500 mb-6">Please try again or contact support if the problem persists.</p>
        
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="secondary">
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
