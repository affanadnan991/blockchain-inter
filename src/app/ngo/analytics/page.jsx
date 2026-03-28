'use client';

import React, { useMemo } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useNGODashboard } from '../../../hooks/useNGODashboard';
import { useAccount } from 'wagmi';
import useWeb3 from '../../../hooks/useWeb3';
import { FaChartLine, FaArrowUp, FaUsers, FaCoins, FaCalendarAlt } from 'react-icons/fa';

export default function AnalyticsPage() {
    const { isConnected } = useAccount();
    const { isWrongNetwork } = useWeb3();
    const { isNGO, stats, balances, requests, loading } = useNGODashboard();

    if (!isConnected) {
        return (
            <DashboardLayout activeTab="analytics">
                <div className="text-center p-12">
                    <h1 className="text-3xl font-bold text-white">Please Connect Wallet</h1>
                </div>
            </DashboardLayout>
        );
    }

    if (isNGO === false) {
        return (
            <DashboardLayout activeTab="analytics">
                <div className="text-center p-12">
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                    <p className="text-white/60 mt-2">Only registered NGOs can access this page</p>
                </div>
            </DashboardLayout>
        );
    }

    const pendingRequests = requests?.filter(r => !r.executed) || [];
    const completedRequests = requests?.filter(r => r.executed) || [];
    const totalWithdrawn = stats?.totalWithdrawn || '0';
    const withdrawalCount = stats?.withdrawalCount || 0;
    const avgWithdrawalAmount = withdrawalCount > 0 ? (parseFloat(totalWithdrawn) / withdrawalCount).toFixed(2) : '0';

    const analyticsCards = [
        {
            title: 'Total Withdrawn',
            value: totalWithdrawn,
            unit: 'MATIC',
            icon: FaCoins,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Withdrawal Count',
            value: withdrawalCount,
            unit: 'Transactions',
            icon: FaCalendarAlt,
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Avg per Withdrawal',
            value: avgWithdrawalAmount,
            unit: 'MATIC',
            icon: FaArrowUp,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Pending Requests',
            value: pendingRequests.length,
            unit: 'To Approve',
            icon: FaChartLine,
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <DashboardLayout activeTab="analytics">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Analytics & Insights</h1>
                    <p className="text-white/60">Monitor your NGO's fundraising performance and trends</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {analyticsCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.title} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                        {Icon ? <Icon size={24} /> : <FaChartLine size={24} />}
                                                    </div>
                                    <span className="text-white/40 text-xs uppercase font-bold">{card.unit}</span>
                                </div>
                                <p className="text-white/60 text-sm mb-1">{card.title}</p>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Token Balances</h2>
                        <div className="space-y-4">
                            {balances && Object.entries(balances).map(([symbol, data]) => (
                                <div key={symbol} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                                    <p className="text-white font-semibold">{symbol}</p>
                                    <p className="text-white font-bold">{data.formatted || '0'} {symbol}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Request Status</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 rounded-lg border border-yellow-500/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-semibold">Pending</span>
                                    <span className="text-2xl font-bold text-yellow-400">{pendingRequests.length}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/20 rounded-lg border border-green-500/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-semibold">Completed</span>
                                    <span className="text-2xl font-bold text-green-400">{completedRequests.length}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/20 rounded-lg border border-blue-500/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-blue-400">{requests?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-6">Performance Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/60 text-sm mb-2">Approvers</p>
                            <p className="text-4xl font-bold text-white">{stats?.approversCount || 0}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/60 text-sm mb-2">Min Approvals</p>
                            <p className="text-4xl font-bold text-white">{stats?.minApprovals || 0}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/60 text-sm mb-2">Status</p>
                            <p className="text-lg font-bold text-green-400">{stats?.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
