import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { useEffect } from 'react'
import { defaultChain } from '../utils/web3Config'

/**
 * Custom hook for Web3 wallet connection and management
 */
export const useWeb3 = () => {
    const { address, isConnected, isConnecting, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { connect, connectors, error: connectError } = useConnect()
    const { disconnect } = useDisconnect()
    const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork()

    // Check if on correct network
    const isCorrectNetwork = chain?.id === defaultChain.id
    const isWrongNetwork = isConnected && !isCorrectNetwork

    // Auto-switch to correct network on connect
    useEffect(() => {
        if (isWrongNetwork && switchNetwork) {
            switchNetwork(defaultChain.id)
        }
    }, [isWrongNetwork, switchNetwork])

    /**
     * Connect to MetaMask
     */
    const connectMetaMask = () => {
        const metaMaskConnector = connectors.find((c) => c.id === 'injected')
        if (metaMaskConnector) {
            connect({ connector: metaMaskConnector })
        }
    }

    /**
     * Connect to WalletConnect
     */
    const connectWalletConnect = () => {
        const wcConnector = connectors.find((c) => c.id === 'walletConnect')
        if (wcConnector) {
            connect({ connector: wcConnector })
        }
    }

    /**
     * Switch to correct network
     */
    const switchToCorrectNetwork = () => {
        if (switchNetwork) {
            switchNetwork(defaultChain.id)
        }
    }

    return {
        // Connection state
        address,
        isConnected,
        isConnecting,
        isDisconnected,

        // Network state
        chain,
        chainId: chain?.id,
        isCorrectNetwork,
        isWrongNetwork,
        isSwitching,

        // Actions
        connectMetaMask,
        connectWalletConnect,
        disconnect,
        switchToCorrectNetwork,

        // Errors
        connectError,

        // Connectors
        connectors,
    }
}

export default useWeb3
