'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaHandHoldingHeart, FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'
import logo from '../../../public/images/logo.png'
import useWeb3 from '../../hooks/useWeb3'
import { useContractRead } from 'wagmi'
import DonationPlatformABI from '../../contracts/DonationPlatform.json'
import { getContractAddress } from '../../utils/web3Config'

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
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src={logo} width={40} height={40} alt="GiveHope Logo" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">GiveHope</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering global philanthropy through transparent blockchain technology.
              Direct impact, verifiable results, giving hope to those who need it most.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-green-600 shadow-sm transition-colors border border-gray-100">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-green-600 shadow-sm transition-colors border border-gray-100">
                <FaDiscord size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-green-600 shadow-sm transition-colors border border-gray-100">
                <FaGithub size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-gray-900 mb-6">Discovery</h4>
            <ul className="space-y-4">
              <li><Link href="/ngos" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Find NGOs</Link></li>
              <li><Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Success Stories</Link></li>
              <li><Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Impact Reports</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-gray-900 mb-6">Protocol</h4>
            <ul className="space-y-4">
              <li><Link href="/ngo/dashboard" className="text-gray-500 hover:text-green-600 text-sm transition-colors">NGO Dashboard</Link></li>
              {isOwner && (
                <li><Link href="/admin/dashboard" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Admin Panel</Link></li>
              )}
              <li><a href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Smart Contract</a></li>
            </ul>
          </div>

          {/* Newsletter / Meta */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-gray-900 mb-6">Stay Updated</h4>
            <p className="text-gray-500 text-sm mb-4">Join our community and help us grow the impact.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2026 GiveHope Protocol. Built on Polygon.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest font-bold">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs uppercase tracking-widest font-bold">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
