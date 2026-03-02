'use client';

import React from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import BalanceOverview from '../../../components/dashboard/BalanceOverview';
import WithdrawalForm from '../../../components/dashboard/WithdrawalForm';
import RequestList from '../../../components/dashboard/RequestList';
import { useNGODashboard } from '../../../hooks/useNGODashboard';
import { useAccount } from 'wagmi';
import useWeb3 from '../../../hooks/useWeb3';
import { FaLock, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function NGODashboardPage() {
    const { isConnected } = useAccount();
    const { isWrongNetwork } = useWeb3();
    const { isNGO, stats, balances, requests, loading, createRequest, executeRequest } = useNGODashboard();

    if (isWrongNetwork) {
        return (
            <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <h1 className="text-3xl font-bold text-white">Wrong Network</h1>
                    <p className="text-white/60">Please switch your wallet to Polygon network to access the NGO dashboard.</p>
                </div>
            </div>
        )
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-8 animate-pulse">
                        <FaLock size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Wallet Not Connected</h1>
                    <p className="text-white/60">Please connect your registered NGO wallet to access the dashboard portal.</p>
                    <Link href="/" className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-bold">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (isNGO === false) {
        return (
            <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-6 text-center">
                <div className="max-w-lg space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 mb-8">
                        <FaExclamationCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                    <p className="text-white/60">
                        The connected wallet address is not registered as an NGO on our platform.
                        If you believe this is an error, please contact the platform administrator.
                    </p>
                    <Link href="/" className="inline-block px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            {/* Header Stats */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Real-time Data</span>
                        <h1 className="text-4xl font-bold text-white">Dashboard Overview</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
                            <FaLock />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase font-bold">Pending Approvals</p>
                            <p className="text-xl font-bold text-white">{stats?.pendingRequestsCount || 0}</p>
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="space-y-8">
                <BalanceOverview balances={balances} stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <RequestList
                            requests={requests}
                            onExecute={executeRequest}
                            loading={loading}
                        />
                    </div>
                    <div>
                        <WithdrawalForm
                            onSubmit={createRequest}
                            loading={loading}
                            balances={balances}
                            isNGO={isNGO}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
