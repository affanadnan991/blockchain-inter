'use client'

import { useState, useEffect } from 'react'
import { useSDK } from '@metamask/sdk-react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  connectWalletStart, 
  connectWalletSuccess, 
  connectWalletFailure,
  disconnectWallet 
} from '@/redux/slices/web3Slice'
import { FaWallet, FaUser } from 'react-icons/fa'
import { formatAddress } from '@/utils/formatting'
import Button from '../ui/Button'

const ConnectWallet = () => {
  const { sdk, connected, account, chainId } = useSDK()
  const dispatch = useDispatch()
  const { isConnected, address, isLoading } = useSelector((state) => state.web3)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (connected && account) {
      handleConnectionSuccess(account, chainId)
    }
  }, [connected, account, chainId])

  const handleConnect = async () => {
    try {
      dispatch(connectWalletStart())
      
      if (!sdk) {
        throw new Error('MetaMask SDK not initialized')
      }

      const accounts = await sdk.connect()
      
      if (accounts && accounts.length > 0) {
        const account = accounts[0]
        // Get chain ID and network name
        const provider = sdk.getProvider()
        const chainId = await provider.request({ method: 'eth_chainId' })
        const networkName = getNetworkName(chainId)
        
        // Get balance
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        })
        
        const formattedBalance = parseFloat(balance) / 1e18
        
        dispatch(connectWalletSuccess({
          address: account,
          chainId,
          balance: formattedBalance.toFixed(4),
          networkName,
        }))
      }
    } catch (error) {
      console.error('Connection error:', error)
      dispatch(connectWalletFailure(error.message))
    }
  }

  const handleDisconnect = () => {
    if (sdk) {
      sdk.terminate()
    }
    dispatch(disconnectWallet())
    setShowDropdown(false)
  }

  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0x13881': 'Mumbai',
      '0xaa36a7': 'Sepolia',
    }
    return networks[chainId] || 'Unknown Network'
  }

  const handleConnectionSuccess = (account, chainId) => {
    const networkName = getNetworkName(chainId)
    dispatch(connectWalletSuccess({
      address: account,
      chainId,
      balance: '0.0000', // Will update with actual balance
      networkName,
    }))
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
        >
          <FaUser className="h-5 w-5" />
          <span className="font-medium leading-none">{formatAddress(address)}</span>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
            <div className="px-4 py-2 border-b">
              <p className="text-sm text-gray-600">Connected</p>
              <p className="font-medium text-sm truncate">{formatAddress(address)}</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      loading={isLoading}
      className="flex items-center space-x-2"
    >
      <FaWallet className="h-5 w-5" />
      <span className="leading-none">Connect Wallet</span>
    </Button>
  )
}

export default ConnectWallet