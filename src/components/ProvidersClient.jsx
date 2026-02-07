'use client'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

export default function ProvidersClient({ children }) {
  return (
    <Provider store={store}>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          dappMetadata: {
            name: 'ZakatChain',
            url: typeof window !== 'undefined' ? window.location.href : '',
          },
        }}
      >
        {children}
      </MetaMaskProvider>
    </Provider>
  )
}