'use client'

import AdminLayout from '../../../components/admin/AdminLayout'
import Stats from '../../../components/home/Stats'
import Link from 'next/link'

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Dashboard Stats */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Protocol Overview</h1>
                        <p className="text-gray-500 text-lg">Real-time status of the donation ecosystem.</p>
                    </div>

                    {/* Reusing the Home Stats for now, will create Admin specific ones if needed */}
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50">
                        <Stats />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                        <h3 className="font-bold text-gray-900 mb-2">NGO Registry</h3>
                        <p className="text-sm text-gray-500 mb-6">Manage verified organizations and their approvers.</p>
                        <Link href="/admin/ngos" className="text-red-600 font-bold text-sm hover:underline">Manage NGOs →</Link>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                        <h3 className="font-bold text-gray-900 mb-2">Token Pool</h3>
                        <p className="text-sm text-gray-500 mb-6">Whitelist new tokens and set donation limits.</p>
                        <Link href="/admin/tokens" className="text-red-600 font-bold text-sm hover:underline">Manage Tokens →</Link>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                        <h3 className="font-bold text-gray-900 mb-2">System Controls</h3>
                        <p className="text-sm text-gray-500 mb-6">Configure fees and protocol-level security.</p>
                        <Link href="/admin/settings" className="text-red-600 font-bold text-sm hover:underline">Manage Settings →</Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
