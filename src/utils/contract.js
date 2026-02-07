import { ethers } from 'ethers'
import DonationPlatformABI from '@/contracts/DonationPlatform.json'
import ERC20ABI from '@/contracts/ERC20.json'

export const DONATION_PLATFORM_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

// Token addresses (Mumbai testnet)
export const TOKEN_ADDRESSES = {
  'MATIC': '0x0000000000000000000000000000000000000000', // Native token
  'USDT': '0x3813e82e6f7098b9583FC0F33a962D02018B6803',
  'USDC': '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97',
  'DAI': '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'
}

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}

export const getContract = (address, abi, signer = null) => {
  const provider = getProvider()
  if (!provider) return null
  
  const contractSigner = signer || provider.getSigner()
  return new ethers.Contract(address, abi, contractSigner)
}

export const getDonationContract = (signer = null) => {
  return getContract(DONATION_PLATFORM_ADDRESS, DonationPlatformABI, signer)
}

export const getERC20Contract = (tokenAddress, signer = null) => {
  return getContract(tokenAddress, ERC20ABI, signer)
}

// Token approval function
export const approveToken = async (tokenAddress, amount, spenderAddress) => {
  try {
    const signer = await getProvider().getSigner()
    const tokenContract = getERC20Contract(tokenAddress, signer)
    
    const tx = await tokenContract.approve(
      spenderAddress,
      ethers.parseUnits(amount.toString(), 6) // USDT/USDC have 6 decimals
    )
    
    await tx.wait()
    return { success: true, hash: tx.hash }
  } catch (error) {
    console.error('Token approval failed:', error)
    return { success: false, error: error.message }
  }
}

// Get token balance
export const getTokenBalance = async (tokenAddress, userAddress) => {
  try {
    const provider = getProvider()
    if (!provider) return '0'
    
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      // Native MATIC balance
      const balance = await provider.getBalance(userAddress)
      return ethers.formatEther(balance)
    }
    
    const tokenContract = getERC20Contract(tokenAddress)
    const balance = await tokenContract.balanceOf(userAddress)
    const decimals = await tokenContract.decimals()
    
    return ethers.formatUnits(balance, decimals)
  } catch (error) {
    console.error('Balance fetch failed:', error)
    return '0'
  }
}