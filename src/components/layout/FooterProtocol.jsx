'use client'

import React from 'react'
import Link from 'next/link'
import useWeb3 from '../../hooks/useWeb3'
import { useContractRead } from 'wagmi'
import DonationPlatformABI from '../../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../../utils/web3Config'

export default function FooterProtocol() {
  const { address, isConnected, chainId } = useWeb3()
  const contractAddress = getContractAddress(chainId)
  const { data: owner } = useContractRead({
    address: contractAddress,
    abi: DonationPlatformABI,
    functionName: 'owner',
    enabled: Boolean(contractAddress),
  })

  const isOwner = isConnected && owner && address && owner.toLowerCase() === address.toLowerCase()

  return (
    <div className="lg:col-span-1">
      <h4 className="font-bold text-gray-900 mb-6">Protocol</h4>
      <ul className="space-y-4">
        <li><Link href="/ngo/dashboard" className="text-gray-500 hover:text-green-600 text-sm transition-colors">NGO Dashboard</Link></li>
        {isOwner && (
          <li><Link href="/admin/dashboard" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Admin Panel</Link></li>
        )}
        <li><Link href="/smart-contract" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Smart Contract</Link></li>
      </ul>
    </div>
  )
}
