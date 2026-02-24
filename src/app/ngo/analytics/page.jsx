'use client'

import DashboardLayout from '../../../components/dashboard/DashboardLayout'

export default function AnalyticsPage() {
    return (
        <DashboardLayout activeTab="analytics">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Analytics</h2>
                    <p className="text-white/40 text-sm mt-1">Donation trends and fund utilization statistics</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <p className="text-white/40">Analytics coming soon...</p>
                </div>
            </div>
        </DashboardLayout>
    )
}
