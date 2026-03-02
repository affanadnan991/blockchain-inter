'use client';

import React, { useMemo, useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useNGODashboard } from '../../../hooks/useNGODashboard';
import { useAccount } from 'wagmi';
import useWeb3 from '../../../hooks/useWeb3';
import { FaHistory, FaCheck, FaClock, FaFilter } from 'react-icons/fa';

export default function HistoryPage() {
    const { isConnected } = useAccount();
    const { isWrongNetwork } = useWeb3();
    const { isNGO, stats, requests, loading } = useNGODashboard();
    const [filterStatus, setFilterStatus] = useState('all');

    if (!isConnected) {
        return (
            <DashboardLayout activeTab="history">
                <div className="text-center p-12">
                    <h1 className="text-3xl font-bold text-white">Please Connect Wallet</h1>
                </div>
            </DashboardLayout>
        );
    }

    if (isNGO === false) {
        return (
            <DashboardLayout activeTab="history">
                <div className="text-center p-12">
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                </div>
            </DashboardLayout>
        );
    }

    const filteredRequests = useMemo(() => {
        if (!requests) return [];
        if (filterStatus === 'all') return requests;
        if (filterStatus === 'pending') return requests.filter(r => !r.executed);
        if (filterStatus === 'completed') return requests.filter(r => r.executed);
        return requests;
    }, [requests, filterStatus]);

    const getStatusBadge = (request) => {
        if (request.executed) {
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <FaCheck size={12} className="text-green-400" />
                    <span className="text-xs font-bold text-green-400">Executed</span>
                </div>
            );
        }
        
        const approvalsReceived = request.approvalCount || 0;
        const approvalsNeeded = request.approvalsNeeded || 1;
        
        if (approvalsReceived >= approvalsNeeded) {
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <FaCheck size={12} className="text-blue-400" />
                    <span className="text-xs font-bold text-blue-400">Ready</span>
                </div>
            );
        }
        
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <FaClock size={12} className="text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">Pending</span>
            </div>
        );
    };

    return (
        <DashboardLayout activeTab="history">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Transaction History</h1>
                    <p className="text-white/60">Complete record of all withdrawal requests</p>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-white/60" />
                        <span className="text-white/60 font-semibold">Filter:</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {['all', 'pending', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    filterStatus === status
                                        ? 'bg-primary/20 border border-primary text-primary'
                                        : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-white/60">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-white/60">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-white/60">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-white/60">Approvals</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-white/60">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <FaHistory size={32} className="text-white/20" />
                                                <p className="text-white/40">No transactions found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-white font-mono text-sm">{String(request.id).slice(0, 8)}...</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-bold">{(Number(request.amount) / 10**18).toFixed(4)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white/60 text-sm">
                                                    {new Date(request.timestamp * 1000).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg">
                                                    <span className="text-green-400 font-bold text-sm">{request.approvalCount || 0}</span>
                                                    <span className="text-white/40">/</span>
                                                    <span className="text-white/60 font-semibold text-sm">{request.approvalsNeeded || 1}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(request)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm mb-2">Total Transactions</p>
                                <p className="text-4xl font-bold text-white">{requests?.length || 0}</p>
                            </div>
                            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                                <FaHistory size={28} className="text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm mb-2">Completed</p>
                                <p className="text-4xl font-bold text-green-400">
                                    {requests?.filter(r => r.executed).length || 0}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                                <FaCheck size={28} className="text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm mb-2">Pending</p>
                                <p className="text-4xl font-bold text-yellow-400">
                                    {requests?.filter(r => !r.executed).length || 0}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                                <FaClock size={28} className="text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
