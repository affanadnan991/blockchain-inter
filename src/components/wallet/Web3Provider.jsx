'use client'

import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { wagmiConfig, supportedChains } from '../../utils/web3Config'
import '@rainbow-me/rainbowkit/styles.css'

/**
 * Web3 Provider Component
 * Wraps the app with wagmi and RainbowKit providers
 */
export default function Web3Provider({ children }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={supportedChains}
                theme={darkTheme({
                    accentColor: '#10B981',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                })}
                modalSize="compact"
            >
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
