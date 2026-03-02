import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { useEffect } from 'react'
import { defaultChain, supportedChains, CONTRACT_ADDRESSES } from '../utils/web3Config'

/**
 * Custom hook for Web3 wallet connection and management
 */
export const useWeb3 = () => {
    const { address, isConnected, isConnecting, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { connect, connectors, error: connectError } = useConnect()
    const { disconnect } = useDisconnect()
    const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork()

    // Allowed chains (ids) are derived from wagmi configuration
    // only include chains where a contract address is provided
    const allowedChainIds = supportedChains
        .filter(c => CONTRACT_ADDRESSES[c.id])
        .map(c => c.id)
    // Check if on one of the approved networks
    const isCorrectNetwork = chain?.id ? allowedChainIds.includes(chain.id) : false
    const isWrongNetwork = isConnected && !isCorrectNetwork

    // Auto‑switch to default chain only if we're connected to an unsupported network
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
