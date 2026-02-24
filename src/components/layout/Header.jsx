'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FaHandHoldingHeart, FaBars, FaTimes } from 'react-icons/fa'
import logo from '../../../public/images/logo.png'
import WalletConnect from '../wallet/WalletConnect'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Discover NGOs', href: '/ngos' },
    { name: 'Donate', href: '/donate' },
    { name: 'NGO Portal', href: '/ngo' },
  ]

  const isActive = (path) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image src={logo} width={40} height={40} alt="GiveHope Logo" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">GiveHope</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors ${isActive(link.href) ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <WalletConnect />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block text-lg font-bold ${isActive(link.href) ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-50">
            <WalletConnect />
          </div>
        </div>
      )}
    </header>
  )
}
