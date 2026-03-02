'use client'

import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

export function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  const spinner = (
    <FaSpinner className={`${sizeClasses[size]} animate-spin text-blue-500`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function LoadingOverlay({ visible = true }) {
  if (!visible) return null
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg z-40">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  const start = () => setIsLoading(true)
  const stop = () => setIsLoading(false)
  const toggle = () => setIsLoading(!isLoading)

  return { isLoading, start, stop, toggle }
}

export default LoadingSpinner
