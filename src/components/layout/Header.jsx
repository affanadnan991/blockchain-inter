'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { FaHandHoldingHeart, FaBars, FaXmark } from 'react-icons/fa'
import ConnectWallet from '../web3/ConnectWallet'
import logo from '../../../public/images/logo.png'
import Image from "next/image";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isConnected } = useSelector((state) => state.web3)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Donate', href: '/donate' },
    { name: 'NGOs', href: '/ngos' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'How It Works', href: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
             <Image src={logo} alt='Donation Platform' />
            </div>
            <div>
              <div className="font-heading text-xl font-bold text-gray-900 leading-tight">
                GiveHope
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                Transparent Giving
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ConnectWallet />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header