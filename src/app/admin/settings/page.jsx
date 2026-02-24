'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import SystemSettings from '@/components/admin/SystemSettings'

export default function AdminSettingsPage() {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <SystemSettings />
            </div>
        </AdminLayout>
    )
}
