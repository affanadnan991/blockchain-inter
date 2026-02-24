'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaGears, FaBuildingShield, FaCoins, FaChartLine, FaShieldHalved } from 'react-icons/fa6'
import { useAccount } from 'wagmi'
import { useContractRead } from 'wagmi'
import DonationPlatformABI from '../../contracts/DonationPlatform.json'
import { getContractAddress } from '../../utils/web3Config'
import useWeb3 from '../../hooks/useWeb3'
import WalletConnect from '../wallet/WalletConnect'

const AdminLayout = ({ children }) => {
    const pathname = usePathname()
    const { address, isConnected, chainId } = useWeb3()

    const contractAddress = getContractAddress(chainId)

    const { data: owner } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'owner',
        enabled: Boolean(contractAddress),
        watch: true,
    })

    const isOwner = isConnected && owner && address && owner.toLowerCase() === address.toLowerCase()

    const navItems = [
        { name: 'Overview', href: '/admin/dashboard', icon: FaChartLine },
        { name: 'NGO Registry', href: '/admin/ngos', icon: FaBuildingShield },
        { name: 'Token Pool', href: '/admin/tokens', icon: FaCoins },
        { name: 'System Settings', href: '/admin/settings', icon: FaGears },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
                            <FaShieldHalved />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">ADMIN PANEL</span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300
                                        ${isActive
                                            ? 'bg-red-50 text-red-600 shadow-sm'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                        }
                                    `}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-gray-100">
                    <WalletConnect />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 lg:hidden">
                    <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaShieldHalved className="text-red-600" />
                            <span className="font-black text-gray-900">ADMIN</span>
                        </div>
                        <WalletConnect />
                    </div>
                </header>

                <div className="p-4 lg:p-12 flex-1">
                    {!isOwner ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-sm">
                                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mx-auto mb-6">
                                    <FaShieldHalved size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
                                <p className="text-gray-500 mb-4">Only the contract owner may access administrative controls.</p>
                                {!isConnected ? (
                                    <div className="mb-4">
                                        <p className="text-gray-500 mb-2">Please connect the wallet that owns the contract.</p>
                                        <WalletConnect />
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <p className="text-gray-500 mb-2">Connected wallet is not the contract owner.</p>
                                        <p className="text-sm text-gray-400">Owner: {owner ? owner : '—'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
