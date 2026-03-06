'use client'

import React from 'react'
import Link from 'next/link'
import useWeb3 from '../../hooks/useWeb3'
import { useContractRead } from 'wagmi'
import DonationPlatformABI from '../../contracts/abis/DonationPlatform.json'
import { getContractAddress } from '../../utils/web3Config'
import FooterBrand from './FooterBrand'
import FooterDiscovery from './FooterDiscovery'
import FooterProtocol from './FooterProtocol'
import FooterNewsletter from './FooterNewsletter'

export default function Footer() {
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
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <FooterBrand />
          <FooterDiscovery />
          <FooterProtocol />
          <FooterNewsletter />
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2026 GiveHope Protocol. Built on Polygon.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest font-bold">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest font-bold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
