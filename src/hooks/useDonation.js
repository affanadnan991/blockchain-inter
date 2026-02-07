import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  getDonationContract, 
  getTokenBalance, 
  TOKEN_ADDRESSES,
  approveToken,
  getProvider
} from '@/utils/contract'
import { ethers } from 'ethers'

export const useDonation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useSelector((state) => state.web3)
  const [balances, setBalances] = useState({})
  
  // Fetch token balances
  useEffect(() => {
    if (isConnected && address) {
      fetchBalances()
    }
  }, [isConnected, address])
  
  const fetchBalances = async () => {
    const newBalances = {}
    
    for (const [token, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
      const balance = await getTokenBalance(tokenAddress, address)
      newBalances[token] = parseFloat(balance).toFixed(4)
    }
    
    setBalances(newBalances)
  }
  
  const donateNative = async (amount, message = '') => {
    try {
      setLoading(true)
      setError(null)
      
      const contract = getDonationContract()
      if (!contract) throw new Error('Contract not initialized')
      
      const tx = await contract.donateNative(
        ethers.keccak256(ethers.toUtf8Bytes(message)),
        {
          value: ethers.parseEther(amount.toString())
        }
      )
      
      await tx.wait()
      await fetchBalances() // Refresh balances
      
      return { success: true, hash: tx.hash }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }
  
  const donateToken = async (token, amount, ngoAddress, message = '') => {
    try {
      setLoading(true)
      setError(null)
      
      const tokenAddress = TOKEN_ADDRESSES[token]
      if (!tokenAddress) throw new Error('Invalid token')
      
      // Approve tokens first
      const approval = await approveToken(
        tokenAddress,
        amount,
        DONATION_PLATFORM_ADDRESS
      )
      
      if (!approval.success) throw new Error('Token approval failed')
      
      // Execute donation
      const contract = getDonationContract()
      const tx = await contract.donateToken(
        tokenAddress,
        ethers.parseUnits(amount.toString(), 6), // For stablecoins
        ngoAddress || ethers.ZeroAddress,
        ethers.keccak256(ethers.toUtf8Bytes(message))
      )
      
      await tx.wait()
      await fetchBalances()
      
      return { success: true, hash: tx.hash }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }
  
  const getNGODetails = async (ngoAddress) => {
    try {
      const contract = getDonationContract()
      const details = await contract.getNGOInfo(ngoAddress)
      
      return {
        ngoAddress: details[0],
        totalWithdrawn: parseInt(details[1]),
        lastWithdrawal: parseInt(details[2]),
        withdrawalCount: parseInt(details[3]),
        pendingRequests: parseInt(details[4]),
        isActive: details[5],
        withdrawalsPaused: details[6],
        minApprovals: parseInt(details[7]),
        approversCount: parseInt(details[8])
      }
    } catch (err) {
      console.error('Failed to fetch NGO details:', err)
      return null
    }
  }
  
  const getAllNGOs = async () => {
    try {
      const contract = getDonationContract()
      // This will depend on your contract's view functions
      // For now, return mock data
      return []
    } catch (err) {
      console.error('Failed to fetch NGOs:', err)
      return []
    }
  }
  
  return {
    loading,
    error,
    balances,
    donateNative,
    donateToken,
    getNGODetails,
    getAllNGOs,
    fetchBalances
  }
}