

import React, { useEffect, useState } from 'react';
import { FaChartPie, FaHistory, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { FiLayout } from "react-icons/fi";
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { shortenAddress } from '../../utils/formatters';

export default function DashboardLayout({ children, activeTab = 'overview' }) {
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <FiLayout />, href: '/ngo/dashboard' },
        { id: 'analytics', label: 'Analytics', icon: <FaChartPie />, href: '/ngo/analytics' },
        { id: 'history', label: 'History', icon: <FaHistory />, href: '/ngo/history' },
        { id: 'settings', label: 'Settings', icon: <FaCog />, href: '/ngo/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0b14] text-white flex">
            <aside className="w-64 border-r border-white/5 bg-white/5 backdrop-blur-xl fixed h-full hidden lg:flex flex-col">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                            <span className="text-xl font-black text-white">D</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            NGO Portal
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            <span className="font-semibold">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <FaUserCircle size={24} />
                        </div>

                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">
                                {mounted && address ? shortenAddress(address) : 'Not connected'}
                            </p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                NGO Owner
                            </p>
                        </div>
                    </div>

                    <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <FaSignOutAlt />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-64 min-h-screen">
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#0a0b14]/80 backdrop-blur-md z-30">
                    <div>
                        <h1 className="text-lg font-bold">Good morning, Partner</h1>
                        <p className="text-xs text-white/40">
                            Here's what's happening with your NGO funds.
                        </p>
                    </div>
                </header>

                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}