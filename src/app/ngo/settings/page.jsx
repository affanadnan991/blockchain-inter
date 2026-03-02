'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useNGODashboard } from '../../../hooks/useNGODashboard';
import { useAccount } from 'wagmi';
import useWeb3 from '../../../hooks/useWeb3';
import { FaCog, FaUser, FaShieldAlt, FaUsers, FaInfo, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
    const { isConnected } = useAccount();
    const { isWrongNetwork } = useWeb3();
    const { isNGO, stats, loading } = useNGODashboard();
    const { address } = useAccount();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    if (!isConnected) {
        return (
            <DashboardLayout activeTab="settings">
                <div className="text-center p-12">
                    <h1 className="text-3xl font-bold text-white">Please Connect Wallet</h1>
                </div>
            </DashboardLayout>
        );
    }

    if (isNGO === false) {
        return (
            <DashboardLayout activeTab="settings">
                <div className="text-center p-12">
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                </div>
            </DashboardLayout>
        );
    }

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Settings saved successfully!');
        setIsSaving(false);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'approvers', label: 'Approvers', icon: FaUsers },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'preferences', label: 'Preferences', icon: FaCog },
    ];

    return (
        <DashboardLayout activeTab="settings">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-white/60">Manage your NGO account and security preferences</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden mb-8">
                    <div className="flex flex-wrap border-b border-white/10">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 px-6 py-4 font-semibold uppercase text-xs tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'bg-primary/20 border-b-primary text-primary'
                                            : 'text-white/60 border-b-transparent hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white font-semibold mb-2">NGO Wallet Address</label>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                        <p className="text-white/80 font-mono text-sm break-all">{address}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">NGO Status</label>
                                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-green-400 font-semibold">Active</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Total Withdrawn</label>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                        <p className="text-white text-lg font-bold">{stats?.totalWithdrawn || '0'} MATIC</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'approvers' && (
                            <div className="space-y-6">
                                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <FaInfo className="text-blue-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-blue-400 font-semibold mb-1">Approver Management</p>
                                            <p className="text-blue-300 text-sm">
                                                Contact the platform administrator to add or remove approvers.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Approvers Count</label>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                            <p className="text-white text-2xl font-bold">{stats?.approversCount || 0}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white font-semibold mb-2">Min Approvals Required</label>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                            <p className="text-white text-2xl font-bold">{stats?.minApprovals || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <FaShieldAlt className="text-green-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-green-400 font-semibold mb-1">Bank-Grade Security</p>
                                            <p className="text-green-300 text-sm">
                                                Your account is protected by multi-signature approval requirements.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-4">Security Status</label>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                                            <span className="text-white">Multi-Signature Enabled</span>
                                            <FaToggleOn className="text-green-400" size={24} />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                                            <span className="text-white">Withdrawal Paused</span>
                                            {stats?.withdrawalsPaused ? (
                                                <FaToggleOn className="text-orange-400" size={24} />
                                            ) : (
                                                <FaToggleOff className="text-white/40" size={24} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                                            <span className="text-white">Account Active</span>
                                            {stats?.isActive ? (
                                                <FaToggleOn className="text-green-400" size={24} />
                                            ) : (
                                                <FaToggleOff className="text-white/40" size={24} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white font-semibold mb-3">Withdrawal Preferences</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="radio" name="withdrawal" className="w-4 h-4" defaultChecked />
                                            <span className="text-white">Auto-approve when minimum approvals reached</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="radio" name="withdrawal" className="w-4 h-4" />
                                            <span className="text-white">Manual confirmation required for each withdrawal</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-3">Notification Preferences</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                                            <span className="text-white">Email on new donation</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                                            <span className="text-white">Email on withdrawal approval</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                                            <span className="text-white">Email on security alerts</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button className="px-6 py-3 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
