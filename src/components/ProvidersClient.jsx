'use client'

import React from 'react'
import Web3Provider from './wallet/Web3Provider'
import { Toaster } from 'react-hot-toast'

/**
 * ProvidersClient
 * Client-side component to wrap the application with all necessary providers.
 */
export default function ProvidersClient({ children }) {
  return (
    <Web3Provider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'font-sans',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
    </Web3Provider>
  )
}
