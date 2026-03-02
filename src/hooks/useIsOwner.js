'use client'

import useWeb3 from './useWeb3'
import { getContractAddress } from '../utils/web3Config'
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json'
import { useContractRead } from 'wagmi'

export const useIsOwner = () => {
  const { address, isConnected, chainId } = useWeb3()
  const contractAddress = getContractAddress(chainId)

  const { data: owner, isLoading } = useContractRead({
    address: contractAddress,
    abi: DonationPlatformABI,
    functionName: 'owner',
    enabled: Boolean(contractAddress && isConnected),
    watch: true,
  })

  const isOwner = isConnected && owner && address && owner.toLowerCase() === address.toLowerCase()

  return { isOwner, owner, isLoading }
}

export default useIsOwner
