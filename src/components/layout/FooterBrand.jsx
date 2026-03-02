'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'
import logo from '../../../public/images/logo.png'

export default function FooterBrand() {
  return (
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
  )
}